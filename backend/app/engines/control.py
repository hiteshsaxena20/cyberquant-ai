"""
CyberQuant AI — Control Effectiveness Engine
Calculates how effective each security control actually is, based on coverage,
configuration strength, and historical performance.

Effectiveness = 0.40 × Coverage + 0.35 × Strength + 0.25 × Historical Performance
"""
from typing import Dict, List, Any


CONTROL_WEIGHTS = {
    "coverage": 0.40,
    "strength": 0.35,
    "historical_performance": 0.25,
}


def calculate_control_effectiveness(
    coverage: float,
    strength: float,
    historical_performance: float,
) -> float:
    """
    Calculate the effectiveness score for a single control.
    
    Args:
        coverage: 0-100, what percentage of applicable assets have this control
        strength: 0-100, how well the control is configured
        historical_performance: 0-100, how well the control has performed historically
    
    Returns:
        Effectiveness score 0-100
    """
    score = (
        CONTROL_WEIGHTS["coverage"] * max(0, min(100, coverage))
        + CONTROL_WEIGHTS["strength"] * max(0, min(100, strength))
        + CONTROL_WEIGHTS["historical_performance"] * max(0, min(100, historical_performance))
    )
    return round(score, 2)


def calculate_aggregate_effectiveness(controls: List[Dict[str, Any]]) -> float:
    """Calculate weighted average effectiveness across all controls."""
    if not controls:
        return 0.0
    
    total_weight = 0.0
    weighted_sum = 0.0
    
    for ctrl in controls:
        # Weight by coverage — controls covering more assets matter more
        weight = ctrl.get("coverage", 50) / 100.0
        effectiveness = ctrl.get("effectiveness_score", 0)
        weighted_sum += effectiveness * weight
        total_weight += weight
    
    if total_weight == 0:
        return 0.0
    
    return round(weighted_sum / total_weight, 2)


def get_control_risk_reduction(
    control_name: str,
    effectiveness: float,
    base_risk_contribution: float,
) -> float:
    """
    Estimate how much risk a control mitigates.
    
    Args:
        control_name: Name of the control
        effectiveness: 0-100 effectiveness score
        base_risk_contribution: The risk amount this control type addresses (INR)
    
    Returns:
        Risk reduction in INR
    """
    reduction_factor = effectiveness / 100.0
    return round(base_risk_contribution * reduction_factor, 2)


# Mapping of control types to the risk categories they mitigate
CONTROL_RISK_MAPPING = {
    "Multi-Factor Authentication": {
        "risk_types": ["account_takeover", "unauthorized_access", "phishing"],
        "max_reduction_pct": 0.85,
    },
    "Endpoint Detection & Response": {
        "risk_types": ["malware", "ransomware", "lateral_movement"],
        "max_reduction_pct": 0.75,
    },
    "Network Segmentation": {
        "risk_types": ["lateral_movement", "data_exfiltration", "blast_radius"],
        "max_reduction_pct": 0.70,
    },
    "Patch Management": {
        "risk_types": ["vulnerability_exploitation", "known_cve"],
        "max_reduction_pct": 0.90,
    },
    "Firewall": {
        "risk_types": ["unauthorized_access", "network_attack"],
        "max_reduction_pct": 0.60,
    },
    "Backup & Recovery": {
        "risk_types": ["ransomware", "data_loss", "disaster_recovery"],
        "max_reduction_pct": 0.80,
    },
    "SIEM & Monitoring": {
        "risk_types": ["detection_gap", "incident_response"],
        "max_reduction_pct": 0.50,
    },
    "Web Application Firewall": {
        "risk_types": ["web_attack", "sql_injection", "xss"],
        "max_reduction_pct": 0.65,
    },
    "Data Encryption": {
        "risk_types": ["data_breach", "data_exfiltration"],
        "max_reduction_pct": 0.55,
    },
    "Security Awareness Training": {
        "risk_types": ["phishing", "social_engineering"],
        "max_reduction_pct": 0.45,
    },
}


def get_control_gap_analysis(controls: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Identify control gaps and improvement opportunities."""
    gaps = []
    for ctrl in controls:
        effectiveness = ctrl.get("effectiveness_score", 0)
        if effectiveness < 70:
            gap = {
                "control": ctrl.get("name", "Unknown"),
                "current_effectiveness": effectiveness,
                "target_effectiveness": 85,
                "gap": round(85 - effectiveness, 2),
                "priority": "high" if effectiveness < 50 else "medium",
                "improvement_actions": [],
            }
            
            if ctrl.get("coverage", 0) < 80:
                gap["improvement_actions"].append(
                    f"Increase coverage from {ctrl.get('coverage', 0)}% to 90%+"
                )
            if ctrl.get("strength", 0) < 70:
                gap["improvement_actions"].append(
                    f"Improve configuration from {ctrl.get('strength', 0)}% to 80%+"
                )
            
            gaps.append(gap)
    
    return sorted(gaps, key=lambda x: x["gap"], reverse=True)
