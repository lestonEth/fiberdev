import { useState, useEffect, FormEvent } from "react";
import { 
  Terminal, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Github, 
  ArrowRight, 
  Sparkles, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  Eye,
  EyeOff
} from "lucide-react";

interface AuthViewProps {
  onAuthSuccess: (user: { email: string; username: string; avatar: string; provider: string }) => void;
  onBypass: () => void;
}

export default function AuthView({ onAuthSuccess, onBypass }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  // Status and Error states
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOAuthLoading, setIsOAuthLoading] = useState<boolean>(false);

  // Clear messages on tab change
  useEffect(() => {
    setError("");
    setSuccess("");
  }, [isLogin]);

  // Handle message from OAuth Popup (GitHub)
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      // Allow from AI Studio preview or localhost
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.user) {
        setIsOAuthLoading(false);
        setSuccess(`Successfully authenticated via GitHub as ${event.data.user.username}!`);
        setTimeout(() => {
          onAuthSuccess(event.data.user);
        }, 1200);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [onAuthSuccess]);

  // Handle GitHub OAuth Popup trigger
  const handleGithubOAuth = async () => {
    setError("");
    setIsOAuthLoading(true);
    try {
      const response = await fetch('/api/auth/github/url');
      if (!response.ok) {
        throw new Error('Could not retrieve GitHub OAuth authorization URL.');
      }
      const { url } = await response.json();
      
      // Open popup with appropriate sizing
      const width = 500;
      const height = 650;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      const popup = window.open(
        url,
        'github_oauth_popup',
        `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=yes`
      );

      if (!popup) {
        setError("Popup was blocked by your browser. Please allow popups to connect with GitHub.");
        setIsOAuthLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to trigger GitHub authorization");
      setIsOAuthLoading(false);
    }
  };

  // Credentials Submission Form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!email || !password || (!isLogin && !username)) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const payload = isLogin ? { email, password } : { email, username, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Authentication failed. Please verify credentials.");
      }

      setSuccess(isLogin ? "Welcome back! Signing in..." : "Account created successfully! Booting workspace...");
      setTimeout(() => {
        onAuthSuccess(data.user);
      }, 1500);

    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1f6feb]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ff7b72]/5 rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(#30363d_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

      {/* Main card */}
      <div className="w-full max-w-md bg-[#161b22]/80 backdrop-blur-xl border border-[#30363d] rounded-3xl overflow-hidden shadow-2xl relative z-10 transition-all">
        
        {/* Header decoration */}
        <div className="h-1.5 bg-gradient-to-r from-[#1f6feb] via-[#58a6ff] to-[#238636]" />

        {/* Branding & Switch tabs */}
        <div className="px-8 pt-8 pb-6 text-center">
          <div className="inline-flex items-center gap-2 mb-3 bg-[#1f6feb]/10 px-3 py-1.5 rounded-2xl border border-[#1f6feb]/20">
            <Terminal className="h-4 w-4 text-[#58a6ff] animate-pulse" />
            <span className="font-mono text-xs text-[#58a6ff] font-bold uppercase tracking-wider">FiberDev Workspace</span>
          </div>
          <h2 className="font-headline-sm text-2xl font-black text-white tracking-tight">
            {isLogin ? "Welcome Back Developer" : "Create Developer Account"}
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            {isLogin ? "Sign in to deploy microservices and manage nodes" : "Register to access the high-performance local sandbox"}
          </p>

          {/* Toggle Tab */}
          <div className="flex bg-[#0d1117] p-1 rounded-xl mt-6 border border-[#30363d]/60">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                isLogin 
                  ? "bg-[#1f6feb] text-white shadow" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
                !isLogin 
                  ? "bg-[#1f6feb] text-white shadow" 
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Content & Forms */}
        <div className="px-8 pb-8">
          
          {/* Status Banners */}
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-start gap-2 animate-fade-in">
              <CheckCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          {/* Core Credentials Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username for Sign Up only */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                  Username
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. go-developer"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117]/60 border border-[#30363d] rounded-xl text-xs focus:outline-none focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb] text-white"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#0d1117]/60 border border-[#30363d] rounded-xl text-xs focus:outline-none focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb] text-white"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-widest font-bold">
                  Password
                </label>
                {isLogin && (
                  <span className="text-[10px] text-[#58a6ff] hover:underline cursor-pointer">
                    Forgot?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 h-4 w-4 text-gray-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-[#0d1117]/60 border border-[#30363d] rounded-xl text-xs focus:outline-none focus:border-[#1f6feb] focus:ring-1 focus:ring-[#1f6feb] text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Action Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isOAuthLoading}
              className="w-full bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all active:scale-[0.98] shadow-lg shadow-[#238636]/15 flex items-center justify-center gap-1.5"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? "Sign In to Studio" : "Create My Account"}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Separator */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#30363d]/60"></div>
            </div>
            <span className="relative bg-[#161b22] px-3 font-mono text-[10px] uppercase text-gray-500 font-semibold tracking-wider">
              Or Social auth
            </span>
          </div>

          {/* Social Auth Option: GitHub */}
          <button
            type="button"
            onClick={handleGithubOAuth}
            disabled={isLoading || isOAuthLoading}
            className="w-full bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer relative group"
          >
            {isOAuthLoading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Github className="h-4 w-4 text-white" />
            )}
            <span>{isLogin ? "Sign in with GitHub" : "Sign up with GitHub"}</span>
            <div className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1f6feb] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1f6feb]"></span>
            </div>
          </button>

          {/* Safe environment note */}
          <div className="mt-6 flex gap-2 items-start p-3 bg-gray-800/10 rounded-xl border border-gray-800/50 text-[10px] text-gray-500 font-mono">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              Your session is secured within this local sandbox. Sign up to unlock persistent workspace files & Go-compiler diagnostics.
            </span>
          </div>

          {/* Bypass Guest option */}
          <div className="mt-5 text-center">
            <button
              onClick={onBypass}
              className="text-gray-400 hover:text-[#58a6ff] text-xs font-semibold hover:underline"
            >
              Skip & Continue as Guest
            </button>
          </div>

        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="mt-6 text-center text-gray-600 text-[10px] font-mono">
        FiberDev Studio Core v1.2.0 • Secured TLS Authorization
      </div>

    </div>
  );
}
