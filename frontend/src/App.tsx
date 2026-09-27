import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import AuthLayout from './components/AuthLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import PlatformPage from './pages/public/PlatformPage';
import PricingPage from './pages/public/PricingPage';
import DocumentationPage from './pages/public/DocumentationPage';
import ContactPage from './pages/public/ContactPage';
import PrivacyPage from './pages/public/PrivacyPage';
import TermsPage from './pages/public/TermsPage';
import BlogPage from './pages/public/BlogPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import TwoFactorPage from './pages/auth/TwoFactorPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import OrgSelectionPage from './pages/auth/OrgSelectionPage';

// App Pages (Core SaaS)
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import RiskExplorer from './pages/RiskExplorer';
import RiskDrivers from './pages/RiskDrivers';
import InvestmentOptimizer from './pages/InvestmentOptimizer';
import ScenarioSimulator from './pages/ScenarioSimulator';
import Compliance from './pages/Compliance';
import AIAssistant from './pages/AIAssistant';

// Enterprise App Pages
import DigitalTwinPage from './pages/app/DigitalTwinPage';
import RiskEnginePage from './pages/app/RiskEnginePage';
import DominoEffectPage from './pages/app/DominoEffectPage';
import AssetsPage from './pages/app/AssetsPage';
import IdentityPage from './pages/app/IdentityPage';
import CloudPage from './pages/app/CloudPage';
import NetworkPage from './pages/app/NetworkPage';
import ThreatIntelPage from './pages/app/ThreatIntelPage';
import BusinessUnitsPage from './pages/app/BusinessUnitsPage';
import EmployeesPage from './pages/app/EmployeesPage';
import ReportsPage from './pages/app/ReportsPage';
import AuditLogsPage from './pages/app/AuditLogsPage';
import SettingsPage from './pages/app/SettingsPage';
import HelpPage from './pages/app/HelpPage';
import ProfilePage from './pages/app/ProfilePage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Website Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/platform" element={<PlatformPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/documentation" element={<DocumentationPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/blog" element={<BlogPage />} />
            </Route>

            {/* Authentication Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/two-factor" element={<TwoFactorPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              <Route path="/organization-selection" element={<OrgSelectionPage />} />
            </Route>

            {/* Protected Enterprise SaaS Application Routes */}
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<ExecutiveDashboard />} />
              <Route path="/digital-twin" element={<DigitalTwinPage />} />
              <Route path="/risk-engine" element={<RiskEnginePage />} />
              <Route path="/attack-simulator" element={<ScenarioSimulator />} />
              <Route path="/domino-effect" element={<DominoEffectPage />} />
              <Route path="/ai-cfo" element={<AIAssistant />} />
              <Route path="/investment-optimizer" element={<InvestmentOptimizer />} />
              <Route path="/assets" element={<AssetsPage />} />
              <Route path="/identity" element={<IdentityPage />} />
              <Route path="/cloud" element={<CloudPage />} />
              <Route path="/network" element={<NetworkPage />} />
              <Route path="/threat-intelligence" element={<ThreatIntelPage />} />
              <Route path="/business-units" element={<BusinessUnitsPage />} />
              <Route path="/employees" element={<EmployeesPage />} />
              <Route path="/compliance" element={<Compliance />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/audit" element={<AuditLogsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Backward Compatibility & Aliases */}
              <Route path="/risk-explorer" element={<RiskExplorer />} />
              <Route path="/risk-drivers" element={<RiskDrivers />} />
              <Route path="/optimizer" element={<InvestmentOptimizer />} />
              <Route path="/simulator" element={<ScenarioSimulator />} />
              <Route path="/assistant" element={<AIAssistant />} />
            </Route>

            {/* Catch-all fallback redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
