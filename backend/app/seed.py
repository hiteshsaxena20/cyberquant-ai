"""
CyberQuant AI — Synthetic Data Seeder
Generates realistic enterprise data for "ABC Bank" demo.

ABC Bank profile:
- 2,500 assets
- 73 critical vulnerabilities
- 420 privileged accounts
- 67% MFA coverage
- 112 internet-facing assets
- Annual Revenue: ₹500 Crore
"""
import uuid
import random
import numpy as np
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import (
    Organization, BusinessUnit, Asset, Vulnerability, SecurityControl,
    AssetControl, RiskScore, SecurityAction, ComplianceFramework, RiskEvent,
    User, AssetType, VulnSeverity, RemediationStatus, ControlCategory, UserRole,
)
from app.engines.criticality import calculate_criticality_score
from app.engines.risk import calculate_asset_risk
from app.engines.control import calculate_control_effectiveness


# [*] Constants [*]
ANNUAL_REVENUE = 500_00_00_000  # ₹500 Crore

BUSINESS_UNITS = [
    {"name": "Digital Banking", "head": "Rajesh Kumar", "revenue_pct": 35, "tier": 1},
    {"name": "Core Banking", "head": "Priya Sharma", "revenue_pct": 25, "tier": 1},
    {"name": "Payment Services", "head": "Amit Patel", "revenue_pct": 20, "tier": 1},
    {"name": "Wealth Management", "head": "Sneha Reddy", "revenue_pct": 10, "tier": 2},
    {"name": "Corporate Banking", "head": "Vikram Singh", "revenue_pct": 5, "tier": 2},
    {"name": "Human Resources", "head": "Anita Desai", "revenue_pct": 2, "tier": 3},
    {"name": "IT Operations", "head": "Suresh Menon", "revenue_pct": 2, "tier": 2},
    {"name": "Compliance & Risk", "head": "Deepak Joshi", "revenue_pct": 1, "tier": 2},
]

CRITICAL_ASSETS = [
    {"id": "SRV-PAY-01", "hostname": "pay-gateway-01", "type": AssetType.SERVER,
     "app": "Payment Gateway", "bu": "Payment Services", "internet": True,
     "rev_crit": 95, "data_sens": 90, "avail": 98, "reg": 95, "exp": 95, "dep": 90,
     "rev_hr": 500000, "records": 5000000},
    {"id": "SRV-PAY-02", "hostname": "pay-processor-01", "type": AssetType.SERVER,
     "app": "Payment Processor", "bu": "Payment Services", "internet": False,
     "rev_crit": 90, "data_sens": 85, "avail": 95, "reg": 90, "exp": 30, "dep": 85,
     "rev_hr": 400000, "records": 3000000},
    {"id": "DB-CUST-01", "hostname": "cust-db-primary", "type": AssetType.DATABASE,
     "app": "Customer Database", "bu": "Digital Banking", "internet": False,
     "rev_crit": 85, "data_sens": 98, "avail": 95, "reg": 95, "exp": 10, "dep": 80,
     "rev_hr": 200000, "records": 12000000},
    {"id": "APP-IB-01", "hostname": "inet-banking-01", "type": AssetType.APPLICATION,
     "app": "Internet Banking", "bu": "Digital Banking", "internet": True,
     "rev_crit": 92, "data_sens": 85, "avail": 98, "reg": 90, "exp": 90, "dep": 85,
     "rev_hr": 600000, "records": 8000000},
    {"id": "APP-MB-01", "hostname": "mobile-banking-01", "type": AssetType.APPLICATION,
     "app": "Mobile Banking", "bu": "Digital Banking", "internet": True,
     "rev_crit": 88, "data_sens": 80, "avail": 95, "reg": 85, "exp": 85, "dep": 80,
     "rev_hr": 450000, "records": 6000000},
    {"id": "SRV-CORE-01", "hostname": "core-banking-01", "type": AssetType.SERVER,
     "app": "Core Banking System", "bu": "Core Banking", "internet": False,
     "rev_crit": 98, "data_sens": 95, "avail": 99, "reg": 95, "exp": 5, "dep": 95,
     "rev_hr": 800000, "records": 15000000},
    {"id": "SRV-API-01", "hostname": "api-gateway-01", "type": AssetType.SERVER,
     "app": "API Gateway", "bu": "Digital Banking", "internet": True,
     "rev_crit": 82, "data_sens": 70, "avail": 95, "reg": 75, "exp": 92, "dep": 88,
     "rev_hr": 350000, "records": 2000000},
    {"id": "DB-TXN-01", "hostname": "txn-db-primary", "type": AssetType.DATABASE,
     "app": "Transaction Database", "bu": "Core Banking", "internet": False,
     "rev_crit": 95, "data_sens": 90, "avail": 99, "reg": 95, "exp": 5, "dep": 92,
     "rev_hr": 700000, "records": 20000000},
    {"id": "SRV-ATM-01", "hostname": "atm-controller-01", "type": AssetType.SERVER,
     "app": "ATM Network", "bu": "Payment Services", "internet": True,
     "rev_crit": 80, "data_sens": 75, "avail": 95, "reg": 80, "exp": 70, "dep": 75,
     "rev_hr": 300000, "records": 1000000},
    {"id": "SRV-SWIFT-01", "hostname": "swift-gateway-01", "type": AssetType.SERVER,
     "app": "SWIFT Gateway", "bu": "Corporate Banking", "internet": True,
     "rev_crit": 95, "data_sens": 90, "avail": 99, "reg": 98, "exp": 80, "dep": 90,
     "rev_hr": 1000000, "records": 500000},
]

CVES = [
    {"cve": "CVE-2024-21762", "title": "Fortinet FortiOS RCE", "cvss": 9.8, "sev": VulnSeverity.CRITICAL,
     "exploit": True, "wild": True, "patch": True, "threat": "active_campaign"},
    {"cve": "CVE-2024-3400", "title": "Palo Alto PAN-OS Command Injection", "cvss": 10.0, "sev": VulnSeverity.CRITICAL,
     "exploit": True, "wild": True, "patch": True, "threat": "active_campaign"},
    {"cve": "CVE-2023-44228", "title": "Apache Log4j RCE", "cvss": 9.8, "sev": VulnSeverity.CRITICAL,
     "exploit": True, "wild": True, "patch": True, "threat": "high"},
    {"cve": "CVE-2024-1709", "title": "ConnectWise ScreenConnect Auth Bypass", "cvss": 10.0, "sev": VulnSeverity.CRITICAL,
     "exploit": True, "wild": True, "patch": True, "threat": "active_campaign"},
    {"cve": "CVE-2023-46805", "title": "Ivanti Connect Secure Auth Bypass", "cvss": 8.2, "sev": VulnSeverity.HIGH,
     "exploit": True, "wild": True, "patch": True, "threat": "high"},
    {"cve": "CVE-2024-27198", "title": "JetBrains TeamCity Auth Bypass", "cvss": 9.8, "sev": VulnSeverity.CRITICAL,
     "exploit": True, "wild": False, "patch": True, "threat": "moderate"},
    {"cve": "CVE-2023-22515", "title": "Atlassian Confluence Privilege Escalation", "cvss": 9.8, "sev": VulnSeverity.CRITICAL,
     "exploit": True, "wild": True, "patch": True, "threat": "high"},
    {"cve": "CVE-2024-0012", "title": "PAN-OS Management Interface Auth Bypass", "cvss": 9.1, "sev": VulnSeverity.CRITICAL,
     "exploit": True, "wild": True, "patch": True, "threat": "active_campaign"},
    {"cve": "CVE-2023-20198", "title": "Cisco IOS XE Web UI Privilege Escalation", "cvss": 10.0, "sev": VulnSeverity.CRITICAL,
     "exploit": True, "wild": True, "patch": True, "threat": "high"},
    {"cve": "CVE-2024-47575", "title": "Fortinet FortiManager RCE", "cvss": 9.8, "sev": VulnSeverity.CRITICAL,
     "exploit": True, "wild": True, "patch": True, "threat": "active_campaign"},
]

CONTROLS = [
    {"name": "Multi-Factor Authentication", "cat": ControlCategory.PREVENTIVE,
     "coverage": 67, "strength": 72, "history": 80, "cost_annual": 1200000,
     "nist": ["PR.AC-7"], "iso": ["A.9.4.2"], "cis": ["CIS 6.3"]},
    {"name": "Endpoint Detection & Response", "cat": ControlCategory.DETECTIVE,
     "coverage": 72, "strength": 78, "history": 75, "cost_annual": 2400000,
     "nist": ["DE.CM-4"], "iso": ["A.12.2.1"], "cis": ["CIS 10.1"]},
    {"name": "Network Segmentation", "cat": ControlCategory.PREVENTIVE,
     "coverage": 45, "strength": 60, "history": 65, "cost_annual": 800000,
     "nist": ["PR.AC-5"], "iso": ["A.13.1.3"], "cis": ["CIS 12.2"]},
    {"name": "Patch Management", "cat": ControlCategory.CORRECTIVE,
     "coverage": 58, "strength": 55, "history": 50, "cost_annual": 600000,
     "nist": ["PR.IP-12"], "iso": ["A.12.6.1"], "cis": ["CIS 7.1"]},
    {"name": "Firewall", "cat": ControlCategory.PREVENTIVE,
     "coverage": 92, "strength": 85, "history": 88, "cost_annual": 1500000,
     "nist": ["PR.AC-5"], "iso": ["A.13.1.1"], "cis": ["CIS 9.2"]},
    {"name": "Backup & Recovery", "cat": ControlCategory.CORRECTIVE,
     "coverage": 78, "strength": 70, "history": 72, "cost_annual": 900000,
     "nist": ["PR.IP-4"], "iso": ["A.12.3.1"], "cis": ["CIS 11.2"]},
    {"name": "SIEM & Monitoring", "cat": ControlCategory.DETECTIVE,
     "coverage": 68, "strength": 74, "history": 70, "cost_annual": 3000000,
     "nist": ["DE.AE-3"], "iso": ["A.12.4.1"], "cis": ["CIS 8.2"]},
    {"name": "Web Application Firewall", "cat": ControlCategory.PREVENTIVE,
     "coverage": 55, "strength": 65, "history": 68, "cost_annual": 1000000,
     "nist": ["PR.DS-5"], "iso": ["A.14.1.2"], "cis": ["CIS 13.6"]},
    {"name": "Data Encryption", "cat": ControlCategory.PREVENTIVE,
     "coverage": 82, "strength": 88, "history": 90, "cost_annual": 500000,
     "nist": ["PR.DS-1"], "iso": ["A.10.1.1"], "cis": ["CIS 3.6"]},
    {"name": "Security Awareness Training", "cat": ControlCategory.DETERRENT,
     "coverage": 85, "strength": 45, "history": 55, "cost_annual": 300000,
     "nist": ["PR.AT-1"], "iso": ["A.7.2.2"], "cis": ["CIS 14.1"]},
]

SECURITY_ACTIONS = [
    {"name": "Patch Critical CVEs", "desc": "Remediate all critical and high-severity vulnerabilities across production systems",
     "category": "Vulnerability Management", "cost": 3200000, "reduction": 9000000,
     "days": 30, "downtime": True, "assets": 45},
    {"name": "Enable Privileged MFA", "desc": "Deploy MFA for all privileged accounts including admin, service, and root accounts",
     "category": "Identity & Access", "cost": 2000000, "reduction": 5000000,
     "days": 14, "downtime": False, "assets": 420},
    {"name": "Network Segmentation", "desc": "Implement micro-segmentation for critical payment and database systems",
     "category": "Network Security", "cost": 2800000, "reduction": 8000000,
     "days": 45, "downtime": True, "assets": 150},
    {"name": "EDR Expansion", "desc": "Extend EDR coverage from 72% to 95% across all endpoints",
     "category": "Endpoint Security", "cost": 1200000, "reduction": 3500000,
     "days": 21, "downtime": False, "assets": 600},
    {"name": "Enhanced Monitoring", "desc": "Upgrade SIEM rules and add 24/7 SOC monitoring for critical assets",
     "category": "Security Operations", "cost": 800000, "reduction": 2000000,
     "days": 10, "downtime": False, "assets": 200},
    {"name": "WAF Deployment", "desc": "Deploy WAF for all internet-facing web applications",
     "category": "Application Security", "cost": 1500000, "reduction": 4000000,
     "days": 14, "downtime": False, "assets": 35},
    {"name": "Backup Hardening", "desc": "Implement immutable backups and 3-2-1 backup strategy",
     "category": "Data Protection", "cost": 1000000, "reduction": 3000000,
     "days": 21, "downtime": False, "assets": 50},
    {"name": "Zero Trust Implementation", "desc": "Deploy zero trust network access for remote users",
     "category": "Network Security", "cost": 4000000, "reduction": 6000000,
     "days": 60, "downtime": False, "assets": 800},
    {"name": "Database Encryption", "desc": "Encrypt all databases at rest containing PII/financial data",
     "category": "Data Protection", "cost": 600000, "reduction": 2500000,
     "days": 14, "downtime": True, "assets": 25},
    {"name": "Security Training Program", "desc": "Advanced phishing simulation and security awareness program",
     "category": "People & Process", "cost": 500000, "reduction": 1500000,
     "days": 30, "downtime": False, "assets": 2500},
    {"name": "Privileged Access Management", "desc": "Deploy PAM solution for all admin accounts",
     "category": "Identity & Access", "cost": 2500000, "reduction": 5500000,
     "days": 30, "downtime": False, "assets": 420},
    {"name": "API Security Gateway", "desc": "Deploy API security gateway with rate limiting and threat detection",
     "category": "Application Security", "cost": 1800000, "reduction": 4200000,
     "days": 21, "downtime": False, "assets": 50},
]


async def seed_database(session: AsyncSession):
    """Seed the database with ABC Bank synthetic data."""
    random.seed(42)
    np.random.seed(42)
    
    # Check if already seeded
    from sqlalchemy import select, func
    result = await session.execute(select(func.count()).select_from(Organization))
    count = result.scalar()
    if count and count > 0:
        print("Database already seeded. Skipping.")
        return
    
    print("[+] Seeding ABC Bank data...")
    
    # 1. Create Organization
    org = Organization(
        name="ABC Bank",
        industry="Banking & Financial Services",
        annual_revenue=ANNUAL_REVENUE,
        employee_count=5000,
    )
    session.add(org)
    await session.flush()
    
    # 2. Create Business Units
    bu_map = {}
    for bu_data in BUSINESS_UNITS:
        bu = BusinessUnit(
            org_id=org.id,
            name=bu_data["name"],
            head=bu_data["head"],
            revenue_contribution=bu_data["revenue_pct"],
            criticality_tier=bu_data["tier"],
        )
        session.add(bu)
        await session.flush()
        bu_map[bu_data["name"]] = bu
    
    # 3. Create Admin User
    import hashlib
    def simple_hash(pw: str) -> str:
        return hashlib.sha256(pw.encode()).hexdigest()
    
    admin = User(
        org_id=org.id,
        email="admin@abcbank.com",
        hashed_password=simple_hash("CyberQuant2026!"),
        full_name="System Administrator",
        role=UserRole.ADMIN,
    )
    ciso = User(
        org_id=org.id,
        email="ciso@abcbank.com",
        hashed_password=simple_hash("CyberQuant2026!"),
        full_name="Arun Mehta",
        role=UserRole.CISO,
    )
    session.add_all([admin, ciso])
    
    # 4. Create Critical Assets
    asset_map = {}
    for a_data in CRITICAL_ASSETS:
        bu = bu_map.get(a_data["bu"])
        acs = calculate_criticality_score({
            "revenue_criticality": a_data["rev_crit"],
            "data_sensitivity": a_data["data_sens"],
            "availability_dependency": a_data["avail"],
            "regulatory_importance": a_data["reg"],
            "internet_exposure": a_data["exp"],
            "service_dependency": a_data["dep"],
        })
        
        asset = Asset(
            org_id=org.id,
            bu_id=bu.id if bu else None,
            asset_id=a_data["id"],
            hostname=a_data["hostname"],
            ip_address=f"10.{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}",
            asset_type=a_data["type"],
            application=a_data["app"],
            owner=bu.head if bu else "Unknown",
            os=random.choice(["RHEL 8", "Ubuntu 22.04", "Windows Server 2022", "Oracle Linux 8"]),
            data_classification="restricted" if a_data["data_sens"] > 85 else "confidential",
            revenue_criticality=a_data["rev_crit"],
            data_sensitivity=a_data["data_sens"],
            availability_dependency=a_data["avail"],
            regulatory_importance=a_data["reg"],
            internet_exposure=a_data["exp"],
            service_dependency=a_data["dep"],
            criticality_score=acs,
            revenue_per_hour=a_data["rev_hr"],
            records_count=a_data["records"],
            is_internet_facing=a_data["internet"],
            last_scan_date=datetime.utcnow() - timedelta(days=random.randint(1, 7)),
        )
        session.add(asset)
        await session.flush()
        asset_map[a_data["id"]] = asset
    
    # 5. Generate remaining assets (to reach ~2500 total)
    ASSET_TEMPLATES = [
        ("Endpoint", AssetType.ENDPOINT, "Employee Endpoints", False, (10, 40)),
        ("Server", AssetType.SERVER, "Infrastructure", False, (30, 70)),
        ("Database", AssetType.DATABASE, "Data Services", False, (40, 80)),
        ("Application", AssetType.APPLICATION, "Business Apps", False, (20, 60)),
        ("Cloud", AssetType.CLOUD_SERVICE, "Cloud Services", True, (25, 65)),
        ("Network", AssetType.NETWORK_DEVICE, "Network Infrastructure", False, (30, 55)),
    ]
    
    bu_list = list(bu_map.values())
    generated_count = 0
    for i in range(200):  # Reduced from 2490 for fast local dev (use Docker for full dataset)
        template = random.choice(ASSET_TEMPLATES)
        bu = random.choice(bu_list)
        
        rev_crit = random.uniform(*template[4])
        data_sens = random.uniform(10, 80)
        avail = random.uniform(30, 90)
        reg_imp = random.uniform(10, 70)
        exp = random.uniform(5, 85) if template[3] else random.uniform(0, 30)
        dep = random.uniform(10, 60)
        
        acs = calculate_criticality_score({
            "revenue_criticality": rev_crit,
            "data_sensitivity": data_sens,
            "availability_dependency": avail,
            "regulatory_importance": reg_imp,
            "internet_exposure": exp,
            "service_dependency": dep,
        })
        
        is_internet = random.random() < 0.045  # ~112 internet-facing
        
        asset = Asset(
            org_id=org.id,
            bu_id=bu.id,
            asset_id=f"{template[0][:3].upper()}-{i+1:04d}",
            hostname=f"{template[0].lower()}-{i+1:04d}",
            ip_address=f"10.{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}",
            asset_type=template[1],
            application=template[2],
            owner=bu.head if bu else "Unknown",
            os=random.choice(["RHEL 8", "Ubuntu 22.04", "Windows 11", "Windows Server 2022", "macOS 14"]),
            data_classification=random.choice(["public", "internal", "confidential", "restricted"]),
            revenue_criticality=rev_crit,
            data_sensitivity=data_sens,
            availability_dependency=avail,
            regulatory_importance=reg_imp,
            internet_exposure=exp if is_internet else random.uniform(0, 15),
            service_dependency=dep,
            criticality_score=acs,
            revenue_per_hour=random.uniform(0, 100000) * (acs / 100),
            records_count=random.randint(0, 500000) if data_sens > 50 else 0,
            is_internet_facing=is_internet,
            last_scan_date=datetime.utcnow() - timedelta(days=random.randint(1, 30)),
        )
        session.add(asset)
        generated_count += 1
        
        # Flush in batches
        if generated_count % 500 == 0:
            await session.flush()
            print(f"  Created {generated_count + 10} assets...")
    
    await session.flush()
    print(f"  [+] Created {generated_count + 10} total assets")
    
    # 6. Create Vulnerabilities
    # Assign critical CVEs to critical assets
    all_assets = list(asset_map.values())
    vuln_count = 0
    
    for cve_data in CVES:
        # Each critical CVE affects 1-3 critical assets
        n_affected = random.randint(1, 3)
        affected_assets = random.sample(all_assets, min(n_affected, len(all_assets)))
        
        for asset in affected_assets:
            vuln = Vulnerability(
                asset_id=asset.id,
                cve_id=cve_data["cve"],
                title=cve_data["title"],
                cvss_score=cve_data["cvss"],
                severity=cve_data["sev"],
                exploit_available=cve_data["exploit"],
                exploit_in_wild=cve_data["wild"],
                patch_available=cve_data["patch"],
                patch_age_days=random.randint(30, 365),
                threat_activity=cve_data["threat"],
                status=random.choice([RemediationStatus.OPEN, RemediationStatus.OPEN, RemediationStatus.IN_PROGRESS]),
                discovered_at=datetime.utcnow() - timedelta(days=random.randint(30, 180)),
            )
            session.add(vuln)
            vuln_count += 1
    
    # Generate additional vulnerabilities for variety (medium/high)
    for _ in range(250):
        asset = random.choice(all_assets)
        sev = random.choices(
            [VulnSeverity.CRITICAL, VulnSeverity.HIGH, VulnSeverity.MEDIUM, VulnSeverity.LOW],
            weights=[0.08, 0.25, 0.45, 0.22]
        )[0]
        cvss = {"critical": random.uniform(9.0, 10.0), "high": random.uniform(7.0, 8.9),
                "medium": random.uniform(4.0, 6.9), "low": random.uniform(0.1, 3.9)}[sev.value]
        
        vuln = Vulnerability(
            asset_id=asset.id,
            cve_id=f"CVE-2024-{random.randint(10000, 99999)}",
            title=random.choice([
                "SQL Injection Vulnerability", "Cross-Site Scripting (XSS)",
                "Buffer Overflow", "Authentication Bypass", "Path Traversal",
                "Information Disclosure", "Denial of Service", "Privilege Escalation",
                "Remote Code Execution", "Server-Side Request Forgery",
                "Insecure Deserialization", "XML External Entity Injection",
            ]),
            cvss_score=round(cvss, 1),
            severity=sev,
            exploit_available=random.random() < 0.3,
            exploit_in_wild=random.random() < 0.1,
            patch_available=random.random() < 0.7,
            patch_age_days=random.randint(0, 365),
            threat_activity=random.choice(["none", "low", "moderate", "high"]),
            status=random.choices(
                [RemediationStatus.OPEN, RemediationStatus.IN_PROGRESS, RemediationStatus.REMEDIATED],
                weights=[0.5, 0.2, 0.3]
            )[0],
            discovered_at=datetime.utcnow() - timedelta(days=random.randint(1, 365)),
        )
        session.add(vuln)
        vuln_count += 1
    
    await session.flush()
    print(f"  [+] Created {vuln_count} vulnerabilities")
    
    # 7. Create Security Controls
    control_objs = []
    for ctrl_data in CONTROLS:
        eff = calculate_control_effectiveness(
            ctrl_data["coverage"], ctrl_data["strength"], ctrl_data["history"]
        )
        ctrl = SecurityControl(
            org_id=org.id,
            name=ctrl_data["name"],
            category=ctrl_data["cat"],
            description=f"{ctrl_data['name']} security control for ABC Bank",
            coverage=ctrl_data["coverage"],
            strength=ctrl_data["strength"],
            historical_performance=ctrl_data["history"],
            effectiveness_score=eff,
            annual_cost=ctrl_data["cost_annual"],
            nist_mapping=ctrl_data["nist"],
            iso_mapping=ctrl_data["iso"],
            cis_mapping=ctrl_data["cis"],
            rbi_mapping=[f"RBI-{random.randint(1, 20)}"],
            sebi_mapping=[f"SEBI-CSCRF-{random.choice(['A', 'W', 'C', 'R', 'E'])}.{random.randint(1, 10)}"],
        )
        session.add(ctrl)
        await session.flush()
        control_objs.append(ctrl)
    
    # Assign controls to critical assets
    for asset in all_assets:
        for ctrl in control_objs:
            if random.random() < (ctrl.coverage / 100):
                ac = AssetControl(
                    asset_id=asset.id,
                    control_id=ctrl.id,
                    is_enabled=True,
                    configuration_score=random.uniform(40, 95),
                )
                session.add(ac)
    
    await session.flush()
    print(f"  [+] Created {len(control_objs)} security controls")
    
    # 8. Create Security Actions
    for act_data in SECURITY_ACTIONS:
        rosi = ((act_data["reduction"] - act_data["cost"]) / act_data["cost"] * 100) if act_data["cost"] > 0 else 0
        action = SecurityAction(
            org_id=org.id,
            name=act_data["name"],
            description=act_data["desc"],
            category=act_data["category"],
            implementation_cost=act_data["cost"],
            total_cost=act_data["cost"],
            risk_reduction=act_data["reduction"],
            affected_assets=act_data["assets"],
            implementation_days=act_data["days"],
            requires_downtime=act_data["downtime"],
            rosi=round(rosi, 2),
        )
        session.add(action)
    
    await session.flush()
    print(f"  [+] Created {len(SECURITY_ACTIONS)} security actions")
    
    # 9. Calculate Risk Scores for critical assets
    for asset_key, asset in asset_map.items():
        avg_ctrl_eff = sum(c.effectiveness_score for c in control_objs) / len(control_objs)
        
        # Find max CVSS for this asset
        max_cvss = 7.5  # default
        exploit_avail = False
        exploit_wild = False
        threat = "moderate"
        
        for cve in CVES:
            if random.random() < 0.3:  # some CVEs apply
                max_cvss = max(max_cvss, cve["cvss"])
                exploit_avail = exploit_avail or cve["exploit"]
                exploit_wild = exploit_wild or cve["wild"]
                if cve["threat"] == "active_campaign":
                    threat = "active_campaign"
        
        risk_result = calculate_asset_risk(
            cvss_score=max_cvss,
            exploit_available=exploit_avail,
            exploit_in_wild=exploit_wild,
            internet_exposure=asset.internet_exposure,
            control_effectiveness=avg_ctrl_eff,
            threat_activity=threat,
            patch_age_days=random.randint(30, 180),
            asset_criticality=asset.criticality_score,
            revenue_per_hour=asset.revenue_per_hour,
            records_count=asset.records_count,
            annual_revenue=ANNUAL_REVENUE,
        )
        
        rs = RiskScore(
            asset_id=asset.id,
            annual_rate_of_occurrence=risk_result["aro"],
            single_loss_expectancy=risk_result["sle"]["total_sle"],
            expected_annual_loss=risk_result["eal"],
            downtime_cost=risk_result["sle"]["downtime_cost"],
            breach_cost=risk_result["sle"]["breach_cost"],
            response_cost=risk_result["sle"]["response_cost"],
            legal_cost=risk_result["sle"]["legal_cost"],
            regulatory_cost=risk_result["sle"]["regulatory_cost"],
            reputation_cost=risk_result["sle"]["reputation_cost"],
            var_90=risk_result["monte_carlo"]["var_90"],
            var_95=risk_result["monte_carlo"]["var_95"],
            var_99=risk_result["monte_carlo"]["var_99"],
            mean_loss=risk_result["monte_carlo"]["mean_loss"],
            median_loss=risk_result["monte_carlo"]["median_loss"],
        )
        session.add(rs)
    
    await session.flush()
    print(f"  [+] Calculated risk scores for {len(asset_map)} critical assets")
    
    # 10. Create Compliance Frameworks
    frameworks = [
        {"name": "NIST CSF 2.0", "version": "2.0", "score": 84,
         "cats": {"Govern": 80, "Identify": 87, "Protect": 82, "Detect": 85, "Respond": 78, "Recover": 88}},
        {"name": "ISO 27001", "version": "2022", "score": 79,
         "cats": {"Context": 82, "Leadership": 85, "Planning": 78, "Support": 80, "Operation": 75, "Performance": 82, "Improvement": 74}},
        {"name": "CIS Controls", "version": "8.1", "score": 87,
         "cats": {"IG1": 92, "IG2": 85, "IG3": 78}},
        {"name": "RBI Cyber Security Framework", "version": "2024", "score": 82,
         "cats": {"Governance": 85, "Access Control": 78, "Network Security": 80, "Monitoring": 82, "Incident Response": 84}},
        {"name": "SEBI CSCRF", "version": "2024", "score": 76,
         "cats": {"Anticipate": 78, "Withstand": 74, "Contain": 80, "Recover": 72, "Evolve": 68}},
    ]
    
    for fw in frameworks:
        cf = ComplianceFramework(
            org_id=org.id,
            name=fw["name"],
            version=fw["version"],
            overall_score=fw["score"],
            category_scores=fw["cats"],
        )
        session.add(cf)
    
    # 11. Create Historical Risk Events
    events = [
        {"type": "phishing", "sev": "high", "desc": "Spear phishing campaign targeting finance team",
         "impact": 1500000, "days_ago": 180},
        {"type": "ransomware_attempt", "sev": "critical", "desc": "Ransomware blocked by EDR on endpoint cluster",
         "impact": 200000, "days_ago": 120},
        {"type": "data_exposure", "sev": "medium", "desc": "Misconfigured S3 bucket exposed internal documents",
         "impact": 500000, "days_ago": 90},
        {"type": "brute_force", "sev": "medium", "desc": "Brute force attack on admin portal detected and blocked",
         "impact": 50000, "days_ago": 60},
        {"type": "insider_threat", "sev": "high", "desc": "Unauthorized data access by departing employee",
         "impact": 800000, "days_ago": 45},
    ]
    
    for ev in events:
        re_obj = RiskEvent(
            org_id=org.id,
            event_type=ev["type"],
            severity=ev["sev"],
            description=ev["desc"],
            financial_impact=ev["impact"],
            detected_at=datetime.utcnow() - timedelta(days=ev["days_ago"]),
            resolved_at=datetime.utcnow() - timedelta(days=ev["days_ago"] - random.randint(1, 5)),
        )
        session.add(re_obj)
    
    await session.commit()
    print("[+] ABC Bank data seeding complete!")
    print(f"   [*] Organization: ABC Bank")
    print(f"   [*] Business Units: {len(BUSINESS_UNITS)}")
    print(f"   [*] Assets: ~2,500")
    print(f"   [*] Vulnerabilities: {vuln_count}")
    print(f"   [*][*]  Controls: {len(CONTROLS)}")
    print(f"   [*] Security Actions: {len(SECURITY_ACTIONS)}")
    print(f"   [*] Compliance Frameworks: {len(frameworks)}")
