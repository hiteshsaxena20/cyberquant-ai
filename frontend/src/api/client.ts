const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '') + '/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

// Dashboard
export const getDashboard = () => fetchAPI<any>('/dashboard/executive');
export const getRiskSummary = () => fetchAPI<any>('/dashboard/risk-summary');

// Assets
export const getAssets = (params?: string) => fetchAPI<any>(`/assets${params ? `?${params}` : ''}`);
export const getAssetDetail = (id: string) => fetchAPI<any>(`/assets/${id}`);

// Optimization
export const optimizeBudget = (budget: number) =>
  fetchAPI<any>('/optimization/optimize', {
    method: 'POST',
    body: JSON.stringify({ budget, constraint_ids: [] }),
  });
export const getSecurityActions = () => fetchAPI<any>('/optimization/actions');
export const getSensitivity = () =>
  fetchAPI<any>('/optimization/sensitivity', { method: 'POST' });

// Simulation
export const runSimulation = (controlChanges: Record<string, any>, delayDays = 0) =>
  fetchAPI<any>('/simulation/run', {
    method: 'POST',
    body: JSON.stringify({ control_changes: controlChanges, delay_days: delayDays }),
  });
export const getScenarios = () => fetchAPI<any>('/simulation/scenarios');

// Compliance
export const getCompliance = () => fetchAPI<any>('/compliance');
export const getFrameworkDetail = (name: string) => fetchAPI<any>(`/compliance/${name}`);

// Chat
export const sendChatMessage = (message: string) =>
  fetchAPI<any>('/chat/message', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });

// Utility: Format INR
export function formatINR(amount: number): string {
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(1)} Cr`;
  if (amount >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(0)} Lakh`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount.toFixed(0)}`;
}

export function formatINRFull(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
