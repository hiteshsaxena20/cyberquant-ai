# CyberQuant AI

**AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform**

> "CyberQuant AI continuously converts enterprise cybersecurity telemetry into ₹-based risk, predicts financial exposure, and optimizes security investments to achieve maximum risk reduction within a defined budget."

---

## 🏗️ Architecture

```
React + TypeScript + Vite + Tailwind + Recharts
                    │
                    ↓
              REST API Layer
                    │
                    ↓
         FastAPI + Python Backend
                    │
     ┌──────────────┼──────────────┐
     ↓              ↓              ↓
Data Processing  Risk Engine   AI Engine
     │              │              │
     ↓              ↓              ↓
 SQLite/PG      ML Models      Intent Router
     │              │
     └──────────┬───┘
                ↓
       Optimization Engine
                │
                ↓
      Dashboard / Reports
```

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Python 3.11+** (installed via `winget install Python.Python.3.12`)
- **Node.js 18+** (installed via `winget install OpenJS.NodeJS.LTS`)

### 1. Backend Setup
```bash
cd backend

# Install Python dependencies
python -m pip install -r requirements.txt
# OR for quick setup with SQLite:
python run_local.py   # Auto-installs deps + starts server

# Manual start:
set DATABASE_URL=sqlite+aiosqlite:///./cyberquant.db
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Open in Browser
- **Frontend**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs

---

## 📊 Dashboard Pages

| # | Page | Description |
|---|------|-------------|
| 1 | **Executive Dashboard** | Enterprise EAL, VaR, trends, top risks, controls |
| 2 | **Risk Explorer** | Drill-down: BU → App → Asset → Vuln → ₹ exposure |
| 3 | **Risk Drivers** | Contribution analysis, control effectiveness gaps |
| 4 | **Investment Optimizer** | Budget → AI optimization → max risk reduction |
| 5 | **Scenario Simulator** | What-if analysis + delay impact projection |
| 6 | **Compliance** | NIST, ISO, CIS, RBI, SEBI scores + gap analysis |
| 7 | **AI Assistant** | Natural language queries about cyber risk |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + Glassmorphism |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Python 3.12 + FastAPI |
| Database | PostgreSQL 16 (prod) / SQLite (dev) |
| ORM | SQLAlchemy 2.0 (async) |
| ML | Scikit-learn + XGBoost |
| Optimization | Google OR-Tools / Greedy fallback |
| Monte Carlo | NumPy + SciPy |
| Deploy | Docker Compose |

---

## 🧠 Core Engines

### Risk Quantification Engine
- **Likelihood estimation** — multi-factor model (CVSS, exploits, exposure, controls, threat intel)
- **Financial Impact (SLE)** — downtime + breach + response + legal + regulatory + reputation
- **EAL = ARO × SLE** — Expected Annual Loss
- **Monte Carlo** — 10,000 simulations → VaR at 90th, 95th, 99th percentile

### ML Prediction Engine
- **XGBoost** classifier for incident probability (7d, 30d, 90d, 365d)
- **Isolation Forest** for anomaly detection
- **SHAP** for explainable risk drivers

### Investment Optimizer
- **0/1 Knapsack** via OR-Tools Integer Linear Programming
- **Maximize** Σ RiskReduction × X subject to Σ Cost × X ≤ Budget
- **ROSI** = (Risk Reduction - Investment) / Investment × 100%

### Control Effectiveness Engine
- **Effectiveness** = 0.40 × Coverage + 0.35 × Strength + 0.25 × History
- Gap analysis and improvement recommendations

---

## 🏦 Demo Data: ABC Bank

| Metric | Value |
|--------|-------|
| Total Assets | ~2,500 |
| Critical Vulnerabilities | 73 |
| Privileged Accounts | 420 |
| MFA Coverage | 67% |
| Internet-facing Assets | 112 |
| Expected Annual Loss | ~₹5 Cr |
| Security Budget | ₹1 Cr |

---

## 🐳 Docker Deployment

```bash
docker-compose up --build
```

Services:
- `db` — PostgreSQL 16 (port 5432)
- `backend` — FastAPI (port 8000)
- `frontend` — Vite dev server (port 5173)

---

## 📚 References

- [NIST Cybersecurity Framework 2.0](https://csrc.nist.gov/pubs/cswp/29/the-nist-cybersecurity-framework-csf-20/final)
- [Open FAIR Risk Quantification](https://www.opengroup.org/open-fair)
- [ISO/IEC 27001:2022](https://www.iso.org/standard/27001)
- [CIS Controls v8.1](https://www.cisecurity.org/controls/v8-1)
- [RBI Cyber Security Framework](https://rbi.org.in)
- [SEBI CSCRF](https://www.sebi.gov.in)
