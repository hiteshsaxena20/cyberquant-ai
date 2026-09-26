"""
CyberQuant AI — Pydantic Schemas for API request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


# [*] Organization [*]
class OrgBase(BaseModel):
    name: str
    industry: Optional[str] = None
    annual_revenue: Optional[float] = None
    employee_count: Optional[int] = None

class OrgResponse(OrgBase):
    id: UUID
    created_at: datetime
    class Config:
        from_attributes = True


# [*] Asset [*]
class AssetBase(BaseModel):
    asset_id: str
    hostname: Optional[str] = None
    ip_address: Optional[str] = None
    asset_type: str
    application: Optional[str] = None
    owner: Optional[str] = None
    is_internet_facing: bool = False

class AssetResponse(AssetBase):
    id: UUID
    criticality_score: float = 0
    revenue_criticality: float = 0
    data_sensitivity: float = 0
    availability_dependency: float = 0
    regulatory_importance: float = 0
    internet_exposure: float = 0
    service_dependency: float = 0
    data_classification: Optional[str] = None
    revenue_per_hour: float = 0
    records_count: int = 0
    bu_name: Optional[str] = None
    vulnerability_count: int = 0
    financial_exposure: float = 0
    class Config:
        from_attributes = True


class AssetDetail(AssetResponse):
    vulnerabilities: List[dict] = []
    controls: List[dict] = []
    risk_score: Optional[dict] = None


# [*] Vulnerability [*]
class VulnResponse(BaseModel):
    id: UUID
    cve_id: Optional[str] = None
    title: Optional[str] = None
    cvss_score: float = 0
    severity: str = "medium"
    exploit_available: bool = False
    exploit_in_wild: bool = False
    patch_available: bool = False
    status: str = "open"
    financial_exposure: float = 0
    likelihood: float = 0
    asset_id_str: Optional[str] = None
    asset_hostname: Optional[str] = None
    discovered_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# [*] Risk Score [*]
class RiskScoreResponse(BaseModel):
    asset_id: UUID
    aro: float = 0
    sle: float = 0
    eal: float = 0
    downtime_cost: float = 0
    breach_cost: float = 0
    response_cost: float = 0
    legal_cost: float = 0
    regulatory_cost: float = 0
    reputation_cost: float = 0
    var_90: float = 0
    var_95: float = 0
    var_99: float = 0
    mean_loss: float = 0
    median_loss: float = 0
    incident_probability_7d: float = 0
    incident_probability_30d: float = 0
    incident_probability_90d: float = 0
    incident_probability_365d: float = 0
    risk_drivers: Dict[str, float] = {}
    calculated_at: Optional[datetime] = None
    class Config:
        from_attributes = True


# [*] Enterprise Risk Summary [*]
class EnterpriseRiskSummary(BaseModel):
    total_eal: float = 0
    var_95: float = 0
    var_99: float = 0
    mean_loss: float = 0
    total_assets: int = 0
    critical_assets: int = 0
    total_vulnerabilities: int = 0
    critical_vulnerabilities: int = 0
    open_vulnerabilities: int = 0
    mfa_coverage: float = 0
    internet_facing_assets: int = 0
    risk_trend_30d: float = 0  # percentage change
    top_risks: List[Dict[str, Any]] = []
    risk_by_bu: List[Dict[str, Any]] = []
    risk_by_type: List[Dict[str, Any]] = []
    risk_drivers: List[Dict[str, Any]] = []
    eal_trend: List[Dict[str, Any]] = []


# [*] Security Control [*]
class ControlResponse(BaseModel):
    id: UUID
    name: str
    category: Optional[str] = None
    coverage: float = 0
    strength: float = 0
    effectiveness_score: float = 0
    annual_cost: float = 0
    nist_mapping: List[str] = []
    iso_mapping: List[str] = []
    cis_mapping: List[str] = []
    class Config:
        from_attributes = True


# [*] Security Action [*]
class ActionResponse(BaseModel):
    id: UUID
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    total_cost: float = 0
    risk_reduction: float = 0
    affected_assets: int = 0
    implementation_days: int = 0
    rosi: float = 0
    is_selected: bool = False
    class Config:
        from_attributes = True


# [*] Optimization [*]
class OptimizationRequest(BaseModel):
    budget: float = Field(..., description="Available security budget in INR")
    constraint_ids: List[str] = Field(default=[], description="Action IDs to exclude")

class OptimizationResult(BaseModel):
    budget: float
    total_spent: float
    remaining_budget: float
    current_eal: float
    residual_eal: float
    total_risk_reduction: float
    overall_rosi: float
    selected_actions: List[Dict[str, Any]]
    unselected_actions: List[Dict[str, Any]]


# [*] Simulation [*]
class SimulationRequest(BaseModel):
    control_changes: Dict[str, Any] = Field(
        ...,
        description="Control name → new value (e.g., {'mfa_coverage': 100, 'patch_critical_cves': True})"
    )
    delay_days: int = Field(default=0, description="Simulate remediation delay in days")

class SimulationResult(BaseModel):
    scenario_name: str
    current_eal: float
    projected_eal: float
    risk_reduction: float
    investment_required: float
    rosi: float
    changes_applied: Dict[str, Any]
    affected_assets: int
    timeline: List[Dict[str, Any]] = []


# [*] Compliance [*]
class ComplianceScore(BaseModel):
    framework: str
    version: Optional[str] = None
    overall_score: float
    category_scores: Dict[str, float] = {}
    gap_count: int = 0
    critical_gaps: List[str] = []

class ComplianceOverview(BaseModel):
    frameworks: List[ComplianceScore] = []
    overall_posture: float = 0


# [*] AI Chat [*]
class ChatMessage(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

class ChatResponse(BaseModel):
    response: str
    data: Optional[Dict[str, Any]] = None
    visualization: Optional[str] = None  # chart type hint
    sources: List[str] = []


# [*] Risk Explorer [*]
class RiskDrilldown(BaseModel):
    level: str  # enterprise, business_unit, application, asset, vulnerability
    name: str
    eal: float
    var_95: float = 0
    children: List[Dict[str, Any]] = []
    vulnerabilities: List[Dict[str, Any]] = []


# [*] Dashboard Data [*]
class DashboardData(BaseModel):
    enterprise_risk: EnterpriseRiskSummary
    top_assets: List[Dict[str, Any]] = []
    recent_events: List[Dict[str, Any]] = []
    control_effectiveness: List[Dict[str, Any]] = []
    compliance_summary: List[Dict[str, Any]] = []
