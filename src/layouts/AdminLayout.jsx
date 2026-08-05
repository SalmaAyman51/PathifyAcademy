// import React, { useRef, useState } from 'react';
// import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { 
//   LayoutDashboard, Users, BookOpen, 
//   UserCheck, FileText, LogOut, 
//   Search, Bell, User, Download, GraduationCap,
//   ClipboardCheck, FolderClock
// } from 'lucide-react';
// import { AnimatePresence, motion } from 'motion/react';
// import { useAuth } from '../context/AuthContext';
// import Logo from '../components/Logo';

// const SidebarLink = ({ icon: Icon, label, to }) => (
//   <NavLink
//     to={to}
//     className={({ isActive }) => `
//       flex items-center gap-3 px-[15px] py-[11px] rounded-[9px] text-[13px] transition-all duration-200
//       ${isActive ? 'bg-[#3d6c8a] text-white shadow-lg' : 'text-[#1e293b] hover:bg-[#dee4ed] hover:translate-x-1'}
//     `}
//   >
//     <Icon size={18} />
//     <span>{label}</span>
//   </NavLink>
// );

// // Helper for the Top Tabs
// const TabLink = ({ icon: Icon, label, to }) => (
//   <NavLink
//     to={to}
//     className={({ isActive }) => `
//       flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200 border-b-2 whitespace-nowrap
//       ${isActive 
//         ? 'border-[#3d6c8a] text-[#3d6c8a] font-bold bg-[#3d6c8a0a]' 
//         : 'border-transparent text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b]'}
//     `}
//   >
//     <Icon size={14} />
//     <span>{label}</span>
//   </NavLink>
// );

// export default function AdminLayout() {
//   const { logout, user } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const fileInputRef = useRef(null);
//   const [importFileName, setImportFileName] = useState('');

//   const handleLogout = () => {
//     logout();
//     navigate('/login');
//   };

//   const handleImportClick = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const handleProfileClick = () => {
//     navigate('/admin/profile');
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setImportFileName(file.name);
//       // هنا ممكن تضيفي قراءة الملف أو عرضه حسب الحاجة
//       console.log('Selected file:', file);
//     }
//   };

//   return (
//     <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans">
//       {/* Sidebar */}
//       <aside className="flex w-[240px] flex-col border-r border-[#cbd5e1] bg-[#e2e8f0] p-[15px]">
//         <div className="mb-[30px] flex items-center gap-2.5 px-2">
//          <div className="flex items-center justify-start">
//             <Logo width="100px" height="60px" className="object-contain" />
//           </div>
//         </div>
        
//         <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
//           <div className="pb-4">
//             <p className="px-4 mb-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wider opacity-60">Management</p>
//             <SidebarLink icon={LayoutDashboard} label="Overview" to="/admin/overview" />
//             <SidebarLink icon={GraduationCap} label="Students" to="/admin/students" />
//             <SidebarLink icon={Users} label="Professors" to="/admin/professors" />
//             <SidebarLink icon={BookOpen} label="Courses" to="/admin/courses" />
//             <SidebarLink icon={UserCheck} label="Enrollments" to="/admin/enrollments" />
//             {/* <SidebarLink icon={FileText} label="Projects" to="/admin/projects" /> */}
//           </div>

//           {/* ADDED: Approvals Section */}
//           <div className="pt-4 border-t border-[#cbd5e1]">
//             <p className="px-4 mb-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wider opacity-60">Pending Approvals</p>
//             <SidebarLink icon={ClipboardCheck} label="Account Requests" to="/admin/pending-accounts" />
//             {/* <SidebarLink icon={FolderClock} label="Pending Projects" to="/admin/pending-projects" /> */}
//           </div>
//         </nav>

//         <div 
//           onClick={handleLogout}
//           className="mt-auto flex cursor-pointer items-center gap-2 border-t border-[#cbd5e1] p-[15px] font-semibold text-[#ef4444] hover:bg-[#ef444410] rounded-lg transition-all"
//         >
//           <LogOut size={18} />
//           <span>Logout</span>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <div className="flex flex-1 flex-col overflow-hidden">
//         {/* Topbar */}
//         <header className="flex h-[60px] items-center justify-between border-b border-[#e2e8f0] bg-white px-[30px] shrink-0">
//           <div className="flex w-[280px] items-center gap-2.5 rounded-[10px] bg-[#f1f5f9] px-[15px] py-[7px]">
//             <Search size={16} className="text-[#94a3b8]" />
//             <input type="text" placeholder="Search anything..." className="w-full bg-transparent text-[13px] outline-none" />
//           </div>
//           <div className="flex items-center gap-[25px]">
//             <Bell size={19} className="cursor-pointer text-[#64748b]" />
//             <div className="flex items-center gap-2.5">
//               <div className="text-right">
//                 <p className="text-[13px] font-bold leading-tight">{user?.name || 'Admin User'}</p>
//                 <p className="text-[11px] text-[#94a3b8]">Administrator</p>
//               </div>
//               <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#3d6c8a] font-bold text-white shadow-sm">
//                 {user?.name?.split(' ').map(n => n[0]).join('') || 'AU'}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Scrollable Content */}
//         <main className="flex-1 overflow-y-auto p-[30px_30px_0_30px] flex flex-col">
//           {/* Header Section */}
//           <div className="mb-[20px] flex items-center justify-between shrink-0">
//             <div>
//               <h1 className="text-2xl font-[800] text-[#1e293b]">System Administration</h1>
//               <p className="text-sm text-[#64748b]">Manage the Pathify academic ecosystem.</p>
//             </div>
//             <div className="flex gap-2.5 items-center">
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
//                 className="hidden"
//                 onChange={handleFileChange}
//               />
//               {/* <button
//                 type="button"
//                 onClick={handleImportClick}
//                 className="flex items-center gap-2 rounded-[10px] border border-[#cbd5e1] bg-white px-[18px] py-[10px] text-[12px] font-semibold text-[#64748b] transition-all hover:bg-[#f8fafc] hover:scale-[1.02]"
//               >
//                 <Download size={14} /> Import
//               </button> */}
//               <button
//                 type="button"
//                 onClick={handleProfileClick}
//                 className="flex items-center gap-2 rounded-[10px] bg-[#3d6c8a] px-[18px] py-[10px] text-[12px] font-semibold text-white transition-all hover:opacity-90 hover:scale-[1.02] shadow-md"
//               >
//                 <User size={14} /> Profile
//               </button>
//             </div>
//             {importFileName && (
//               <p className="mt-2 text-[12px] text-[#475569]">Selected file: <span className="font-semibold text-[#0f172a]">{importFileName}</span></p>
//             )}
//           </div>

//           {/* ADJUSTED TABS STRIP: Added Pending routes and scrollable container */}
//           <div className="mb-6 flex gap-1 border-b border-[#e2e8f0] overflow-x-auto no-scrollbar shrink-0">
//             <TabLink icon={LayoutDashboard} label="Overview" to="/admin/overview" />
//             <TabLink icon={GraduationCap} label="Students" to="/admin/students" />
//             <TabLink icon={Users} label="Professors" to="/admin/professors" />
//             <TabLink icon={BookOpen} label="Courses" to="/admin/courses" />
//             <TabLink icon={UserCheck} label="Enrollments" to="/admin/enrollments" />
//             {/* <TabLink icon={FileText} label="Projects" to="/admin/projects" /> */}
//             {/* Added Approvals to Tabs */}
//             <TabLink icon={ClipboardCheck} label="Pending Accounts" to="/admin/pending-accounts" />
//             {/* <TabLink icon={FolderClock} label="Pending Projects" to="/admin/pending-projects" /> */}
//           </div>

//           <div className="flex-1">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={location.pathname}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.2 }}
//                 className="h-full"
//               >
//                 <Outlet />
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           <footer className="mt-10 border-t border-[#e2e8f0] py-[20px] text-center text-[12px] text-[#94a3b8] shrink-0">
//             © 2026 Pathify Academic Management System. All rights reserved.
//           </footer>
//         </main>
//       </div>
//     </div>
//   );
// }

import React, { useRef, useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, 
  UserCheck, FileText, LogOut, 
  Search, Bell, User, Download, GraduationCap,
  ClipboardCheck, FolderClock
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const SidebarLink = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-3 px-[15px] py-[11px] rounded-[9px] text-[13px] transition-all duration-200
      ${isActive ? 'bg-[#3d6c8a] text-white shadow-lg' : 'text-[#1e293b] hover:bg-[#dee4ed] hover:translate-x-1'}
    `}
  >
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
);

// Helper for the Top Tabs
const TabLink = ({ icon: Icon, label, to }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200 border-b-2 whitespace-nowrap
      ${isActive 
        ? 'border-[#3d6c8a] text-[#3d6c8a] font-bold bg-[#3d6c8a0a]' 
        : 'border-transparent text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b]'}
    `}
  >
    <Icon size={14} />
    <span>{label}</span>
  </NavLink>
);

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);
  const [importFileName, setImportFileName] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProfileClick = () => {
    navigate('/admin/Profile');
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFileName(file.name);
      // هنا ممكن تضيفي قراءة الملف أو عرضه حسب الحاجة
      console.log('Selected file:', file);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <aside className="flex w-[240px] flex-col border-r border-[#cbd5e1] bg-[#e2e8f0] p-[15px]">
        <div className="mb-[30px] flex items-center gap-2.5 px-2">
         <div className="flex items-center justify-start">
            <Logo width="100px" height="60px" className="object-contain" />
          </div>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="pb-4">
            <p className="px-4 mb-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wider opacity-60">Management</p>
            <SidebarLink icon={LayoutDashboard} label="Overview" to="/admin/overview" />
            <SidebarLink icon={GraduationCap} label="Students" to="/admin/students" />
            <SidebarLink icon={Users} label="Professors" to="/admin/professors" />
            <SidebarLink icon={BookOpen} label="Courses" to="/admin/courses" />
            <SidebarLink icon={UserCheck} label="Enrollments" to="/admin/enrollments" />
            {/* <SidebarLink icon={FileText} label="Projects" to="/admin/projects" /> */}
          </div>

          {/* ADDED: Approvals Section */}
          <div className="pt-4 border-t border-[#cbd5e1]">
            <p className="px-4 mb-2 text-[10px] font-bold text-[#64748b] uppercase tracking-wider opacity-60">Pending Approvals</p>
            <SidebarLink icon={ClipboardCheck} label="Account Requests" to="/admin/pending-accounts" />
            {/* <SidebarLink icon={FolderClock} label="Pending Projects" to="/admin/pending-projects" /> */}
          </div>
        </nav>

        <div 
          onClick={handleLogout}
          className="mt-auto flex cursor-pointer items-center gap-2 border-t border-[#cbd5e1] p-[15px] font-semibold text-[#ef4444] hover:bg-[#ef444410] rounded-lg transition-all"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-[60px] items-center justify-between border-b border-[#e2e8f0] bg-white px-[30px] shrink-0">
          <div className="flex w-[280px] items-center gap-2.5 rounded-[10px] bg-[#f1f5f9] px-[15px] py-[7px]">
            <Search size={16} className="text-[#94a3b8]" />
            <input type="text" placeholder="Search anything..." className="w-full bg-transparent text-[13px] outline-none" />
          </div>
          <div className="flex items-center gap-[25px]">
            <div
              onClick={handleProfileClick}
              title="View Profile"
              className="flex items-center gap-2.5 cursor-pointer rounded-[10px] px-2 py-1 transition-all hover:bg-[#f1f5f9]"
            >
              <div className="text-right">
                <p className="text-[13px] font-bold leading-tight">{user?.name || 'Admin User'}</p>
                <p className="text-[11px] text-[#94a3b8]">Administrator</p>
              </div>
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#3d6c8a] font-bold text-white shadow-sm">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'AU'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-[30px_30px_0_30px] flex flex-col">
          {/* Header Section */}
          <div className="mb-[20px] flex items-center justify-between shrink-0">
            <div>
              <h1 className="text-2xl font-[800] text-[#1e293b]">System Administration</h1>
              <p className="text-sm text-[#64748b]">Manage the Pathify academic ecosystem.</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              className="hidden"
              onChange={handleFileChange}
            />
            {importFileName && (
              <p className="mt-2 text-[12px] text-[#475569]">Selected file: <span className="font-semibold text-[#0f172a]">{importFileName}</span></p>
            )}
          </div>

          {/* ADJUSTED TABS STRIP: Added Pending routes and scrollable container */}
          <div className="mb-6 flex gap-1 border-b border-[#e2e8f0] overflow-x-auto no-scrollbar shrink-0">
            <TabLink icon={LayoutDashboard} label="Overview" to="/admin/overview" />
            <TabLink icon={GraduationCap} label="Students" to="/admin/students" />
            <TabLink icon={Users} label="Professors" to="/admin/professors" />
            <TabLink icon={BookOpen} label="Courses" to="/admin/courses" />
            <TabLink icon={UserCheck} label="Enrollments" to="/admin/enrollments" />
             {/* <TabLink icon={UserCheck} label="Profile" to="/admin/Profile" /> */}

            {/* <TabLink icon={FileText} label="Projects" to="/admin/projects" /> */}
            {/* Added Approvals to Tabs */}
            <TabLink icon={ClipboardCheck} label="Pending Accounts" to="/admin/pending-accounts" />
            {/* <TabLink icon={FolderClock} label="Pending Projects" to="/admin/pending-projects" /> */}
          </div>

          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>

          <footer className="mt-10 border-t border-[#e2e8f0] py-[20px] text-center text-[12px] text-[#94a3b8] shrink-0">
            © 2026 Pathify Academic Management System. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
}