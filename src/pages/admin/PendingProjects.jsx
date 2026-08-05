import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Check, FileText, Calendar, Users, Search, Info, X,
  Trash
} from 'lucide-react';

export default function PendingProjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [pendingProjects, setPendingProjects] = useState([
    {
      id: 1,
      title: "AI Health Monitor",
      course: "Machine Learning",
      leader: "Zeyad Ali",
      teamSize: 4,
      date: "May 12, 2026",
      description: "A system designed to monitor patient vitals in real-time using advanced ML algorithms to predict potential emergencies.",
      members: ["Zeyad Ali", "Ahmed Hassan", "Sami Omar", "Lila Zeyad"]
    },
    {
      id: 2,
      title: "Secure Voting System",
      course: "Cybersecurity",
      leader: "Layla Nour",
      teamSize: 3,
      date: "May 14, 2026",
      description: "A blockchain-based voting application ensuring complete transparency and security for university-wide elections.",
      members: ["Layla Nour", "Kareem Adel", "Sara Maya"]
    },
    {
      id: 3,
      title: "Smart Traffic Flow",
      course: "Internet of Things",
      leader: "Hassan Karim",
      teamSize: 5,
      date: "May 15, 2026",
      description: "An IoT solution that uses smart sensors and real-time data analysis to optimize traffic lights and reduce city congestion.",
      members: ["Hassan Karim", "Nour El-Din", "Youssef Ali", "Mariam Soliman", "Hoda Atef"]
    },
    {
      id: 4,
      title: "E-Learning VR Lab",
      course: "Virtual Reality",
      leader: "Mona Ahmed",
      teamSize: 3,
      date: "May 18, 2026",
      description: "A virtual reality platform designed to provide science students with a safe, immersive laboratory experience for complex experiments.",
      members: ["Mona Ahmed", "Salma Yasser", "Ibrahim Khalil"]
    },
    {
      id: 5,
      title: "Fintech Fraud Shield",
      course: "Network Security",
      leader: "Omar Fayed",
      teamSize: 4,
      date: "May 20, 2026",
      description: "A secure payment gateway enhancement that uses anomaly detection to identify and block fraudulent financial transactions instantly.",
      members: ["Omar Fayed", "Mostafa Mahmoud", "Habiba Tarek", "Zainab Ali"]
    }
  ]);

  const handleApprove = (id) => {
    setPendingProjects(prev => prev.filter(p => p.id !== id));
    setShowModal(false);
  };

  const handleReject = (id) => {
    setPendingProjects(prev => prev.filter(p => p.id !== id));
    setShowModal(false);
  };

  const openInfo = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const [formData, setFormData] = useState({
    supervisor1: '',
    supervisor2: '',
  });

  const filteredProjects = useMemo(() => {
    return pendingProjects.filter((project) => {
      const search = searchTerm.toLowerCase();
      return (
        project.title.toLowerCase().includes(search) ||
        project.leader.toLowerCase().includes(search)
      );
    });
  }, [pendingProjects, searchTerm]);

  return (
    <div className="relative rounded-[20px] border border-[#e2e8f0] bg-white p-[20px]">

      {/* Modal */}
      {showModal && selectedProject && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-[450px] rounded-[28px] bg-white p-[30px] shadow-2xl transition-all scale-up">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3d6c8a] text-white shadow-md">
                <FileText size={24} />
              </div>
              <button onClick={() => setShowModal(false)} className="rounded-full p-2 hover:bg-slate-100 text-[#94a3b8]">
                <X size={20} />
              </button>
            </div>

            <h3 className="text-[20px] font-bold text-[#1e293b]">{selectedProject.title}</h3>
            <p className="mb-5 text-[14px] font-semibold text-[#3d6c8a]">{selectedProject.course}</p>

            <div className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-1">Description</p>
                <p className="text-[13px] text-[#64748b] leading-relaxed bg-[#f8fafc] p-3 rounded-xl border border-[#f1f5f9]">
                  {selectedProject.description}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider mb-2">Team Members</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.members.map((m, index) => (
                    <span key={index} className="px-3 py-1 bg-white border border-[#e2e8f0] rounded-lg text-[12px] font-bold text-[#1e293b]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* --- Supervisors Section --- */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Input Supervisor 1 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                    Add Primary Supervisor
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2.5 transition-all focus-within:border-[#3d6c8a] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#3d6c8a]">
                    <Users size={16} className="text-[#94a3b8]" />
                    <input
                      type="text"
                      placeholder="Enter name..."
                      className="w-full bg-transparent text-sm outline-none text-[#1e293b] placeholder:text-[#cbd5e1]"
                    />
                  </div>
                </div>

                {/* Input Supervisor 2 */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                    Add Secondary Supervisor
                  </label>
                  <div className="flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2.5 transition-all focus-within:border-[#3d6c8a] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#3d6c8a]">
                    <Users size={16} className="text-[#94a3b8]" />
                    <input
                      type="text"
                      placeholder="Enter name..."
                      className="w-full bg-transparent text-sm outline-none text-[#1e293b] placeholder:text-[#cbd5e1]"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-xl border cursor-pointer  border-[#e2e8f0] py-3 text-[14px] font-bold text-[#64748b] hover:bg-slate-50 transition-all duration-300 hover:-translate-y-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApprove(project.id)}
                className="flex-1 rounded-xl cursor-pointer  bg-[#3d6c8a] py-3 text-[14px] font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#2d5269] shadow-md"
              >
                Approve Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-[17px] font-bold text-[#1e293b]">Project Proposals</h3>
          <p className="text-[12px] text-[#64748b]">Review and authorize projects</p>
        </div>

        <div className="flex w-fit gap-1 rounded-xl bg-[#f1f5f9] p-1 text-[12px]">
          <NavLink
            to="/admin/pending-accounts"
            className={({ isActive }) => `px-5 py-1.5 rounded-lg font-bold transition-all ${isActive ? 'bg-white text-[#3d6c8a] shadow-sm' : 'text-[#64748b]'}`}
          >
            Accounts
          </NavLink>
          {/* <NavLink
            to="/admin/pending-projects"
            className={({ isActive }) => `px-5 py-1.5 rounded-lg font-bold transition-all ${isActive ? 'bg-white text-[#3d6c8a] shadow-sm' : 'text-[#64748b]'}`}
          >
            Projects
          </NavLink> */}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex w-full max-w-sm items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 transition-all focus-within:border-[#3d6c8a] focus-within:ring-1 focus-within:ring-[#3d6c8a]">
        <Search size={16} className="text-[#94a3b8]" />
        <input
          type="text"
          placeholder="Search by title or leader..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent text-xs outline-none w-full"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className="group relative flex flex-col overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white p-4 transition-all duration-300 hover:-translate-y-2 hover:border-[#3d6c8a] hover:shadow-[0_10px_25px_-5px_rgba(61,108,138,0.2)]"
          >
            <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#3d6c8a] transition-all duration-500 group-hover:w-full"></div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3d6c8a] text-white shadow-md transition-all duration-300 hover:shadow-lg">
                <FileText size={20} />
              </div>
              <span className="text-[10px] font-bold text-[#3d6c8a] bg-[#3d6c8a0a] px-2.5 py-1 rounded-full uppercase tracking-wider">
                {project.course}
              </span>
            </div>

            <h4 className="text-[15px] font-extrabold text-[#1e293b] leading-snug mb-4 group-hover:text-[#3d6c8a] transition-colors">
              {project.title}
            </h4>

            <div className="space-y-3 rounded-xl bg-[#f8fafc] p-3.5 border border-[#f1f5f9] transition-all duration-300 group-hover:bg-white group-hover:border-[#e2e8f0]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#3d6c8a] animate-pulse"></div>
                  <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-tighter">Leader</p>
                </div>
                <p className="text-[12px] font-bold text-[#1e293b]">{project.leader}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users size={12} className="text-[#94a3b8]" />
                  <p className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-tighter">Team</p>
                </div>
                <p className="text-[12px] font-bold text-[#1e293b]">{project.teamSize} Members</p>
              </div>

              <div className="mt-2 pt-2 border-t border-[#e2e8f0] flex items-center justify-between">
                <p className="text-[9px] font-bold text-[#94a3b8] uppercase">Date</p>
                <div className="flex items-center gap-1 text-[#3d6c8a]">
                  <Calendar size={10} />
                  <span className="text-[11px] font-bold tracking-tight">{project.date}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              <button
               onClick={() => openInfo(project)}
                className="flex-1 rounded-xl bg-[#3d6c8a] py-2.5 text-[12px] font-bold text-white transition-all cursor-pointer hover:bg-[#2d5269] hover:shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <Check size={14} /> Approve
              </button>
              <button
                onClick={() => handleReject(selectedProject.id)}
                className="rounded-xl border border-[#e2e8f0] bg-white px-3 py-2.5 text-[#64748b] hover:bg-[#3d6c8a0a] hover:text-[#3d6c8a] cursor-pointer  transition-all active:scale-95 shadow-sm"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* رسائل الحالات (بدون تكرار) */}
      {pendingProjects.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-[#94a3b8] text-sm italic">All projects have been reviewed!</p>
        </div>
      )}

      {pendingProjects.length > 0 && filteredProjects.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-[#94a3b8] text-sm italic">No projects found for "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}