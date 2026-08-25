"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Briefcase, Building2, Plus, Sparkles, LayoutGrid, List,
  ArrowUpRight, DollarSign, Globe, CheckCircle2, ShieldCheck, X,
  Sun, Moon, Code2, Palette, LineChart, Layers, Database
} from "lucide-react";
import { FaGithub, FaXTwitter, FaLinkedin, FaDiscord } from "react-icons/fa6";

type Job = {
  id: number;
  source_id: string;
  title: string;
  company: string;
  salary: number;
  url: string;
  description?: string;
  location?: string;
};

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");

  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeFilter, setActiveFilter] = useState<"all" | "companies">("all");
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [newJob, setNewJob] = useState({ title: "", company: "", salary: "", url: "" });
  const [viewMode, setViewMode] = useState<"card" | "list">("card");

  const PAGE_SIZE = 9;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/jobs?limit=100&offset=0`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching jobs:", err);
        setError(true);
        setLoading(false);
      });
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      return (
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [jobs, search]);

  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE) || 1;

  const displayedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredJobs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredJobs, currentPage]);

  const companySummary = useMemo(() => {
    const map = new Map<string, number>();
    jobs.forEach((job) => {
      map.set(job.company, (map.get(job.company) || 0) + 1);
    });
    return Array.from(map.entries()).map(([company, count]) => ({ company, count }));
  }, [jobs]);

  const initials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  // Helper function to pick job domain icons based on title keywords
  const getJobIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("dev") || lower.includes("engineer") || lower.includes("code") || lower.includes("stack") || lower.includes("frontend") || lower.includes("backend")) {
      return <Code2 className="w-5 h-5 text-indigo-400" />;
    }
    if (lower.includes("design") || lower.includes("ui") || lower.includes("ux") || lower.includes("art")) {
      return <Palette className="w-5 h-5 text-pink-400" />;
    }
    if (lower.includes("market") || lower.includes("growth") || lower.includes("sales") || lower.includes("seo")) {
      return <LineChart className="w-5 h-5 text-amber-400" />;
    }
    if (lower.includes("product") || lower.includes("manager") || lower.includes("lead")) {
      return <Layers className="w-5 h-5 text-cyan-400" />;
    }
    if (lower.includes("data") || lower.includes("analyst") || lower.includes("ai") || lower.includes("machine")) {
      return <Database className="w-5 h-5 text-emerald-400" />;
    }
    return <Briefcase className="w-5 h-5 text-indigo-400" />;
  };

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.company) return;

    const createdJob: Job = {
      id: Date.now(),
      source_id: `custom_${Date.now()}`,
      title: newJob.title,
      company: newJob.company,
      salary: Number(newJob.salary) || 0,
      url: newJob.url || "#",
      description: "Direct community posted role.",
    };

    setJobs([createdJob, ...jobs]);
    setNewJob({ title: "", company: "", salary: "", url: "" });
    setShowPostJobModal(false);
    setActiveFilter("all");
    setCurrentPage(1);
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 relative overflow-hidden ${
        isDark ? "bg-[#0b0f19] text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Background Glows */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] blur-3xl pointer-events-none -z-10 ${
          isDark
            ? "bg-gradient-to-b from-indigo-600/20 via-cyan-500/10 to-transparent"
            : "bg-gradient-to-b from-indigo-200/50 via-cyan-200/30 to-transparent"
        }`}
      />

      {/* NAVBAR */}
      <nav className={`border-b sticky top-0 z-40 backdrop-blur-md ${isDark ? "border-slate-800/80 bg-slate-950/70" : "border-slate-200 bg-white/70"}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveFilter("all")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20">
              R
            </div>
            <span className={`text-xl font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              Rozgar<span className="text-indigo-500">.io</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Switcher Button */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2.5 rounded-xl border transition-all ${
                isDark 
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800" 
                  : "bg-slate-100 border-slate-300 text-indigo-600 hover:bg-slate-200"
              }`}
              title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setShowPostJobModal(true)}
              className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-xs transition-all"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 rounded-xl animate-gradient" />
              <span className={`relative block px-5 py-2.5 rounded-[11px] transition-all flex items-center gap-2 ${
                isDark ? "bg-slate-950 text-white group-hover:bg-opacity-80" : "bg-white text-slate-900 group-hover:bg-opacity-90"
              }`}>
                <Plus className="w-4 h-4 text-indigo-500" />
                <span>Post a Job</span>
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative pt-16 pb-12 px-6 text-center max-w-4xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border ${
            isDark 
              ? "bg-slate-900/80 text-cyan-400 border-cyan-500/30" 
              : "bg-indigo-50 text-indigo-600 border-indigo-200"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>Real-time Verified Remote Listings</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
        >
          Build Your Career From Anywhere In The <span className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 bg-clip-text text-transparent">World</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`font-medium text-base sm:text-lg max-w-2xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}
        >
          Streamlined remote roles fetched from top global engineering and design hubs.
        </motion.p>

        {/* CONTROLS & SEARCH */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="pt-4 space-y-4 max-w-2xl mx-auto"
        >
          <div className={`flex flex-wrap items-center justify-center gap-2 p-1.5 border rounded-2xl backdrop-blur-md ${
            isDark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200 shadow-sm"
          }`}>
            <button
              onClick={() => { setActiveFilter("all"); setSearch(""); setCurrentPage(1); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === "all"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : isDark ? "text-slate-400 hover:text-white hover:bg-slate-800/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Briefcase className="w-4 h-4" /> All Remote Jobs
            </button>

            <button
              onClick={() => setActiveFilter("companies")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === "companies"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : isDark ? "text-slate-400 hover:text-white hover:bg-slate-800/50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <Building2 className="w-4 h-4" /> Top Companies
            </button>
          </div>

          {activeFilter === "all" && (
            <div className="relative group">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                isDark ? "text-slate-500 group-focus-within:text-cyan-400" : "text-slate-400 group-focus-within:text-indigo-600"
              }`} />
              <input
                type="text"
                placeholder="Search engineering, design, or company name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full border rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                  isDark 
                    ? "bg-slate-900/90 border-slate-800 text-slate-100 placeholder-slate-500 shadow-2xl" 
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm"
                }`}
              />
            </div>
          )}
        </motion.div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        {activeFilter === "companies" ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Building2 className="text-indigo-500 w-5 h-5" /> Active Hiring Partners
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {companySummary.map(({ company, count }) => (
                <motion.div
                  whileHover={{ y: -5, scale: 1.01 }}
                  key={company}
                  onClick={() => {
                    setSearch(company);
                    setActiveFilter("all");
                    setCurrentPage(1);
                  }}
                  className={`p-5 rounded-2xl border cursor-pointer flex items-center justify-between group transition-all ${
                    isDark ? "bg-slate-900/50 border-slate-800/80 hover:border-slate-700" : "bg-white border-slate-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black ${
                      isDark ? "bg-slate-800 border-slate-700 text-indigo-400" : "bg-indigo-50 border-indigo-100 text-indigo-600"
                    }`}>
                      {initials(company)}
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${isDark ? "text-slate-200 group-hover:text-cyan-300" : "text-slate-900 group-hover:text-indigo-600"}`}>
                        {company}
                      </h3>
                      <p className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}>Verified Partner</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                    isDark ? "bg-slate-800 text-cyan-400 border-slate-700" : "bg-indigo-50 text-indigo-600 border-indigo-100"
                  }`}>
                    {count} {count === 1 ? "role" : "roles"}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className={`flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 p-4 rounded-2xl border ${
              isDark ? "bg-slate-900/50 border-slate-800/80" : "bg-white border-slate-200 shadow-sm"
            }`}>
              <span className={`text-xs font-bold flex items-center gap-2 ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Showing <span className={isDark ? "text-white" : "text-slate-900"}>{displayedJobs.length}</span> of <span className={isDark ? "text-white" : "text-slate-900"}>{filteredJobs.length}</span> remote opportunities
              </span>

              <div className={`flex items-center gap-1 p-1 rounded-xl border ${
                isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200"
              }`}>
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "card" 
                      ? "bg-indigo-600 text-white shadow-md" 
                      : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg text-xs font-bold transition-all ${
                    viewMode === "list" 
                      ? "bg-indigo-600 text-white shadow-md" 
                      : isDark ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                <p className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>Fetching remote job board feed...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-20 text-rose-500 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                Failed to reach scraper API. Please verify backend status.
              </div>
            )}

            {!loading && !error && viewMode === "card" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedJobs.map((job, idx) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ y: -6 }}
                    onClick={() => setSelectedJob(job)}
                    className={`rounded-2xl p-6 flex flex-col justify-between cursor-pointer group border transition-all duration-300 ${
                      isDark 
                        ? "bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 shadow-xl" 
                        : "bg-white border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-xl"
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Company Initials Avatar */}
                          <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center font-black text-sm ${
                            isDark ? "bg-slate-800 border-slate-700/60 text-indigo-400" : "bg-indigo-50 border-indigo-100 text-indigo-600"
                          }`}>
                            {initials(job.company)}
                          </div>
                          
                          {/* Role Specific Domain Icon */}
                          <div className={`p-2.5 rounded-xl border ${
                            isDark ? "bg-slate-800/50 border-slate-700/40" : "bg-slate-50 border-slate-200"
                          }`}>
                            {getJobIcon(job.title)}
                          </div>
                        </div>

                        {job.salary > 0 && (
                          <span className="text-xs font-black bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            {job.salary.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div>
                        <h2 className={`font-bold text-lg transition-colors line-clamp-1 ${
                          isDark ? "text-slate-100 group-hover:text-cyan-300" : "text-slate-900 group-hover:text-indigo-600"
                        }`}>
                          {job.title}
                        </h2>
                        <p className={`text-xs font-medium mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>{job.company}</p>
                      </div>
                    </div>

                    <div className={`pt-6 mt-6 border-t flex items-center justify-between ${
                      isDark ? "border-slate-800/80" : "border-slate-100"
                    }`}>
                      <span className={`text-xs flex items-center gap-1 ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                        <Globe className="w-3.5 h-3.5 text-cyan-500" /> 100% Remote
                      </span>
                      <span className="text-xs font-bold text-indigo-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Details <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && !error && viewMode === "list" && (
              <div className="space-y-3">
                {displayedJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    whileHover={{ x: 4 }}
                    className={`rounded-2xl p-4 flex items-center gap-4 cursor-pointer group border transition-all ${
                      isDark 
                        ? "bg-slate-900/60 border-slate-800 hover:border-slate-700" 
                        : "bg-white border-slate-200 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-black text-sm shrink-0 ${
                      isDark ? "bg-slate-800 border-slate-700 text-indigo-400" : "bg-indigo-50 border-indigo-100 text-indigo-600"
                    }`}>
                      {initials(job.company)}
                    </div>

                    <div className="p-2 rounded-xl border hidden sm:block shrink-0 border-slate-700/30">
                      {getJobIcon(job.title)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h2 className={`font-bold truncate transition-colors ${
                        isDark ? "text-slate-100 group-hover:text-cyan-300" : "text-slate-900 group-hover:text-indigo-600"
                      }`}>
                        {job.title}
                      </h2>
                      <p className={`text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>{job.company}</p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      {job.salary > 0 && (
                        <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                          ${job.salary.toLocaleString()}
                        </span>
                      )}
                      <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors flex items-center gap-1 shadow-md">
                        View <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border disabled:opacity-40 disabled:cursor-not-allowed transition-all ${
                    isDark 
                      ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800" 
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === p
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                        : isDark ? "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border disabled:opacity-40 disabled:cursor-not-allowed transition-all ${
                    isDark 
                      ? "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800" 
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer className={`border-t mt-20 py-12 px-6 transition-colors ${
        isDark ? "border-slate-800/80 bg-slate-950/40" : "border-slate-200 bg-white"
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-black text-sm text-white">
              R
            </div>
            <span className={`text-sm font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              © 2026 Rozgar Inc. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              isDark ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400" : "bg-slate-100 border-slate-200 text-slate-600 hover:text-indigo-600"
            }`}>
              <FaXTwitter className="w-4 h-4" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              isDark ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-indigo-400" : "bg-slate-100 border-slate-200 text-slate-600 hover:text-indigo-600"
            }`}>
              <FaGithub className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              isDark ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-blue-400" : "bg-slate-100 border-slate-200 text-slate-600 hover:text-indigo-600"
            }`}>
              <FaLinkedin className="w-4 h-4" />
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
              isDark ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-purple-400" : "bg-slate-100 border-slate-200 text-slate-600 hover:text-indigo-600"
            }`}>
              <FaDiscord className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* POST JOB MODAL */}
      <AnimatePresence>
        {showPostJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`border rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 ${
                isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className={`flex justify-between items-center border-b pb-3 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-500" /> Post Remote Role
                </h3>
                <button onClick={() => setShowPostJobModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePostJobSubmit} className="space-y-4">
                <div>
                  <label className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Job Title *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className={`w-full mt-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Company Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Vercel"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    className={`w-full mt-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Annual Salary (USD)</label>
                  <input
                    type="number"
                    placeholder="e.g. 140000"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className={`w-full mt-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}>Application Link</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newJob.url}
                    onChange={(e) => setNewJob({ ...newJob, url: e.target.value })}
                    className={`w-full mt-1 px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDark ? "bg-slate-950 border-slate-800 text-white" : "bg-slate-50 border-slate-200 text-slate-900"
                    }`}
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPostJobModal(false)}
                    className={`px-4 py-2.5 text-xs font-bold rounded-xl border ${
                      isDark ? "border-slate-800 text-slate-400 hover:text-white" : "border-slate-200 text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
                  >
                    Publish Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* JOB DETAILS MODAL */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`border rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden ${
                isDark ? "bg-slate-900 border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className={`p-6 border-b flex items-start justify-between ${isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50"}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center font-black text-lg ${
                    isDark ? "bg-slate-800 border-slate-700 text-indigo-400" : "bg-indigo-50 border-indigo-100 text-indigo-600"
                  }`}>
                    {initials(selectedJob.company)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedJob.title}</h3>
                    <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>{selectedJob.company}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-slate-600 p-2">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed">
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Remote Verified
                  </span>
                  {selectedJob.salary > 0 && (
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full">
                      ${selectedJob.salary.toLocaleString()} / year
                    </span>
                  )}
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-base mb-2">Role Overview</h4>
                  {selectedJob.description ? (
                    <div
                      className={`prose max-w-none text-sm leading-relaxed ${isDark ? "prose-invert text-slate-300" : "text-slate-600"}`}
                      dangerouslySetInnerHTML={{ __html: selectedJob.description }}
                    />
                  ) : (
                    <p className={`italic ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                      No description provided. Click below to view the application portal directly.
                    </p>
                  )}
                </div>
              </div>

              <div className={`p-6 border-t flex items-center justify-between ${isDark ? "border-slate-800 bg-slate-950/40" : "border-slate-100 bg-slate-50"}`}>
                <button
                  onClick={() => setSelectedJob(null)}
                  className={`px-5 py-2.5 rounded-xl border font-bold transition-all ${
                    isDark ? "border-slate-800 text-slate-400 hover:text-white" : "border-slate-200 text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Close
                </button>
                <a
                  href={selectedJob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  Apply Directly <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}