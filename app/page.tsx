"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Clipboard, 
  Check, 
  Moon, 
  Sun, 
  User, 
  FileText, 
  Zap, 
  Layout, 
  Trash2,
  RefreshCw
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- PROMPT_DATA ---
const PROMPT_DATA = {
  Role: [
    { id: "expert", label: "Expert", snippet: "Act as a world-class expert in this field." },
    { id: "creative", label: "Creative", snippet: "Act as a creative visionary with a unique perspective." },
    { id: "mentor", label: "Mentor", snippet: "Act as a supportive mentor and teacher." },
    { id: "critic", label: "Critic", snippet: "Act as a rigorous critic focused on precision and logic." },
  ],
  Task: [
    { id: "explain", label: "Explain", snippet: "Explain the following concept clearly and concisely." },
    { id: "write", label: "Write", snippet: "Write a detailed and engaging article about the topic." },
    { id: "code", label: "Code", snippet: "Write high-quality, documented code for the requested feature." },
    { id: "summarize", label: "Summarize", snippet: "Provide a comprehensive summary of the main points." },
  ],
  Tone: [
    { id: "professional", label: "Professional", snippet: "Maintain a professional and formal tone." },
    { id: "friendly", label: "Friendly", snippet: "Use a warm, conversational, and friendly tone." },
    { id: "humorous", label: "Humorous", snippet: "Incorporate wit and a lighthearted, humorous tone." },
    { id: "analytical", label: "Analytical", snippet: "Be analytical, objective, and data-driven." },
  ],
  Format: [
    { id: "bullet", label: "Bullet Points", snippet: "Format the output using clear bullet points." },
    { id: "step", label: "Step-by-Step", snippet: "Present the information as a logical step-by-step guide." },
    { id: "markdown", label: "Markdown", snippet: "Use structured Markdown with headers and tables where appropriate." },
    { id: "essay", label: "Essay", snippet: "Write the response as a well-structured multi-paragraph essay." },
  ],
};

type Category = keyof typeof PROMPT_DATA;

export default function PromptMaker() {
  const [selected, setSelected] = useState<Record<Category, string[]>>({
    Role: [],
    Task: [],
    Tone: [],
    Format: [],
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Load dark mode preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSelect = (category: Category, id: string) => {
    setSelected((prev) => {
      const current = prev[category];
      const isSelected = current.includes(id);
      return {
        ...prev,
        [category]: isSelected 
          ? current.filter((item) => item !== id) 
          : [...current, id],
      };
    });
  };

  const generatedPrompt = useMemo(() => {
    const parts: string[] = [];
    
    // Add Role
    const roles = selected.Role.map(id => PROMPT_DATA.Role.find(r => r.id === id)?.snippet);
    if (roles.length) parts.push(roles.join(" "));

    // Add Task
    const tasks = selected.Task.map(id => PROMPT_DATA.Task.find(t => t.id === id)?.snippet);
    if (tasks.length) parts.push(tasks.join(" "));

    // Add Tone
    const tones = selected.Tone.map(id => PROMPT_DATA.Tone.find(t => t.id === id)?.snippet);
    if (tones.length) parts.push(`Constraints: ${tones.join(" ")}`);

    // Add Format
    const formats = selected.Format.map(id => PROMPT_DATA.Format.find(f => f.id === id)?.snippet);
    if (formats.length) parts.push(`Output Format: ${formats.join(" ")}`);

    return parts.join("\n\n");
  }, [selected]);

  const copyToClipboard = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const resetAll = () => {
    setSelected({
      Role: [],
      Task: [],
      Tone: [],
      Format: [],
    });
  };

  const categories: { name: Category; icon: any }[] = [
    { name: "Role", icon: User },
    { name: "Task", icon: Zap },
    { name: "Tone", icon: FileText },
    { name: "Format", icon: Layout },
  ];

  return (
    <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto max-w-6xl">
          <div className="flex items-center gap-2">
            <div className="p-2 text-white rounded-lg bg-blue-600 shadow-lg shadow-blue-500/20">
              <Zap size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Prompt Maker</h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className="p-2 transition-colors rounded-full hover:bg-muted"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="container px-4 py-8 mx-auto max-w-6xl space-y-8">
        {/* Selection Area */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => (
            <div key={cat.name} className="space-y-4">
              <div className="flex items-center gap-2 font-semibold">
                <cat.icon size={18} className="text-blue-500" />
                <h2>{cat.name}</h2>
              </div>
              <div className="grid gap-3">
                {PROMPT_DATA[cat.name].map((option) => {
                  const isSelected = selected[cat.name].includes(option.id);
                  return (
                    <label
                      key={option.id}
                      className={cn(
                        "relative flex items-center p-4 transition-all duration-200 border rounded-xl cursor-pointer group hover:shadow-md",
                        isSelected 
                          ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/20" 
                          : "border-border bg-card hover:border-blue-400/50"
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={isSelected}
                        onChange={() => handleSelect(cat.name, option.id)}
                      />
                      <div className="flex flex-col flex-1 gap-1">
                        <span className={cn(
                          "font-medium transition-colors",
                          isSelected ? "text-blue-600 dark:text-blue-400" : "text-foreground"
                        )}>
                          {option.label}
                        </span>
                      </div>
                      <div className={cn(
                        "w-5 h-5 flex items-center justify-center rounded-md border transition-all",
                        isSelected 
                          ? "bg-blue-500 border-blue-500 text-white" 
                          : "border-muted-foreground/30 text-transparent group-hover:border-blue-400"
                      )}>
                        <Check size={14} strokeWidth={3} />
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Preview Area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Generated Prompt</h2>
            <div className="flex gap-2">
              <button
                onClick={resetAll}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors border rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 border-border"
              >
                <Trash2 size={16} />
                Reset
              </button>
              <button
                onClick={copyToClipboard}
                disabled={!generatedPrompt}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 text-sm font-medium text-white transition-all rounded-lg disabled:opacity-50 disabled:cursor-not-allowed",
                  isCopied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/25"
                )}
              >
                {isCopied ? <Check size={16} /> : <Clipboard size={16} />}
                {isCopied ? "Copied!" : "Copy Prompt"}
              </button>
            </div>
          </div>

          <div className={cn(
            "relative min-h-[200px] p-6 border rounded-2xl transition-all",
            generatedPrompt 
              ? "bg-muted/30 border-blue-200 dark:border-blue-900/30" 
              : "bg-muted/10 border-dashed border-muted-foreground/20 flex items-center justify-center"
          )}>
            {generatedPrompt ? (
              <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed text-foreground/90 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {generatedPrompt}
              </pre>
            ) : (
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <RefreshCw size={32} className="opacity-20 animate-spin-slow" />
                <p>Select options above to generate a prompt...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="py-12 border-t mt-12">
        <div className="container px-4 mx-auto text-center text-sm text-muted-foreground">
          <p>© 2026 Prompt Maker. Built with Next.js and Tailwind CSS.</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
