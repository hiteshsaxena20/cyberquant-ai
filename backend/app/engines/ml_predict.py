"""
CyberQuant AI — ML Prediction Engine
Uses XGBoost/Random Forest to predict incident likelihood and SHAP for explainability.

For the MVP, the model is trained on synthetic data at startup.
In production, it would be trained on historical incident data.
"""
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple, Optional
import warnings
warnings.filterwarnings("ignore")

try:
    from xgboost import XGBClassifier
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
import os

# Try to import SHAP — not critical for core functionality
try:
    import shap
    HAS_SHAP = True
except ImportError:
    HAS_SHAP = False


class MLPredictionEngine:
    """
    ML engine for predicting incident likelihood and anomaly detection.
    """
    
    FEATURE_NAMES = [
        "cvss_score",
        "exploit_available",
        "exploit_in_wild",
        "internet_exposure",
        "control_effectiveness",
        "asset_criticality",
        "patch_age_days",
        "mfa_enabled",
        "edr_enabled",
        "records_count_log",
        "revenue_criticality",
        "threat_activity_score",
    ]
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.anomaly_model = None
        self.explainer = None
        self._is_trained = False
    
    def _generate_training_data(self, n_samples: int = 5000) -> Tuple[np.ndarray, np.ndarray]:
        """
        Generate synthetic training data for the incident prediction model.
        In production, this would come from historical incident data.
        """
        np.random.seed(42)
        
        # Features
        cvss = np.random.uniform(0, 10, n_samples)
        exploit_avail = np.random.binomial(1, 0.3, n_samples)
        exploit_wild = np.random.binomial(1, 0.15, n_samples)
        internet_exp = np.random.uniform(0, 100, n_samples)
        control_eff = np.random.uniform(20, 95, n_samples)
        criticality = np.random.uniform(10, 100, n_samples)
        patch_age = np.random.exponential(90, n_samples).astype(int)
        mfa = np.random.binomial(1, 0.67, n_samples)
        edr = np.random.binomial(1, 0.72, n_samples)
        records_log = np.log1p(np.random.exponential(50000, n_samples))
        rev_crit = np.random.uniform(0, 100, n_samples)
        threat_score = np.random.choice([0, 1, 2, 3, 4], n_samples, p=[0.1, 0.25, 0.35, 0.2, 0.1])
        
        X = np.column_stack([
            cvss, exploit_avail, exploit_wild, internet_exp,
            control_eff, criticality, patch_age, mfa, edr,
            records_log, rev_crit, threat_score,
        ])
        
        # Generate labels based on a realistic model
        # Higher CVSS, exploits, exposure → higher incident probability
        logit = (
            0.3 * (cvss / 10)
            + 0.2 * exploit_avail
            + 0.25 * exploit_wild
            + 0.1 * (internet_exp / 100)
            - 0.2 * (control_eff / 100)
            + 0.05 * (criticality / 100)
            + 0.05 * np.minimum(patch_age / 365, 1)
            - 0.1 * mfa
            - 0.08 * edr
            + 0.05 * (threat_score / 4)
            - 0.3  # bias
        )
        
        prob = 1 / (1 + np.exp(-5 * logit))
        prob += np.random.normal(0, 0.05, n_samples)
        prob = np.clip(prob, 0, 1)
        y = (prob > 0.5).astype(int)
        
        return X, y
    
    def train(self, X: np.ndarray = None, y: np.ndarray = None):
        """Train the prediction model."""
        if X is None or y is None:
            X, y = self._generate_training_data()
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        X_train, X_test, y_train, y_test = train_test_split(
            X_scaled, y, test_size=0.2, random_state=42
        )
        
        # Train XGBoost if available, else Random Forest
        if HAS_XGBOOST:
            self.model = XGBClassifier(
                n_estimators=100,
                max_depth=6,
                learning_rate=0.1,
                random_state=42,
                use_label_encoder=False,
                eval_metric="logloss",
            )
        else:
            self.model = RandomForestClassifier(
                n_estimators=100,
                max_depth=8,
                random_state=42,
            )
        
        self.model.fit(X_train, y_train)
        
        # Train anomaly detector
        self.anomaly_model = IsolationForest(
            n_estimators=100,
            contamination=0.1,
            random_state=42,
        )
        self.anomaly_model.fit(X_scaled)
        
        # Initialize SHAP explainer
        if HAS_SHAP:
            try:
                self.explainer = shap.TreeExplainer(self.model)
            except Exception:
                self.explainer = None
        
        self._is_trained = True
        
        # Calculate accuracy
        accuracy = self.model.score(X_test, y_test)
        return {"accuracy": round(accuracy, 4), "model_type": type(self.model).__name__}
    
    def predict_incident_probability(self, features: Dict[str, float]) -> Dict[str, Any]:
        """
        Predict incident probability for given features.
        
        Returns probabilities for 7d, 30d, 90d, 365d windows plus SHAP explanations.
        """
        if not self._is_trained:
            self.train()
        
        # Build feature vector
        feature_vector = np.array([[
            features.get("cvss_score", 5.0),
            features.get("exploit_available", 0),
            features.get("exploit_in_wild", 0),
            features.get("internet_exposure", 50),
            features.get("control_effectiveness", 50),
            features.get("asset_criticality", 50),
            features.get("patch_age_days", 30),
            features.get("mfa_enabled", 0),
            features.get("edr_enabled", 0),
            np.log1p(features.get("records_count", 1000)),
            features.get("revenue_criticality", 50),
            features.get("threat_activity_score", 2),
        ]])
        
        X_scaled = self.scaler.transform(feature_vector)
        
        # Get annual probability
        prob_annual = float(self.model.predict_proba(X_scaled)[0][1])
        
        # Convert to different time windows
        # P(no incident in t days) = (1 - P_annual)^(t/365)
        prob_7d = 1 - (1 - prob_annual) ** (7 / 365)
        prob_30d = 1 - (1 - prob_annual) ** (30 / 365)
        prob_90d = 1 - (1 - prob_annual) ** (90 / 365)
        
        result = {
            "probability_7d": round(prob_7d, 4),
            "probability_30d": round(prob_30d, 4),
            "probability_90d": round(prob_90d, 4),
            "probability_365d": round(prob_annual, 4),
        }
        
        # SHAP explanation
        if self.explainer is not None:
            try:
                shap_values = self.explainer.shap_values(X_scaled)
                if isinstance(shap_values, list):
                    sv = shap_values[1][0]  # class 1 (incident)
                else:
                    sv = shap_values[0]
                
                explanations = {}
                for i, name in enumerate(self.FEATURE_NAMES):
                    explanations[name] = round(float(sv[i]) * 100, 2)
                
                result["risk_drivers"] = dict(
                    sorted(explanations.items(), key=lambda x: abs(x[1]), reverse=True)
                )
            except Exception:
                result["risk_drivers"] = self._fallback_feature_importance(features)
        else:
            result["risk_drivers"] = self._fallback_feature_importance(features)
        
        # Anomaly detection
        anomaly_score = float(self.anomaly_model.decision_function(X_scaled)[0])
        result["is_anomalous"] = anomaly_score < -0.1
        result["anomaly_score"] = round(anomaly_score, 4)
        
        return result
    
    def _fallback_feature_importance(self, features: Dict[str, float]) -> Dict[str, float]:
        """Fallback feature importance when SHAP is not available."""
        if self.model is None:
            return {}
        
        importances = self.model.feature_importances_
        result = {}
        for i, name in enumerate(self.FEATURE_NAMES):
            result[name] = round(float(importances[i]) * 100, 2)
        return dict(sorted(result.items(), key=lambda x: abs(x[1]), reverse=True))
    
    def get_feature_importance(self) -> Dict[str, float]:
        """Get global feature importance from the trained model."""
        if not self._is_trained:
            self.train()
        
        importances = self.model.feature_importances_
        result = {}
        for i, name in enumerate(self.FEATURE_NAMES):
            result[name] = round(float(importances[i]) * 100, 2)
        return dict(sorted(result.items(), key=lambda x: x[1], reverse=True))


# Singleton instance
ml_engine = MLPredictionEngine()
