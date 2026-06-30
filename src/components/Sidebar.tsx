import { 
  FolderOpen, 
  Search, 
  GitBranch, 
  Play, 
  Network, 
  User, 
  Settings,
  Home
} from "lucide-react";

interface SidebarProps {
  activeView: 'home' | 'dashboard' | 'ide' | 'nodes';
  setActiveView: (view: 'home' | 'dashboard' | 'ide' | 'nodes') => void;
  activeIdeTab?: string;
  setActiveIdeTab?: (tab: string) => void;
}

export default function Sidebar({ activeView, setActiveView, activeIdeTab = 'files', setActiveIdeTab }: SidebarProps) {
  
  const handleIdeTabClick = (tab: string) => {
    setActiveView('ide');
    if (setActiveIdeTab) {
      setActiveIdeTab(tab);
    }
  };

  return (
    <aside className="bg-[#161b22] border-r border-[#30363d] flex flex-col items-center py-4 h-[calc(100vh-3.5rem)] w-16 fixed left-0 top-14 z-40 select-none">
      <div className="flex flex-col gap-5 items-center flex-1 w-full">
        {/* Home Overview */}
        <button 
          onClick={() => setActiveView('home')}
          title="Home Portal"
          className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeView === 'home'
              ? 'text-[#58a6ff] bg-[#30363d] border-l-2 border-[#58a6ff]'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-[9px] scale-90 font-mono mt-0.5">HOME</span>
        </button>

        {/* Dashboard overview */}
        <button 
          onClick={() => setActiveView('dashboard')}
          title="Dashboard"
          className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeView === 'dashboard'
              ? 'text-[#58a6ff] bg-[#30363d] border-l-2 border-[#58a6ff]'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
          }`}
        >
          <Network className="h-5 w-5 rotate-45" />
          <span className="text-[9px] scale-90 font-mono mt-0.5">DASH</span>
        </button>

        <div className="w-8 h-[1px] bg-[#30363d] my-1" />

        {/* Workspace IDE: Explorer Files */}
        <button 
          onClick={() => handleIdeTabClick('files')}
          title="File Explorer"
          className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeView === 'ide' && activeIdeTab === 'files'
              ? 'text-[#58a6ff] bg-[#30363d] border-l-2 border-[#58a6ff]'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
          }`}
        >
          <FolderOpen className="h-5 w-5" />
          <span className="text-[9px] scale-90 font-mono mt-0.5">FILES</span>
        </button>

        {/* Workspace IDE: Search in Files */}
        <button 
          onClick={() => handleIdeTabClick('search')}
          title="Search in Files"
          className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeView === 'ide' && activeIdeTab === 'search'
              ? 'text-[#58a6ff] bg-[#30363d] border-l-2 border-[#58a6ff]'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
          }`}
        >
          <Search className="h-5 w-5" />
          <span className="text-[9px] scale-90 font-mono mt-0.5">FIND</span>
        </button>

        {/* Workspace IDE: Source Control */}
        <button 
          onClick={() => handleIdeTabClick('git')}
          title="Source Control"
          className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeView === 'ide' && activeIdeTab === 'git'
              ? 'text-[#58a6ff] bg-[#30363d] border-l-2 border-[#58a6ff]'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
          }`}
        >
          <GitBranch className="h-5 w-5" />
          <span className="text-[9px] scale-90 font-mono mt-0.5">GIT</span>
        </button>

        {/* Workspace IDE: Run & Debug */}
        <button 
          onClick={() => handleIdeTabClick('debug')}
          title="Run & Debug"
          className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeView === 'ide' && activeIdeTab === 'debug'
              ? 'text-[#58a6ff] bg-[#30363d] border-l-2 border-[#58a6ff]'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
          }`}
        >
          <Play className="h-5 w-5" />
          <span className="text-[9px] scale-90 font-mono mt-0.5">DEBUG</span>
        </button>

        {/* Node Manager */}
        <button 
          onClick={() => setActiveView('nodes')}
          title="Node Manager"
          className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg transition-all ${
            activeView === 'nodes'
              ? 'text-[#58a6ff] bg-[#30363d] border-l-2 border-[#58a6ff]'
              : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
          }`}
        >
          <Network className="h-5 w-5" />
          <span className="text-[9px] scale-90 font-mono mt-0.5">NODES</span>
        </button>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col items-center gap-3 w-full pb-4">
        <button 
          title="Profile"
          className="text-gray-500 hover:text-[#58a6ff] hover:bg-gray-800/40 p-2 rounded-lg transition-colors"
        >
          <User className="h-5 w-5" />
        </button>
        <button 
          title="Settings"
          className="text-gray-500 hover:text-[#58a6ff] hover:bg-gray-800/40 p-2 rounded-lg transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
}
