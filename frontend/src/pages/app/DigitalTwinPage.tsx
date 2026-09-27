import { useState } from 'react';
import {
  Server, Database, Cloud, Monitor, Globe, Users, Cpu, AlertTriangle,
  ShieldAlert, Activity, DollarSign, CheckCircle2, RefreshCw, Eye, X, ArrowRight
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import { mockAssets, mockEnterpriseRisk } from '../../data/mockData';
import { formatINR } from '../../api/client';

interface TwinNode {
  id: string;
  name: string;
  type: 'server' | 'database' | 'cloud' | 'application' | 'employee' | 'erp' | 'network';
  ip: string;
  criticality: number;
  vulns: number;
  financial_exposure: number;
  status: 'healthy' | 'warning' | 'critical';
  x: number;
  y: number;
  connections: string[];
}

const NODES: TwinNode[] = [
  { id: 'n1', name: 'Core Retail DB (PostgreSQL)', type: 'database', ip: '10.140.2.15', criticality: 98, vulns: 3, financial_exposure: 112000000, status: 'critical', x: 50, y: 50, connections: ['n2', 'n3', 'n4'] },
  { id: 'n2', name: 'UPI API Gateway (Kong)', type: 'cloud', ip: '13.234.88.102', criticality: 94, vulns: 5, financial_exposure: 74000000, status: 'warning', x: 25, y: 30, connections: ['n5'] },
  { id: 'n3', name: 'SWIFT Wire Transfer Node', type: 'server', ip: '10.140.5.88', criticality: 96, vulns: 1, financial_exposure: 48000000, status: 'warning', x: 75, y: 30, connections: ['n6'] },
  { id: 'n4', name: 'SAP HANA Core ERP', type: 'erp', ip: '10.140.12.30', criticality: 88, vulns: 4, financial_exposure: 26000000, status: 'healthy', x: 50, y: 80, connections: ['n7'] },
  { id: 'n5', name: 'Mobile Banking Kubernetes Cluster', type: 'application', ip: '10.140.40.10', criticality: 91, vulns: 2, financial_exposure: 32000000, status: 'healthy', x: 15, y: 70, connections: [] },
  { id: 'n6', name: 'Perimeter Palo Alto Firewall', type: 'network', ip: '115.112.45.2', criticality: 95, vulns: 0, financial_exposure: 60000000, status: 'healthy', x: 85, y: 70, connections: [] },
  { id: 'n7', name: 'Executive Workstation (CISO Laptop)', type: 'employee', ip: '10.140.90.4', criticality: 82, vulns: 2, financial_exposure: 14500000, status: 'warning', x: 70, y: 90, connections: [] },
];

export default function DigitalTwinPage() {
  const [selectedNode, setSelectedNode] = useState<TwinNode | null>(NODES[0]);
  const [filterType, setFilterType] = useState<string>('all');

  const getNodeIcon = (type: TwinNode['type']) => {
    switch (type) {
      case 'database': return Database;
      case 'cloud': return Cloud;
      case 'server': return Server;
      case 'application': return Monitor;
      case 'employee': return Users;
      case 'erp': return Cpu;
      case 'network': return Globe;
    }
  };

  const filteredNodes = filterType === 'all' ? NODES : NODES.filter(n => n.type === filterType);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Interactive Enterprise Digital Twin"
        description="Real-time graph visualization linking Servers, Cloud, Databases, Applications, ERP, and Employees."
        badge="FAIR Graph Engine"
        actions={[
          { label: 'Re-sync Topology', icon: RefreshCw, onClick: () => {}, variant: 'secondary' },
          { label: 'Export Graph JSON', icon: Eye, onClick: () => {}, variant: 'primary' },
        ]}
      />

      {/* Filter Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs py-2">
        <span className="text-dark-400 font-semibold mr-2">Filter Category:</span>
        {['all', 'database', 'cloud', 'server', 'application', 'erp', 'employee', 'network'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterType(cat)}
            className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
              filterType === cat
                ? 'bg-cyber-600 text-white shadow-sm'
                : 'glass-card text-dark-300 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Canvas Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Visualizer Area */}
        <div className="lg:col-span-2 glass-card p-6 min-h-[520px] relative overflow-hidden flex flex-col justify-between border-cyber-500/20">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-ping" />
              <span className="text-dark-300 font-medium">Live Node Telemetry Sync</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-dark-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Critical Risk</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Warning</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Healthy</span>
            </div>
          </div>

          {/* Canvas SVG Grid & Interactive Nodes */}
          <div className="relative w-full h-[400px] my-4 rounded-2xl bg-dark-950/60 border border-dark-800 p-4 flex items-center justify-center">
            {/* SVG Connector Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-dark-700/60 stroke-2">
              <line x1="50%" y1="20%" x2="25%" y2="40%" strokeDasharray="4 4" className="animate-pulse" />
              <line x1="50%" y1="20%" x2="75%" y2="40%" strokeDasharray="4 4" />
              <line x1="50%" y1="20%" x2="50%" y2="70%" />
            </svg>

            {/* Render Nodes */}
            <div className="relative w-full h-full">
              {filteredNodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                const isSelected = selectedNode?.id === node.id;
                const statusBorder =
                  node.status === 'critical'
                    ? 'border-red-500 shadow-red-500/20'
                    : node.status === 'warning'
                    ? 'border-amber-500 shadow-amber-500/20'
                    : 'border-green-500 shadow-green-500/20';

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-20 group ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    <div
                      className={`w-14 h-14 rounded-2xl glass-card border-2 flex items-center justify-center shadow-lg ${statusBorder} ${
                        isSelected ? 'bg-cyber-600/30' : 'bg-dark-900/90'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white group-hover:text-cyber-300" />
                    </div>
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold px-2 py-0.5 rounded-md bg-dark-950/90 border border-dark-700 text-white shadow-md">
                      {node.name.split(' ')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-xs text-dark-400 text-center">
            Click any node to inspect telemetry, vulnerability severity, and modeled financial exposure.
          </div>
        </div>

        {/* Selected Node Drawer Panel */}
        <div className="glass-card p-6 space-y-6 border-cyber-500/30">
          {selectedNode ? (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-start justify-between border-b border-dark-700/50 pb-4">
                <div>
                  <span className="badge badge-low text-[10px] uppercase">{selectedNode.type}</span>
                  <h3 className="text-lg font-bold text-white mt-1">{selectedNode.name}</h3>
                  <p className="text-xs text-dark-400 font-mono mt-0.5">{selectedNode.ip}</p>
                </div>
                <button onClick={() => setSelectedNode(null)} className="text-dark-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-dark-900/80 border border-dark-800">
                  <span className="text-dark-400 block text-[10px] uppercase font-semibold">Criticality Score</span>
                  <span className="text-lg font-bold text-cyber-400">{selectedNode.criticality} / 100</span>
                </div>
                <div className="p-3 rounded-xl bg-dark-900/80 border border-dark-800">
                  <span className="text-dark-400 block text-[10px] uppercase font-semibold">Open Vulns</span>
                  <span className="text-lg font-bold text-amber-400">{selectedNode.vulns} CVEs</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-1">
                <span className="text-xs font-semibold text-red-400">Financial Loss Exposure (EAL)</span>
                <p className="text-2xl font-extrabold text-white">{formatINR(selectedNode.financial_exposure)}</p>
                <p className="text-[10px] text-dark-300">Modeled impact if node is compromised in Ransomware scenario.</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Node Connections</h4>
                <div className="space-y-1.5">
                  {selectedNode.connections.map((cId) => {
                    const connNode = NODES.find((n) => n.id === cId);
                    if (!connNode) return null;
                    return (
                      <div
                        key={cId}
                        onClick={() => setSelectedNode(connNode)}
                        className="p-2.5 rounded-lg bg-dark-900 border border-dark-800 flex items-center justify-between text-xs cursor-pointer hover:border-cyber-500/40"
                      >
                        <span className="text-dark-200">{connNode.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-cyber-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-dark-400">Select a node from the canvas to view specs</div>
          )}
        </div>
      </div>
    </div>
  );
}
