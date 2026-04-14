"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Clipboard, 
  Check, 
  User, 
  FileText, 
  Zap, 
  Layout, 
  Trash2,
  Sparkles,
  ArrowRight,
  Target,
  Trophy,
  Palette,
  Monitor,
  Cpu,
  Feather,
  type LucideIcon
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import gsap from "gsap";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ThemeMode = "modern" | "sporty" | "minimal" | "futuristic";

const THEMES: Record<ThemeMode, { 
  label: string; 
  icon: LucideIcon; 
  class: string;
  description: string;
}> = {
  modern: { label: "Modern", icon: Monitor, class: "theme-modern", description: "Structured & Clean" },
  sporty: { label: "Sporty", icon: Target, class: "theme-sporty", description: "High Energy & Bold" },
  minimal: { label: "Minimal", icon: Feather, class: "theme-minimal", description: "Soft & Simple" },
  futuristic: { label: "Futuristic", icon: Cpu, class: "theme-futuristic", description: "Cyber & Tech" },
};

const PROMPT_DATA = {
  Role: [
    { id: "expert", label: "Expert", snippet: "당신은 세계 최고의 전문가입니다.", desc: "Professional" },
    { id: "creative", label: "Creative", snippet: "당신은 상상력이 풍부한 예술가입니다.", desc: "Artistic" },
    { id: "mentor", label: "Mentor", snippet: "당신은 친절한 교육자입니다.", desc: "Kind" },
    { id: "critic", label: "Critic", snippet: "당신은 날카로운 비평가입니다.", desc: "Strict" },
  ],
  Task: [
    { id: "explain", label: "Explain", snippet: "이 개념을 명확하게 설명하세요.", desc: "Clarity" },
    { id: "write", label: "Write", snippet: "매력적인 기사를 작성하세요.", desc: "Content" },
    { id: "code", label: "Code", snippet: "최적화된 코드를 작성하세요.", desc: "Logic" },
    { id: "summarize", label: "Summarize", snippet: "핵심 요약을 제공하세요.", desc: "Summary" },
  ],
  Tone: [
    { id: "professional", label: "Professional", snippet: "격식 있는 어조를 사용하세요.", desc: "Formal" },
    { id: "friendly", label: "Friendly", snippet: "친근한 어조를 사용하세요.", desc: "Warm" },
    { id: "humorous", label: "Humorous", snippet: "유머를 섞어서 답변하세요.", desc: "Witty" },
    { id: "analytical", label: "Analytical", snippet: "분석적인 어조를 사용하세요.", desc: "Data" },
  ],
  Format: [
    { id: "bullet", label: "Bullets", snippet: "불렛 포인트로 작성하세요.", desc: "List" },
    { id: "step", label: "Steps", snippet: "단계별로 가이드하세요.", desc: "Process" },
    { id: "markdown", label: "Markdown", snippet: "마크다운 형식을 사용하세요.", desc: "Rich" },
    { id: "essay", label: "Essay", snippet: "에세이 형식으로 작성하세요.", desc: "Depth" },
  ],
};

type Category = keyof typeof PROMPT_DATA;

const categories: { name: Category; icon: LucideIcon; color: string }[] = [
  { name: "Role", icon: User, color: "text-blue-500" },
  { name: "Task", icon: Zap, color: "text-yellow-500" },
  { name: "Tone", icon: FileText, color: "text-emerald-500" },
  { name: "Format", icon: Layout, color: "text-purple-500" },
];

export default function PromptMaker() {
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>("modern");
  const [selected, setSelected] = useState<Record<Category, string[]>>({
    Role: [], Task: [], Tone: [], Format: [],
  });
  const [isCopied, setIsCopied] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Theme change animation
  useEffect(() => {
    document.body.className = THEMES[currentTheme].class;
    
    // Initial entrance animations
    const ctx = gsap.context(() => {
      gsap.from(heroRef.current, { opacity: 0, y: 30, duration: 1, ease: "power3.out" });
      gsap.from(".category-card", { 
        opacity: 0, 
        y: 20, 
        stagger: 0.1, 
        duration: 0.8, 
        delay: 0.3,
        ease: "back.out(1.7)" 
      });
      gsap.from(previewRef.current, { opacity: 0, x: 20, duration: 1, delay: 0.6, ease: "power3.out" });
    }, mainRef);

    return () => ctx.revert();
  }, [currentTheme]);

  const handleSelect = (category: Category, id: string) => {
    setSelected((prev) => {
      const current = prev[category];
      const isSelected = current.includes(id);
      return {
        ...prev,
        [category]: isSelected ? current.filter((item) => item !== id) : [...current, id],
      };
    });
  };

  const generatedPrompt = useMemo(() => {
    const parts: string[] = [];
    const roles = selected.Role.map(id => PROMPT_DATA.Role.find(r => r.id === id)?.snippet);
    if (roles.length) parts.push(roles.join(" "));
    const tasks = selected.Task.map(id => PROMPT_DATA.Task.find(t => t.id === id)?.snippet);
    if (tasks.length) parts.push(tasks.join(" "));
    const tones = selected.Tone.map(id => PROMPT_DATA.Tone.find(t => t.id === id)?.snippet);
    if (tones.length) parts.push(`Tone: ${tones.join(" ")}`);
    const formats = selected.Format.map(id => PROMPT_DATA.Format.find(f => f.id === id)?.snippet);
    if (formats.length) parts.push(`Format: ${formats.join(" ")}`);
    return parts.join("\n\n");
  }, [selected]);

  const resetAll = () => setSelected({ Role: [], Task: [], Tone: [], Format: [] });

  return (
    <div ref={mainRef} className="min-h-screen transition-all duration-500 overflow-x-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none opacity-10 dark:opacity-20">
        {currentTheme === "futuristic" && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-blue-900 animate-flow" />
        )}
        {currentTheme === "sporty" && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#facc15_0,transparent_50%)] opacity-10" />
        )}
      </div>

      <header className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between max-w-7xl">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-[var(--radius)] transition-all",
              currentTheme === "sporty" ? "bg-[var(--accent)] skew-x-[-12deg]" : "bg-[var(--accent)]"
            )}>
              <Sparkles className={cn(currentTheme === "sporty" ? "text-black" : "text-white")} size={20} />
            </div>
            <span className={cn(
              "text-xl font-black italic tracking-tighter uppercase transition-all",
              currentTheme === "sporty" && "skew-x-[-6deg]"
            )}>
              PromptCraft <span className="text-[var(--accent)]">X</span>
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex bg-[var(--card-bg)] border border-[var(--card-border)] rounded-full p-1 gap-1">
              {(Object.keys(THEMES) as ThemeMode[]).map((t) => {
                const T = THEMES[t];
                const isActive = currentTheme === t;
                return (
                  <button
                    key={t}
                    onClick={() => setCurrentTheme(t)}
                    className={cn(
                      "p-2 rounded-full transition-all flex items-center gap-2 px-3",
                      isActive ? "bg-[var(--accent)] text-white shadow-lg" : "hover:bg-[var(--bg)] text-muted-foreground"
                    )}
                    title={T.label}
                  >
                    <T.icon size={16} />
                    <span className="hidden lg:block text-xs font-bold uppercase">{T.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-7xl relative z-10">
        {/* Hero */}
        <div ref={heroRef} className="max-w-4xl mb-20 space-y-6">
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all",
            currentTheme === "sporty" ? "bg-[var(--accent)] text-black skew-x-[-12deg]" : "bg-[var(--accent)]/10 text-[var(--accent)]"
          )}>
            <Trophy size={14} /> Performance Unleashed
          </div>
          <h1 className={cn(
            "text-5xl md:text-7xl lg:text-8xl font-black transition-all leading-[0.9] uppercase tracking-tighter",
            currentTheme === "sporty" && "skew-x-[-4deg] italic",
            currentTheme === "minimal" && "font-light tracking-normal lowercase capitalize"
          )}>
            Design the <br />
            <span className={cn(
              "text-transparent bg-clip-text bg-gradient-to-r transition-all",
              currentTheme === "futuristic" ? "from-purple-400 to-cyan-400" : "from-[var(--accent)] to-[var(--accent)] opacity-80"
            )} style={currentTheme === "modern" ? { WebkitTextStroke: '1px var(--fg)' } : {}}>
              Ultimate
            </span> <br />
            Prompt.
          </h1>
          <p className="text-lg md:text-xl opacity-60 max-w-2xl font-medium leading-relaxed">
            {THEMES[currentTheme].description}. 조합을 선택하고 당신만의 AI 전략을 완성하세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Grid */}
          <div ref={gridRef} className="lg:col-span-8 space-y-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {categories.map((cat) => (
                <div key={cat.name} className="category-card space-y-6">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-[var(--radius)] bg-[var(--card-bg)] border border-[var(--card-border)]", cat.color)}>
                      <cat.icon size={20} />
                    </div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] opacity-40">{cat.name}</h2>
                  </div>
                  
                  <div className="grid gap-3">
                    {PROMPT_DATA[cat.name].map((option) => {
                      const isSelected = selected[cat.name].includes(option.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleSelect(cat.name, option.id)}
                          className={cn(
                            "group text-left p-4 border transition-all duration-300 relative overflow-hidden",
                            isSelected 
                              ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-xl scale-[1.02] z-10" 
                              : "bg-[var(--card-bg)] border-[var(--card-border)] hover:border-[var(--accent)]/50",
                            currentTheme === "sporty" && "skew-x-[-6deg]",
                            currentTheme === "minimal" && "rounded-2xl",
                            currentTheme === "modern" && "rounded-lg",
                            currentTheme === "futuristic" && "glass rounded-xl"
                          )}
                        >
                          <div className={cn("flex flex-col gap-0.5", currentTheme === "sporty" && "skew-x-[6deg]")}>
                            <div className="flex items-center justify-between">
                              <span className="font-black text-sm uppercase tracking-tight">{option.label}</span>
                              {isSelected && <Zap size={14} className="animate-pulse" />}
                            </div>
                            <span className="text-[10px] font-bold uppercase opacity-50 tracking-widest">{option.desc}</span>
                          </div>
                          {isSelected && currentTheme === "futuristic" && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-flow" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sticky Terminal */}
          <div ref={previewRef} className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
            <div className={cn(
              "p-8 border-2 transition-all duration-500 relative",
              currentTheme === "modern" && "bg-white dark:bg-zinc-900 border-zinc-200 rounded-2xl shadow-2xl",
              currentTheme === "sporty" && "bg-black border-l-[12px] border-[var(--accent)] shadow-[15px_15px_0px_0px_rgba(250,204,21,0.1)]",
              currentTheme === "minimal" && "bg-neutral-50 border-neutral-200 rounded-[3rem]",
              currentTheme === "futuristic" && "glass rounded-3xl border-white/10 shadow-[0_0_50px_-12px_rgba(139,92,246,0.3)]"
            )}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40">Preview</h3>
                </div>
                <button 
                  onClick={resetAll}
                  className="p-2 hover:text-red-500 transition-colors opacity-40 hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className={cn(
                "min-h-[300px] max-h-[500px] overflow-y-auto font-mono text-sm leading-relaxed transition-all",
                !generatedPrompt && "flex items-center justify-center text-center opacity-30 italic"
              )}>
                {generatedPrompt ? (
                  <div className="space-y-6">
                    {generatedPrompt.split('\n\n').map((para, i) => (
                      <p key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {para}
                      </p>
                    ))}
                    <div className="pt-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Output Encoded</span>
                    </div>
                  </div>
                ) : (
                  "Waiting for input sequence..."
                )}
              </div>

              <div className="mt-8">
                <button
                  onClick={() => {
                    if (!generatedPrompt) return;
                    navigator.clipboard.writeText(generatedPrompt).then(() => {
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    });
                  }}
                  disabled={!generatedPrompt}
                  className={cn(
                    "w-full py-5 font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3",
                    isCopied ? "bg-emerald-500 text-white" : "bg-[var(--fg)] text-[var(--bg)] hover:scale-[0.98] active:scale-95 disabled:opacity-10",
                    currentTheme === "sporty" && "skew-x-[-12deg]",
                    currentTheme === "minimal" && "rounded-full",
                    currentTheme === "modern" && "rounded-xl",
                    currentTheme === "futuristic" && "rounded-2xl shadow-[0_0_20px_rgba(139,92,246,0.5)]"
                  )}
                >
                  {isCopied ? (
                    <><Check size={20} /> Success</>
                  ) : (
                    <><Clipboard size={20} /> Copy Sequence</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-40 border-t border-[var(--card-border)] bg-[var(--card-bg)] py-20 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-3 opacity-30">
              <Sparkles size={24} />
              <span className="font-black italic text-3xl tracking-tighter uppercase">PromptCraft</span>
            </div>
            <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
              <a href="#" className="hover:text-[var(--accent)]">Github</a>
              <a href="#" className="hover:text-[var(--accent)]">Twitter</a>
              <a href="#" className="hover:text-[var(--accent)]">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
