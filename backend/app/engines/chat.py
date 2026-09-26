"""
CyberQuant AI — AI Chat Engine
Intent-based query routing for the natural language interface.

Architecture:
  LLM → Intent Extraction → Risk/Optimization APIs → Deterministic Calculations → Response

The LLM does NOT invent financial calculations.
It routes queries to the correct engine and formats the response.
"""
from typing import Dict, Any, List, Optional
import re
import json


# [*] Intent Definitions [*]
INTENTS = {
    "top_risk": {
        "patterns": [
            r"(?:highest|biggest|top|major|largest|greatest)\s+(?:financial\s+)?(?:cyber\s+)?risk",
            r"what\s+(?:is|are)\s+(?:our|the)\s+(?:biggest|top|main|highest)\s+risk",
            r"risk\s+(?:driver|contributor)",
        ],
        "handler": "get_top_risks",
        "description": "Identifies the highest financial cyber risks",
    },
    "spend_budget": {
        "patterns": [
            r"(?:where|how)\s+should\s+(?:we|i)\s+(?:spend|invest|allocate)",
            r"(?:have|got|budget)\s+₹?\s*(\d+[\d,]*)\s*(?:lakh|crore|cr|l|lakhs|crores)",
            r"budget\s+(?:of|is)\s+₹?\s*(\d+[\d,]*)",
            r"spend\s+₹?\s*(\d+[\d,]*)",
            r"optimize.*budget",
        ],
        "handler": "optimize_budget",
        "description": "Optimizes security budget allocation",
    },
    "patch_priority": {
        "patterns": [
            r"which\s+vulnerabilit(?:y|ies)\s+should\s+(?:we|i)\s+(?:patch|fix|remediate)\s+first",
            r"priorit(?:y|ize)\s+(?:patch|remediat|vulnerabilit)",
            r"patch\s+(?:first|priority|order)",
            r"most\s+(?:critical|important|urgent)\s+vulnerabilit",
        ],
        "handler": "get_patch_priorities",
        "description": "Prioritizes vulnerabilities for remediation",
    },
    "what_if": {
        "patterns": [
            r"what\s+(?:happens|would happen|if)\s+(?:if\s+)?(?:we\s+)?(?:enable|disable|deploy|implement|delay)",
            r"(?:impact|effect)\s+of\s+(?:enabling|deploying|implementing|delaying)",
            r"simulate\s+",
            r"what\s+if\s+mfa",
            r"what\s+if\s+(?:remediation|patching)\s+(?:is\s+)?delayed",
        ],
        "handler": "run_what_if",
        "description": "Simulates the impact of security changes",
    },
    "enterprise_risk": {
        "patterns": [
            r"(?:overall|total|enterprise|company|our)\s+(?:cyber\s+)?risk",
            r"(?:annual|expected)\s+(?:loss|exposure)",
            r"eal\b",
            r"var\b",
            r"value\s+at\s+risk",
        ],
        "handler": "get_enterprise_risk",
        "description": "Shows enterprise-level risk summary",
    },
    "compliance": {
        "patterns": [
            r"compliance\s+(?:status|score|posture)",
            r"(?:nist|iso|cis|rbi|sebi)\s+(?:score|compliance|status)",
            r"regulatory\s+(?:compliance|posture|status)",
        ],
        "handler": "get_compliance_status",
        "description": "Shows compliance posture across frameworks",
    },
    "control_effectiveness": {
        "patterns": [
            r"(?:how\s+)?effective\s+(?:is|are)\s+(?:our\s+)?(?:controls|security|mfa|edr|firewall)",
            r"control\s+effectiveness",
            r"security\s+(?:posture|effectiveness|strength)",
        ],
        "handler": "get_control_effectiveness",
        "description": "Shows security control effectiveness",
    },
    "asset_risk": {
        "patterns": [
            r"risk\s+(?:for|of|on)\s+(?:the\s+)?(\w+)",
            r"(?:payment|database|server|api|gateway)\s+risk",
        ],
        "handler": "get_asset_risk",
        "description": "Shows risk for a specific asset",
    },
}


def extract_intent(message: str) -> Dict[str, Any]:
    """
    Extract intent and parameters from a natural language message.
    Returns the intent key and any extracted parameters.
    """
    message_lower = message.lower().strip()
    
    for intent_key, intent_def in INTENTS.items():
        for pattern in intent_def["patterns"]:
            match = re.search(pattern, message_lower)
            if match:
                params = {}
                
                # Extract budget amount if present
                budget_match = re.search(
                    r"₹?\s*(\d+[\d,]*\.?\d*)\s*(lakh|lakhs|l|crore|crores|cr)",
                    message_lower
                )
                if budget_match:
                    amount = float(budget_match.group(1).replace(",", ""))
                    unit = budget_match.group(2).lower()
                    if unit in ("crore", "crores", "cr"):
                        amount *= 10_000_000  # 1 Cr = 1,00,00,000
                    elif unit in ("lakh", "lakhs", "l"):
                        amount *= 100_000  # 1 Lakh = 1,00,000
                    params["budget"] = amount
                
                # Extract asset name if present
                asset_match = re.search(
                    r"(?:for|of|on)\s+(?:the\s+)?([a-zA-Z\s]+?)(?:\?|$|\.|,)",
                    message_lower
                )
                if asset_match and intent_key == "asset_risk":
                    params["asset_name"] = asset_match.group(1).strip()
                
                # Extract control name for what-if
                if intent_key == "what_if":
                    if "mfa" in message_lower:
                        params["control"] = "mfa_coverage"
                        params["value"] = 100
                    elif "segment" in message_lower:
                        params["control"] = "network_segmentation"
                        params["value"] = True
                    elif "patch" in message_lower:
                        params["control"] = "patch_critical_cves"
                        params["value"] = True
                    elif "delay" in message_lower:
                        params["is_delay"] = True
                        days_match = re.search(r"(\d+)\s*days?", message_lower)
                        params["delay_days"] = int(days_match.group(1)) if days_match else 30
                
                return {
                    "intent": intent_key,
                    "handler": intent_def["handler"],
                    "params": params,
                    "confidence": 0.85,
                    "description": intent_def["description"],
                }
    
    # Default: general question
    return {
        "intent": "general",
        "handler": "general_response",
        "params": {},
        "confidence": 0.3,
        "description": "General cybersecurity question",
    }


def format_inr(amount: float) -> str:
    """Format amount in Indian Rupee notation (Lakh/Crore)."""
    if amount >= 10_000_000:
        return f"₹{amount / 10_000_000:.1f} Cr"
    elif amount >= 100_000:
        return f"₹{amount / 100_000:.0f} Lakh"
    elif amount >= 1000:
        return f"₹{amount / 1000:.0f}K"
    else:
        return f"₹{amount:.0f}"


def generate_response(
    intent_result: Dict[str, Any],
    data: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Generate a human-readable response from intent and data.
    This is the deterministic formatting layer — no LLM hallucination.
    """
    intent = intent_result.get("intent", "general")
    handler = intent_result.get("handler", "general_response")
    
    response_generators = {
        "get_top_risks": _format_top_risks,
        "optimize_budget": _format_optimization,
        "get_patch_priorities": _format_patch_priorities,
        "run_what_if": _format_what_if,
        "get_enterprise_risk": _format_enterprise_risk,
        "get_compliance_status": _format_compliance,
        "get_control_effectiveness": _format_controls,
        "get_asset_risk": _format_asset_risk,
        "general_response": _format_general,
    }
    
    formatter = response_generators.get(handler, _format_general)
    return formatter(data)


def _format_top_risks(data: Dict[str, Any]) -> Dict[str, Any]:
    risks = data.get("top_risks", [])
    if not risks:
        return {"response": "No significant risks identified at this time.", "data": data}
    
    lines = ["Here are your highest financial cyber risks:\n"]
    for i, r in enumerate(risks[:5], 1):
        eal = format_inr(r.get("eal", 0))
        lines.append(f"**{i}. {r.get('name', 'Unknown')}** → {eal} annual exposure")
        if r.get("drivers"):
            drivers = ", ".join(r["drivers"][:3])
            lines.append(f"   _Drivers: {drivers}_")
    
    total = format_inr(sum(r.get("eal", 0) for r in risks[:5]))
    lines.append(f"\nThese top risks account for approximately **{total}** of estimated annual exposure.")
    
    return {"response": "\n".join(lines), "data": data, "visualization": "bar_chart"}


def _format_optimization(data: Dict[str, Any]) -> Dict[str, Any]:
    budget = format_inr(data.get("budget", 0))
    reduction = format_inr(data.get("total_risk_reduction", 0))
    rosi = data.get("overall_rosi", 0)
    
    lines = [f"**Optimized allocation for {budget} budget:**\n"]
    for a in data.get("selected_actions", []):
        cost = format_inr(a.get("total_cost", 0))
        red = format_inr(a.get("risk_reduction", 0))
        lines.append(f"• **{a.get('name', '')}** — {cost} → {red} risk reduction")
    
    spent = format_inr(data.get("total_spent", 0))
    remaining = format_inr(data.get("remaining_budget", 0))
    lines.append(f"\n**Total invested:** {spent}")
    lines.append(f"**Estimated risk reduction:** {reduction}")
    lines.append(f"**ROSI:** {rosi:.0f}%")
    lines.append(f"**Remaining budget:** {remaining}")
    
    return {"response": "\n".join(lines), "data": data, "visualization": "optimization_chart"}


def _format_patch_priorities(data: Dict[str, Any]) -> Dict[str, Any]:
    vulns = data.get("vulnerabilities", [])
    lines = ["**Priority vulnerabilities for remediation:**\n"]
    for i, v in enumerate(vulns[:10], 1):
        exposure = format_inr(v.get("financial_exposure", 0))
        lines.append(
            f"{i}. **{v.get('cve_id', 'N/A')}** on {v.get('asset', 'Unknown')} → {exposure}"
        )
    return {"response": "\n".join(lines), "data": data, "visualization": "table"}


def _format_what_if(data: Dict[str, Any]) -> Dict[str, Any]:
    current = format_inr(data.get("current_eal", 0))
    projected = format_inr(data.get("projected_eal", 0))
    reduction = format_inr(data.get("risk_reduction", 0))
    investment = format_inr(data.get("investment_required", 0))
    
    lines = [
        "**Scenario Simulation Result:**\n",
        f"| Metric | Value |",
        f"|--------|-------|",
        f"| Current EAL | {current} |",
        f"| Projected EAL | {projected} |",
        f"| Risk Reduction | {reduction} |",
        f"| Investment Required | {investment} |",
        f"| ROSI | {data.get('rosi', 0):.0f}% |",
    ]
    return {"response": "\n".join(lines), "data": data, "visualization": "comparison_chart"}


def _format_enterprise_risk(data: Dict[str, Any]) -> Dict[str, Any]:
    eal = format_inr(data.get("total_eal", 0))
    var95 = format_inr(data.get("var_95", 0))
    
    lines = [
        "**Enterprise Cyber Risk Summary:**\n",
        f"• **Expected Annual Loss:** {eal}",
        f"• **95% Value at Risk:** {var95}",
        f"• **Critical Assets:** {data.get('critical_assets', 0)}",
        f"• **Open Vulnerabilities:** {data.get('open_vulnerabilities', 0)}",
        f"• **30-Day Trend:** {'↑' if data.get('risk_trend_30d', 0) > 0 else '↓'} {abs(data.get('risk_trend_30d', 0)):.1f}%",
    ]
    return {"response": "\n".join(lines), "data": data, "visualization": "gauge_chart"}


def _format_compliance(data: Dict[str, Any]) -> Dict[str, Any]:
    frameworks = data.get("frameworks", [])
    lines = ["**Compliance Posture:**\n"]
    for f in frameworks:
        score = f.get("overall_score", 0)
        bar = "[*]" * int(score / 10) + "[*]" * (10 - int(score / 10))
        lines.append(f"• **{f.get('framework', '')}** {bar} {score:.0f}%")
    return {"response": "\n".join(lines), "data": data, "visualization": "radar_chart"}


def _format_controls(data: Dict[str, Any]) -> Dict[str, Any]:
    controls = data.get("controls", [])
    lines = ["**Security Control Effectiveness:**\n"]
    for c in controls:
        eff = c.get("effectiveness_score", 0)
        status = "[+]" if eff >= 70 else "[!][*]" if eff >= 50 else "[*]"
        lines.append(f"{status} **{c.get('name', '')}** — {eff:.0f}% effective")
    return {"response": "\n".join(lines), "data": data, "visualization": "bar_chart"}


def _format_asset_risk(data: Dict[str, Any]) -> Dict[str, Any]:
    asset = data.get("asset", {})
    eal = format_inr(asset.get("eal", 0))
    lines = [
        f"**Risk for {asset.get('name', 'Unknown Asset')}:**\n",
        f"• Criticality Score: {asset.get('criticality_score', 0):.0f}/100",
        f"• EAL: {eal}",
        f"• Open Vulnerabilities: {asset.get('vuln_count', 0)}",
        f"• Critical CVEs: {asset.get('critical_cves', 0)}",
    ]
    return {"response": "\n".join(lines), "data": data}


def _format_general(data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "response": (
            "I can help you with:\n\n"
            "• **Risk analysis** — \"What is our biggest financial cyber risk?\"\n"
            "• **Budget optimization** — \"Where should we spend ₹50 lakh?\"\n"
            "• **Patch priorities** — \"Which vulnerabilities should we patch first?\"\n"
            "• **What-if scenarios** — \"What happens if MFA is enabled for all users?\"\n"
            "• **Compliance status** — \"What is our NIST compliance score?\"\n"
            "• **Control effectiveness** — \"How effective are our security controls?\"\n"
        ),
        "data": data,
    }
