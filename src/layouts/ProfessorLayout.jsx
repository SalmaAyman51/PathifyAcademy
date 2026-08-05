

// import React, { useEffect, useState } from 'react';
// import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { FolderGit2, Lightbulb, LogOut, Search, Users, Clock } from 'lucide-react';
// import { AnimatePresence, motion } from 'motion/react';
// import { useAuth } from '../context/AuthContext';
// import Logo from '../components/Logo';
// import API from '../api';

// const SidebarLink = ({ icon: Icon, label, to, viewParam }) => {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   // Highlight if the 'view' parameter matches our viewParam
//   const isActive = searchParams.get('view') === viewParam;

//   return (
//     <NavLink
//       to={to}
//       className={`flex items-center gap-3 px-[15px] py-[11px] rounded-[9px] text-[13px] transition-all duration-200 ${
//         isActive 
//           ? 'bg-[#cbd5e1] text-[#1e293b] font-semibold' 
//           : 'text-[#1e293b] hover:bg-[#dee4ed] hover:translate-x-1'
//       }`}
//     >
//       <Icon size={18} />
//       <span>{label}</span>
//     </NavLink>
//   );
// };

// export default function ProfessorLayout() {
//   const { logout } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [professor, setProfessor] = useState({ name: '', role: '' });

//   useEffect(() => {
//     const fetchCurrentProfessor = async () => {
//       try {
//         const res = await API.get('/Professor/me');
//         setProfessor({
//           name: res.data.name || 'Professor',
//           role: res.data.role === 'External' ? 'External Advisor' : 'Internal Advisor'
//         });
//       } catch (err) {
//         console.error(err);
//         setProfessor({ name: 'Professor', role: '' });
//       }
//     };

//     fetchCurrentProfessor();
//   }, []);

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const initials = professor.name
//     ? professor.name.split(' ').map(n => n[0]).join('').toUpperCase()
//     : 'P';

//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans">
//       <aside className="flex w-[240px] flex-col border-r border-[#cbd5e1] bg-[#e2e8f0] p-[15px]">
//         <div className="mb-[30px] flex items-center gap-2.5">
//           <div className="flex items-center justify-start">
//             <Logo width="100px" height="60px" className="object-contain" />
//           </div>
//         </div>
        
//         <nav className="flex-1 space-y-1">
//           <SidebarLink 
//             icon={Users} 
//             label="Supervised Teams" 
//             to={`${location.pathname}?view=teams`} 
//             viewParam="teams"
//           />
//           <SidebarLink 
//             icon={Clock} 
//             label="Pending Projects" 
//             to={`${location.pathname}?view=pending`} 
//             viewParam="pending"
//           />
//         </nav>

//         <div 
//           onClick={handleLogout}
//           className="mt-auto flex cursor-pointer items-center gap-2 border-t border-[#cbd5e1] p-[15px] font-semibold text-[#ef4444] hover:opacity-80 transition-opacity"
//         >
//           <LogOut size={18} />
//           <span>Logout</span>
//         </div>
//       </aside>

//       <div className="flex flex-1 flex-col overflow-hidden">
//         <header className="flex h-[60px] items-center justify-between border-b border-[#e2e8f0] bg-white px-[30px]">
//           <div className="flex w-[280px] items-center gap-2.5 rounded-[10px] bg-[#f1f5f9] px-[15px] py-[7px]">
//             <Search size={16} className="text-[#94a3b8]" />
//             <input type="text" placeholder="Search..." className="w-full bg-transparent text-[13px] outline-none" />
//           </div>
//           <div className="flex items-center gap-[25px]">
//             <div 
//               onClick={() => navigate('/professor/profile')}
//               className="flex items-center gap-2.5 cursor-pointer rounded-xl px-2 py-1 -mr-2 transition-colors hover:bg-slate-50"
//             >
//               <div className="text-right">
//                 <p className="text-[13px] font-bold">{professor.name || 'Professor'}</p>
//                 <p className="text-[11px] text-[#94a3b8]">{professor.role}</p>
//               </div>
//               <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#3d6c8a] font-bold text-white">
//                 {initials}
//               </div>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 overflow-y-auto p-[30px]">
//           <AnimatePresence mode="wait">
//             <motion.div 
//               key={location.key} 
//               initial={{ opacity: 0, y: 10 }} 
//               animate={{ opacity: 1, y: 0 }} 
//               exit={{ opacity: 0, y: -10 }} 
//               transition={{ duration: 0.2 }}
//             >
//               <Outlet />
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FolderGit2, Lightbulb, LogOut, Search, Users, Clock, FolderOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import API from '../api';

const SidebarLink = ({ icon: Icon, label, to, viewParam }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  // Highlight if the 'view' parameter matches our viewParam
  const isActive = searchParams.get('view') === viewParam;

  return (
    <NavLink
      to={to}
      className={`flex items-center gap-3 px-[15px] py-[11px] rounded-[9px] text-[13px] transition-all duration-200 ${
        isActive 
          ? 'bg-[#cbd5e1] text-[#1e293b] font-semibold' 
          : 'text-[#1e293b] hover:bg-[#dee4ed] hover:translate-x-1'
      }`}
    >
      <Icon size={18} />
      <span>{label}</span>
    </NavLink>
  );
};

export default function ProfessorLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [professor, setProfessor] = useState({ name: '', role: '' });

  useEffect(() => {
    const fetchCurrentProfessor = async () => {
      try {
        const res = await API.get('/Professor/me');
        setProfessor({
          name: res.data.name || 'Professor',
          role: res.data.role === 'External' ? 'External Advisor' : 'Internal Advisor'
        });
      } catch (err) {
        console.error(err);
        setProfessor({ name: 'Professor', role: '' });
      }
    };

    fetchCurrentProfessor();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = professor.name
    ? professor.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'P';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans">
      <aside className="flex w-[240px] flex-col border-r border-[#cbd5e1] bg-[#e2e8f0] p-[15px]">
        <div className="mb-[30px] flex items-center gap-2.5">
          <div className="flex items-center justify-start">
            <Logo width="100px" height="60px" className="object-contain" />
          </div>
        </div>
        
        <nav className="flex-1 space-y-1">
          <SidebarLink 
            icon={Users} 
            label="Supervised Teams" 
            to={`${location.pathname}?view=teams`} 
            viewParam="teams"
          />
          <SidebarLink 
            icon={Clock} 
            label="Pending Projects" 
            to={`${location.pathname}?view=pending`} 
            viewParam="pending"
          />
          <SidebarLink 
            icon={FolderOpen} 
            label="All Projects" 
            to={`${location.pathname}?view=all`} 
            viewParam="all"
          />
        </nav>

        <div 
          onClick={handleLogout}
          className="mt-auto flex cursor-pointer items-center gap-2 border-t border-[#cbd5e1] p-[15px] font-semibold text-[#ef4444] hover:opacity-80 transition-opacity"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-[60px] items-center justify-between border-b border-[#e2e8f0] bg-white px-[30px]">
          <div className="flex w-[280px] items-center gap-2.5 rounded-[10px] bg-[#f1f5f9] px-[15px] py-[7px]">
            <Search size={16} className="text-[#94a3b8]" />
            <input type="text" placeholder="Search..." className="w-full bg-transparent text-[13px] outline-none" />
          </div>
          <div className="flex items-center gap-[25px]">
            <div 
              onClick={() => navigate('/professor/profile')}
              className="flex items-center gap-2.5 cursor-pointer rounded-xl px-2 py-1 -mr-2 transition-colors hover:bg-slate-50"
            >
              <div className="text-right">
                <p className="text-[13px] font-bold">{professor.name || 'Professor'}</p>
                <p className="text-[11px] text-[#94a3b8]">{professor.role}</p>
              </div>
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#3d6c8a] font-bold text-white">
                {initials}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-[30px]">
          <AnimatePresence mode="wait">
            <motion.div 
              key={location.key} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}