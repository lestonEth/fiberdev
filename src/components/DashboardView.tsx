import { 
  PlusSquare, 
  DownloadCloud, 
  LayoutTemplate, 
  Terminal, 
  ShoppingCart, 
  Database, 
  AlertTriangle,
  History,
  CheckCircle,
  Cpu,
  HardDrive,
  Activity
} from "lucide-react";
import { Project, ActivityItem, NodeMetrics } from "../types";

interface DashboardViewProps {
  metrics: NodeMetrics;
  nodeStatus: string;
  onNavigateToIde: () => void;
  onNavigateToNodes: () => void;
  deployTriggeredCount: number;
}

export default function DashboardView({ 
  metrics, 
  nodeStatus, 
  onNavigateToIde, 
  onNavigateToNodes,
  deployTriggeredCount
}: DashboardViewProps) {

  // Simulated projects list
  const projects: Project[] = [
    {
      id: "p1",
      name: "fiber-blog-api",
      branch: "main",
      updatedAt: "Updated 2h ago",
      status: "Active",
      type: "api",
      collaborators: ["JD", "AS"]
    },
    {
      id: "p2",
      name: "ecommerce-v3-core",
      branch: "staging",
      updatedAt: "Updated 14h ago",
      status: "Building",
      type: "service",
      collaborators: ["ML"]
    },
    {
      id: "p3",
      name: "analytics-engine-db",
      branch: "v1.0.4-rc",
      updatedAt: "Updated 1d ago",
      status: "Idle",
      type: "db",
      collaborators: ["AS", "+2"]
    },
    {
      id: "p4",
      name: "legacy-auth-service",
      branch: "deprecated",
      updatedAt: "Updated 5d ago",
      status: "Halted",
      type: "auth",
      collaborators: []
    }
  ];

  // Activities
  const activities: ActivityItem[] = [
    ...(deployTriggeredCount > 0 ? [{
      id: `dep-${deployTriggeredCount}`,
      title: "Workspace build successfully deployed",
      subtitle: `Node contract updated · Block #${18234012 + deployTriggeredCount}`,
      type: "success" as const,
      timestamp: "Just now"
    }] : []),
    {
      id: "act-1",
      title: "Deployment successful",
      subtitle: "fiber-blog-api · production",
      type: "success",
      timestamp: "14 minutes ago"
    },
    {
      id: "act-2",
      title: "New build triggered",
      subtitle: "ecommerce-v3-core · push",
      type: "info",
      timestamp: "1 hour ago"
    },
    {
      id: "act-3",
      title: "Build failed",
      subtitle: "auth-server · CI/CD",
      type: "error",
      timestamp: "3 hours ago"
    },
    {
      id: "act-4",
      title: "Settings modified",
      subtitle: "Account security update",
      type: "warning",
      timestamp: "1 day ago"
    }
  ];

  return (
    <div className="text-gray-100 min-h-screen bg-[#0d1117] p-8 pb-20 select-none">
      <div className="max-w-7xl mx-auto space-y-10 pt-6">
        
        {/* Welcome Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="font-headline-md text-3xl font-extrabold text-white tracking-tight">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, dev. Your workspace infrastructure is currently stable.</p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] px-4 py-2 rounded-lg">
              <span className={`w-2 h-2 rounded-full ${
                nodeStatus === 'Operational' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'
              }`} />
              <span className="text-xs font-mono uppercase text-gray-300">
                {nodeStatus === 'Operational' ? 'Systems Operational' : `Status: ${nodeStatus}`}
              </span>
            </div>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* Column Left (Quick Actions, Resource Gauges) - Span 3 */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            
            {/* Quick Actions Card */}
            <div className="bg-[#161b22]/70 border border-[#30363d] rounded-2xl p-6 relative">
              <h2 className="font-headline-sm text-sm font-bold text-[#58a6ff] uppercase tracking-wider mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={onNavigateToIde}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-[#1f6feb] text-white font-semibold text-xs transition-all hover:bg-[#388bfd] active:scale-95 cursor-pointer shadow-lg shadow-[#1f6feb]/20"
                >
                  <PlusSquare className="h-4 w-4" />
                  <span>Create Workspace</span>
                </button>
                <button 
                  onClick={onNavigateToIde}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-[#21262d] border border-[#30363d] hover:border-gray-500 text-gray-200 font-semibold text-xs transition-all hover:bg-[#30363d] active:scale-95 cursor-pointer"
                >
                  <DownloadCloud className="h-4 w-4 text-[#58a6ff]" />
                  <span>Import Repository</span>
                </button>
                <button 
                  onClick={onNavigateToIde}
                  className="flex items-center gap-3 w-full p-3 rounded-xl bg-[#21262d] border border-[#30363d] hover:border-gray-500 text-gray-200 font-semibold text-xs transition-all hover:bg-[#30363d] active:scale-95 cursor-pointer"
                >
                  <LayoutTemplate className="h-4 w-4 text-[#ff7b72]" />
                  <span>Use Template</span>
                </button>
              </div>
            </div>

            {/* Resources Widget Card */}
            <div className="bg-[#161b22]/70 border border-[#30363d] rounded-2xl p-6">
              <h2 className="font-headline-sm text-sm font-bold text-white uppercase tracking-wider mb-5">Resource Usage</h2>
              <div className="space-y-5">
                {/* CPU Gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1"><Cpu className="h-3 w-3 text-[#58a6ff]" /> CPU Nodes</span>
                    <span className="font-bold text-white">{metrics.cpu}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#1f6feb] rounded-full shadow-[0_0_8px_rgba(31,111,235,0.6)] transition-all duration-1000"
                      style={{ width: `${metrics.cpu}%` }}
                    />
                  </div>
                </div>

                {/* RAM Gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1"><HardDrive className="h-3 w-3 text-[#a5d6ff]" /> RAM Allocation</span>
                    <span className="font-bold text-white">{metrics.memory} / 4.0 GB</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#58a6ff] rounded-full transition-all duration-1000"
                      style={{ width: "35%" }}
                    />
                  </div>
                </div>

                {/* Network gauge */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-[#ff7b72]" /> Bandwidth</span>
                    <span className="font-bold text-white">{metrics.network}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#0d1117] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#ff7b72] rounded-full transition-all duration-1000"
                      style={{ width: `${metrics.network}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Column Middle (Recent Projects, Global Banner image) - Span 6 */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
            
            <div className="flex items-center justify-between">
              <h2 className="font-headline-md text-lg font-extrabold text-white">Recent Projects</h2>
              <button 
                onClick={onNavigateToIde} 
                className="text-[#58a6ff] text-xs font-mono tracking-wider uppercase hover:underline"
              >
                View All Projects
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div 
                  key={proj.id}
                  onClick={onNavigateToIde}
                  className="bg-[#161b22]/70 border border-[#30363d] rounded-2xl p-5 hover:border-[#58a6ff]/40 hover:shadow-lg hover:shadow-[#58a6ff]/5 transition-all group cursor-pointer flex flex-col justify-between h-40"
                >
                  <div className="flex justify-between items-start">
                    <div className={`p-2.5 rounded-lg border ${
                      proj.type === "api" ? "bg-[#1f6feb]/10 border-[#1f6feb]/30 text-[#58a6ff]" :
                      proj.type === "service" ? "bg-[#a5d6ff]/10 border-[#58a6ff]/30 text-[#58a6ff]" :
                      proj.type === "db" ? "bg-[#ff7b72]/10 border-[#ff7b72]/30 text-[#ff7b72]" :
                      "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    }`}>
                      {proj.type === "api" && <Terminal className="h-4.5 w-4.5" />}
                      {proj.type === "service" && <ShoppingCart className="h-4.5 w-4.5" />}
                      {proj.type === "db" && <Database className="h-4.5 w-4.5" />}
                      {proj.type === "auth" && <AlertTriangle className="h-4.5 w-4.5" />}
                    </div>
                    
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-mono tracking-wider uppercase ${
                      proj.status === "Active" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 animate-pulse" :
                      proj.status === "Building" ? "border-[#1f6feb]/30 bg-[#1f6feb]/10 text-[#58a6ff] animate-pulse" :
                      proj.status === "Idle" ? "border-gray-500/30 bg-gray-500/10 text-gray-400" :
                      "border-rose-500/30 bg-rose-500/10 text-rose-400"
                    }`}>
                      {proj.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-headline-sm text-sm font-bold text-white group-hover:text-[#58a6ff] transition-colors truncate">{proj.name}</h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{proj.branch} · {proj.updatedAt}</p>
                  </div>

                  <div className="flex -space-x-1.5 pt-1">
                    {proj.collaborators.map((collab, idx) => (
                      <div 
                        key={idx}
                        className="w-5.5 h-5.5 rounded-full border border-[#0d1117] bg-[#0d1117] text-white text-[9px] font-bold flex items-center justify-center font-mono"
                      >
                        {collab}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Hotlinked Cinematic Network Image */}
            <div 
              onClick={onNavigateToNodes}
              className="relative h-44 rounded-2xl overflow-hidden border border-[#30363d] group cursor-pointer"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5kNPGDtVw5SkgdfCHrw1tzhIWG2NLdhNtGPUAvAJPMPu2fGP7w5O_P3nhfOglPaMEBl3s-OuB0o-mX7Wt72xEBNz300l_CE32uPZY2gaDrDosDr2kauajrpwoz-iq7PQmWCKY3styWLzX5KYKif_bPDUN8NhtfPIVn8cWg3hUaZw7PbfCOeFMA7RC5MboTy3vhp6dkFCqAouDosSSNEtd9ezVD9McAXEt-tAj_gZFVA027OACvfy1ngkgT2Snl3CxAcFobmbuy0A" 
                alt="Global Fiber Network" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/35 to-transparent" />
              <div className="absolute bottom-5 left-6">
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Global Edge Network Active
                </h4>
                <p className="text-xs text-gray-300 mt-1">Simulated local peer synchronization across 24 testnet regions</p>
              </div>
            </div>

          </div>

          {/* Column Right (Activity Feed timeline) - Span 3 */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            
            <div className="bg-[#161b22]/70 border border-[#30363d] rounded-2xl p-6 h-full flex flex-col justify-between">
              <div>
                <h2 className="font-headline-sm text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center justify-between">
                  <span>Activity Feed</span>
                  <History className="h-4 w-4 text-gray-500" />
                </h2>
                
                <div className="space-y-6 max-h-[360px] overflow-y-auto pr-1">
                  {activities.map((act) => (
                    <div key={act.id} className="relative pl-6 border-l border-gray-800">
                      {/* Timeline dot */}
                      <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-[#0d1117] ${
                        act.type === 'success' ? 'bg-emerald-500' :
                        act.type === 'info' ? 'bg-[#1f6feb]' :
                        act.type === 'error' ? 'bg-rose-500' : 'bg-amber-400'
                      }`} />
                      
                      <div className="flex flex-col gap-1">
                        <p className="text-xs font-bold text-gray-200 leading-tight">{act.title}</p>
                        <p className="text-[11px] text-gray-500 font-mono">{act.subtitle}</p>
                        <p className="text-[9px] text-gray-600 font-mono mt-0.5">{act.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={onNavigateToNodes}
                className="w-full pt-4 mt-4 border-t border-[#30363d] text-center text-xs font-mono tracking-widest text-gray-500 hover:text-[#58a6ff] transition-colors uppercase"
              >
                View Full Live Logs
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
