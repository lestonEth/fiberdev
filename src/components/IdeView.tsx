import { useState, useEffect, useRef, FormEvent } from "react";
import { 
  Folder, 
  FileCode, 
  Settings, 
  Play, 
  Terminal as TermIcon, 
  Sparkles, 
  Save, 
  Check, 
  AlertTriangle, 
  Send, 
  HelpCircle,
  Copy,
  Plus,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Clock
} from "lucide-react";
import { VirtualFile } from "../types";

interface IdeViewProps {
  files: VirtualFile[];
  onSaveFile: (path: string, content: string) => Promise<void>;
  onDeploy: () => void;
  isDeploying: boolean;
  activeBlock: number;
  nodeStatus: string;
  terminalLogs: string[];
}

export default function IdeView({ 
  files, 
  onSaveFile, 
  onDeploy, 
  isDeploying, 
  activeBlock, 
  nodeStatus,
  terminalLogs 
}: IdeViewProps) {
  
  const [activeFilePath, setActiveFilePath] = useState<string>("internal/api/post.go");
  const [editorContent, setEditorContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  
  // Terminal Tab State
  const [activeTerminalTab, setActiveTerminalTab] = useState<'terminal' | 'debug' | 'output' | 'problems'>('terminal');
  
  // AI Panel State
  const [aiPrompt, setAiPrompt] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiMode, setAiMode] = useState<'chat' | 'explain' | 'generate'>('chat');
  
  // Terminal inputs state
  const [terminalInput, setTerminalInput] = useState<string>("");
  const [customTerminalLogs, setCustomTerminalLogs] = useState<string[]>([]);
  
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Sync editor content with file changes
  useEffect(() => {
    const currentFile = files.find(f => f.path === activeFilePath);
    if (currentFile) {
      setEditorContent(currentFile.content);
    }
  }, [activeFilePath, files]);

  // Scroll to bottom of terminal when logs change
  useEffect(() => {
    if (terminalBottomRef.current) {
      terminalBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs, customTerminalLogs, activeTerminalTab]);

  // Save active file changes
  const handleSave = async () => {
    setIsSaving(true);
    await onSaveFile(activeFilePath, editorContent);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  // AI Prompt Request
  const handleAiAction = async (selectedMode: 'chat' | 'explain' | 'generate', customPrompt?: string) => {
    setIsAiLoading(true);
    setAiMode(selectedMode);
    
    const promptToSend = customPrompt || aiPrompt || (selectedMode === 'explain' ? "Explain this router handler" : "Write a Go Fiber handler");
    
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptToSend,
          currentFile: activeFilePath,
          fileContent: editorContent,
          mode: selectedMode
        })
      });
      const data = await response.json();
      if (data.error) {
        setAiResponse(`Error: ${data.error}`);
      } else {
        setAiResponse(data.response);
      }
    } catch (err: any) {
      setAiResponse(`Failed to contact assistant: ${err.message}`);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Auto Insert AI Code into active editor
  const handleInsertCode = (code: string) => {
    // Basic helper to extract Go code inside markdown blocks if present
    let cleanCode = code;
    const match = code.match(/```go\n([\s\S]*?)```/);
    if (match && match[1]) {
      cleanCode = match[1];
    } else {
      const matchAny = code.match(/```([\s\S]*?)```/);
      if (matchAny && matchAny[1]) {
        cleanCode = matchAny[1];
      }
    }
    setEditorContent(cleanCode);
  };

  // Handle Terminal input execution
  const handleTerminalSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const cmd = terminalInput.trim();
    const newLogs = [...customTerminalLogs, `➜ fiber-app git:(main) ✗ ${cmd}`];
    
    if (cmd === "clear") {
      setCustomTerminalLogs([]);
      setTerminalInput("");
      return;
    }

    if (cmd === "fiber run" || cmd === "go run cmd/main.go") {
      newLogs.push(
        "[fiber] Starting Go Fiber server...",
        "[fiber] Loading configuration from env...",
        `[fiber] DB connection successfully established`,
        `[fiber] App loaded: FiberDev Microservice (port: 3000)`,
        `[fiber] 127.0.0.1:3000 - Listening for requests...`
      );
    } else if (cmd === "go test ./...") {
      newLogs.push(
        "?   \tfiber-app/cmd\t[no test files]",
        "ok  \tfiber-app/internal/api\t0.045s\tcoverage: 85.2% of statements",
        "ok  \tfiber-app/pkg/db\t0.012s\tcoverage: 100% of statements"
      );
    } else if (cmd === "fiber deploy") {
      newLogs.push("[build] Initiating contract deployment...");
      onDeploy();
    } else {
      newLogs.push(`sh: command not found: ${cmd.split(" ")[0]}. Try 'fiber run', 'go test ./...', or 'fiber deploy'.`);
    }

    setCustomTerminalLogs(newLogs);
    setTerminalInput("");
  };

  // Group files by directory structure
  const folders = {
    cmd: files.filter(f => f.path.startsWith("cmd/")),
    api: files.filter(f => f.path.startsWith("internal/api/")),
    models: files.filter(f => f.path.startsWith("internal/models/")),
    pkg: files.filter(f => f.path.startsWith("pkg/")),
    root: files.filter(f => !f.path.includes("/"))
  };

  const currentFile = files.find(f => f.path === activeFilePath) || files[0];

  return (
    <div className="flex h-[calc(100vh-3.5rem)] text-gray-200 bg-[#0d1117] overflow-hidden select-none">
      
      {/* LEFT COLUMN: Collapsible File Explorer Tree */}
      <div className="w-64 bg-[#161b22] border-r border-[#30363d] flex flex-col shrink-0">
        <div className="h-11 flex items-center px-4 justify-between bg-[#0d1117] border-b border-[#30363d]">
          <span className="font-mono text-xs text-gray-400 font-bold uppercase tracking-widest">Explorer: FIBER-APP</span>
          <button 
            title="Reload VFS"
            className="text-gray-500 hover:text-white p-1 hover:bg-gray-800 rounded"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        </div>
        
        {/* VFS File list scroll */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin">
          
          {/* cmd folder */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 py-1 px-2 text-gray-400 hover:text-white hover:bg-gray-800/30 rounded cursor-pointer text-xs font-semibold">
              <ChevronDown className="h-3.5 w-3.5" />
              <Folder className="h-4 w-4 text-[#58a6ff] fill-[#58a6ff]/10" />
              <span>cmd</span>
            </div>
            <div className="pl-6 space-y-0.5">
              {folders.cmd.map(f => (
                <div 
                  key={f.path}
                  onClick={() => setActiveFilePath(f.path)}
                  className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-xs font-mono border-l-2 ${
                    activeFilePath === f.path 
                      ? 'bg-[#1f6feb]/10 border-[#1f6feb] text-[#58a6ff] font-semibold' 
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/20'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 text-[#58a6ff]" />
                  <span className="truncate">{f.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* internal/api folder */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 py-1 px-2 text-gray-400 hover:text-white hover:bg-gray-800/30 rounded cursor-pointer text-xs font-semibold">
              <ChevronDown className="h-3.5 w-3.5" />
              <Folder className="h-4 w-4 text-[#58a6ff] fill-[#58a6ff]/10" />
              <span>internal/api</span>
            </div>
            <div className="pl-6 space-y-0.5">
              {folders.api.map(f => (
                <div 
                  key={f.path}
                  onClick={() => setActiveFilePath(f.path)}
                  className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-xs font-mono border-l-2 ${
                    activeFilePath === f.path 
                      ? 'bg-[#1f6feb]/10 border-[#1f6feb] text-[#58a6ff] font-semibold' 
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/20'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 text-[#a5d6ff]" />
                  <span className="truncate">{f.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* internal/models folder */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 py-1 px-2 text-gray-400 hover:text-white hover:bg-gray-800/30 rounded cursor-pointer text-xs font-semibold">
              <ChevronDown className="h-3.5 w-3.5" />
              <Folder className="h-4 w-4 text-[#58a6ff] fill-[#58a6ff]/10" />
              <span>internal/models</span>
            </div>
            <div className="pl-6 space-y-0.5">
              {folders.models.map(f => (
                <div 
                  key={f.path}
                  onClick={() => setActiveFilePath(f.path)}
                  className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-xs font-mono border-l-2 ${
                    activeFilePath === f.path 
                      ? 'bg-[#1f6feb]/10 border-[#1f6feb] text-[#58a6ff] font-semibold' 
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/20'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 text-[#ff7b72]" />
                  <span className="truncate">{f.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* pkg/db folder */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 py-1 px-2 text-gray-400 hover:text-white hover:bg-gray-800/30 rounded cursor-pointer text-xs font-semibold">
              <ChevronDown className="h-3.5 w-3.5" />
              <Folder className="h-4 w-4 text-[#58a6ff] fill-[#58a6ff]/10" />
              <span>pkg/db</span>
            </div>
            <div className="pl-6 space-y-0.5">
              {folders.pkg.map(f => (
                <div 
                  key={f.path}
                  onClick={() => setActiveFilePath(f.path)}
                  className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-xs font-mono border-l-2 ${
                    activeFilePath === f.path 
                      ? 'bg-[#1f6feb]/10 border-[#1f6feb] text-[#58a6ff] font-semibold' 
                      : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/20'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5 text-sky-400" />
                  <span className="truncate">{f.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Root config files */}
          <div className="pt-2 space-y-0.5">
            {folders.root.map(f => (
              <div 
                key={f.path}
                onClick={() => setActiveFilePath(f.path)}
                className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer text-xs font-mono border-l-2 ${
                  activeFilePath === f.path 
                    ? 'bg-[#1f6feb]/10 border-[#1f6feb] text-[#58a6ff] font-semibold' 
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/20'
                }`}
              >
                <Settings className="h-3.5 w-3.5 text-gray-500" />
                <span className="truncate">{f.name}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Node status box */}
        <div className="p-4 border-t border-[#30363d] bg-[#161b22]/40 text-xs">
          <div className="flex justify-between text-gray-400">
            <span>Blockchain Height:</span>
            <span className="font-mono font-bold text-[#58a6ff]">#{activeBlock}</span>
          </div>
          <div className="flex justify-between text-gray-400 mt-1">
            <span>Uptime:</span>
            <span className="font-mono">Stable Devnet</span>
          </div>
        </div>
      </div>

      {/* MIDDLE COLUMN: Tab list breadcrumbs + Active Editor + Collapsible bottom Terminal */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
        
        {/* Editor tabs bar */}
        <div className="flex h-11 bg-[#161b22] border-b border-[#30363d] overflow-x-auto">
          {/* Active File Tab */}
          <div className="flex items-center px-4 gap-2 bg-[#0d1117] border-r border-[#30363d] border-t-2 border-t-[#1f6feb] text-[#58a6ff] cursor-pointer h-full">
            <FileCode className="h-3.5 w-3.5 text-[#a5d6ff]" />
            <span className="font-mono text-xs font-semibold">{currentFile.name}</span>
            <span className="text-gray-500 hover:text-white rounded ml-1 text-[10px]">✕</span>
          </div>
          
          {/* Dummy extra tab */}
          <div 
            onClick={() => setActiveFilePath("cmd/main.go")}
            className="flex items-center px-4 gap-2 text-gray-500 hover:text-gray-300 border-r border-[#30363d] hover:bg-gray-800/10 cursor-pointer h-full"
          >
            <FileCode className="h-3.5 w-3.5 opacity-50" />
            <span className="font-mono text-xs">main.go</span>
          </div>
        </div>

        {/* Breadcrumb row & Controls */}
        <div className="flex items-center justify-between h-8 px-4 bg-[#0d1117] border-b border-[#30363d]/50 text-[11px] text-gray-500">
          <div className="flex items-center gap-1 font-mono">
            <span>FIBER-APP</span>
            <span>&gt;</span>
            {currentFile.path.split("/").map((part, idx, arr) => (
              <span key={idx} className={idx === arr.length - 1 ? "text-gray-300 font-semibold" : ""}>
                {part} {idx < arr.length - 1 && " > "}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Auto-Save ON
            </span>
            
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-1 px-2.5 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded hover:border-gray-500 text-gray-300 transition-colors ${
                saveSuccess ? "border-emerald-500/50 text-emerald-400" : ""
              }`}
            >
              {saveSuccess ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Saved
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save File
                </>
              )}
            </button>
          </div>
        </div>

        {/* Workspace Code Textarea */}
        <div className="flex-1 relative overflow-hidden bg-[#0d1117] flex">
          {/* Simulated Line numbers gutter */}
          <div className="w-11 bg-[#0d1117]/80 border-r border-gray-800/50 text-right pr-3 pt-4 select-none font-mono text-[11px] text-gray-600 leading-[1.6]">
            {Array.from({ length: 42 }, (_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Active editor textarea */}
          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            className="flex-1 p-4 bg-transparent resize-none focus:outline-none font-mono text-xs text-gray-300 leading-[1.6] overflow-y-auto scrollbar-thin select-text h-full placeholder-gray-700"
            style={{ tabSize: 4 }}
            placeholder="// Write high-performance Go code here..."
          />
        </div>

        {/* BOTTOM PANEL: Collapsible Multi-tab Terminal log stream */}
        <div className="h-48 bg-[#161b22] border-t border-[#30363d] flex flex-col shrink-0">
          {/* Terminal control bar */}
          <div className="flex items-center px-4 h-9 bg-[#0d1117] border-b border-[#30363d] gap-6 text-[11px] font-mono font-bold">
            <button 
              onClick={() => setActiveTerminalTab('terminal')}
              className={`h-full flex items-center border-b-2 px-1 transition-all uppercase ${
                activeTerminalTab === 'terminal' 
                  ? 'border-[#1f6feb] text-[#58a6ff]' 
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              TERMINAL
            </button>
            <button 
              onClick={() => setActiveTerminalTab('debug')}
              className={`h-full flex items-center border-b-2 px-1 transition-all uppercase ${
                activeTerminalTab === 'debug' 
                  ? 'border-[#1f6feb] text-[#58a6ff]' 
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              DEBUG CONSOLE
            </button>
            <button 
              onClick={() => setActiveTerminalTab('output')}
              className={`h-full flex items-center border-b-2 px-1 transition-all uppercase ${
                activeTerminalTab === 'output' 
                  ? 'border-[#1f6feb] text-[#58a6ff]' 
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              OUTPUT
            </button>
            <button 
              onClick={() => setActiveTerminalTab('problems')}
              className={`h-full flex items-center border-b-2 px-1 transition-all uppercase ${
                activeTerminalTab === 'problems' 
                  ? 'border-[#1f6feb] text-[#58a6ff]' 
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              PROBLEMS (0)
            </button>

            {/* Deploy feedback in Terminal footer */}
            <div className="ml-auto hidden sm:flex items-center gap-4 text-gray-500">
              <span>Host: localhost:3000</span>
              <span>Port: 3000</span>
            </div>
          </div>

          {/* Terminal Console log stream viewport */}
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-[#0d1117] scrollbar-thin flex flex-col justify-between">
            
            {activeTerminalTab === 'terminal' && (
              <div className="space-y-1">
                <div className="text-gray-500">FiberDev Studio Cloud Workspace Shell v1.0.4</div>
                <div className="text-gray-400">Type 'fiber run' or 'go test ./...' to trigger compiler pipelines.</div>
                
                {/* Active Simulated node logs or custom typed logs */}
                {customTerminalLogs.length === 0 ? (
                  <>
                    <div className="text-[#58a6ff] mt-2">➜ fiber-app git:(main) ✗ fiber run</div>
                    <div className="text-gray-400 leading-relaxed">
                      [fiber] 14:22:10 <span className="text-[#58a6ff]">INFO</span> | Loaded env from local .env config file<br />
                      [fiber] 14:22:10 <span className="text-[#58a6ff]">INFO</span> | Preparing router mappings for Go models...<br />
                      [fiber] 14:22:11 <span className="text-[#58a6ff]">INFO</span> | Listening on host <span className="text-amber-400 underline cursor-pointer">http://localhost:3000</span><br />
                      [fiber] 14:22:11 <span className="text-[#58a6ff]">INFO</span> | Running in container environment mode...
                    </div>
                  </>
                ) : (
                  customTerminalLogs.map((logLine, idx) => (
                    <div key={idx} className="whitespace-pre text-gray-300 leading-relaxed">{logLine}</div>
                  ))
                )}

                {/* Form input command typing simulation */}
                <form onSubmit={handleTerminalSubmit} className="flex items-center gap-1 text-white mt-1 pt-1">
                  <span className="text-[#58a6ff] shrink-0 font-bold">➜ fiber-app git:(main) ✗ </span>
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="flex-1 bg-transparent focus:outline-none font-mono text-xs text-white"
                    placeholder="Type console command..."
                  />
                </form>
              </div>
            )}

            {activeTerminalTab === 'debug' && (
              <div className="space-y-1 text-amber-300">
                <div>[debug] Attached to local process singletons...</div>
                <div>[debug] Listening for VM breakpoints...</div>
                <div className="text-gray-500">No active breakpoint triggered. Run contract deployment to inspect transactions.</div>
              </div>
            )}

            {activeTerminalTab === 'output' && (
              <div className="space-y-1.5 text-[#ff7b72]">
                <div className="text-gray-400">-- Build Output (go build) --</div>
                {terminalLogs.slice(-10).map((line, idx) => (
                  <div key={idx} className="font-mono text-[11px] truncate">{line}</div>
                ))}
              </div>
            )}

            {activeTerminalTab === 'problems' && (
              <div className="text-emerald-400 flex items-center gap-2">
                <span>✓ No structural compilation syntax warnings. Your Go code is perfectly clean.</span>
              </div>
            )}

            <div ref={terminalBottomRef} />
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Gemini AI Coding Assistant Panel */}
      <div className="w-80 bg-[#161b22] border-l border-[#30363d] flex flex-col shrink-0 select-none">
        <div className="h-11 flex items-center px-4 justify-between bg-[#0d1117] border-b border-[#30363d]">
          <span className="font-mono text-xs text-[#58a6ff] font-bold uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="h-4 w-4 animate-pulse text-[#58a6ff]" />
            Gemini Assistant
          </span>
          <span className="text-[10px] bg-[#1f6feb]/10 text-[#58a6ff] px-2 py-0.5 rounded border border-[#1f6feb]/20 font-mono">
            3.5-flash
          </span>
        </div>

        {/* AI Action Quick Triggers Panel */}
        <div className="p-4 border-b border-[#30363d] bg-[#161b22]/20 space-y-3 shrink-0">
          <div className="text-xs text-gray-400 font-medium">Quick Context Prompts:</div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleAiAction('explain')}
              className="bg-[#21262d] border border-[#30363d] hover:border-[#58a6ff] hover:bg-[#30363d] text-xs py-1.5 px-2 rounded-lg text-gray-200 font-semibold transition-colors flex items-center gap-1 justify-center cursor-pointer"
            >
              Explain File
            </button>
            <button 
              onClick={() => handleAiAction('generate', 'Generate an API route with custom fields')}
              className="bg-[#21262d] border border-[#30363d] hover:border-[#58a6ff] hover:bg-[#30363d] text-xs py-1.5 px-2 rounded-lg text-gray-200 font-semibold transition-colors flex items-center gap-1 justify-center cursor-pointer"
            >
              Write Route
            </button>
          </div>
        </div>

        {/* AI response panel display */}
        <div className="flex-1 p-4 overflow-y-auto scrollbar-thin bg-[#0d1117]/60 select-text font-body-sm text-xs leading-relaxed space-y-4">
          {isAiLoading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3 text-center text-gray-400">
              <span className="w-8 h-8 border-3 border-[#1f6feb] border-t-transparent rounded-full animate-spin" />
              <div className="font-mono text-[10px] text-[#58a6ff] animate-pulse">Gemini reasoning with deep compiler context...</div>
            </div>
          ) : aiResponse ? (
            <div className="space-y-4">
              <div className="text-gray-300 whitespace-pre-wrap select-text markdown-body bg-[#161b22] p-3 rounded-lg border border-[#30363d]/80 shadow-md">
                {aiResponse}
              </div>

              {/* Action: Copy generated code or auto insert into editor! */}
              {aiMode === 'generate' && (
                <button 
                  onClick={() => handleInsertCode(aiResponse)}
                  className="w-full flex items-center gap-2 justify-center py-2 bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold rounded-lg cursor-pointer shadow-lg transition-transform active:scale-95"
                >
                  <FileCode className="h-4 w-4" />
                  Insert Into Active Editor
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 space-y-4">
              <Sparkles className="h-10 w-10 text-gray-700" />
              <p className="max-w-[200px]">
                Ask me to write routers, design database mappings, explain Go modules, or mock test files. 
              </p>
              <div className="text-[10px] font-mono text-[#58a6ff] bg-[#1f6feb]/5 px-3 py-1.5 rounded-full border border-[#1f6feb]/15">
                GEMINI LIVE CHAT READY
              </div>
            </div>
          )}
        </div>

        {/* Chat input box footer */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleAiAction('chat');
          }}
          className="p-3 bg-[#161b22] border-t border-[#30363d] flex gap-2 items-center"
        >
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Ask AI compiler assistant..."
            className="flex-1 bg-[#0d1117] border border-[#30363d] rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#1f6feb] text-gray-200"
          />
          <button 
            type="submit"
            disabled={!aiPrompt.trim() || isAiLoading}
            className="p-1.5 rounded bg-[#1f6feb] text-white hover:bg-[#388bfd] disabled:opacity-40 transition-colors cursor-pointer shrink-0"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
