"""
CyberQuant AI — Cyber Risk Quantification Engine
Core engine that calculates financial risk using:
  - Probability / Likelihood estimation
  - Financial Impact modeling (SLE components)
  - Expected Annual Loss (EAL = ARO × SLE)
  - Monte Carlo simulation for Value at Risk (VaR)

Grounded in Open FAIR methodology concepts.
"""
import numpy as np
from typing import Dict, Any, List, Tuple
from app.config import settings


# [*] Cost Constants (INR) [*]
# Per-record breach cost (India average, ~₹5,500/record based on IBM 2024)
COST_PER_RECORD = 5500

# Base incident response cost
BASE_IR_COST = 500_000  # ₹5 Lakh

# Legal cost factor (% of breach cost)
LEGAL_COST_FACTOR = 0.15

# Regulatory fine ranges by severity
REGULATORY_COST = {
    "critical": 5_000_000,   # ₹50 Lakh
    "high": 2_000_000,       # ₹20 Lakh
    "medium": 500_000,       # ₹5 Lakh
    "low": 100_000,          # ₹1 Lakh
}

# Reputation impact factor (% of annual revenue)
REPUTATION_FACTOR = {
    "critical": 0.05,
    "high": 0.02,
    "medium": 0.005,
    "low": 0.001,
}


def estimate_likelihood(
    cvss_score: float,
    exploit_available: bool,
    exploit_in_wild: bool,
    internet_exposure: float,
    control_effectiveness: float,
    threat_activity: str = "moderate",
    patch_age_days: int = 0,
    asset_criticality: float = 50,
) -> float:
    """
    Estimate the annual probability of a security incident.
    
    Uses a multi-factor model combining technical and contextual signals.
    
    Returns:
        Annual probability 0.0–1.0
    """
    # Base probability from CVSS (normalized 0–1)
    base_prob = (cvss_score / 10.0) * 0.3
    
    # Exploit availability multiplier
    if exploit_in_wild:
        base_prob += 0.25
    elif exploit_available:
        base_prob += 0.15
    
    # Internet exposure factor
    exposure_factor = (internet_exposure / 100.0) * 0.15
    base_prob += exposure_factor
    
    # Threat activity factor
    threat_multipliers = {
        "none": 0.0,
        "low": 0.03,
        "moderate": 0.08,
        "high": 0.15,
        "active_campaign": 0.25,
    }
    base_prob += threat_multipliers.get(threat_activity, 0.05)
    
    # Patch age — older unpatched vulns are more likely exploited
    if patch_age_days > 0:
        patch_factor = min(0.15, (patch_age_days / 365.0) * 0.15)
        base_prob += patch_factor
    
    # Control effectiveness reduces probability
    control_reduction = (control_effectiveness / 100.0) * 0.35
    base_prob -= control_reduction
    
    # Clamp to valid range
    return max(0.01, min(0.95, base_prob))


def calculate_single_loss_expectancy(
    revenue_per_hour: float,
    estimated_downtime_hours: float,
    records_count: int,
    regulatory_severity: str,
    annual_revenue: float,
    asset_criticality: float,
) -> Dict[str, float]:
    """
    Calculate the Single Loss Expectancy (SLE) broken down by component.
    
    SLE = Downtime + Breach + Response + Legal + Regulatory + Reputation
    """
    # Scale downtime by asset criticality
    criticality_factor = asset_criticality / 100.0
    
    # 1. Downtime Cost
    downtime_cost = revenue_per_hour * estimated_downtime_hours * criticality_factor
    
    # 2. Data Breach Cost
    # Not all incidents result in full record exposure
    breach_probability = 0.3 * criticality_factor
    effective_records = int(records_count * breach_probability)
    breach_cost = effective_records * COST_PER_RECORD
    
    # 3. Incident Response Cost
    response_cost = BASE_IR_COST * (1 + criticality_factor)
    
    # 4. Legal Cost
    legal_cost = (downtime_cost + breach_cost) * LEGAL_COST_FACTOR
    
    # 5. Regulatory Cost
    regulatory_cost = REGULATORY_COST.get(regulatory_severity, 500_000)
    
    # 6. Reputation / Revenue Impact
    rep_factor = REPUTATION_FACTOR.get(regulatory_severity, 0.005)
    reputation_cost = annual_revenue * rep_factor * criticality_factor
    
    total_sle = (
        downtime_cost + breach_cost + response_cost
        + legal_cost + regulatory_cost + reputation_cost
    )
    
    return {
        "downtime_cost": round(downtime_cost, 2),
        "breach_cost": round(breach_cost, 2),
        "response_cost": round(response_cost, 2),
        "legal_cost": round(legal_cost, 2),
        "regulatory_cost": round(regulatory_cost, 2),
        "reputation_cost": round(reputation_cost, 2),
        "total_sle": round(total_sle, 2),
    }


def calculate_eal(aro: float, sle: float) -> float:
    """
    Expected Annual Loss = Annual Rate of Occurrence × Single Loss Expectancy
    """
    return round(aro * sle, 2)


def monte_carlo_simulation(
    aro: float,
    sle_components: Dict[str, float],
    n_simulations: int = None,
) -> Dict[str, float]:
    """
    Run Monte Carlo simulation to estimate loss distribution.
    
    Uses probability distributions rather than point estimates:
    - Frequency: Poisson distribution (λ = ARO)
    - Impact: Log-normal distribution (based on SLE)
    
    Returns percentile-based Value at Risk metrics.
    """
    if n_simulations is None:
        n_simulations = settings.MONTE_CARLO_SIMULATIONS
    
    total_sle = sle_components.get("total_sle", 0)
    if total_sle <= 0 or aro <= 0:
        return {
            "mean_loss": 0,
            "median_loss": 0,
            "var_90": 0,
            "var_95": 0,
            "var_99": 0,
            "std_dev": 0,
        }
    
    # Simulate frequency using Poisson
    frequencies = np.random.poisson(lam=aro, size=n_simulations)
    
    # Simulate impact using log-normal (captures right-skewed loss distribution)
    # Parameters: mean ≈ total_sle, with ~40% coefficient of variation
    mu = np.log(total_sle) - 0.08  # adjust for log-normal mean
    sigma = 0.4  # spread
    
    annual_losses = np.zeros(n_simulations)
    for i in range(n_simulations):
        if frequencies[i] > 0:
            # Each incident has its own impact draw
            impacts = np.random.lognormal(mean=mu, sigma=sigma, size=frequencies[i])
            annual_losses[i] = np.sum(impacts)
    
    return {
        "mean_loss": round(float(np.mean(annual_losses)), 2),
        "median_loss": round(float(np.median(annual_losses)), 2),
        "var_90": round(float(np.percentile(annual_losses, 90)), 2),
        "var_95": round(float(np.percentile(annual_losses, 95)), 2),
        "var_99": round(float(np.percentile(annual_losses, 99)), 2),
        "std_dev": round(float(np.std(annual_losses)), 2),
    }


def calculate_asset_risk(
    cvss_score: float,
    exploit_available: bool,
    exploit_in_wild: bool,
    internet_exposure: float,
    control_effectiveness: float,
    threat_activity: str,
    patch_age_days: int,
    asset_criticality: float,
    revenue_per_hour: float,
    records_count: int,
    annual_revenue: float,
    estimated_downtime_hours: float = 24,
) -> Dict[str, Any]:
    """
    Complete risk calculation for a single asset.
    Returns EAL, SLE components, Monte Carlo results, and likelihood.
    """
    # 1. Estimate likelihood / ARO
    aro = estimate_likelihood(
        cvss_score=cvss_score,
        exploit_available=exploit_available,
        exploit_in_wild=exploit_in_wild,
        internet_exposure=internet_exposure,
        control_effectiveness=control_effectiveness,
        threat_activity=threat_activity,
        patch_age_days=patch_age_days,
        asset_criticality=asset_criticality,
    )
    
    # 2. Determine regulatory severity from criticality
    if asset_criticality >= 90:
        reg_severity = "critical"
    elif asset_criticality >= 70:
        reg_severity = "high"
    elif asset_criticality >= 50:
        reg_severity = "medium"
    else:
        reg_severity = "low"
    
    # 3. Calculate SLE
    sle_components = calculate_single_loss_expectancy(
        revenue_per_hour=revenue_per_hour,
        estimated_downtime_hours=estimated_downtime_hours,
        records_count=records_count,
        regulatory_severity=reg_severity,
        annual_revenue=annual_revenue,
        asset_criticality=asset_criticality,
    )
    
    # 4. Calculate EAL
    eal = calculate_eal(aro, sle_components["total_sle"])
    
    # 5. Monte Carlo
    mc_results = monte_carlo_simulation(aro, sle_components)
    
    return {
        "aro": round(aro, 4),
        "sle": sle_components,
        "eal": eal,
        "monte_carlo": mc_results,
    }


def aggregate_risk(asset_risks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Aggregate risk across multiple assets to enterprise level.
    Uses correlation-adjusted summation (not simple sum).
    """
    if not asset_risks:
        return {
            "total_eal": 0,
            "var_95": 0,
            "var_99": 0,
            "mean_loss": 0,
            "asset_count": 0,
        }
    
    total_eal = sum(r.get("eal", 0) for r in asset_risks)
    
    # For VaR, use square-root-of-sum-of-squares approximation
    # (assumes partial correlation between asset risks)
    vars_95 = [r.get("monte_carlo", {}).get("var_95", 0) for r in asset_risks]
    vars_99 = [r.get("monte_carlo", {}).get("var_99", 0) for r in asset_risks]
    
    # Correlation factor (0.3 = moderate correlation between asset risks)
    rho = 0.3
    n = len(asset_risks)
    
    sum_var95 = sum(vars_95)
    sum_var99 = sum(vars_99)
    
    # Diversified VaR with correlation
    if n > 1:
        agg_var95 = sum_var95 * np.sqrt((1 + (n - 1) * rho) / n)
        agg_var99 = sum_var99 * np.sqrt((1 + (n - 1) * rho) / n)
    else:
        agg_var95 = sum_var95
        agg_var99 = sum_var99
    
    return {
        "total_eal": round(total_eal, 2),
        "var_95": round(float(agg_var95), 2),
        "var_99": round(float(agg_var99), 2),
        "mean_loss": round(sum(r.get("monte_carlo", {}).get("mean_loss", 0) for r in asset_risks), 2),
        "asset_count": n,
    }
