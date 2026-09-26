"""
CyberQuant AI — Simulation API Routes
What-if scenarios and remediation delay projections.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models import Organization, Asset, RiskScore
from app.schemas import SimulationRequest
from app.engines.simulator import (
    simulate_control_change,
    simulate_delay,
    generate_predefined_scenarios,
)

router = APIRouter(prefix="/api/simulation", tags=["Simulation"])


@router.post("/run")
async def run_simulation(request: SimulationRequest, db: AsyncSession = Depends(get_db)):
    """Run a what-if simulation with specified control changes."""
    org_result = await db.execute(select(Organization).limit(1))
    org = org_result.scalar_one_or_none()
    if not org:
        return {"error": "No organization found"}
    
    # Get current EAL
    eal_q = await db.execute(
        select(func.sum(RiskScore.expected_annual_loss))
        .join(Asset).where(Asset.org_id == org.id)
    )
    current_eal = float(eal_q.scalar() or 0)
    
    # Handle delay simulation
    if request.delay_days > 0:
        timeline = simulate_delay(current_eal, request.delay_days)
        return {
            "scenario_name": f"{request.delay_days}-Day Remediation Delay",
            "current_eal": round(current_eal, 2),
            "projected_eal": timeline[-1]["projected_eal"] if timeline else current_eal,
            "risk_reduction": -(timeline[-1]["increase"]) if timeline else 0,
            "investment_required": 0,
            "rosi": 0,
            "changes_applied": {"delay_days": request.delay_days},
            "affected_assets": 0,
            "timeline": timeline,
            "is_delay_scenario": True,
        }
    
    # Run control change simulation
    result = simulate_control_change([], request.control_changes, current_eal)
    return result


@router.get("/scenarios")
async def get_predefined_scenarios(db: AsyncSession = Depends(get_db)):
    """Get predefined what-if scenarios with pre-computed results."""
    org_result = await db.execute(select(Organization).limit(1))
    org = org_result.scalar_one_or_none()
    if not org:
        return {"scenarios": []}
    
    eal_q = await db.execute(
        select(func.sum(RiskScore.expected_annual_loss))
        .join(Asset).where(Asset.org_id == org.id)
    )
    current_eal = float(eal_q.scalar() or 0)
    
    scenarios = generate_predefined_scenarios(current_eal)
    return {"scenarios": scenarios, "current_eal": current_eal}
