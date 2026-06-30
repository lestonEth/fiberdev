import { 
  ArrowRight, 
  Terminal, 
  Cpu, 
  Layers, 
  GitFork, 
  Bug, 
  CloudLightning, 
  Share2, 
  ExternalLink,
  Zap,
  FolderOpen,
  Search
} from "lucide-react";
import { useState, useEffect } from "react";

interface HomeViewProps {
  onStartBuilding: () => void;
  activeBlock: number;
}

export default function HomeView({ onStartBuilding, activeBlock }: HomeViewProps) {
  const [activeCodeLine, setActiveCodeLine] = useState(0);

  // Terminal simulated typing/highlight highlight line loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCodeLine((prev) => (prev + 1) % 11);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-gray-100 min-h-screen relative overflow-hidden bg-[#0d1117] select-none">
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#1f6feb]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[600px] h-[600px] bg-[#58a6ff]/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-28 pb-24">
        
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-32">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1f6feb]/10 border border-[#1f6feb]/20 rounded-full">
              <span className="flex h-2 w-2 rounded-full bg-[#1f6feb] animate-pulse"></span>
              <span className="text-[#58a6ff] font-mono text-xs font-semibold tracking-wider">V1.0.4 Stable Now Live</span>
            </div>
            
            <h1 className="font-headline-md text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Build Fiber Applications <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58a6ff] to-[#1f6feb]">Without Local Setup</span>
            </h1>
            
            <p className="text-gray-400 text-base md:text-lg max-w-lg leading-relaxed">
              A professional, browser-based IDE for high-performance blockchain development. No setup, just code. Access preconfigured Fiber nodes and deployment pipelines instantly.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={onStartBuilding}
                className="bg-[#1f6feb] hover:bg-[#388bfd] text-white px-8 py-3.5 rounded font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#1f6feb]/20 active:scale-95 cursor-pointer"
              >
                Start Building
              </button>
              <a 
                href="#bento"
                className="border border-[#30363d] hover:border-[#58a6ff] hover:bg-gray-800/20 text-white px-8 py-3.5 rounded font-bold text-sm tracking-wide transition-all active:scale-95 text-center cursor-pointer"
              >
                Explore Features
              </a>
            </div>
            
            <div className="flex items-center gap-6 pt-4 text-gray-500 font-mono text-xs tracking-widest">
              <span>TRUSTED BY TEAMS AT</span>
              <span className="font-black text-gray-400 tracking-tighter">NODEFLOW</span>
              <span className="font-black text-gray-400 tracking-tighter">BLOCKV</span>
              <span className="font-black text-gray-400 tracking-tighter">CORE.IO</span>
            </div>
          </div>

          {/* IDE Preview Mockup */}
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#1f6feb]/30 to-[#58a6ff]/30 blur-2xl opacity-30 group-hover:opacity-40 transition-all duration-700" />
            
            <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl relative">
              {/* Window Controls bar */}
              <div className="bg-[#161b22] h-10 flex items-center px-4 justify-between border-b border-[#30363d]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/30" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/30" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
                </div>
                <div className="bg-[#0d1117] px-3 py-1 rounded text-[11px] text-[#58a6ff] font-mono border border-[#30363d]/50">
                  internal/api/post.go
                </div>
                <div className="w-12" />
              </div>
              
              {/* Editor body mock */}
              <div className="flex h-80">
                {/* Editor sidebar mock */}
                <div className="w-12 bg-[#161b22] border-r border-[#30363d] flex flex-col items-center py-4 gap-4 text-gray-500">
                  <FolderOpen className="h-4 w-4 text-[#58a6ff]" />
                  <Search className="h-4 w-4" />
                  <Terminal className="h-4 w-4" />
                </div>
                
                {/* Code viewport */}
                <div className="flex-1 p-6 font-mono text-xs overflow-hidden bg-[#0d1117] leading-relaxed relative">
                  {[
                    { text: 'package api', color: 'text-[#58a6ff]' },
                    { text: 'import "github.com/gofiber/fiber/v2"', color: 'text-[#58a6ff]' },
                    { text: '' },
                    { text: '// CreatePost handler', color: 'text-gray-500 italic' },
                    { text: 'func CreatePost(c *fiber.Ctx) error {', color: 'text-white' },
                    { text: '    post := new(models.Post)', color: 'text-gray-300' },
                    { text: '    if err := c.BodyParser(post); err != nil {', color: 'text-gray-300' },
                    { text: '        return c.Status(400).JSON(fiber.Map{', color: 'text-[#58a6ff]' },
                    { text: '            "error": "Cannot parse JSON payload",', color: 'text-amber-300' },
                    { text: '        })', color: 'text-gray-300' },
                    { text: '    }', color: 'text-gray-300' },
                    { text: '    return c.Status(201).JSON(post)', color: 'text-[#58a6ff]' },
                    { text: '}', color: 'text-white' }
                  ].map((line, idx) => (
                    <div 
                      key={idx} 
                      className={`flex gap-3 pl-2 transition-colors duration-500 rounded py-0.5 ${
                        activeCodeLine === idx ? 'bg-[#1f6feb]/10 border-l-2 border-[#1f6feb] -ml-2' : ''
                      }`}
                    >
                      <span className="text-gray-600 text-right w-5 select-none">{idx + 1}</span>
                      <span className={`${line.color || 'text-gray-300'} whitespace-pre`}>{line.text}</span>
                    </div>
                  ))}
                  
                  {/* Glowing absolute effect */}
                  <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#1f6feb]/10 rounded-full blur-2xl pointer-events-none" />
                </div>
              </div>
              
              {/* Editor bottom status bar */}
              <div className="bg-[#161b22] h-6 flex items-center px-4 justify-between font-mono text-[10px] text-gray-400 border-t border-[#30363d]">
                <div className="flex gap-4">
                  <span>main*</span>
                  <span>UTF-8</span>
                </div>
                <div className="flex gap-4">
                  <span>Fiber Go SDK v2.52.2</span>
                  <span>Active Block: #{activeBlock}</span>
                </div>
              </div>
            </div>
          </div>
          
        </section>

        {/* Feature Bento Grid */}
        <section id="bento" className="mb-32">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-headline-md text-3xl md:text-4xl font-extrabold text-white">
              Everything Needed for Go & Fiber
            </h2>
            <p className="text-gray-400 font-body-md max-w-lg mx-auto">
              The most comprehensive cloud sandbox environment for building and launching web applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[160px]">
            {/* Isolated Sandboxes (Medium Box) */}
            <div className="md:col-span-2 md:row-span-1 bg-[#161b22]/70 border border-[#30363d] p-6 rounded-xl flex flex-col justify-between hover:bg-[#1f2631] hover:border-[#58a6ff]/40 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="bg-[#1f6feb]/10 p-2.5 rounded-lg border border-[#1f6feb]/20 text-[#58a6ff]">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-white">Isolated Sandboxes</h3>
                  <p className="text-xs text-gray-400 mt-1">Every project runs in its own secure, isolated kernel-level container.</p>
                </div>
              </div>
            </div>

            {/* Fiber Nodes (Tall Box) */}
            <div className="md:col-span-1 md:row-span-2 bg-[#161b22]/70 border border-[#30363d] p-6 rounded-xl flex flex-col justify-between hover:bg-[#1f2631] hover:border-[#58a6ff]/40 transition-all cursor-pointer relative overflow-hidden">
              <div className="space-y-4 z-10">
                <div className="bg-[#58a6ff]/10 p-2.5 rounded-lg border border-[#58a6ff]/20 text-[#58a6ff] w-fit">
                  <Cpu className="h-5 w-5" />
                </div>
                <h3 className="font-headline-sm text-base font-bold text-white">Simulated P2P Node</h3>
                <p className="text-xs text-gray-400">Instant access to local simulated nodes with custom block mining and state inspection.</p>
              </div>
              <div className="bg-[#0d1117] border border-[#30363d] p-2.5 rounded text-[10px] font-mono text-[#58a6ff] z-10 mt-4">
                RPC STATUS: ACTIVE
                <div className="text-emerald-400 mt-1">● 127.0.0.1:3000</div>
              </div>
              <div className="absolute right-0 bottom-0 w-32 h-32 bg-[#58a6ff]/5 rounded-full blur-xl pointer-events-none" />
            </div>

            {/* Git Engine (Small Box) */}
            <div className="md:col-span-1 md:row-span-1 bg-[#161b22]/70 border border-[#30363d] p-6 rounded-xl flex flex-col justify-between hover:bg-[#1f2631] hover:border-[#58a6ff]/40 transition-all cursor-pointer">
              <div className="flex flex-col h-full justify-between">
                <div className="bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 text-amber-400 w-fit">
                  <GitFork className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-headline-sm text-sm font-bold text-white mt-2">Git Engine</h3>
                  <p className="text-[11px] text-gray-400 mt-1">Native branch management & git merge tracking.</p>
                </div>
              </div>
            </div>

            {/* Debugger (Wide Box) */}
            <div className="md:col-span-2 md:row-span-1 bg-[#161b22]/70 border border-[#30363d] p-6 rounded-xl flex items-center gap-6 hover:bg-[#1f2631] hover:border-[#58a6ff]/40 transition-all cursor-pointer">
              <div className="hidden sm:flex bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 text-rose-400">
                <Bug className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-headline-sm text-base font-bold text-white">Advanced Diagnostic Debugger</h3>
                <p className="text-xs text-gray-400">
                  Step through code execution, trace variables, and inspect raw transaction logs with zero local setup latency.
                </p>
              </div>
            </div>

            {/* Cloud Terminal (Small Box) */}
            <div className="md:col-span-1 md:row-span-1 bg-[#161b22]/70 border border-[#30363d] p-6 rounded-xl flex flex-col justify-between hover:bg-[#1f2631] hover:border-[#58a6ff]/40 transition-all cursor-pointer">
              <div className="flex flex-col h-full justify-between">
                <div className="bg-sky-400/10 p-2 rounded-lg border border-sky-400/20 text-sky-400 w-fit">
                  <Terminal className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="font-headline-sm text-sm font-bold text-white mt-2">Cloud Terminal</h3>
                  <p className="text-[11px] text-gray-400 mt-1">Full terminal access inside sandbox containers.</p>
                </div>
              </div>
            </div>

            {/* Instant Deploy (Small Box) */}
            <div className="md:col-span-1 md:row-span-1 bg-[#238636]/10 border border-[#238636]/20 p-6 rounded-xl flex flex-col justify-between hover:bg-[#238636]/15 hover:border-[#2ea043]/40 transition-all cursor-pointer">
              <div className="flex flex-col h-full justify-between">
                <div className="bg-white/10 p-2 rounded-lg border border-white/20 text-white w-fit">
                  <CloudLightning className="h-4.5 w-4.5 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-headline-sm text-sm font-bold text-white mt-2">Instant Deployment</h3>
                  <p className="text-[11px] text-emerald-400 mt-1">Deploy handlers to node in 1 quick click.</p>
                </div>
              </div>
            </div>

            {/* Collaboration (Medium Box) */}
            <div className="md:col-span-2 md:row-span-1 bg-[#161b22]/70 border border-[#30363d] p-6 rounded-xl flex justify-between items-center hover:bg-[#1f2631] hover:border-[#58a6ff]/40 transition-all cursor-pointer">
              <div className="space-y-1 pr-4">
                <h3 className="font-headline-sm text-base font-bold text-white">Low-Latency Collaboration</h3>
                <p className="text-xs text-gray-400">Share workspaces and live-code together with low-latency cursor tracking.</p>
              </div>
              <div className="flex -space-x-3 select-none shrink-0">
                <div className="w-10 h-10 rounded-full border-2 border-[#0d1117] bg-[#161b22] flex items-center justify-center font-bold text-xs text-gray-300 shadow">JD</div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0d1117] bg-[#1f6feb] flex items-center justify-center font-bold text-xs text-white shadow">SK</div>
                <div className="w-10 h-10 rounded-full border-2 border-[#0d1117] bg-[#58a6ff] flex items-center justify-center font-bold text-xs text-[#0d1117] shadow">ML</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-[#161b22]/80 border border-[#30363d] p-12 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <div className="w-full h-full bg-gradient-to-l from-[#1f6feb] to-transparent" />
          </div>
          
          <div className="max-w-2xl relative z-10 space-y-6">
            <h2 className="font-headline-md text-3xl md:text-4xl font-black text-white leading-tight">
              Ready to ship your next high-performance dApp?
            </h2>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed">
              Join 15,000+ developers building on FiberDev Studio. No setup, no servers, and no payment required to start your first sandbox.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={onStartBuilding}
                className="bg-white hover:bg-gray-100 text-[#0d1117] px-8 py-3.5 rounded font-bold text-sm transition-all active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg"
              >
                Create Free Project
                <ArrowRight className="h-4 w-4" />
              </button>
              <button 
                onClick={onStartBuilding}
                className="text-[#58a6ff] flex items-center gap-2 font-bold text-sm hover:text-white transition-colors group cursor-pointer"
              >
                View Sample Codes
                <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
