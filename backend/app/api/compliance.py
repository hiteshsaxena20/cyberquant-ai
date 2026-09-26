"""
CyberQuant AI — Compliance API Routes
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Organization, ComplianceFramework, SecurityControl

router = APIRouter(prefix="/api/compliance", tags=["Compliance"])


@router.get("")
async def get_compliance_overview(db: AsyncSession = Depends(get_db)):
    """Get compliance posture across all frameworks."""
    org_result = await db.execute(select(Organization).limit(1))
    org = org_result.scalar_one_or_none()
    if not org:
        return {"frameworks": [], "overall_posture": 0}
    
    fw_q = await db.execute(
        select(ComplianceFramework).where(ComplianceFramework.org_id == org.id)
    )
    frameworks = fw_q.scalars().all()
    
    result = []
    total_score = 0
    for fw in frameworks:
        gaps = []
        critical_gaps = []
        if fw.category_scores:
            for cat, score in fw.category_scores.items():
                if score < 75:
                    gaps.append(cat)
                if score < 60:
                    critical_gaps.append(f"{cat}: {score}%")
        
        result.append({
            "framework": fw.name,
            "version": fw.version,
            "overall_score": fw.overall_score,
            "category_scores": fw.category_scores or {},
            "gap_count": len(gaps),
            "critical_gaps": critical_gaps,
            "last_assessed": fw.last_assessed.isoformat() if fw.last_assessed else None,
        })
        total_score += fw.overall_score
    
    overall = total_score / len(frameworks) if frameworks else 0
    
    return {
        "frameworks": result,
        "overall_posture": round(overall, 1),
    }


@router.get("/{framework_name}")
async def get_framework_detail(framework_name: str, db: AsyncSession = Depends(get_db)):
    """Get detailed compliance data for a specific framework."""
    org_result = await db.execute(select(Organization).limit(1))
    org = org_result.scalar_one_or_none()
    if not org:
        return {"error": "No organization found"}
    
    fw_q = await db.execute(
        select(ComplianceFramework).where(
            ComplianceFramework.org_id == org.id,
            ComplianceFramework.name.ilike(f"%{framework_name}%")
        )
    )
    fw = fw_q.scalar_one_or_none()
    if not fw:
        return {"error": "Framework not found"}
    
    # Get controls mapped to this framework
    controls_q = await db.execute(
        select(SecurityControl).where(SecurityControl.org_id == org.id)
    )
    controls = controls_q.scalars().all()
    
    # Map controls to framework
    mapped_controls = []
    mapping_field = {
        "NIST": "nist_mapping",
        "ISO": "iso_mapping",
        "CIS": "cis_mapping",
        "RBI": "rbi_mapping",
        "SEBI": "sebi_mapping",
    }
    
    field = None
    for key, val in mapping_field.items():
        if key.lower() in framework_name.lower():
            field = val
            break
    
    for ctrl in controls:
        mappings = getattr(ctrl, field, []) if field else []
        if mappings:
            mapped_controls.append({
                "control": ctrl.name,
                "effectiveness": ctrl.effectiveness_score,
                "coverage": ctrl.coverage,
                "mappings": mappings,
                "category": ctrl.category.value if ctrl.category else "unknown",
            })
    
    return {
        "framework": fw.name,
        "version": fw.version,
        "overall_score": fw.overall_score,
        "category_scores": fw.category_scores or {},
        "mapped_controls": mapped_controls,
    }
