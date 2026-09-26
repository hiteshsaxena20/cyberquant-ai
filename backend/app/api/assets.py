"""
CyberQuant AI — Assets API Routes
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.database import get_db
from app.models import Asset, Organization, Vulnerability, RiskScore, BusinessUnit, VulnSeverity, RemediationStatus

router = APIRouter(prefix="/api/assets", tags=["Assets"])


@router.get("")
async def get_assets(
    skip: int = 0,
    limit: int = 50,
    sort_by: str = "criticality_score",
    order: str = "desc",
    asset_type: str = None,
    min_criticality: float = 0,
    db: AsyncSession = Depends(get_db),
):
    """Get paginated list of assets with risk data."""
    org_result = await db.execute(select(Organization).limit(1))
    org = org_result.scalar_one_or_none()
    if not org:
        return {"assets": [], "total": 0}
    
    query = select(Asset).where(
        and_(Asset.org_id == org.id, Asset.criticality_score >= min_criticality)
    )
    
    if asset_type:
        query = query.where(Asset.asset_type == asset_type)
    
    # Sort
    sort_col = getattr(Asset, sort_by, Asset.criticality_score)
    if order == "desc":
        query = query.order_by(sort_col.desc())
    else:
        query = query.order_by(sort_col.asc())
    
    # Count
    count_q = select(func.count()).select_from(Asset).where(
        and_(Asset.org_id == org.id, Asset.criticality_score >= min_criticality)
    )
    if asset_type:
        count_q = count_q.where(Asset.asset_type == asset_type)
    total = (await db.execute(count_q)).scalar() or 0
    
    # Paginate
    query = query.offset(skip).limit(limit)
    result = await db.execute(query)
    assets = result.scalars().all()
    
    # Enrich with vulnerability count and financial exposure
    asset_list = []
    for asset in assets:
        # Vulnerability count
        vuln_q = await db.execute(
            select(func.count()).select_from(Vulnerability).where(
                and_(Vulnerability.asset_id == asset.id, Vulnerability.status == RemediationStatus.OPEN)
            )
        )
        vuln_count = vuln_q.scalar() or 0
        
        # Financial exposure from risk score
        rs_q = await db.execute(
            select(RiskScore.expected_annual_loss).where(RiskScore.asset_id == asset.id)
            .order_by(RiskScore.calculated_at.desc()).limit(1)
        )
        eal = rs_q.scalar() or 0
        
        # BU name
        bu_name = None
        if asset.bu_id:
            bu_q = await db.execute(select(BusinessUnit.name).where(BusinessUnit.id == asset.bu_id))
            bu_name = bu_q.scalar()
        
        asset_list.append({
            "id": str(asset.id),
            "asset_id": asset.asset_id,
            "hostname": asset.hostname,
            "ip_address": asset.ip_address,
            "asset_type": asset.asset_type.value if asset.asset_type else "unknown",
            "application": asset.application,
            "owner": asset.owner,
            "criticality_score": asset.criticality_score,
            "data_classification": asset.data_classification,
            "is_internet_facing": asset.is_internet_facing,
            "bu_name": bu_name,
            "vulnerability_count": vuln_count,
            "financial_exposure": float(eal),
            "revenue_per_hour": asset.revenue_per_hour,
            "records_count": asset.records_count,
        })
    
    return {"assets": asset_list, "total": total}


@router.get("/{asset_id}")
async def get_asset_detail(asset_id: str, db: AsyncSession = Depends(get_db)):
    """Get detailed asset information including vulnerabilities and risk."""
    result = await db.execute(
        select(Asset).where(Asset.asset_id == asset_id)
    )
    asset = result.scalar_one_or_none()
    if not asset:
        return {"error": "Asset not found"}
    
    # Vulnerabilities
    vulns_q = await db.execute(
        select(Vulnerability).where(Vulnerability.asset_id == asset.id)
        .order_by(Vulnerability.cvss_score.desc())
    )
    vulns = [
        {
            "id": str(v.id),
            "cve_id": v.cve_id,
            "title": v.title,
            "cvss_score": v.cvss_score,
            "severity": v.severity.value if v.severity else "medium",
            "exploit_available": v.exploit_available,
            "exploit_in_wild": v.exploit_in_wild,
            "status": v.status.value if v.status else "open",
            "financial_exposure": v.financial_exposure,
            "discovered_at": v.discovered_at.isoformat() if v.discovered_at else None,
        }
        for v in vulns_q.scalars().all()
    ]
    
    # Risk Score
    rs_q = await db.execute(
        select(RiskScore).where(RiskScore.asset_id == asset.id)
        .order_by(RiskScore.calculated_at.desc()).limit(1)
    )
    rs = rs_q.scalar_one_or_none()
    risk_data = None
    if rs:
        risk_data = {
            "eal": rs.expected_annual_loss,
            "aro": rs.annual_rate_of_occurrence,
            "sle": rs.single_loss_expectancy,
            "var_95": rs.var_95,
            "var_99": rs.var_99,
            "downtime_cost": rs.downtime_cost,
            "breach_cost": rs.breach_cost,
            "response_cost": rs.response_cost,
            "legal_cost": rs.legal_cost,
            "regulatory_cost": rs.regulatory_cost,
            "reputation_cost": rs.reputation_cost,
            "risk_drivers": rs.risk_drivers,
        }
    
    return {
        "id": str(asset.id),
        "asset_id": asset.asset_id,
        "hostname": asset.hostname,
        "application": asset.application,
        "asset_type": asset.asset_type.value if asset.asset_type else "unknown",
        "criticality_score": asset.criticality_score,
        "revenue_criticality": asset.revenue_criticality,
        "data_sensitivity": asset.data_sensitivity,
        "availability_dependency": asset.availability_dependency,
        "regulatory_importance": asset.regulatory_importance,
        "internet_exposure": asset.internet_exposure,
        "service_dependency": asset.service_dependency,
        "is_internet_facing": asset.is_internet_facing,
        "revenue_per_hour": asset.revenue_per_hour,
        "records_count": asset.records_count,
        "vulnerabilities": vulns,
        "risk": risk_data,
    }
