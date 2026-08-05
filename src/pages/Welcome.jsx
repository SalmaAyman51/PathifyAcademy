import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, GraduationCap, Users, BookOpen, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';


export default function Welcome() {
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-[#3d6c8a] selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center justify-start">
          
            <Logo width="100px" height="60px" className="object-contain" />
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-[#3d6c8a] transition-colors">Login</Link>
            <Link to="/signup" className="rounded-full bg-[#3d6c8a] px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-[#3d6c8a]/20 hover:bg-[#2d5169] transition-all hover:scale-105 active:scale-95">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-20 text-center">
        {/* Background Accents */}
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-[#3d6c8a]/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-blue-400/5 blur-[120px]" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="z-10 max-w-4xl"
        >
          <span className="mb-6 inline-block rounded-full bg-[#3d6c8a]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#3d6c8a]">
            Next-Gen Academic Ecosystem
          </span>
          <h1 className="mb-6 text-5xl font-[900] leading-tight text-slate-900 md:text-7xl">
            Empowering Your <span className="text-[#3d6c8a]">Academic</span> Future.
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-slate-600 md:text-xl">
            The all-in-one platform for students and faculty to manage courses, 
            graduation projects, and academic enrollment with professional precision.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link 
              to="/signup" 
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3d6c8a] px-8 py-4 text-lg font-bold text-white shadow-2xl shadow-[#3d6c8a]/30 transition-all hover:scale-105 active:scale-95 sm:w-auto"
            >
              Get Started for Free <ArrowRight size={20} />
            </Link>
            <Link 
              to="/login" 
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-8 py-4 text-lg font-bold text-slate-700 transition-all hover:border-[#3d6c8a] hover:text-[#3d6c8a] sm:w-auto"
            >
              Partner Access
            </Link>
          </div>
        </motion.div>

        {/* Feature Preview Grid */}
        <div className="mt-24 grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard 
            icon={<GraduationCap className="text-[#3d6c8a]" size={32} />}
            title="Student Excellence"
            description="Personalized dashboard to track courses, projects, and academic growth."
          />
          <FeatureCard 
            icon={<Users className="text-emerald-500" size={32} />}
            title="Faculty Control"
            description="Streamlined management system for professors to guide and evaluate brilliance."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-amber-500" size={32} />}
            title="Secure Infrastructure"
            description="Professional-grade security ensuring your academic data remains private and protected."
          />
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-12 text-center text-slate-400">
        <p className="text-sm font-medium">© 2026 Pathify Academic Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="group rounded-3xl border border-slate-100 bg-white p-8 text-left shadow-xl shadow-slate-200/50 transition-all"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 transition-colors group-hover:bg-[#3d6c8a]/5">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500">{description}</p>
    </motion.div>
  );
}
