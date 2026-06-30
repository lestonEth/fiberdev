export interface VirtualFile {
  path: string;
  name: string;
  content: string;
  language: string;
  isFolder?: boolean;
}

export interface NodeMetrics {
  cpu: number;
  memory: string;
  network: number; // in %
  bandwidth: string;
}

export interface Block {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: string;
  txCount: number;
  size: string;
  gasUsed: number;
  transactions: string[];
}

export interface Peer {
  id: string;
  address: string;
  latency: number;
  region: string;
  client: string;
}

export interface NodeState {
  status: 'Operational' | 'Restarting' | 'Resetting' | 'Synchronizing';
  version: string;
  uptime: string;
  blockHeight: number;
  syncProgress: number;
  peers: Peer[];
  blocks: Block[];
  metrics: NodeMetrics;
  logs: string[];
}

export interface Project {
  id: string;
  name: string;
  branch: string;
  updatedAt: string;
  status: 'Active' | 'Building' | 'Idle' | 'Halted';
  type: 'api' | 'service' | 'db' | 'auth';
  collaborators: string[];
}

export interface ActivityItem {
  id: string;
  title: string;
  subtitle: string;
  type: 'success' | 'info' | 'error' | 'warning';
  timestamp: string;
}
