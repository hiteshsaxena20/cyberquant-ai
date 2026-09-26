"""
CyberQuant AI — SQLAlchemy Database Models
All models for the cyber risk quantification platform.
"""
import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Float, Integer, Boolean, DateTime, Text,
    ForeignKey, JSON, Enum as SQLEnum, TypeDecorator, CHAR,
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import relationship
from app.database import Base
import enum


# Cross-platform UUID type that works with both SQLite and PostgreSQL
class GUID(TypeDecorator):
    """Platform-independent GUID type. Uses PostgreSQL's UUID when available,
    otherwise stores as CHAR(36) for SQLite."""
    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == "postgresql":
            return dialect.type_descriptor(PG_GUID())
        else:
            return dialect.type_descriptor(CHAR(36))

    def process_bind_param(self, value, dialect):
        if value is not None:
            if dialect.name == "postgresql":
                return value if isinstance(value, uuid.UUID) else uuid.UUID(str(value))
            else:
                return str(value)
        return value

    def process_result_value(self, value, dialect):
        if value is not None:
            if not isinstance(value, uuid.UUID):
                value = uuid.UUID(str(value))
        return value


# [*] Enums [*]
class AssetType(str, enum.Enum):
    SERVER = "server"
    ENDPOINT = "endpoint"
    DATABASE = "database"
    APPLICATION = "application"
    NETWORK_DEVICE = "network_device"
    CLOUD_SERVICE = "cloud_service"
    IOT_DEVICE = "iot_device"


class VulnSeverity(str, enum.Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"


class RemediationStatus(str, enum.Enum):
    OPEN = "open"
    IN_PROGRESS = "in_progress"
    REMEDIATED = "remediated"
    ACCEPTED = "accepted"
    FALSE_POSITIVE = "false_positive"


class ControlCategory(str, enum.Enum):
    PREVENTIVE = "preventive"
    DETECTIVE = "detective"
    CORRECTIVE = "corrective"
    DETERRENT = "deterrent"


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    CISO = "ciso"
    RISK_OFFICER = "risk_officer"
    SOC_ANALYST = "soc_analyst"
    AUDITOR = "auditor"
    EXECUTIVE = "executive"


# [*] Organization (Multi-Tenant) [*]
class Organization(Base):
    __tablename__ = "organizations"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    industry = Column(String(100))
    annual_revenue = Column(Float)  # in INR
    employee_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    assets = relationship("Asset", back_populates="organization", cascade="all, delete-orphan")
    business_units = relationship("BusinessUnit", back_populates="organization", cascade="all, delete-orphan")
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")


# [*] User [*]
class User(Base):
    __tablename__ = "users"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    org_id = Column(GUID(), ForeignKey("organizations.id"), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(SQLEnum(UserRole, native_enum=False), default=UserRole.SOC_ANALYST)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    organization = relationship("Organization", back_populates="users")


# [*] Business Unit [*]
class BusinessUnit(Base):
    __tablename__ = "business_units"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    org_id = Column(GUID(), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    head = Column(String(255))
    revenue_contribution = Column(Float)  # percentage
    criticality_tier = Column(Integer)  # 1=critical, 2=high, 3=medium, 4=low

    organization = relationship("Organization", back_populates="business_units")
    assets = relationship("Asset", back_populates="business_unit")


# [*] Asset [*]
class Asset(Base):
    __tablename__ = "assets"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    org_id = Column(GUID(), ForeignKey("organizations.id"), nullable=False)
    bu_id = Column(GUID(), ForeignKey("business_units.id"), nullable=True)
    asset_id = Column(String(100), nullable=False)  # internal ID like SRV-PAY-01
    hostname = Column(String(255))
    ip_address = Column(String(50))
    asset_type = Column(SQLEnum(AssetType, native_enum=False), nullable=False)
    application = Column(String(255))
    owner = Column(String(255))
    os = Column(String(100))
    
    # Business Context
    data_classification = Column(String(50))  # public, internal, confidential, restricted
    revenue_criticality = Column(Float, default=0)  # 0-100
    data_sensitivity = Column(Float, default=0)
    availability_dependency = Column(Float, default=0)
    regulatory_importance = Column(Float, default=0)
    internet_exposure = Column(Float, default=0)
    service_dependency = Column(Float, default=0)
    
    # Computed
    criticality_score = Column(Float, default=0)  # ACS 0-100
    
    # Financial
    revenue_per_hour = Column(Float, default=0)
    records_count = Column(Integer, default=0)
    
    # Status
    is_internet_facing = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    last_scan_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    organization = relationship("Organization", back_populates="assets")
    business_unit = relationship("BusinessUnit", back_populates="assets")
    vulnerabilities = relationship("Vulnerability", back_populates="asset", cascade="all, delete-orphan")
    risk_scores = relationship("RiskScore", back_populates="asset", cascade="all, delete-orphan")
    asset_controls = relationship("AssetControl", back_populates="asset", cascade="all, delete-orphan")


# [*] Vulnerability [*]
class Vulnerability(Base):
    __tablename__ = "vulnerabilities"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    asset_id = Column(GUID(), ForeignKey("assets.id"), nullable=False)
    cve_id = Column(String(50))
    title = Column(String(500))
    description = Column(Text)
    
    # CVSS
    cvss_score = Column(Float, default=0)
    cvss_vector = Column(String(100))
    severity = Column(SQLEnum(VulnSeverity, native_enum=False), default=VulnSeverity.MEDIUM)
    
    # Exploit context
    exploit_available = Column(Boolean, default=False)
    exploit_in_wild = Column(Boolean, default=False)
    patch_available = Column(Boolean, default=False)
    patch_age_days = Column(Integer, default=0)
    
    # Threat Intelligence
    threat_activity = Column(String(50))  # none, low, moderate, high, active_campaign
    
    # Status
    status = Column(SQLEnum(RemediationStatus, native_enum=False), default=RemediationStatus.OPEN)
    discovered_at = Column(DateTime, default=datetime.utcnow)
    remediated_at = Column(DateTime, nullable=True)
    
    # Risk (computed)
    financial_exposure = Column(Float, default=0)  # in INR
    likelihood = Column(Float, default=0)  # 0-1 probability
    
    asset = relationship("Asset", back_populates="vulnerabilities")


# [*] Security Control [*]
class SecurityControl(Base):
    __tablename__ = "security_controls"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    org_id = Column(GUID(), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    category = Column(SQLEnum(ControlCategory, native_enum=False))
    description = Column(Text)
    
    # Effectiveness
    coverage = Column(Float, default=0)  # 0-100%
    strength = Column(Float, default=0)  # 0-100
    historical_performance = Column(Float, default=0)  # 0-100
    effectiveness_score = Column(Float, default=0)  # computed 0-100
    
    # Cost
    annual_cost = Column(Float, default=0)
    implementation_cost = Column(Float, default=0)
    
    # Framework Mappings
    nist_mapping = Column(JSON, default=list)
    iso_mapping = Column(JSON, default=list)
    cis_mapping = Column(JSON, default=list)
    rbi_mapping = Column(JSON, default=list)
    sebi_mapping = Column(JSON, default=list)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    asset_controls = relationship("AssetControl", back_populates="control", cascade="all, delete-orphan")


# [*] Asset-Control Junction [*]
class AssetControl(Base):
    __tablename__ = "asset_controls"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    asset_id = Column(GUID(), ForeignKey("assets.id"), nullable=False)
    control_id = Column(GUID(), ForeignKey("security_controls.id"), nullable=False)
    is_enabled = Column(Boolean, default=True)
    configuration_score = Column(Float, default=50)  # 0-100

    asset = relationship("Asset", back_populates="asset_controls")
    control = relationship("SecurityControl", back_populates="asset_controls")


# [*] Risk Score (per-asset computed risk) [*]
class RiskScore(Base):
    __tablename__ = "risk_scores"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    asset_id = Column(GUID(), ForeignKey("assets.id"), nullable=False)
    
    # Quantified risk
    annual_rate_of_occurrence = Column(Float, default=0)  # ARO
    single_loss_expectancy = Column(Float, default=0)  # SLE in INR
    expected_annual_loss = Column(Float, default=0)  # EAL = ARO × SLE
    
    # Loss components
    downtime_cost = Column(Float, default=0)
    breach_cost = Column(Float, default=0)
    response_cost = Column(Float, default=0)
    legal_cost = Column(Float, default=0)
    regulatory_cost = Column(Float, default=0)
    reputation_cost = Column(Float, default=0)
    
    # Monte Carlo results
    var_90 = Column(Float, default=0)
    var_95 = Column(Float, default=0)
    var_99 = Column(Float, default=0)
    mean_loss = Column(Float, default=0)
    median_loss = Column(Float, default=0)
    
    # ML prediction
    incident_probability_7d = Column(Float, default=0)
    incident_probability_30d = Column(Float, default=0)
    incident_probability_90d = Column(Float, default=0)
    incident_probability_365d = Column(Float, default=0)
    
    # Explainability (SHAP)
    risk_drivers = Column(JSON, default=dict)  # feature → contribution
    
    calculated_at = Column(DateTime, default=datetime.utcnow)
    
    asset = relationship("Asset", back_populates="risk_scores")


# [*] Security Action (for optimization) [*]
class SecurityAction(Base):
    __tablename__ = "security_actions"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    org_id = Column(GUID(), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100))
    
    # Costs
    implementation_cost = Column(Float, default=0)  # one-time
    annual_cost = Column(Float, default=0)  # recurring
    total_cost = Column(Float, default=0)  # for optimization
    
    # Benefits
    risk_reduction = Column(Float, default=0)  # estimated EAL reduction in INR
    affected_assets = Column(Integer, default=0)
    
    # Constraints
    implementation_days = Column(Integer, default=0)
    requires_downtime = Column(Boolean, default=False)
    dependency_ids = Column(JSON, default=list)  # IDs of actions that must be done first
    
    # Computed
    rosi = Column(Float, default=0)  # Return on Security Investment
    priority_score = Column(Float, default=0)
    
    is_selected = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# [*] Compliance Framework [*]
class ComplianceFramework(Base):
    __tablename__ = "compliance_frameworks"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    org_id = Column(GUID(), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(100), nullable=False)  # NIST CSF, ISO 27001, etc.
    version = Column(String(50))
    
    # Overall compliance
    overall_score = Column(Float, default=0)  # 0-100
    
    # Category scores
    category_scores = Column(JSON, default=dict)
    
    # Control mappings
    control_mappings = Column(JSON, default=list)
    
    last_assessed = Column(DateTime, default=datetime.utcnow)


# [*] Scenario (for what-if simulation) [*]
class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    org_id = Column(GUID(), ForeignKey("organizations.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    
    # Changes to simulate
    control_changes = Column(JSON, default=dict)  # control_id → new_effectiveness
    
    # Results
    current_eal = Column(Float, default=0)
    projected_eal = Column(Float, default=0)
    risk_reduction = Column(Float, default=0)
    investment_required = Column(Float, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)


# [*] Risk Event (historical incidents) [*]
class RiskEvent(Base):
    __tablename__ = "risk_events"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    org_id = Column(GUID(), ForeignKey("organizations.id"), nullable=False)
    event_type = Column(String(100))  # ransomware, data_breach, phishing, etc.
    severity = Column(String(20))
    description = Column(Text)
    affected_assets = Column(JSON, default=list)
    financial_impact = Column(Float, default=0)
    detected_at = Column(DateTime)
    resolved_at = Column(DateTime, nullable=True)
    root_cause = Column(Text)
    lessons_learned = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
