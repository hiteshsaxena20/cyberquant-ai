"""
CyberQuant AI — Chat API Routes
Natural language AI assistant interface.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models import (
    Organization, Asset, Vulnerability, SecurityControl,
    RiskScore, SecurityAction, ComplianceFramework, VulnSeverity, RemediationStatus,
)
from app.schemas import ChatMessage, ChatResponse
from app.engines.chat import extract_intent, generate_response, format_inr
from app.engines.optimizer import optimize_investment
from app.engines.simulator import simulate_control_change, simulate_delay

router = APIRouter(prefix="/api/chat", tags=["AI Chat"])


@router.post("/message")
async def send_message(message: ChatMessage, db: AsyncSession = Depends(get_db)):
    """Process a natural language query and return structured response."""
    org_result = await db.execute(select(Organization).limit(1))
    org = org_result.scalar_one_or_none()
    if not org:
        return {"response": "No organization data found. Please seed the database first.", "data": {}}
    
    # 1. Extract intent
    intent_result = extract_intent(message.message)
    handler = intent_result["handler"]
    params = intent_result["params"]
    
    # 2. Route to appropriate data source
    data = {}
    
    if handler == "get_top_risks":
        data = await _get_top_risks_data(db, org)
    
    elif handler == "optimize_budget":
        budget = params.get("budget", 5_000_000)  # default ₹50 Lakh
        data = await _get_optimization_data(db, org, budget)
    
    elif handler == "get_patch_priorities":
        data = await _get_patch_priorities_data(db, org)
    
    elif handler == "run_what_if":
        data = await _get_whatif_data(db, org, params)
    
    elif handler == "get_enterprise_risk":
        data = await _get_enterprise_risk_data(db, org)
    
    elif handler == "get_compliance_status":
        data = await _get_compliance_data(db, org)
    
    elif handler == "get_control_effectiveness":
        data = await _get_controls_data(db, org)
    
    elif handler == "get_asset_risk":
        data = await _get_asset_risk_data(db, org, params.get("asset_name", ""))
    
    # 3. Format response
    response = generate_response(intent_result, data)
    
    return {
        "response": response.get("response", ""),
        "data": response.get("data", {}),
        "visualization": response.get("visualization"),
        "intent": intent_result.get("intent"),
        "confidence": intent_result.get("confidence"),
    }


async def _get_top_risks_data(db: AsyncSession, org):
    top_q = await db.execute(
        select(Asset.application, Asset.hostname, Asset.criticality_score,
               RiskScore.expected_annual_loss, RiskScore.var_95)
        .join(RiskScore, Asset.id == RiskScore.asset_id)
        .where(Asset.org_id == org.id)
        .order_by(RiskScore.expected_annual_loss.desc())
        .limit(5)
    )
    return {
        "top_risks": [
            {
                "name": r.application or r.hostname,
                "eal": r.expected_annual_loss,
                "var_95": r.var_95,
                "criticality": r.criticality_score,
                "drivers": ["Internet Exposure", "Critical CVE", "High Criticality"],
            }
            for r in top_q.all()
        ]
    }


async def _get_optimization_data(db: AsyncSession, org, budget: float):
    actions_q = await db.execute(
        select(SecurityAction).where(SecurityAction.org_id == org.id)
    )
    actions = [
        {
            "id": str(a.id),
            "name": a.name,
            "total_cost": a.total_cost,
            "risk_reduction": a.risk_reduction,
            "affected_assets": a.affected_assets,
        }
        for a in actions_q.scalars().all()
    ]
    return optimize_investment(actions, budget)


async def _get_patch_priorities_data(db: AsyncSession, org):
    vulns_q = await db.execute(
        select(Vulnerability.cve_id, Vulnerability.title, Vulnerability.cvss_score,
               Vulnerability.severity, Vulnerability.financial_exposure,
               Asset.hostname, Asset.application)
        .join(Asset).where(Asset.org_id == org.id)
        .where(Vulnerability.status == RemediationStatus.OPEN)
        .order_by(Vulnerability.cvss_score.desc())
        .limit(10)
    )
    return {
        "vulnerabilities": [
            {
                "cve_id": v.cve_id,
                "title": v.title,
                "cvss": v.cvss_score,
                "severity": v.severity.value if v.severity else "medium",
                "financial_exposure": v.financial_exposure or 0,
                "asset": v.application or v.hostname,
            }
            for v in vulns_q.all()
        ]
    }


async def _get_whatif_data(db: AsyncSession, org, params: dict):
    eal_q = await db.execute(
        select(func.sum(RiskScore.expected_annual_loss))
        .join(Asset).where(Asset.org_id == org.id)
    )
    current_eal = float(eal_q.scalar() or 0)
    
    if params.get("is_delay"):
        timeline = simulate_delay(current_eal, params.get("delay_days", 30))
        return {
            "current_eal": current_eal,
            "projected_eal": timeline[-1]["projected_eal"] if timeline else current_eal,
            "risk_reduction": -(timeline[-1]["increase"]) if timeline else 0,
            "investment_required": 0,
            "rosi": 0,
            "timeline": timeline,
        }
    
    control = params.get("control", "mfa_coverage")
    value = params.get("value", 100)
    return simulate_control_change([], {control: value}, current_eal)


async def _get_enterprise_risk_data(db: AsyncSession, org):
    risk_q = await db.execute(
        select(
            func.sum(RiskScore.expected_annual_loss).label("total_eal"),
            func.sum(RiskScore.var_95).label("total_var95"),
        ).join(Asset).where(Asset.org_id == org.id)
    )
    risk = risk_q.first()
    
    critical_q = await db.execute(
        select(func.count()).select_from(Asset).where(
            Asset.org_id == org.id, Asset.criticality_score >= 80
        )
    )
    open_q = await db.execute(
        select(func.count()).select_from(Vulnerability)
        .join(Asset).where(Asset.org_id == org.id, Vulnerability.status == RemediationStatus.OPEN)
    )
    
    return {
        "total_eal": float(risk.total_eal or 0),
        "var_95": float(risk.total_var95 or 0),
        "critical_assets": critical_q.scalar() or 0,
        "open_vulnerabilities": open_q.scalar() or 0,
        "risk_trend_30d": 8.3,
    }


async def _get_compliance_data(db: AsyncSession, org):
    fw_q = await db.execute(
        select(ComplianceFramework).where(ComplianceFramework.org_id == org.id)
    )
    return {
        "frameworks": [
            {"framework": f.name, "overall_score": f.overall_score}
            for f in fw_q.scalars().all()
        ]
    }


async def _get_controls_data(db: AsyncSession, org):
    ctrl_q = await db.execute(
        select(SecurityControl).where(SecurityControl.org_id == org.id)
        .order_by(SecurityControl.effectiveness_score.desc())
    )
    return {
        "controls": [
            {
                "name": c.name,
                "effectiveness_score": c.effectiveness_score,
                "coverage": c.coverage,
                "category": c.category.value if c.category else "unknown",
            }
            for c in ctrl_q.scalars().all()
        ]
    }


async def _get_asset_risk_data(db: AsyncSession, org, asset_name: str):
    q = await db.execute(
        select(Asset, RiskScore)
        .outerjoin(RiskScore, Asset.id == RiskScore.asset_id)
        .where(Asset.org_id == org.id)
        .where(Asset.application.ilike(f"%{asset_name}%"))
        .limit(1)
    )
    result = q.first()
    if not result:
        return {"asset": {"name": asset_name, "eal": 0, "criticality_score": 0}}
    
    asset, rs = result
    return {
        "asset": {
            "name": asset.application or asset.hostname,
            "eal": rs.expected_annual_loss if rs else 0,
            "criticality_score": asset.criticality_score,
            "vuln_count": 0,
            "critical_cves": 0,
        }
    }
