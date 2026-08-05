import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, FolderKanban, 
  User, LogOut 
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const API = import.meta.env.VITE_API_URL;

const SidebarLink = ({ icon: Icon, label, to, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) => `
      flex items-center gap-3 px-[15px] py-[11px] rounded-[9px] text-[13px] transition-all duration-200
      ${isActive ? 'bg-[#3d6c8a] text-white shadow-lg' : 'text-[#1e293b] hover:bg-[#dee4ed] hover:translate-x-1'}
    `}
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

export default function StudentLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [studentName, setStudentName] = useState(user?.name || 'Student');

  useEffect(() => {
    const fetchName = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) return;

      try {
        const res = await fetch(`${API}/api/ProjectManagement/name`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) return;

        const data = await res.json();
        if (data?.name) setStudentName(data.name);
      } catch {
        // keep fallback name on failure
      }
    };

    fetchName();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <aside className="flex w-[240px] flex-col border-r border-[#cbd5e1] bg-[#e2e8f0] p-[15px]">
        <div className="mb-[30px] flex items-center gap-2.5">
          <div className="flex items-center justify-start">
            <Logo width="100px" height="60px" className="object-contain" />
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          <SidebarLink icon={LayoutDashboard} label="Dashboard" to="/student/dashboard" end />
          <SidebarLink icon={BookOpen} label="Course Enrollment" to="/student/courses" />
          <SidebarLink icon={FolderKanban} label="Project Management" to="/student/projects" />
          <SidebarLink icon={User} label="Profile" to="/student/profile" />
        </nav>
        <div 
          onClick={handleLogout}
          className="mt-auto flex cursor-pointer items-center gap-2 border-t border-[#cbd5e1] p-[15px] font-semibold text-[#ef4444] hover:opacity-80 transition-opacity"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-[60px] items-center justify-end border-b border-[#e2e8f0] bg-white px-[30px]">
          <div className="flex items-center gap-2.5">
            <div className="text-right">
              <p className="text-[13px] font-bold">{studentName}</p>
              <p className="text-[11px] text-[#94a3b8]">Student</p>
            </div>
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#3d6c8a] font-bold text-white">
              {studentName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'S'}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-[24px_30px_0_30px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>

          <footer className="mt-10 border-t border-[#e2e8f0] py-[15px] text-center text-[13px] text-[#64748b]">
            © 2026 Pathify Academic Management System. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}