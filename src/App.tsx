import { useState, useEffect } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import HomeView from "./components/HomeView";
import DashboardView from "./components/DashboardView";
import IdeView from "./components/IdeView";
import NodesView from "./components/NodesView";
import AuthView from "./components/AuthView";
import { VirtualFile, NodeState } from "./types";
import { Terminal } from "lucide-react";

export default function App() {
  // Navigation View Router
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'ide' | 'nodes'>('home');
  const [activeIdeTab, setActiveIdeTab] = useState<string>('files');

  // User Session state
  const [user, setUser] = useState<{ email: string; username: string; avatar: string; provider: string } | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);

  // Virtual Filesystem State
  const [files, setFiles] = useState<VirtualFile[]>([]);
  
  // Deploy triggered trigger count (to display custom activity item)
  const [deployTriggeredCount, setDeployTriggeredCount] = useState<number>(0);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);

  // Node state simulator fallbacks
  const [nodeState, setNodeState] = useState<NodeState>({
    status: 'Operational',
    version: "v1.0.4-stable",
    uptime: "12d 04h 22m 10s",
    blockHeight: 18234012,
    syncProgress: 100,
    peers: [],
    blocks: [],
    metrics: { cpu: 12, memory: "1.4GB", network: 42, bandwidth: "89 Mbps" },
    logs: []
  });

  // Fetch virtual files from server
  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files");
      const data = await res.json();
      if (Array.isArray(data)) {
        setFiles(data);
      }
    } catch (err) {
      console.error("VFS Fetch Error:", err);
    }
  };

  // Fetch live node state from server
  const fetchNodeState = async () => {
    try {
      const res = await fetch("/api/node");
      const data = await res.json();
      if (data && data.status) {
        setNodeState(data);
      }
    } catch (err) {
      console.error("Node state Fetch Error:", err);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data && data.user) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setIsAuthChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    setUser(null);
  };

  const handleBypass = () => {
    setUser({
      email: "guest@fiberdev.io",
      username: "guest-developer",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=guest-developer",
      provider: "guest"
    });
  };

  // Initial load
  useEffect(() => {
    checkAuth();
    fetchFiles();
    fetchNodeState();

    // Setup active polling loop for blocks/logs/metrics (every 3 seconds)
    const timer = setInterval(() => {
      fetchNodeState();
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Save modified virtual file back to the server
  const handleSaveFile = async (path: string, content: string) => {
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, content })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state files list
        setFiles(prev => prev.map(f => f.path === path ? { ...f, content } : f));
      }
    } catch (err) {
      console.error("Save file API failed:", err);
    }
  };

  // Trigger Node Action: Restart
  const handleRestartNode = async () => {
    try {
      const res = await fetch("/api/node/restart", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchNodeState();
      }
    } catch (err) {
      console.error("Restart node failed:", err);
    }
  };

  // Trigger Node Action: Reset / Purge local testnet
  const handleResetNode = async () => {
    try {
      const res = await fetch("/api/node/reset", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchNodeState();
      }
    } catch (err) {
      console.error("Reset node failed:", err);
    }
  };

  // Trigger Node Action: Connect Peer
  const handleConnectPeer = async () => {
    try {
      const res = await fetch("/api/node/connect-peer", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchNodeState();
      }
    } catch (err) {
      console.error("Connect peer failed:", err);
    }
  };

  // Trigger Node Action: Disconnect peer socket
  const handleDisconnectPeer = async (id: string) => {
    try {
      const res = await fetch("/api/node/disconnect-peer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        await fetchNodeState();
      }
    } catch (err) {
      console.error("Disconnect peer failed:", err);
    }
  };

  // Deploy workspace code to node
  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const activeFile = files.find(f => f.path === "internal/api/post.go") || files[0];
      const res = await fetch("/api/node/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: activeFile?.name || "post.go",
          fileContent: activeFile?.content || ""
        })
      });
      const data = await res.json();
      if (data.success) {
        setDeployTriggeredCount(prev => prev + 1);
        await fetchNodeState();
      }
    } catch (err) {
      console.error("Deploy endpoint failed:", err);
    } finally {
      setIsDeploying(false);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center font-mono text-gray-400 p-6 select-none">
        <div className="max-w-md w-full space-y-4 text-center">
          <div className="inline-flex p-3 bg-gradient-to-br from-[#1f6feb] to-[#58a6ff] rounded-2xl text-white shadow-xl shadow-[#1f6feb]/10 animate-bounce">
            <Terminal className="h-8 w-8" />
          </div>
          <h2 className="text-white font-bold text-base">Booting FiberDev Studio...</h2>
          <div className="w-full bg-[#161b22] h-1.5 rounded-full overflow-hidden border border-[#30363d] mt-2">
            <div className="bg-[#1f6feb] h-full rounded-full animate-pulse" style={{ width: '65%' }} />
          </div>
          <p className="text-[10px] text-gray-500">Connecting to secure sandbox backend compiler & local testnet...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <AuthView 
        onAuthSuccess={(authenticatedUser) => setUser(authenticatedUser)}
        onBypass={handleBypass}
      />
    );
  }

  return (
    <div className="bg-[#0d1117] text-gray-200 min-h-screen relative font-sans flex flex-col antialiased">
      
      {/* Shared Header Navigation */}
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView}
        nodeStatus={nodeState.status}
        onDeploy={handleDeploy}
        isDeploying={isDeploying}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Shell Layout */}
      <div className="flex flex-1 pt-14 overflow-hidden h-[calc(100vh-3.5rem)]">
        
        {/* Left Sidebar */}
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView}
          activeIdeTab={activeIdeTab}
          setActiveIdeTab={setActiveIdeTab}
        />

        {/* Dynamic active view panel */}
        <main className="flex-1 ml-16 overflow-y-auto bg-[#0d1117]">
          {activeView === 'home' && (
            <HomeView 
              onStartBuilding={() => setActiveView('dashboard')} 
              activeBlock={nodeState.blockHeight}
            />
          )}

          {activeView === 'dashboard' && (
            <DashboardView 
              metrics={nodeState.metrics}
              nodeStatus={nodeState.status}
              onNavigateToIde={() => setActiveView('ide')}
              onNavigateToNodes={() => setActiveView('nodes')}
              deployTriggeredCount={deployTriggeredCount}
            />
          )}

          {activeView === 'ide' && (
            <IdeView 
              files={files}
              onSaveFile={handleSaveFile}
              onDeploy={handleDeploy}
              isDeploying={isDeploying}
              activeBlock={nodeState.blockHeight}
              nodeStatus={nodeState.status}
              terminalLogs={nodeState.logs}
            />
          )}

          {activeView === 'nodes' && (
            <NodesView 
              nodeState={nodeState}
              onRestartNode={handleRestartNode}
              onResetNode={handleResetNode}
              onConnectPeer={handleConnectPeer}
              onDisconnectPeer={handleDisconnectPeer}
            />
          )}
        </main>
      </div>

      {/* Embedded footer status bar */}
      <footer className="bg-[#0d1117] border-t border-[#30363d] flex justify-between items-center px-6 h-8 fixed bottom-0 left-0 right-0 z-50 text-[11px] font-mono select-none text-gray-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Stable Mainnet-v1.2 Sandbox
          </span>
          <span>|</span>
          <span>Uptime: {nodeState.uptime}</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#58a6ff]">Documentation</a>
          <a href="#" className="hover:text-[#58a6ff]">Changelog</a>
          <a href="#" className="hover:text-[#58a6ff]">Privacy</a>
        </div>
      </footer>

    </div>
  );
}
