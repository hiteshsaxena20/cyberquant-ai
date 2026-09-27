export interface Asset {
  id: string;
  asset_id: string;
  hostname: string;
  ip_address: string;
  type: 'server' | 'database' | 'endpoint' | 'application' | 'cloud_service' | 'network_device';
  business_unit: string;
  criticality_score: number;
  revenue_per_hour: number;
  open_vulns: number;
  cvss_max: number;
  owner: string;
  location: string;
  status: 'healthy' | 'warning' | 'critical';
  tags: string[];
}

export interface Threat {
  id: string;
  name: string;
  actor: string;
  type: 'Ransomware' | 'APT' | 'Phishing' | 'Zero-Day' | 'Supply Chain' | 'Insider';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  cve_id?: string;
  target_sector: string;
  detected_at: string;
  status: 'Active' | 'Mitigated' | 'Monitoring';
  financial_threat_level: string;
  description: string;
}

export interface BusinessUnit {
  id: string;
  name: string;
  head: string;
  total_assets: number;
  eal: number;
  risk_score: number;
  compliance_score: number;
  trend: 'up' | 'down' | 'stable';
  budget_allocated: number;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  fullName: string;
  authority: string;
  score: number;
  passedControls: number;
  totalControls: number;
  status: 'Compliant' | 'At Risk' | 'Non-Compliant';
  lastAudit: string;
  nextAudit: string;
  categories: {
    name: string;
    score: number;
    controls: number;
    passed: number;
  }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  target: string;
  ip: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
  severity: 'info' | 'warn' | 'critical';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'risk' | 'ai' | 'compliance' | 'system';
  severity: 'critical' | 'high' | 'medium' | 'info';
  read: boolean;
  link?: string;
}

// Enterprise Risk Data
export const mockEnterpriseRisk = {
  total_eal: 284500000, // ₹28.45 Cr
  var_95: 421000000,    // ₹42.10 Cr
  risk_score: 78,
  risk_rating: 'HIGH',
  risk_trend_30d: 4.2,
  total_vulnerabilities: 1248,
  critical_vulnerabilities: 47,
  high_vulnerabilities: 312,
  total_assets: 14200,
  critical_assets: 412,
  internet_facing_assets: 185,
  mfa_coverage: 84.5,
  open_vulnerabilities: 359,
  eal_trend: [
    { date: 'Sep 01', eal: 241000000, var: 360000000 },
    { date: 'Sep 05', eal: 252000000, var: 375000000 },
    { date: 'Sep 10', eal: 248000000, var: 370000000 },
    { date: 'Sep 15', eal: 265000000, var: 395000000 },
    { date: 'Sep 20', eal: 279000000, var: 412000000 },
    { date: 'Sep 25', eal: 284500000, var: 421000000 },
  ],
  risk_by_bu: [
    { name: 'Core Retail Banking', eal: 112000000, assets: 4800, score: 82 },
    { name: 'Digital Payments & UPI', eal: 74000000, assets: 3200, score: 76 },
    { name: 'Corporate Treasury', eal: 48000000, assets: 1800, score: 71 },
    { name: 'Wealth Management', eal: 26000000, assets: 2100, score: 65 },
    { name: 'HR & Payroll Systems', eal: 14500000, assets: 1200, score: 58 },
    { name: 'Cloud Infra & DevOps', eal: 10000000, assets: 1100, score: 52 },
  ],
  risk_drivers: [
    { name: 'Unpatched Critical CVEs', value: 34, color: '#ef4444' },
    { name: 'MFA Gaps on Legacy Admin Accounts', value: 22, color: '#f97316' },
    { name: 'Cloud Misconfigurations (S3/IAM)', value: 18, color: '#eab308' },
    { name: 'Third-Party Vendor Access', value: 14, color: '#3b82f6' },
    { name: 'Insider Threat / Phishing Susceptibility', value: 12, color: '#8b5cf6' },
  ],
};

// Realistic Assets Dataset
export const mockAssets: Asset[] = [
  {
    id: 'ast-001',
    asset_id: 'SRV-PROD-DB-01',
    hostname: 'db-primary-mumbai.bank.internal',
    ip_address: '10.140.2.15',
    type: 'database',
    business_unit: 'Core Retail Banking',
    criticality_score: 98,
    revenue_per_hour: 4500000,
    open_vulns: 3,
    cvss_max: 9.8,
    owner: 'Rakesh Verma (Lead DBA)',
    location: 'Mumbai DC-1 (Tier IV)',
    status: 'critical',
    tags: ['PostgreSQL', 'PCI-DSS', 'Crown Jewel', 'PII'],
  },
  {
    id: 'ast-002',
    asset_id: 'API-GW-PROD-04',
    hostname: 'api-gateway-upi.bank.com',
    ip_address: '13.234.88.102',
    type: 'cloud_service',
    business_unit: 'Digital Payments & UPI',
    criticality_score: 94,
    revenue_per_hour: 3800000,
    open_vulns: 5,
    cvss_max: 8.6,
    owner: 'Priya Sharma (Cloud Ops)',
    location: 'AWS ap-south-1',
    status: 'warning',
    tags: ['Kong', 'API Gateway', 'Internet Facing', 'OAuth2'],
  },
  {
    id: 'ast-003',
    asset_id: 'K8S-CLUSTER-PROD',
    hostname: 'k8s-master-node-01.internal',
    ip_address: '10.140.40.10',
    type: 'application',
    business_unit: 'Digital Payments & UPI',
    criticality_score: 91,
    revenue_per_hour: 3200000,
    open_vulns: 2,
    cvss_max: 7.8,
    owner: 'DevOps Platform Team',
    location: 'AWS EKS',
    status: 'healthy',
    tags: ['Kubernetes', 'Docker', 'Microservices'],
  },
  {
    id: 'ast-004',
    asset_id: 'SWIFT-CONN-SRV',
    hostname: 'swift-gateway-mumbai.bank.internal',
    ip_address: '10.140.5.88',
    type: 'server',
    business_unit: 'Corporate Treasury',
    criticality_score: 96,
    revenue_per_hour: 5200000,
    open_vulns: 1,
    cvss_max: 9.1,
    owner: 'Treasury IT Security',
    location: 'Mumbai DC-1',
    status: 'warning',
    tags: ['SWIFT', 'Wire Transfer', 'High Value'],
  },
  {
    id: 'ast-005',
    asset_id: 'S3-CUSTOMER-DOCS',
    hostname: 's3://cyberquant-kyc-vault-prod',
    ip_address: '52.95.148.12',
    type: 'cloud_service',
    business_unit: 'Core Retail Banking',
    criticality_score: 88,
    revenue_per_hour: 1200000,
    open_vulns: 4,
    cvss_max: 8.9,
    owner: 'Compliance Engineering',
    location: 'AWS ap-south-1',
    status: 'critical',
    tags: ['S3 Bucket', 'KYC', 'Aadhaar Vault', 'Unencrypted'],
  },
  {
    id: 'ast-006',
    asset_id: 'FW-CORE-PERIMETER',
    hostname: 'paloalto-fw-edge-01.bank.com',
    ip_address: '115.112.45.2',
    type: 'network_device',
    business_unit: 'Cloud Infra & DevOps',
    criticality_score: 95,
    revenue_per_hour: 6000000,
    open_vulns: 0,
    cvss_max: 0,
    owner: 'Network Security NOC',
    location: 'Edge Router DC-1',
    status: 'healthy',
    tags: ['Firewall', 'Palo Alto', 'Border Gateway'],
  },
  {
    id: 'ast-007',
    asset_id: 'SAP-ERP-MAIN-01',
    hostname: 'sap-hana-prod.bank.internal',
    ip_address: '10.140.12.30',
    type: 'server',
    business_unit: 'HR & Payroll Systems',
    criticality_score: 85,
    revenue_per_hour: 950000,
    open_vulns: 6,
    cvss_max: 7.4,
    owner: 'ERP Ops Group',
    location: 'Bengaluru DC-2',
    status: 'warning',
    tags: ['SAP HANA', 'ERP', 'Financials'],
  },
  {
    id: 'ast-008',
    asset_id: 'WAF-CLOUDFLARE',
    hostname: 'waf.cyberquant.bank',
    ip_address: '104.16.12.44',
    type: 'network_device',
    business_unit: 'Digital Payments & UPI',
    criticality_score: 89,
    revenue_per_hour: 2500000,
    open_vulns: 0,
    cvss_max: 0,
    owner: 'InfoSec SecOps',
    location: 'Global CDN',
    status: 'healthy',
    tags: ['Cloudflare', 'DDoS Protection', 'WAF'],
  },
];

// Threats Feed Data
export const mockThreats: Threat[] = [
  {
    id: 'th-101',
    name: 'LockBit 3.0 Ransomware Campaign Targeting Financial Sector',
    actor: 'LockBit Supporter Group',
    type: 'Ransomware',
    severity: 'CRITICAL',
    cve_id: 'CVE-2024-3094',
    target_sector: 'Banking & Financial Services',
    detected_at: '2026-09-27 18:42',
    status: 'Active',
    financial_threat_level: '₹35 Cr Potential Ransom Impact',
    description: 'Exploiting SSH backdoor in unpatched XZ utils to pivot into internal banking networks and encrypt core databases.',
  },
  {
    id: 'th-102',
    name: 'APT29 Spear Phishing Campaign against Executive Banking Credentials',
    actor: 'Cozy Bear (APT29)',
    type: 'APT',
    severity: 'HIGH',
    target_sector: 'Enterprise Leadership',
    detected_at: '2026-09-27 15:20',
    status: 'Monitoring',
    financial_threat_level: '₹12 Cr Wire Fraud Risk',
    description: 'Targeting C-suite executives with spoofed RBI circulars containing maldoc payloads with OAuth token stealers.',
  },
  {
    id: 'th-103',
    name: 'MOVEit Transfer Zero-Day Vulnerability Exploitation Wave',
    actor: 'Cl0p Ransomware Gang',
    type: 'Zero-Day',
    severity: 'CRITICAL',
    cve_id: 'CVE-2023-34362',
    target_sector: 'Third-Party Vendors',
    detected_at: '2026-09-26 22:15',
    status: 'Mitigated',
    financial_threat_level: '₹18 Cr Data Leak Exposure',
    description: 'SQL injection in MOVEit Transfer web interface allowing unauthenticated remote code execution and data exfiltration.',
  },
  {
    id: 'th-104',
    name: 'UPI Gateway API Rate Limit Bypass & Credential Stuffing',
    actor: 'Unknown Botnet',
    type: 'Phishing',
    severity: 'MEDIUM',
    target_sector: 'Digital Payments',
    detected_at: '2026-09-27 11:05',
    status: 'Active',
    financial_threat_level: '₹4.5 Cr Fraud Reversal Cost',
    description: 'Distributed botnet targeting mobile banking login APIs using leaked credential dumps from dark web forums.',
  },
];

// Business Units Data
export const mockBusinessUnits: BusinessUnit[] = [
  { id: 'bu-1', name: 'Core Retail Banking', head: 'Sunil Mehta (VP Retail)', total_assets: 4800, eal: 112000000, risk_score: 82, compliance_score: 94, trend: 'up', budget_allocated: 45000000 },
  { id: 'bu-2', name: 'Digital Payments & UPI', head: 'Ananya Roy (SVP Digital)', total_assets: 3200, eal: 74000000, risk_score: 76, compliance_score: 91, trend: 'up', budget_allocated: 35000000 },
  { id: 'bu-3', name: 'Corporate Treasury', head: 'Vikramaditya Rao (CFO)', total_assets: 1800, eal: 48000000, risk_score: 71, compliance_score: 96, trend: 'down', budget_allocated: 28000000 },
  { id: 'bu-4', name: 'Wealth Management', head: 'Karan Kapoor (Head Wealth)', total_assets: 2100, eal: 26000000, risk_score: 65, compliance_score: 88, trend: 'stable', budget_allocated: 18000000 },
  { id: 'bu-5', name: 'HR & Payroll Systems', head: 'Neha Gupta (CHRO)', total_assets: 1200, eal: 14500000, risk_score: 58, compliance_score: 92, trend: 'down', budget_allocated: 12000000 },
  { id: 'bu-6', name: 'Cloud Infra & DevOps', head: 'Siddharth Nair (CTO)', total_assets: 1100, eal: 10000000, risk_score: 52, compliance_score: 98, trend: 'down', budget_allocated: 22000000 },
];

// Compliance Frameworks
export const mockComplianceFrameworks: ComplianceFramework[] = [
  {
    id: 'nist-csf',
    name: 'NIST CSF 2.0',
    fullName: 'NIST Cybersecurity Framework 2.0',
    authority: 'National Institute of Standards & Technology',
    score: 88,
    passedControls: 162,
    totalControls: 185,
    status: 'Compliant',
    lastAudit: '2026-08-15',
    nextAudit: '2026-11-15',
    categories: [
      { name: 'Govern (GV)', score: 92, controls: 30, passed: 28 },
      { name: 'Identify (ID)', score: 85, controls: 35, passed: 30 },
      { name: 'Protect (PR)', score: 86, controls: 45, passed: 39 },
      { name: 'Detect (DE)', score: 90, controls: 30, passed: 27 },
      { name: 'Respond (RS)', score: 88, controls: 25, passed: 22 },
      { name: 'Recover (RC)', score: 80, controls: 20, passed: 16 },
    ],
  },
  {
    id: 'iso-27001',
    name: 'ISO / IEC 27001:2022',
    fullName: 'Information Security Management Systems',
    authority: 'ISO / International Electrotechnical Commission',
    score: 92,
    passedControls: 86,
    totalControls: 93,
    status: 'Compliant',
    lastAudit: '2026-06-20',
    nextAudit: '2027-06-20',
    categories: [
      { name: 'Organizational Controls', score: 95, controls: 37, passed: 35 },
      { name: 'People Controls', score: 88, controls: 8, passed: 7 },
      { name: 'Physical Controls', score: 94, controls: 14, passed: 13 },
      { name: 'Technological Controls', score: 90, controls: 34, passed: 31 },
    ],
  },
  {
    id: 'cis-benchmarks',
    name: 'CIS Controls v8',
    fullName: 'Center for Internet Security Critical Controls',
    authority: 'CIS Security',
    score: 82,
    passedControls: 126,
    totalControls: 153,
    status: 'At Risk',
    lastAudit: '2026-09-01',
    nextAudit: '2026-12-01',
    categories: [
      { name: 'Inventory & Control of Assets', score: 92, controls: 12, passed: 11 },
      { name: 'Data Protection', score: 76, controls: 24, passed: 18 },
      { name: 'Access Control Management', score: 84, controls: 18, passed: 15 },
      { name: 'Vulnerability Management', score: 72, controls: 16, passed: 11 },
    ],
  },
  {
    id: 'sebi-cyber',
    name: 'SEBI CS Framework',
    fullName: 'SEBI Cyber Security & Resilience Framework for Stock Brokers & Depository Participants',
    authority: 'Securities and Exchange Board of India',
    score: 95,
    passedControls: 76,
    totalControls: 80,
    status: 'Compliant',
    lastAudit: '2026-07-10',
    nextAudit: '2026-10-10',
    categories: [
      { name: 'Governance & SOPs', score: 98, controls: 20, passed: 20 },
      { name: 'Vulnerability Assessment & Penetration Testing', score: 92, controls: 25, passed: 23 },
      { name: 'SOC Monitoring 24x7', score: 96, controls: 20, passed: 19 },
      { name: 'Cyber Crisis Management Plan', score: 93, controls: 15, passed: 14 },
    ],
  },
  {
    id: 'rbi-cyber',
    name: 'RBI Cyber Framework',
    fullName: 'RBI Cyber Security Framework for Scheduled Commercial Banks',
    authority: 'Reserve Bank of India',
    score: 91,
    passedControls: 118,
    totalControls: 130,
    status: 'Compliant',
    lastAudit: '2026-05-12',
    nextAudit: '2026-11-12',
    categories: [
      { name: 'Customer Confidentiality & Data Theft', score: 94, controls: 30, passed: 28 },
      { name: 'ATM & SWIFT Protection', score: 90, controls: 35, passed: 32 },
      { name: 'Cyber Incident Reporting (2 Hour SLA)', score: 96, controls: 25, passed: 24 },
      { name: 'Third Party Risk Management', score: 82, controls: 40, passed: 34 },
    ],
  },
];

// Audit Logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: 'log-8001',
    timestamp: '2026-09-27 20:14:32',
    actor: 'aditya.mandloi@cyberquant.io',
    role: 'Chief Information Security Officer',
    action: 'SIMULATION_EXECUTE',
    target: 'Ransomware Scenario #4',
    ip: '103.21.124.5',
    status: 'SUCCESS',
    severity: 'info',
  },
  {
    id: 'log-8002',
    timestamp: '2026-09-27 19:45:10',
    actor: 'priya.sharma@cyberquant.io',
    role: 'Cloud Security Engineer',
    action: 'POLICY_UPDATE',
    target: 'AWS S3 Bucket Encryption Enforcer',
    ip: '14.139.22.8',
    status: 'SUCCESS',
    severity: 'info',
  },
  {
    id: 'log-8003',
    timestamp: '2026-09-27 18:22:01',
    actor: 'system.bot@cyberquant.internal',
    role: 'AI Risk Engine',
    action: 'VAR_RECALCULATION',
    target: 'Monte Carlo 100,000 Iterations',
    ip: '127.0.0.1',
    status: 'SUCCESS',
    severity: 'info',
  },
  {
    id: 'log-8004',
    timestamp: '2026-09-27 16:05:44',
    actor: 'unknown_admin_attempt',
    role: 'Unauthenticated User',
    action: 'FAILED_LOGIN_ATTEMPT',
    target: 'Admin API Gateway',
    ip: '185.220.101.4',
    status: 'FAILURE',
    severity: 'critical',
  },
  {
    id: 'log-8005',
    timestamp: '2026-09-27 14:10:18',
    actor: 'rakesh.verma@cyberquant.io',
    role: 'Lead Database Administrator',
    action: 'EXPORT_AUDIT_REPORT',
    target: 'NIST CSF Compliance PDF',
    ip: '103.21.124.8',
    status: 'SUCCESS',
    severity: 'warn',
  },
];

// Notifications
export const mockNotifications: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Critical CVE Detected on Core DB',
    message: 'CVE-2024-3094 SSH Backdoor found on db-primary-mumbai.bank.internal. Financial exposure increased by ₹4.2 Cr.',
    timestamp: '10 mins ago',
    type: 'risk',
    severity: 'critical',
    read: false,
    link: '/assets',
  },
  {
    id: 'notif-2',
    title: 'AI CFO Optimization Available',
    message: 'Allocating ₹1.2 Cr to EDR deployment reduces 95% Cyber VaR by ₹14.5 Cr. ROI: 12.1x.',
    timestamp: '1 hour ago',
    type: 'ai',
    severity: 'high',
    read: false,
    link: '/ai-cfo',
  },
  {
    id: 'notif-3',
    title: 'SEBI CS Audit Due in 13 Days',
    message: 'VAPT report upload required for Quarterly SEBI Cyber Compliance filing.',
    timestamp: '3 hours ago',
    type: 'compliance',
    severity: 'medium',
    read: false,
    link: '/compliance',
  },
  {
    id: 'notif-4',
    title: 'New Attack Scenario Simulated',
    message: 'Simulation run "Ransomware on Core Retail" estimates total potential downtime of 14 hours.',
    timestamp: '5 hours ago',
    type: 'system',
    severity: 'info',
    read: true,
    link: '/attack-simulator',
  },
];

// Current Logged-in User Profile Data
export const mockUserProfile = {
  name: 'Aditya Mandloi',
  email: 'aditya.mandloi@cyberquant.io',
  title: 'Chief Information Security Officer (CISO)',
  department: 'Information Security & Enterprise Risk',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  organization: 'ABC Bank India',
  org_id: 'org-abc-bank-01',
  role: 'Super Administrator',
  two_factor_enabled: true,
  last_login: '2026-09-27 20:14 IST',
  phone: '+91 98765 43210',
  time_zone: 'Asia/Kolkata (IST +05:30)',
  currency: 'INR (₹)',
  sessions: [
    { id: 'sess-1', device: 'MacBook Pro 16" (macOS Sequoia)', location: 'Mumbai, India', ip: '103.21.124.5', current: true, time: 'Active now' },
    { id: 'sess-2', device: 'iPhone 15 Pro (iOS 18.1)', location: 'Mumbai, India', ip: '49.37.12.90', current: false, time: '2 hours ago' },
    { id: 'sess-3', device: 'Chrome on Windows 11', location: 'Bengaluru, India', ip: '14.139.22.8', current: false, time: 'Yesterday 18:40' },
  ],
  api_keys: [
    { id: 'key-1', name: 'Production SIEM Ingestion Key', prefix: 'cq_live_8f9a...', created: '2026-01-15', status: 'Active' },
    { id: 'key-2', name: 'DevOps CI/CD Scanner Token', prefix: 'cq_live_3b2c...', created: '2026-05-10', status: 'Active' },
  ],
  billing: {
    plan: 'CyberTwinX Enterprise Pro',
    assets_licensed: 25000,
    assets_used: 14200,
    renew_date: '2027-03-31',
    billing_email: 'finance-tech@cyberquant.io',
  },
};
