"""
CyberQuant AI — Optimization API Routes
Budget optimization and ROSI calculation.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models import Organization, SecurityAction, RiskScore, Asset
from app.schemas import OptimizationRequest
from app.engines.optimizer import optimize_investment, sensitivity_analysis, calculate_rosi
from sqlalchemy import func

router = APIRouter(prefix="/api/optimization", tags=["Optimization"])


@router.post("/optimize")
async def optimize_budget(request: OptimizationRequest, db: AsyncSession = Depends(get_db)):
    """Run investment optimization for given budget."""
    org_result = await db.execute(select(Organization).limit(1))
    org = org_result.scalar_one_or_none()
    if not org:
        return {"error": "No organization found"}
    
    # Get all security actions
    actions_q = await db.execute(
        select(SecurityAction).where(SecurityAction.org_id == org.id)
    )
    actions = [
        {
            "id": str(a.id),
            "name": a.name,
            "description": a.description,
            "category": a.category,
            "total_cost": a.total_cost,
            "risk_reduction": a.risk_reduction,
            "affected_assets": a.affected_assets,
            "implementation_days": a.implementation_days,
            "requires_downtime": a.requires_downtime,
            "rosi": a.rosi,
        }
        for a in actions_q.scalars().all()
    ]
    
    # Get current EAL
    eal_q = await db.execute(
        select(func.sum(RiskScore.expected_annual_loss))
        .join(Asset).where(Asset.org_id == org.id)
    )
    current_eal = float(eal_q.scalar() or 0)
    
    # Run optimization
    result = optimize_investment(actions, request.budget, request.constraint_ids)
    result["current_eal"] = current_eal
    result["residual_eal"] = current_eal - result["total_risk_reduction"]
    
    return result


@router.get("/actions")
async def get_security_actions(db: AsyncSession = Depends(get_db)):
    """Get all available security actions."""
    org_result = await db.execute(select(Organization).limit(1))
    org = org_result.scalar_one_or_none()
    if not org:
        return {"actions": []}
    
    actions_q = await db.execute(
        select(SecurityAction).where(SecurityAction.org_id == org.id)
        .order_by(SecurityAction.rosi.desc())
    )
    
    return {
        "actions": [
            {
                "id": str(a.id),
                "name": a.name,
                "description": a.description,
                "category": a.category,
                "total_cost": a.total_cost,
                "risk_reduction": a.risk_reduction,
                "affected_assets": a.affected_assets,
                "implementation_days": a.implementation_days,
                "requires_downtime": a.requires_downtime,
                "rosi": a.rosi,
            }
            for a in actions_q.scalars().all()
        ]
    }


@router.post("/sensitivity")
async def run_sensitivity(db: AsyncSession = Depends(get_db)):
    """Run sensitivity analysis across multiple budget levels."""
    org_result = await db.execute(select(Organization).limit(1))
    org = org_result.scalar_one_or_none()
    if not org:
        return {"results": []}
    
    actions_q = await db.execute(
        select(SecurityAction).where(SecurityAction.org_id == org.id)
    )
    actions = [
        {
            "id": str(a.id),
            "name": a.name,
            "total_cost": a.total_cost,
            "risk_reduction": a.risk_reduction,
        }
        for a in actions_q.scalars().all()
    ]
    
    budget_levels = [
        2000000, 5000000, 7500000, 10000000, 15000000,
        20000000, 25000000, 30000000, 40000000, 50000000,
    ]
    
    results = sensitivity_analysis(actions, budget_levels)
    return {"results": results}
