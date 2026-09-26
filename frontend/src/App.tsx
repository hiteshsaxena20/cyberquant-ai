import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import RiskExplorer from './pages/RiskExplorer';
import RiskDrivers from './pages/RiskDrivers';
import InvestmentOptimizer from './pages/InvestmentOptimizer';
import ScenarioSimulator from './pages/ScenarioSimulator';
import Compliance from './pages/Compliance';
import AIAssistant from './pages/AIAssistant';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ExecutiveDashboard />} />
          <Route path="/risk-explorer" element={<RiskExplorer />} />
          <Route path="/risk-drivers" element={<RiskDrivers />} />
          <Route path="/optimizer" element={<InvestmentOptimizer />} />
          <Route path="/simulator" element={<ScenarioSimulator />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/assistant" element={<AIAssistant />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
