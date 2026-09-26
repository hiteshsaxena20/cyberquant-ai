"""
CyberQuant AI — Asset Criticality Engine
Calculates the Asset Criticality Score (ACS) using weighted business context factors.

ACS = 0.25 × Revenue Criticality
    + 0.20 × Data Sensitivity
    + 0.20 × Availability Dependency
    + 0.15 × Regulatory Importance
    + 0.10 × Internet Exposure
    + 0.10 × Service Dependency

Normalized to 0–100.
"""
from typing import Dict, Any


# Weights for ACS calculation
ACS_WEIGHTS = {
    "revenue_criticality": 0.25,
    "data_sensitivity": 0.20,
    "availability_dependency": 0.20,
    "regulatory_importance": 0.15,
    "internet_exposure": 0.10,
    "service_dependency": 0.10,
}


def calculate_criticality_score(asset_data: Dict[str, Any]) -> float:
    """
    Calculate the Asset Criticality Score (ACS) for a given asset.
    
    Args:
        asset_data: Dictionary containing the six criticality factors (0-100 each)
    
    Returns:
        ACS score normalized to 0-100
    """
    score = 0.0
    for factor, weight in ACS_WEIGHTS.items():
        value = float(asset_data.get(factor, 0))
        # Clamp to 0-100
        value = max(0.0, min(100.0, value))
        score += weight * value
    
    return round(score, 2)


def get_criticality_tier(score: float) -> str:
    """Convert ACS to a human-readable tier."""
    if score >= 90:
        return "Critical"
    elif score >= 70:
        return "High"
    elif score >= 50:
        return "Medium"
    elif score >= 30:
        return "Low"
    else:
        return "Minimal"


def calculate_all_asset_criticalities(assets: list) -> list:
    """
    Calculate ACS for a list of asset dictionaries.
    
    Args:
        assets: List of asset data dictionaries
    
    Returns:
        List of assets with criticality_score and criticality_tier added
    """
    results = []
    for asset in assets:
        acs = calculate_criticality_score(asset)
        tier = get_criticality_tier(acs)
        asset["criticality_score"] = acs
        asset["criticality_tier"] = tier
        results.append(asset)
    return results


def get_criticality_distribution(assets: list) -> Dict[str, int]:
    """Get count of assets per criticality tier."""
    distribution = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Minimal": 0}
    for asset in assets:
        score = asset.get("criticality_score", 0)
        tier = get_criticality_tier(score)
        distribution[tier] += 1
    return distribution
