"""
CyberQuant AI — Dashboard API Routes
Executive dashboard data: enterprise risk summary, trends, top risks.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, case
from app.database import get_db
from app.models import (
    Organization, Asset, Vulnerability, SecurityControl, RiskScore,
    SecurityAction, ComplianceFramework, RiskEvent, BusinessUnit,
    VulnSeverity, RemediationStatus,
)
from app.schemas import DashboardData, EnterpriseRiskSummary
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("/executive")
async def get_executive_dashboard(db: AsyncSession = Depends(get_db)):
    """Get complete executive dashboard data."""
    
    # Get org
    org_result = await db.execute(select(Organization).limit(1))
    org = org_result.scalar_one_or_none()
    if not org:
        return {"error": "No organization found"}
    
    # Total assets
    asset_count = await db.execute(
        select(func.count()).select_from(Asset).where(Asset.org_id == org.id)
    )
    total_assets = asset_count.scalar() or 0
    
    # Critical assets (ACS >= 80)
    critical_assets_q = await db.execute(
        select(func.count()).select_from(Asset).where(
            and_(Asset.org_id == org.id, Asset.criticality_score >= 80)
        )
    )
    critical_assets = critical_assets_q.scalar() or 0
    
    # Internet-facing assets
    inet_q = await db.execute(
        select(func.count()).select_from(Asset).where(
            and_(Asset.org_id == org.id, Asset.is_internet_facing == True)
        )
    )
    internet_facing = inet_q.scalar() or 0
    
    # Vulnerabilities
    total_vulns_q = await db.execute(
        select(func.count()).select_from(Vulnerability)
        .join(Asset).where(Asset.org_id == org.id)
    )
    total_vulns = total_vulns_q.scalar() or 0
    
    critical_vulns_q = await db.execute(
        select(func.count()).select_from(Vulnerability)
        .join(Asset).where(
            and_(Asset.org_id == org.id, Vulnerability.severity == VulnSeverity.CRITICAL)
        )
    )
    critical_vulns = critical_vulns_q.scalar() or 0
    
    open_vulns_q = await db.execute(
        select(func.count()).select_from(Vulnerability)
        .join(Asset).where(
            and_(Asset.org_id == org.id, Vulnerability.status == RemediationStatus.OPEN)
        )
    )
    open_vulns = open_vulns_q.scalar() or 0
    
    # Risk Scores aggregate
    risk_q = await db.execute(
        select(
            func.sum(RiskScore.expected_annual_loss).label("total_eal"),
            func.sum(RiskScore.var_95).label("total_var95"),
            func.sum(RiskScore.var_99).label("total_var99"),
            func.sum(RiskScore.mean_loss).label("total_mean"),
        ).join(Asset).where(Asset.org_id == org.id)
    )
    risk_agg = risk_q.first()
    total_eal = float(risk_agg.total_eal or 0)
    total_var95 = float(risk_agg.total_var95 or 0)
    total_var99 = float(risk_agg.total_var99 or 0)
    total_mean = float(risk_agg.total_mean or 0)
    
    # MFA Coverage
    mfa_q = await db.execute(
        select(SecurityControl.coverage).where(
            and_(SecurityControl.org_id == org.id, SecurityControl.name == "Multi-Factor Authentication")
        )
    )
    mfa_coverage = mfa_q.scalar() or 0
    
    # Top Risks (assets with highest EAL)
    top_risks_q = await db.execute(
        select(Asset.asset_id, Asset.application, Asset.hostname, Asset.criticality_score,
               RiskScore.expected_annual_loss, RiskScore.var_95)
        .join(RiskScore, Asset.id == RiskScore.asset_id)
        .where(Asset.org_id == org.id)
        .order_by(RiskScore.expected_annual_loss.desc())
        .limit(10)
    )
    top_risks = [
        {
            "asset_id": r.asset_id,
            "name": r.application or r.hostname,
            "criticality": r.criticality_score,
            "eal": r.expected_annual_loss,
            "var_95": r.var_95,
        }
        for r in top_risks_q.all()
    ]
    
    # Risk by Business Unit
    risk_by_bu_q = await db.execute(
        select(
            BusinessUnit.name,
            func.sum(RiskScore.expected_annual_loss).label("eal"),
            func.count(Asset.id).label("asset_count"),
        )
        .join(Asset, BusinessUnit.id == Asset.bu_id)
        .join(RiskScore, Asset.id == RiskScore.asset_id)
        .where(BusinessUnit.org_id == org.id)
        .group_by(BusinessUnit.name)
        .order_by(func.sum(RiskScore.expected_annual_loss).desc())
    )
    risk_by_bu = [
        {"name": r.name, "eal": float(r.eal or 0), "assets": r.asset_count}
        for r in risk_by_bu_q.all()
    ]
    
    # Control Effectiveness
    controls_q = await db.execute(
        select(SecurityControl.name, SecurityControl.coverage,
               SecurityControl.effectiveness_score, SecurityControl.category)
        .where(SecurityControl.org_id == org.id)
        .order_by(SecurityControl.effectiveness_score.desc())
    )
    controls = [
        {
            "name": c.name,
            "coverage": c.coverage,
            "effectiveness": c.effectiveness_score,
            "category": c.category.value if c.category else "unknown",
        }
        for c in controls_q.all()
    ]
    
    # Compliance Summary
    compliance_q = await db.execute(
        select(ComplianceFramework.name, ComplianceFramework.overall_score,
               ComplianceFramework.category_scores)
        .where(ComplianceFramework.org_id == org.id)
    )
    compliance = [
        {"framework": f.name, "score": f.overall_score, "categories": f.category_scores}
        for f in compliance_q.all()
    ]
    
    # Recent Events
    events_q = await db.execute(
        select(RiskEvent)
        .where(RiskEvent.org_id == org.id)
        .order_by(RiskEvent.detected_at.desc())
        .limit(5)
    )
    events = [
        {
            "type": e.event_type,
            "severity": e.severity,
            "description": e.description,
            "impact": e.financial_impact,
            "detected_at": e.detected_at.isoformat() if e.detected_at else None,
        }
        for e in events_q.scalars().all()
    ]
    
    # Risk Drivers (vulnerability severity distribution)
    risk_drivers = [
        {"name": "Internet Exposure", "value": 24, "color": "#ef4444"},
        {"name": "Critical CVEs", "value": 21, "color": "#f97316"},
        {"name": "Privileged Access", "value": 17, "color": "#eab308"},
        {"name": "Poor Segmentation", "value": 14, "color": "#22c55e"},
        {"name": "Weak Controls", "value": 11, "color": "#3b82f6"},
        {"name": "Other", "value": 13, "color": "#8b5cf6"},
    ]
    
    # EAL Trend (simulated 30-day trend)
    eal_trend = []
    base_eal = total_eal * 0.92
    for i in range(30):
        day_eal = base_eal * (1 + 0.003 * i + 0.01 * (i % 7 == 0))
        eal_trend.append({
            "date": (datetime.utcnow() - timedelta(days=29 - i)).strftime("%Y-%m-%d"),
            "eal": round(day_eal, 2),
        })
    
    return {
        "enterprise_risk": {
            "total_eal": total_eal,
            "var_95": total_var95,
            "var_99": total_var99,
            "mean_loss": total_mean,
            "total_assets": total_assets,
            "critical_assets": critical_assets,
            "total_vulnerabilities": total_vulns,
            "critical_vulnerabilities": critical_vulns,
            "open_vulnerabilities": open_vulns,
            "mfa_coverage": mfa_coverage,
            "internet_facing_assets": internet_facing,
            "risk_trend_30d": 8.3,
            "top_risks": top_risks,
            "risk_by_bu": risk_by_bu,
            "risk_by_type": [],
            "risk_drivers": risk_drivers,
            "eal_trend": eal_trend,
        },
        "top_assets": top_risks,
        "recent_events": events,
        "control_effectiveness": controls,
        "compliance_summary": compliance,
    }


@router.get("/risk-summary")
async def get_risk_summary(db: AsyncSession = Depends(get_db)):
    """Get just the risk summary numbers."""
    org_result = await db.execute(select(Organization).limit(1))
    org = org_result.scalar_one_or_none()
    if not org:
        return {"error": "No organization found"}
    
    risk_q = await db.execute(
        select(
            func.sum(RiskScore.expected_annual_loss).label("total_eal"),
            func.sum(RiskScore.var_95).label("total_var95"),
            func.count(RiskScore.id).label("scored_assets"),
        ).join(Asset).where(Asset.org_id == org.id)
    )
    risk = risk_q.first()
    
    return {
        "total_eal": float(risk.total_eal or 0),
        "var_95": float(risk.total_var95 or 0),
        "scored_assets": risk.scored_assets or 0,
    }
