"""
CyberQuant AI — What-If Scenario Simulator
Allows toggling controls on/off and recomputing risk to show before/after impact.
Also simulates remediation delay cost projection.
"""
from typing import Dict, Any, List
import numpy as np
from app.engines.risk import estimate_likelihood, calculate_eal


def simulate_control_change(
    assets_data: List[Dict[str, Any]],
    control_changes: Dict[str, Any],
    current_enterprise_eal: float,
) -> Dict[str, Any]:
    """
    Simulate the impact of control changes on enterprise risk.
    
    Args:
        assets_data: List of asset risk data with current parameters
        control_changes: e.g., {"mfa_coverage": 100, "patch_critical_cves": True}
        current_enterprise_eal: Current enterprise EAL
    
    Returns:
        Simulation result with projected EAL and risk reduction
    """
    projected_eal = current_enterprise_eal
    affected_count = 0
    investment = 0.0
    changes_detail = {}
    
    # Process each control change
    for change_key, change_value in control_changes.items():
        result = _apply_control_change(
            change_key, change_value, assets_data, projected_eal
        )
        projected_eal = result["new_eal"]
        affected_count += result["affected_assets"]
        investment += result["cost"]
        changes_detail[change_key] = {
            "before": result["before_value"],
            "after": result["after_value"],
            "risk_impact": result["risk_impact"],
            "cost": result["cost"],
        }
    
    risk_reduction = current_enterprise_eal - projected_eal
    rosi = ((risk_reduction - investment) / investment * 100) if investment > 0 else 0
    
    return {
        "scenario_name": "Custom Scenario",
        "current_eal": round(current_enterprise_eal, 2),
        "projected_eal": round(projected_eal, 2),
        "risk_reduction": round(risk_reduction, 2),
        "investment_required": round(investment, 2),
        "rosi": round(rosi, 2),
        "changes_applied": changes_detail,
        "affected_assets": affected_count,
    }


def _apply_control_change(
    change_key: str,
    change_value: Any,
    assets_data: List[Dict[str, Any]],
    current_eal: float,
) -> Dict[str, Any]:
    """Apply a single control change and estimate its impact."""
    
    # Control change impact models
    CONTROL_IMPACTS = {
        "mfa_coverage": {
            "risk_reduction_per_pct": 0.008,  # 0.8% EAL reduction per 1% MFA increase
            "cost_per_pct": 50_000,  # ₹50K per 1% coverage increase
            "current_default": 67,
        },
        "patch_critical_cves": {
            "risk_reduction_flat": 0.18,  # 18% EAL reduction
            "cost_flat": 3_200_000,  # ₹32 Lakh
            "current_default": False,
        },
        "network_segmentation": {
            "risk_reduction_flat": 0.15,  # 15% EAL reduction
            "cost_flat": 2_800_000,  # ₹28 Lakh
            "current_default": False,
        },
        "edr_expansion": {
            "risk_reduction_per_pct": 0.005,
            "cost_per_pct": 30_000,
            "current_default": 72,
        },
        "waf_deployment": {
            "risk_reduction_flat": 0.08,
            "cost_flat": 1_500_000,
            "current_default": False,
        },
        "security_monitoring": {
            "risk_reduction_flat": 0.06,
            "cost_flat": 800_000,
            "current_default": False,
        },
        "encryption_at_rest": {
            "risk_reduction_flat": 0.05,
            "cost_flat": 600_000,
            "current_default": False,
        },
        "backup_improvement": {
            "risk_reduction_flat": 0.07,
            "cost_flat": 1_000_000,
            "current_default": False,
        },
        "security_training": {
            "risk_reduction_flat": 0.04,
            "cost_flat": 500_000,
            "current_default": False,
        },
    }
    
    impact_model = CONTROL_IMPACTS.get(change_key)
    if not impact_model:
        return {
            "new_eal": current_eal,
            "affected_assets": 0,
            "cost": 0,
            "before_value": "N/A",
            "after_value": str(change_value),
            "risk_impact": 0,
        }
    
    before_value = impact_model.get("current_default", "N/A")
    risk_impact = 0.0
    cost = 0.0
    affected = len(assets_data) if assets_data else 100
    
    if "risk_reduction_per_pct" in impact_model:
        # Percentage-based change (like MFA coverage 67% → 100%)
        current_pct = impact_model["current_default"]
        target_pct = float(change_value)
        delta_pct = max(0, target_pct - current_pct)
        
        risk_impact = current_eal * impact_model["risk_reduction_per_pct"] * delta_pct
        cost = impact_model["cost_per_pct"] * delta_pct
    
    elif "risk_reduction_flat" in impact_model:
        # Boolean/flat change (enable segmentation, patch CVEs)
        if change_value:
            risk_impact = current_eal * impact_model["risk_reduction_flat"]
            cost = impact_model["cost_flat"]
    
    new_eal = current_eal - risk_impact
    
    return {
        "new_eal": max(0, new_eal),
        "affected_assets": affected,
        "cost": cost,
        "before_value": str(before_value),
        "after_value": str(change_value),
        "risk_impact": round(risk_impact, 2),
    }


def simulate_delay(
    current_eal: float,
    delay_days: int,
    growth_rate_per_day: float = 0.001,
) -> List[Dict[str, Any]]:
    """
    Project how risk increases if remediation is delayed.
    
    Models risk growth as compounding:
    EAL(t) = EAL(0) × (1 + growth_rate)^t
    
    Args:
        current_eal: Current enterprise EAL
        delay_days: Number of days to simulate
        growth_rate_per_day: Daily risk growth rate (default 0.1%)
    
    Returns:
        Timeline of projected EAL values
    """
    timeline = []
    checkpoints = [0, 7, 14, 21, 30, 45, 60, 90]
    
    for day in checkpoints:
        if day > delay_days:
            break
        projected = current_eal * ((1 + growth_rate_per_day) ** day)
        timeline.append({
            "day": day,
            "projected_eal": round(projected, 2),
            "increase": round(projected - current_eal, 2),
            "increase_pct": round(((projected / current_eal) - 1) * 100, 2) if current_eal > 0 else 0,
        })
    
    # Ensure we include the exact delay day
    if delay_days not in checkpoints:
        projected = current_eal * ((1 + growth_rate_per_day) ** delay_days)
        timeline.append({
            "day": delay_days,
            "projected_eal": round(projected, 2),
            "increase": round(projected - current_eal, 2),
            "increase_pct": round(((projected / current_eal) - 1) * 100, 2) if current_eal > 0 else 0,
        })
        timeline.sort(key=lambda x: x["day"])
    
    return timeline


def generate_predefined_scenarios(
    current_eal: float,
    assets_data: List[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    """Generate a set of predefined what-if scenarios for the dashboard."""
    if assets_data is None:
        assets_data = []
    
    scenarios = [
        {
            "id": "full_mfa",
            "name": "Enable MFA for All Users",
            "description": "Increase MFA coverage from 67% to 100% across all accounts",
            "changes": {"mfa_coverage": 100},
        },
        {
            "id": "patch_critical",
            "name": "Patch All Critical CVEs",
            "description": "Remediate all critical and high-severity vulnerabilities",
            "changes": {"patch_critical_cves": True},
        },
        {
            "id": "segmentation",
            "name": "Implement Network Segmentation",
            "description": "Segment critical assets from general network",
            "changes": {"network_segmentation": True},
        },
        {
            "id": "comprehensive",
            "name": "Comprehensive Security Upgrade",
            "description": "MFA + Patching + Segmentation + EDR",
            "changes": {
                "mfa_coverage": 100,
                "patch_critical_cves": True,
                "network_segmentation": True,
                "edr_expansion": 95,
            },
        },
        {
            "id": "delay_30",
            "name": "30-Day Remediation Delay",
            "description": "Impact of delaying all remediation by 30 days",
            "changes": {},
            "delay_days": 30,
        },
    ]
    
    results = []
    for scenario in scenarios:
        if scenario.get("delay_days"):
            timeline = simulate_delay(current_eal, scenario["delay_days"])
            result = {
                "id": scenario["id"],
                "name": scenario["name"],
                "description": scenario["description"],
                "current_eal": round(current_eal, 2),
                "projected_eal": timeline[-1]["projected_eal"] if timeline else current_eal,
                "risk_reduction": -(timeline[-1]["increase"]) if timeline else 0,
                "investment_required": 0,
                "rosi": 0,
                "timeline": timeline,
                "is_delay_scenario": True,
            }
        else:
            sim_result = simulate_control_change(
                assets_data, scenario["changes"], current_eal
            )
            result = {
                "id": scenario["id"],
                "name": scenario["name"],
                "description": scenario["description"],
                **sim_result,
            }
        results.append(result)
    
    return results
