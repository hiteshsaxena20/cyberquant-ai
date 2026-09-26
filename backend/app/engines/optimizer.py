"""
CyberQuant AI — Investment Optimization Engine
Formulates security budget allocation as a 0/1 Knapsack / ILP problem.

Maximize: Σ RiskReduction_i × X_i
Subject to: Σ Cost_i × X_i ≤ Budget
Where: X_i ∈ {0, 1}

Uses Google OR-Tools for optimization.
Falls back to a greedy heuristic if OR-Tools is unavailable.
"""
from typing import List, Dict, Any, Optional
import numpy as np

try:
    from ortools.linear_solver import pywraplp
    HAS_ORTOOLS = True
except ImportError:
    HAS_ORTOOLS = False


def optimize_investment(
    actions: List[Dict[str, Any]],
    budget: float,
    excluded_ids: List[str] = None,
) -> Dict[str, Any]:
    """
    Find the optimal combination of security actions that maximizes
    risk reduction within a given budget.
    
    Args:
        actions: List of security actions with 'id', 'name', 'total_cost', 'risk_reduction'
        budget: Available security budget in INR
        excluded_ids: Action IDs to exclude from optimization
    
    Returns:
        Optimization result with selected actions, total spend, and risk reduction
    """
    if excluded_ids is None:
        excluded_ids = []
    
    # Filter actions
    eligible = [a for a in actions if str(a.get("id", "")) not in excluded_ids and a.get("total_cost", 0) > 0]
    
    if not eligible:
        return {
            "budget": budget,
            "total_spent": 0,
            "remaining_budget": budget,
            "total_risk_reduction": 0,
            "overall_rosi": 0,
            "selected_actions": [],
            "unselected_actions": actions,
        }
    
    if HAS_ORTOOLS:
        return _solve_with_ortools(eligible, budget, actions, excluded_ids)
    else:
        return _solve_greedy(eligible, budget, actions, excluded_ids)


def _solve_with_ortools(
    eligible: List[Dict[str, Any]],
    budget: float,
    all_actions: List[Dict[str, Any]],
    excluded_ids: List[str],
) -> Dict[str, Any]:
    """Solve using Google OR-Tools ILP solver."""
    solver = pywraplp.Solver.CreateSolver("SCIP")
    if not solver:
        # Fallback to CBC if SCIP not available
        solver = pywraplp.Solver.CreateSolver("CBC")
    
    if not solver:
        return _solve_greedy(eligible, budget, all_actions, excluded_ids)
    
    n = len(eligible)
    
    # Decision variables: x[i] ∈ {0, 1}
    x = [solver.IntVar(0, 1, f"x_{i}") for i in range(n)]
    
    # Budget constraint: Σ cost_i × x_i ≤ budget
    cost_constraint = solver.Constraint(0, budget)
    for i in range(n):
        cost_constraint.SetCoefficient(x[i], eligible[i].get("total_cost", 0))
    
    # Objective: Maximize Σ risk_reduction_i × x_i
    objective = solver.Objective()
    for i in range(n):
        objective.SetCoefficient(x[i], eligible[i].get("risk_reduction", 0))
    objective.SetMaximization()
    
    # Solve
    status = solver.Solve()
    
    selected = []
    unselected = []
    
    if status in (pywraplp.Solver.OPTIMAL, pywraplp.Solver.FEASIBLE):
        for i in range(n):
            action_copy = dict(eligible[i])
            if x[i].solution_value() > 0.5:
                action_copy["is_selected"] = True
                selected.append(action_copy)
            else:
                action_copy["is_selected"] = False
                unselected.append(action_copy)
    else:
        # No feasible solution — return cheapest action if affordable
        cheapest = min(eligible, key=lambda a: a.get("total_cost", float("inf")))
        if cheapest.get("total_cost", 0) <= budget:
            cheapest_copy = dict(cheapest)
            cheapest_copy["is_selected"] = True
            selected = [cheapest_copy]
            unselected = [dict(a) for a in eligible if a != cheapest]
        else:
            unselected = [dict(a) for a in eligible]
    
    # Add excluded actions to unselected
    for a in all_actions:
        if str(a.get("id", "")) in excluded_ids:
            a_copy = dict(a)
            a_copy["is_selected"] = False
            unselected.append(a_copy)
    
    return _build_result(selected, unselected, budget)


def _solve_greedy(
    eligible: List[Dict[str, Any]],
    budget: float,
    all_actions: List[Dict[str, Any]],
    excluded_ids: List[str],
) -> Dict[str, Any]:
    """Greedy approximation: sort by risk_reduction/cost ratio, pick until budget exhausted."""
    # Calculate efficiency ratio
    for a in eligible:
        cost = a.get("total_cost", 1)
        reduction = a.get("risk_reduction", 0)
        a["efficiency"] = reduction / cost if cost > 0 else 0
    
    # Sort by efficiency descending
    sorted_actions = sorted(eligible, key=lambda a: a["efficiency"], reverse=True)
    
    remaining = budget
    selected = []
    unselected = []
    
    for action in sorted_actions:
        cost = action.get("total_cost", 0)
        if cost <= remaining:
            action_copy = dict(action)
            action_copy["is_selected"] = True
            selected.append(action_copy)
            remaining -= cost
        else:
            action_copy = dict(action)
            action_copy["is_selected"] = False
            unselected.append(action_copy)
    
    # Add excluded
    for a in all_actions:
        if str(a.get("id", "")) in excluded_ids:
            a_copy = dict(a)
            a_copy["is_selected"] = False
            unselected.append(a_copy)
    
    return _build_result(selected, unselected, budget)


def _build_result(
    selected: List[Dict[str, Any]],
    unselected: List[Dict[str, Any]],
    budget: float,
) -> Dict[str, Any]:
    """Build the optimization result summary."""
    total_spent = sum(a.get("total_cost", 0) for a in selected)
    total_reduction = sum(a.get("risk_reduction", 0) for a in selected)
    
    # ROSI = (Risk Reduction - Investment) / Investment × 100
    rosi = ((total_reduction - total_spent) / total_spent * 100) if total_spent > 0 else 0
    
    return {
        "budget": budget,
        "total_spent": round(total_spent, 2),
        "remaining_budget": round(budget - total_spent, 2),
        "total_risk_reduction": round(total_reduction, 2),
        "overall_rosi": round(rosi, 2),
        "selected_actions": sorted(selected, key=lambda a: a.get("risk_reduction", 0), reverse=True),
        "unselected_actions": unselected,
    }


def calculate_rosi(investment: float, risk_reduction: float) -> float:
    """
    Return on Security Investment.
    ROSI = (Risk Reduction - Security Investment) / Security Investment × 100
    """
    if investment <= 0:
        return 0.0
    return round(((risk_reduction - investment) / investment) * 100, 2)


def sensitivity_analysis(
    actions: List[Dict[str, Any]],
    budget_range: List[float],
) -> List[Dict[str, Any]]:
    """
    Run optimization at multiple budget levels to show
    diminishing returns curve.
    """
    results = []
    for budget in sorted(budget_range):
        result = optimize_investment(actions, budget)
        results.append({
            "budget": budget,
            "risk_reduction": result["total_risk_reduction"],
            "rosi": result["overall_rosi"],
            "actions_selected": len(result["selected_actions"]),
        })
    return results
