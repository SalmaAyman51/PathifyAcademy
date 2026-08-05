
// import React, { useState, useRef, useEffect } from 'react';
// import {
//   Users,
//   GraduationCap,
//   BookOpen,
//   Clock,
//   Download, // تم تغيير Upload إلى Download لتصبح الأسهم متجهة لأسفل
//   AlertCircle,
//   CheckCircle2,
//   Loader2,
//   X
// } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const StatCard = ({ title, value, icon: Icon, iconBg, iconColor }) => (
//   <motion.div 
//     whileHover={{ 
//       scale: 1.05,
//       y: -8,
//     }}
//     transition={{ 
//       type: "spring", 
//       stiffness: 400, 
//       damping: 10 
//     }}
//     className="flex cursor-pointer items-center gap-4 rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-sm hover:shadow-xl transition-shadow"
//   >
//     <div className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${iconBg} ${iconColor}`}>
//       <Icon size={22} />
//     </div>
//     <div>
//       <p className="text-[10px] font-[800] uppercase tracking-wider text-[#94a3b8]">{title}</p>
//       <h3 className="text-3xl font-bold text-[#1e293b] leading-tight">{value}</h3>
//     </div>
//   </motion.div>
// );

// export default function AdminOverview() {
//   const studentFileInputRef = useRef(null);
//   const professorFileInputRef = useRef(null);
//   const pastProjectsFileInputRef = useRef(null);

//   const [uploadStatus, setUploadStatus] = useState({
//     loading: false,
//     success: null,
//     errors: [],
//     message: ''
//   });

//   const [professorUploadStatus, setProfessorUploadStatus] = useState({
//     loading: false,
//     success: null,
//     errors: [],
//     message: ''
//   });

//   const [pastProjectsUploadStatus, setPastProjectsUploadStatus] = useState({
//     loading: false,
//     success: null,
//     errors: [],
//     message: ''
//   });

//   // ====== Recent Enrollment (latest one from DB) ======
//   const [recentEnrollment, setRecentEnrollment] = useState(null);
//   const [enrollmentLoading, setEnrollmentLoading] = useState(true);

//   // ====== System Health ======
//   const [systemHealth, setSystemHealth] = useState({
//     loading: true,
//     database: null,   
//     authService: null, 
//     loadPercentage: null
//   });

//   // ====== Stats (Students / Professors / Active Courses / Pending Approvals) ======
//   const [stats, setStats] = useState({
//     loading: true,
//     studentsCount: null,
//     professorsCount: null,
//     activeCoursesCount: null,
//     pendingApprovalsCount: null
//   });

//   useEffect(() => {
//     fetchRecentEnrollment();
//     fetchSystemHealth();
//     fetchStats();
//   }, []);

//   const fetchStats = async () => {
//     setStats(prev => ({ ...prev, loading: true }));
//     const token = localStorage.getItem('userToken');
//     const headers = { 'Authorization': `Bearer ${token}` };

//     try {
//       const [studentsRes, professorsRes, coursesRes, pendingRes] = await Promise.all([
//         fetch('https://localhost:7061/api/Admin/get-students-count', { headers }),
//         fetch('https://localhost:7061/api/Admin/get-professors-count', { headers }),
//         fetch('https://localhost:7061/api/Admin/get-active-courses-count', { headers }),
//         fetch('https://localhost:7061/api/Admin/get-pending-approvals-count', { headers })
//       ]);

//       const studentsData = studentsRes.ok ? await studentsRes.json() : { studentsCount: 0 };
//       const professorsData = professorsRes.ok ? await professorsRes.json() : { totalProfessorsCount: 0 };
//       const coursesData = coursesRes.ok ? await coursesRes.json() : { activeCoursesCount: 0 };
//       const pendingData = pendingRes.ok ? await pendingRes.json() : { pendingApprovalsCount: 0 };

//       setStats({
//         loading: false,
//         studentsCount: studentsData.studentsCount,
//         professorsCount: professorsData.totalProfessorsCount,
//         activeCoursesCount: coursesData.activeCoursesCount,
//         pendingApprovalsCount: pendingData.pendingApprovalsCount
//       });
//     } catch (error) {
//       setStats({
//         loading: false,
//         studentsCount: 0,
//         professorsCount: 0,
//         activeCoursesCount: 0,
//         pendingApprovalsCount: 0
//       });
//     }
//   };

//   const fetchRecentEnrollment = async () => {
//     setEnrollmentLoading(true);
//     try {
//       const token = localStorage.getItem('userToken');
//       const response = await fetch('https://localhost:7061/api/Admin/recent-enrollment', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setRecentEnrollment(data);
//       } else {
//         setRecentEnrollment(null);
//       }
//     } catch (error) {
//       setRecentEnrollment(null);
//     } finally {
//       setEnrollmentLoading(false);
//     }
//   };

//   const fetchSystemHealth = async () => {
//     setSystemHealth(prev => ({ ...prev, loading: true }));
//     try {
//       const token = localStorage.getItem('userToken');
//       const response = await fetch('https://localhost:7061/api/Admin/system-health', {
//         headers: { 'Authorization': `Bearer ${token}` }
//       });
//       if (response.ok) {
//         const data = await response.json();
//         setSystemHealth({
//           loading: false,
//           database: data.database,
//           authService: data.authService,
//           loadPercentage: data.loadPercentage
//         });
//       } else {
//         setSystemHealth({ loading: false, database: 'Unknown', authService: 'Unknown', loadPercentage: 0 });
//       }
//     } catch (error) {
//       setSystemHealth({ loading: false, database: 'Unknown', authService: 'Unknown', loadPercentage: 0 });
//     }
//   };

//   const handleFileChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const allowedExtensions = /(\.xlsx|\.xls)$/i;
//     if (!allowedExtensions.exec(file.name)) {
//       setUploadStatus({
//         loading: false,
//         success: false,
//         errors: ['Only Excel files (.xlsx, .xls) are allowed.'],
//         message: 'Invalid file type'
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     setUploadStatus({ loading: true, success: null, errors: [], message: '' });

//     try {
//       const token = localStorage.getItem('userToken'); 

//       const response = await fetch('https://localhost:7061/api/Admin/import-students', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       const contentType = response.headers.get("content-type");
//       let data;
//       if (contentType && contentType.indexOf("application/json") !== -1) {
//         data = await response.json();
//       } else {
//         data = await response.text();
//       }

//       if (response.ok) {
//         setUploadStatus({
//           loading: false,
//           success: true,
//           errors: data.errors || [],
//           message: data.message || `${data.importedCount} students imported successfully.`
//         });
//         fetchRecentEnrollment();
//         fetchStats();
//       } else {
//         setUploadStatus({
//           loading: false,
//           success: false,
//           errors: typeof data === 'string' ? [data] : (data.errors || ['Something went wrong']),
//           message: typeof data === 'string' ? data : (data.message || 'Failed to import students')
//         });
//       }
//     } catch (error) {
//       setUploadStatus({
//         loading: false,
//         success: false,
//         errors: ['Unable to connect to the server. Please try again later.'],
//         message: 'Network Error'
//       });
//     }

//     if (studentFileInputRef.current) studentFileInputRef.current.value = '';
//   };

//   const handleProfessorFileChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const allowedExtensions = /(\.xlsx|\.xls)$/i;
//     if (!allowedExtensions.exec(file.name)) {
//       setProfessorUploadStatus({
//         loading: false,
//         success: false,
//         errors: ['Only Excel files (.xlsx, .xls) are allowed.'],
//         message: 'Invalid file type'
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     setProfessorUploadStatus({ loading: true, success: null, errors: [], message: '' });

//     try {
//       const token = localStorage.getItem('userToken');

//       const response = await fetch('https://localhost:7061/api/Admin/import-professors', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       const contentType = response.headers.get("content-type");
//       let data;
//       if (contentType && contentType.indexOf("application/json") !== -1) {
//         data = await response.json();
//       } else {
//         data = await response.text();
//       }

//       if (response.ok) {
//         // الـ endpoint بيرجع importedInternalCount و importedExternalCount منفصلين
//         // (مش importedCount موحّد)، فبنجمعهم هنا كـ fallback لو message مش موجودة
//         const totalImported =
//           (data.importedInternalCount || 0) + (data.importedExternalCount || 0);

//         setProfessorUploadStatus({
//           loading: false,
//           success: true,
//           errors: data.errors || [],
//           message: data.message || `${totalImported} professors imported successfully.`
//         });
//         fetchStats();
//       } else {
//         setProfessorUploadStatus({
//           loading: false,
//           success: false,
//           errors: typeof data === 'string' ? [data] : (data.errors || ['Something went wrong']),
//           message: typeof data === 'string' ? data : (data.message || 'Failed to import professors')
//         });
//       }
//     } catch (error) {
//       setProfessorUploadStatus({
//         loading: false,
//         success: false,
//         errors: ['Unable to connect to the server. Please try again later.'],
//         message: 'Network Error'
//       });
//     }

//     if (professorFileInputRef.current) professorFileInputRef.current.value = '';
//   };

//   // ====== Import Past Years Projects (POST -> AdminController) ======
//   const handlePastProjectsFileChange = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const allowedExtensions = /(\.xlsx|\.xls)$/i;
//     if (!allowedExtensions.exec(file.name)) {
//       setPastProjectsUploadStatus({
//         loading: false,
//         success: false,
//         errors: ['Only Excel files (.xlsx, .xls) are allowed.'],
//         message: 'Invalid file type'
//       });
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);

//     setPastProjectsUploadStatus({ loading: true, success: null, errors: [], message: '' });

//     try {
//       const token = localStorage.getItem('userToken');

//       const response = await fetch('https://localhost:7061/api/Admin/past-projects/upload', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`
//         },
//         body: formData
//       });

//       const contentType = response.headers.get("content-type");
//       let data;
//       if (contentType && contentType.indexOf("application/json") !== -1) {
//         data = await response.json();
//       } else {
//         data = await response.text();
//       }

//       if (response.ok) {
//         setPastProjectsUploadStatus({
//           loading: false,
//           success: true,
//           errors: [],
//           message: typeof data === 'string' ? data : (data.message || 'Projects imported successfully.')
//         });
//       } else {
//         setPastProjectsUploadStatus({
//           loading: false,
//           success: false,
//           errors: typeof data === 'string' ? [data] : (data.errors || [data.message || 'Something went wrong']),
//           message: typeof data === 'string' ? data : (data.message || 'Failed to import projects')
//         });
//       }
//     } catch (error) {
//       setPastProjectsUploadStatus({
//         loading: false,
//         success: false,
//         errors: ['Unable to connect to the server. Please try again later.'],
//         message: 'Network Error'
//       });
//     }

//     if (pastProjectsFileInputRef.current) pastProjectsFileInputRef.current.value = '';
//   };

//   const triggerStudentFileSelect = () => {
//     studentFileInputRef.current?.click();
//   };

//   const triggerProfessorFileSelect = () => {
//     professorFileInputRef.current?.click();
//   };

//   const triggerPastProjectsFileSelect = () => {
//     pastProjectsFileInputRef.current?.click();
//   };

//   const healthColor = (status) => {
//     if (!status) return 'text-[#94a3b8]';
//     const normalized = status.toLowerCase();
//     if (['healthy', 'active', 'ok', 'up'].includes(normalized)) return 'text-[#10b981]';
//     if (['degraded', 'warning'].includes(normalized)) return 'text-orange-500';
//     return 'text-red-500';
//   };

//   return (
//     <div className="flex flex-col gap-8 p-6">
      
//       {/* قسم رفع الملفات والتحكم العلوي */}
//       <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#e2e8f0] shadow-sm">
//         <div>
//           <h1 className="text-xl font-[800] text-[#1e293b]">Data Management</h1>
//           <p className="text-[13px] text-[#64748b]">Import students, professors, and past years projects directly via Excel spreadsheets.</p>
//         </div>
//         <div className="flex flex-wrap gap-3">
//           {/* Import Students */}
//           <input 
//             type="file" 
//             ref={studentFileInputRef} 
//             onChange={handleFileChange} 
//             accept=".xlsx, .xls" 
//             className="hidden" 
//           />
//           <button
//             onClick={triggerStudentFileSelect}
//             disabled={uploadStatus.loading}
//             className="flex items-center gap-2 rounded-xl bg-[#3d6c8a] px-5 py-3 text-[13px] font-[800] text-white shadow-sm transition-all hover:bg-[#2c526b] disabled:opacity-50"
//           >
//             {uploadStatus.loading ? (
//               <Loader2 size={18} className="animate-spin" />
//             ) : (
//               <Download size={18} />
//             )}
//             {uploadStatus.loading ? 'Importing...' : 'Import Students (Excel)'}
//           </button>

//           {/* Import Professors */}
//           <input 
//             type="file" 
//             ref={professorFileInputRef} 
//             onChange={handleProfessorFileChange} 
//             accept=".xlsx, .xls" 
//             className="hidden" 
//           />
//           <button
//             onClick={triggerProfessorFileSelect}
//             disabled={professorUploadStatus.loading}
//             className="flex items-center gap-2 rounded-xl bg-[#3d6c8a] px-5 py-3 text-[13px] font-[800] text-white shadow-sm transition-all hover:bg-[#2c526b] disabled:opacity-50"
//           >
//             {professorUploadStatus.loading ? (
//               <Loader2 size={18} className="animate-spin" />
//             ) : (
//               <Download size={18} />
//             )}
//             {professorUploadStatus.loading ? 'Importing...' : 'Import Professors (Excel)'}
//           </button>

//           {/* Import Past Years Projects */}
//           <input 
//             type="file" 
//             ref={pastProjectsFileInputRef} 
//             onChange={handlePastProjectsFileChange} 
//             accept=".xlsx, .xls" 
//             className="hidden" 
//           />
//           <button
//             onClick={triggerPastProjectsFileSelect}
//             disabled={pastProjectsUploadStatus.loading}
//             className="flex items-center gap-2 rounded-xl bg-[#3d6c8a] px-5 py-3 text-[13px] font-[800] text-white shadow-sm transition-all hover:bg-[#2c526b] disabled:opacity-50"
//           >
//             {pastProjectsUploadStatus.loading ? (
//               <Loader2 size={18} className="animate-spin" />
//             ) : (
//               <Download size={18} />
//             )}
//             {pastProjectsUploadStatus.loading ? 'Importing...' : 'Import Past Projects (Excel)'}
//           </button>
//         </div>
//       </div>

//       {/* رسالة نتيجة استيراد الطلبة */}
//       <AnimatePresence>
//         {(uploadStatus.success !== null || uploadStatus.loading) && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className={`rounded-[20px] p-6 border ${
//               uploadStatus.loading 
//                 ? 'bg-blue-50 border-blue-200 text-blue-800'
//                 : uploadStatus.success 
//                   ? 'bg-green-50 border-green-200 text-green-800' 
//                   : 'bg-red-50 border-red-200 text-red-800'
//             }`}
//           >
//             <div className="flex items-start gap-3">
//               {uploadStatus.loading ? (
//                 <Loader2 size={20} className="animate-spin text-blue-600 mt-0.5" />
//               ) : uploadStatus.success ? (
//                 <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
//               ) : (
//                 <AlertCircle size={20} className="text-red-600 mt-0.5" />
//               )}
//               <div className="flex-1">
//                 <h4 className="font-[800] text-[14px]">
//                   {uploadStatus.loading ? 'Processing Students Excel File...' : uploadStatus.message}
//                 </h4>
                
//                 {uploadStatus.errors.length > 0 && (
//                   <div className="mt-3 max-h-[150px] overflow-y-auto rounded-xl bg-white/50 p-3 text-[12px] space-y-1">
//                     <p className="font-bold text-[#1e293b] mb-1">Execution Details / Warnings:</p>
//                     {uploadStatus.errors.map((err, idx) => (
//                       <p key={idx} className="text-red-700 flex items-center gap-1">
//                         • {err}
//                       </p>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               {!uploadStatus.loading && (
//                 <button 
//                   onClick={() => setUploadStatus({ loading: false, success: null, errors: [], message: '' })}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={18} />
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* رسالة نتيجة استيراد البروفيسورز */}
//       <AnimatePresence>
//         {(professorUploadStatus.success !== null || professorUploadStatus.loading) && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className={`rounded-[20px] p-6 border ${
//               professorUploadStatus.loading 
//                 ? 'bg-blue-50 border-blue-200 text-blue-800'
//                 : professorUploadStatus.success 
//                   ? 'bg-green-50 border-green-200 text-green-800' 
//                   : 'bg-red-50 border-red-200 text-red-800'
//             }`}
//           >
//             <div className="flex items-start gap-3">
//               {professorUploadStatus.loading ? (
//                 <Loader2 size={20} className="animate-spin text-blue-600 mt-0.5" />
//               ) : professorUploadStatus.success ? (
//                 <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
//               ) : (
//                 <AlertCircle size={20} className="text-red-600 mt-0.5" />
//               )}
//               <div className="flex-1">
//                 <h4 className="font-[800] text-[14px]">
//                   {professorUploadStatus.loading ? 'Processing Professors Excel File...' : professorUploadStatus.message}
//                 </h4>
                
//                 {professorUploadStatus.errors.length > 0 && (
//                   <div className="mt-3 max-h-[150px] overflow-y-auto rounded-xl bg-white/50 p-3 text-[12px] space-y-1">
//                     <p className="font-bold text-[#1e293b] mb-1">Execution Details / Warnings:</p>
//                     {professorUploadStatus.errors.map((err, idx) => (
//                       <p key={idx} className="text-red-700 flex items-center gap-1">
//                         • {err}
//                       </p>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               {!professorUploadStatus.loading && (
//                 <button 
//                   onClick={() => setProfessorUploadStatus({ loading: false, success: null, errors: [], message: '' })}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={18} />
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* رسالة نتيجة استيراد Past Years Projects */}
//       <AnimatePresence>
//         {(pastProjectsUploadStatus.success !== null || pastProjectsUploadStatus.loading) && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className={`rounded-[20px] p-6 border ${
//               pastProjectsUploadStatus.loading 
//                 ? 'bg-blue-50 border-blue-200 text-blue-800'
//                 : pastProjectsUploadStatus.success 
//                   ? 'bg-green-50 border-green-200 text-green-800' 
//                   : 'bg-red-50 border-red-200 text-red-800'
//             }`}
//           >
//             <div className="flex items-start gap-3">
//               {pastProjectsUploadStatus.loading ? (
//                 <Loader2 size={20} className="animate-spin text-blue-600 mt-0.5" />
//               ) : pastProjectsUploadStatus.success ? (
//                 <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
//               ) : (
//                 <AlertCircle size={20} className="text-red-600 mt-0.5" />
//               )}
//               <div className="flex-1">
//                 <h4 className="font-[800] text-[14px]">
//                   {pastProjectsUploadStatus.loading ? 'Processing Past Projects Excel File...' : pastProjectsUploadStatus.message}
//                 </h4>

//                 {pastProjectsUploadStatus.errors.length > 0 && (
//                   <div className="mt-3 max-h-[150px] overflow-y-auto rounded-xl bg-white/50 p-3 text-[12px] space-y-1">
//                     <p className="font-bold text-[#1e293b] mb-1">Execution Details / Warnings:</p>
//                     {pastProjectsUploadStatus.errors.map((err, idx) => (
//                       <p key={idx} className="text-red-700 flex items-center gap-1">
//                         • {err}
//                       </p>
//                     ))}
//                   </div>
//                 )}
//               </div>
//               {!pastProjectsUploadStatus.loading && (
//                 <button 
//                   onClick={() => setPastProjectsUploadStatus({ loading: false, success: null, errors: [], message: '' })}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X size={18} />
//                 </button>
//               )}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
      
//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
//         <StatCard
//           title="Total Students"
//           value={stats.loading ? '...' : stats.studentsCount}
//           icon={GraduationCap}
//           iconBg="bg-blue-50"
//           iconColor="text-blue-500"
//         />
//         <StatCard
//           title="Total Professors"
//           value={stats.loading ? '...' : stats.professorsCount}
//           icon={Users}
//           iconBg="bg-green-50"
//           iconColor="text-green-500"
//         />
//         <StatCard
//           title="Active Courses"
//           value={stats.loading ? '...' : stats.activeCoursesCount}
//           icon={BookOpen}
//           iconBg="bg-orange-50"
//           iconColor="text-orange-500"
//         />
//         <StatCard
//           title="Pending Approvals"
//           value={stats.loading ? '...' : stats.pendingApprovalsCount}
//           icon={Clock}
//           iconBg="bg-red-50"
//           iconColor="text-red-500"
//         />
//       </div>

//       {/* Main Grid */}
//       <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.8fr_1fr]">
//         {/* Recent Enrollments */}
//         <div className="rounded-[24px] border border-[#e2e8f0] bg-white p-8 shadow-sm">
//           <h2 className="mb-6 text-[18px] font-[800] text-[#1e293b]">Recent Enrollments</h2>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="text-left text-[11px] font-[800] uppercase tracking-widest text-[#94a3b8]">
//                   <th className="pb-5">STUDENT</th>
//                   <th className="pb-5">COURSE</th>
//                   <th className="pb-5">COURSE LEVEL</th>
//                   <th className="pb-5">COURSE SEMESTER</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#f1f5f9]">
//                 {enrollmentLoading ? (
//                   <tr>
//                     <td colSpan={4} className="py-8 text-center text-[#94a3b8] text-[13px]">
//                       <Loader2 size={18} className="animate-spin inline mr-2" />
//                       Loading...
//                     </td>
//                   </tr>
//                 ) : recentEnrollment ? (
//                   <tr className="group text-[13px] text-[#1e293b] transition-colors hover:bg-[#f8fafc]">
//                     <td className="py-5 font-medium">{recentEnrollment.studentName}</td>
//                     <td className="py-5 text-[#64748b]">{recentEnrollment.courseName}</td>
//                     <td className="py-5">
//                       <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-[800] text-blue-600">
//                         {recentEnrollment.courseLevel}
//                       </span>
//                     </td>
//                     <td className="py-5 text-[#64748b]">{recentEnrollment.courseSemester}</td>
//                   </tr>
//                 ) : (
//                   <tr>
//                     <td colSpan={4} className="py-8 text-center text-[#94a3b8] text-[13px]">
//                       No enrollments found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* System Health */}
//         <div className="rounded-[24px] border border-[#e2e8f0] bg-white p-8 shadow-sm">
//           <h2 className="mb-8 text-[18px] font-[800] text-[#1e293b]">System Health</h2>
//           {systemHealth.loading ? (
//             <div className="flex items-center justify-center py-10 text-[#94a3b8]">
//               <Loader2 size={20} className="animate-spin mr-2" /> Checking status...
//             </div>
//           ) : (
//             <div className="space-y-8">
//               <div className="flex items-center justify-between">
//                 <span className="text-[14px] font-medium text-[#64748b]">Database</span>
//                 <span className={`text-[14px] font-[800] ${healthColor(systemHealth.database)}`}>
//                   {systemHealth.database}
//                 </span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-[14px] font-medium text-[#64748b]">Auth Service</span>
//                 <span className={`text-[14px] font-[800] ${healthColor(systemHealth.authService)}`}>
//                   {systemHealth.authService}
//                 </span>
//               </div>
//               <div className="pt-4">
//                 <div className="h-2 w-full rounded-full bg-[#f1f5f9]">
//                   <div
//                     className="h-full rounded-full bg-[#3d6c8a]"
//                     style={{ width: `${systemHealth.loadPercentage ?? 0}%` }}
//                   ></div>
//                 </div>
//                 <p className="mt-4 text-[12px] font-semibold text-[#94a3b8]">
//                   {systemHealth.loadPercentage ?? 0}% Load Used
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  Download, // تم تغيير Upload إلى Download لتصبح الأسهم متجهة لأسفل
  AlertCircle,
  CheckCircle2,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, iconBg, iconColor }) => (
  <motion.div 
    whileHover={{ 
      scale: 1.05,
      y: -8,
    }}
    transition={{ 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    }}
    className="flex cursor-pointer items-center gap-4 rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-sm hover:shadow-xl transition-shadow"
  >
    <div className={`flex h-12 w-12 items-center justify-center rounded-[12px] ${iconBg} ${iconColor}`}>
      <Icon size={22} />
    </div>
    <div>
      <p className="text-[10px] font-[800] uppercase tracking-wider text-[#94a3b8]">{title}</p>
      <h3 className="text-3xl font-bold text-[#1e293b] leading-tight">{value}</h3>
    </div>
  </motion.div>
);

export default function AdminOverview() {
  const studentFileInputRef = useRef(null);
  const professorFileInputRef = useRef(null);
  const pastProjectsFileInputRef = useRef(null);
  const resultsFileInputRef = useRef(null);

  const [uploadStatus, setUploadStatus] = useState({
    loading: false,
    success: null,
    errors: [],
    message: ''
  });

  const [professorUploadStatus, setProfessorUploadStatus] = useState({
    loading: false,
    success: null,
    errors: [],
    message: ''
  });

  const [pastProjectsUploadStatus, setPastProjectsUploadStatus] = useState({
    loading: false,
    success: null,
    errors: [],
    message: ''
  });

  const [resultsUploadStatus, setResultsUploadStatus] = useState({
    loading: false,
    success: null,
    errors: [],
    message: ''
  });

  // ====== Recent Enrollment (latest one from DB) ======
  const [recentEnrollment, setRecentEnrollment] = useState(null);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);

  // ====== System Health ======
  const [systemHealth, setSystemHealth] = useState({
    loading: true,
    database: null,   
    authService: null, 
    loadPercentage: null
  });

  // ====== Stats (Students / Professors / Active Courses / Pending Approvals) ======
  const [stats, setStats] = useState({
    loading: true,
    studentsCount: null,
    professorsCount: null,
    activeCoursesCount: null,
    pendingApprovalsCount: null
  });

  useEffect(() => {
    fetchRecentEnrollment();
    fetchSystemHealth();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setStats(prev => ({ ...prev, loading: true }));
    const token = localStorage.getItem('userToken');
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      const [studentsRes, professorsRes, coursesRes, pendingRes] = await Promise.all([
        fetch('https://localhost:7061/api/Admin/get-students-count', { headers }),
        fetch('https://localhost:7061/api/Admin/get-professors-count', { headers }),
        fetch('https://localhost:7061/api/Admin/get-active-courses-count', { headers }),
        fetch('https://localhost:7061/api/Admin/get-pending-approvals-count', { headers })
      ]);

      const studentsData = studentsRes.ok ? await studentsRes.json() : { studentsCount: 0 };
      const professorsData = professorsRes.ok ? await professorsRes.json() : { totalProfessorsCount: 0 };
      const coursesData = coursesRes.ok ? await coursesRes.json() : { activeCoursesCount: 0 };
      const pendingData = pendingRes.ok ? await pendingRes.json() : { pendingApprovalsCount: 0 };

      setStats({
        loading: false,
        studentsCount: studentsData.studentsCount,
        professorsCount: professorsData.totalProfessorsCount,
        activeCoursesCount: coursesData.activeCoursesCount,
        pendingApprovalsCount: pendingData.pendingApprovalsCount
      });
    } catch (error) {
      setStats({
        loading: false,
        studentsCount: 0,
        professorsCount: 0,
        activeCoursesCount: 0,
        pendingApprovalsCount: 0
      });
    }
  };

  const fetchRecentEnrollment = async () => {
    setEnrollmentLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('https://localhost:7061/api/Admin/recent-enrollment', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setRecentEnrollment(data);
      } else {
        setRecentEnrollment(null);
      }
    } catch (error) {
      setRecentEnrollment(null);
    } finally {
      setEnrollmentLoading(false);
    }
  };

  const fetchSystemHealth = async () => {
    setSystemHealth(prev => ({ ...prev, loading: true }));
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch('https://localhost:7061/api/Admin/system-health', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setSystemHealth({
          loading: false,
          database: data.database,
          authService: data.authService,
          loadPercentage: data.loadPercentage
        });
      } else {
        setSystemHealth({ loading: false, database: 'Unknown', authService: 'Unknown', loadPercentage: 0 });
      }
    } catch (error) {
      setSystemHealth({ loading: false, database: 'Unknown', authService: 'Unknown', loadPercentage: 0 });
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = /(\.xlsx|\.xls)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setUploadStatus({
        loading: false,
        success: false,
        errors: ['Only Excel files (.xlsx, .xls) are allowed.'],
        message: 'Invalid file type'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploadStatus({ loading: true, success: null, errors: [], message: '' });

    try {
      const token = localStorage.getItem('userToken'); 

      const response = await fetch('https://localhost:7061/api/Admin/import-students', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        setUploadStatus({
          loading: false,
          success: true,
          errors: data.errors || [],
          message: data.message || `${data.importedCount} students imported successfully.`
        });
        fetchRecentEnrollment();
        fetchStats();
      } else {
        setUploadStatus({
          loading: false,
          success: false,
          errors: typeof data === 'string' ? [data] : (data.errors || ['Something went wrong']),
          message: typeof data === 'string' ? data : (data.message || 'Failed to import students')
        });
      }
    } catch (error) {
      setUploadStatus({
        loading: false,
        success: false,
        errors: ['Unable to connect to the server. Please try again later.'],
        message: 'Network Error'
      });
    }

    if (studentFileInputRef.current) studentFileInputRef.current.value = '';
  };

  const handleProfessorFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = /(\.xlsx|\.xls)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setProfessorUploadStatus({
        loading: false,
        success: false,
        errors: ['Only Excel files (.xlsx, .xls) are allowed.'],
        message: 'Invalid file type'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setProfessorUploadStatus({ loading: true, success: null, errors: [], message: '' });

    try {
      const token = localStorage.getItem('userToken');

      const response = await fetch('https://localhost:7061/api/Admin/import-professors', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        // الـ endpoint بيرجع importedInternalCount و importedExternalCount منفصلين
        // (مش importedCount موحّد)، فبنجمعهم هنا كـ fallback لو message مش موجودة
        const totalImported =
          (data.importedInternalCount || 0) + (data.importedExternalCount || 0);

        setProfessorUploadStatus({
          loading: false,
          success: true,
          errors: data.errors || [],
          message: data.message || `${totalImported} professors imported successfully.`
        });
        fetchStats();
      } else {
        setProfessorUploadStatus({
          loading: false,
          success: false,
          errors: typeof data === 'string' ? [data] : (data.errors || ['Something went wrong']),
          message: typeof data === 'string' ? data : (data.message || 'Failed to import professors')
        });
      }
    } catch (error) {
      setProfessorUploadStatus({
        loading: false,
        success: false,
        errors: ['Unable to connect to the server. Please try again later.'],
        message: 'Network Error'
      });
    }

    if (professorFileInputRef.current) professorFileInputRef.current.value = '';
  };

  // ====== Import Past Years Projects (POST -> AdminController) ======
  const handlePastProjectsFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = /(\.xlsx|\.xls)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setPastProjectsUploadStatus({
        loading: false,
        success: false,
        errors: ['Only Excel files (.xlsx, .xls) are allowed.'],
        message: 'Invalid file type'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setPastProjectsUploadStatus({ loading: true, success: null, errors: [], message: '' });

    try {
      const token = localStorage.getItem('userToken');

      const response = await fetch('https://localhost:7061/api/Admin/past-projects/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        setPastProjectsUploadStatus({
          loading: false,
          success: true,
          errors: [],
          message: typeof data === 'string' ? data : (data.message || 'Projects imported successfully.')
        });
      } else {
        setPastProjectsUploadStatus({
          loading: false,
          success: false,
          errors: typeof data === 'string' ? [data] : (data.errors || [data.message || 'Something went wrong']),
          message: typeof data === 'string' ? data : (data.message || 'Failed to import projects')
        });
      }
    } catch (error) {
      setPastProjectsUploadStatus({
        loading: false,
        success: false,
        errors: ['Unable to connect to the server. Please try again later.'],
        message: 'Network Error'
      });
    }

    if (pastProjectsFileInputRef.current) pastProjectsFileInputRef.current.value = '';
  };

  // ====== Import Enrollment Results (Passed / Failed) ======
  const handleResultsFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedExtensions = /(\.xlsx|\.xls)$/i;
    if (!allowedExtensions.exec(file.name)) {
      setResultsUploadStatus({
        loading: false,
        success: false,
        errors: ['Only Excel files (.xlsx, .xls) are allowed.'],
        message: 'Invalid file type'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setResultsUploadStatus({ loading: true, success: null, errors: [], message: '' });

    try {
      const token = localStorage.getItem('userToken');

      const response = await fetch('https://localhost:7061/api/Admin/import-results', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (response.ok) {
        setResultsUploadStatus({
          loading: false,
          success: true,
          errors: [],
          message: typeof data === 'string'
            ? data
            : (data.message || `${data.updated ?? 0} enrollments updated successfully.`)
        });
        fetchRecentEnrollment();
        fetchStats();
      } else {
        setResultsUploadStatus({
          loading: false,
          success: false,
          errors: typeof data === 'string' ? [data] : (data.errors || [data.message || 'Something went wrong']),
          message: typeof data === 'string' ? data : (data.message || 'Failed to import results')
        });
      }
    } catch (error) {
      setResultsUploadStatus({
        loading: false,
        success: false,
        errors: ['Unable to connect to the server. Please try again later.'],
        message: 'Network Error'
      });
    }

    if (resultsFileInputRef.current) resultsFileInputRef.current.value = '';
  };

  const triggerStudentFileSelect = () => {
    studentFileInputRef.current?.click();
  };

  const triggerProfessorFileSelect = () => {
    professorFileInputRef.current?.click();
  };

  const triggerPastProjectsFileSelect = () => {
    pastProjectsFileInputRef.current?.click();
  };

  const triggerResultsFileSelect = () => {
    resultsFileInputRef.current?.click();
  };

  const healthColor = (status) => {
    if (!status) return 'text-[#94a3b8]';
    const normalized = status.toLowerCase();
    if (['healthy', 'active', 'ok', 'up'].includes(normalized)) return 'text-[#10b981]';
    if (['degraded', 'warning'].includes(normalized)) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="flex flex-col gap-8 p-6">
      
      {/* قسم رفع الملفات والتحكم العلوي */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-6 rounded-[24px] border border-[#e2e8f0] shadow-sm">
        <div>
          <h1 className="text-xl font-[800] text-[#1e293b]">Data Management</h1>
          <p className="text-[13px] text-[#64748b]">Import students, professors, past years projects, and enrollment results directly via Excel spreadsheets.</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {/* Import Students */}
          <input 
            type="file" 
            ref={studentFileInputRef} 
            onChange={handleFileChange} 
            accept=".xlsx, .xls" 
            className="hidden" 
          />
          <button
            onClick={triggerStudentFileSelect}
            disabled={uploadStatus.loading}
            className="flex items-center gap-1.5 rounded-xl bg-[#3d6c8a] px-4 py-2.5 text-[12px] font-[800] text-white shadow-sm transition-all hover:bg-[#2c526b] disabled:opacity-50 whitespace-nowrap"
          >
            {uploadStatus.loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {uploadStatus.loading ? 'Importing...' : 'Import Students'}
          </button>

          {/* Import Professors */}
          <input 
            type="file" 
            ref={professorFileInputRef} 
            onChange={handleProfessorFileChange} 
            accept=".xlsx, .xls" 
            className="hidden" 
          />
          <button
            onClick={triggerProfessorFileSelect}
            disabled={professorUploadStatus.loading}
            className="flex items-center gap-1.5 rounded-xl bg-[#3d6c8a] px-4 py-2.5 text-[12px] font-[800] text-white shadow-sm transition-all hover:bg-[#2c526b] disabled:opacity-50 whitespace-nowrap"
          >
            {professorUploadStatus.loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {professorUploadStatus.loading ? 'Importing...' : 'Import Professors'}
          </button>

          {/* Import Past Years Projects */}
          <input 
            type="file" 
            ref={pastProjectsFileInputRef} 
            onChange={handlePastProjectsFileChange} 
            accept=".xlsx, .xls" 
            className="hidden" 
          />
          <button
            onClick={triggerPastProjectsFileSelect}
            disabled={pastProjectsUploadStatus.loading}
            className="flex items-center gap-1.5 rounded-xl bg-[#3d6c8a] px-4 py-2.5 text-[12px] font-[800] text-white shadow-sm transition-all hover:bg-[#2c526b] disabled:opacity-50 whitespace-nowrap"
          >
            {pastProjectsUploadStatus.loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {pastProjectsUploadStatus.loading ? 'Importing...' : 'Import Past Projects'}
          </button>

          {/* Import Enrollment Results */}
          <input 
            type="file" 
            ref={resultsFileInputRef} 
            onChange={handleResultsFileChange} 
            accept=".xlsx, .xls" 
            className="hidden" 
          />
          <button
            onClick={triggerResultsFileSelect}
            disabled={resultsUploadStatus.loading}
            className="flex items-center gap-1.5 rounded-xl bg-[#3d6c8a] px-4 py-2.5 text-[12px] font-[800] text-white shadow-sm transition-all hover:bg-[#2c526b] disabled:opacity-50 whitespace-nowrap"
          >
            {resultsUploadStatus.loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {resultsUploadStatus.loading ? 'Importing...' : 'Import Results'}
          </button>
        </div>
      </div>

      {/* رسالة نتيجة استيراد الطلبة */}
      <AnimatePresence>
        {(uploadStatus.success !== null || uploadStatus.loading) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-[20px] p-6 border ${
              uploadStatus.loading 
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : uploadStatus.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-start gap-3">
              {uploadStatus.loading ? (
                <Loader2 size={20} className="animate-spin text-blue-600 mt-0.5" />
              ) : uploadStatus.success ? (
                <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-[800] text-[14px]">
                  {uploadStatus.loading ? 'Processing Students Excel File...' : uploadStatus.message}
                </h4>
                
                {uploadStatus.errors.length > 0 && (
                  <div className="mt-3 max-h-[150px] overflow-y-auto rounded-xl bg-white/50 p-3 text-[12px] space-y-1">
                    <p className="font-bold text-[#1e293b] mb-1">Execution Details / Warnings:</p>
                    {uploadStatus.errors.map((err, idx) => (
                      <p key={idx} className="text-red-700 flex items-center gap-1">
                        • {err}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {!uploadStatus.loading && (
                <button 
                  onClick={() => setUploadStatus({ loading: false, success: null, errors: [], message: '' })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* رسالة نتيجة استيراد البروفيسورز */}
      <AnimatePresence>
        {(professorUploadStatus.success !== null || professorUploadStatus.loading) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-[20px] p-6 border ${
              professorUploadStatus.loading 
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : professorUploadStatus.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-start gap-3">
              {professorUploadStatus.loading ? (
                <Loader2 size={20} className="animate-spin text-blue-600 mt-0.5" />
              ) : professorUploadStatus.success ? (
                <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-[800] text-[14px]">
                  {professorUploadStatus.loading ? 'Processing Professors Excel File...' : professorUploadStatus.message}
                </h4>
                
                {professorUploadStatus.errors.length > 0 && (
                  <div className="mt-3 max-h-[150px] overflow-y-auto rounded-xl bg-white/50 p-3 text-[12px] space-y-1">
                    <p className="font-bold text-[#1e293b] mb-1">Execution Details / Warnings:</p>
                    {professorUploadStatus.errors.map((err, idx) => (
                      <p key={idx} className="text-red-700 flex items-center gap-1">
                        • {err}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {!professorUploadStatus.loading && (
                <button 
                  onClick={() => setProfessorUploadStatus({ loading: false, success: null, errors: [], message: '' })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* رسالة نتيجة استيراد Past Years Projects */}
      <AnimatePresence>
        {(pastProjectsUploadStatus.success !== null || pastProjectsUploadStatus.loading) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-[20px] p-6 border ${
              pastProjectsUploadStatus.loading 
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : pastProjectsUploadStatus.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-start gap-3">
              {pastProjectsUploadStatus.loading ? (
                <Loader2 size={20} className="animate-spin text-blue-600 mt-0.5" />
              ) : pastProjectsUploadStatus.success ? (
                <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-[800] text-[14px]">
                  {pastProjectsUploadStatus.loading ? 'Processing Past Projects Excel File...' : pastProjectsUploadStatus.message}
                </h4>

                {pastProjectsUploadStatus.errors.length > 0 && (
                  <div className="mt-3 max-h-[150px] overflow-y-auto rounded-xl bg-white/50 p-3 text-[12px] space-y-1">
                    <p className="font-bold text-[#1e293b] mb-1">Execution Details / Warnings:</p>
                    {pastProjectsUploadStatus.errors.map((err, idx) => (
                      <p key={idx} className="text-red-700 flex items-center gap-1">
                        • {err}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {!pastProjectsUploadStatus.loading && (
                <button 
                  onClick={() => setPastProjectsUploadStatus({ loading: false, success: null, errors: [], message: '' })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* رسالة نتيجة استيراد نتائج التسجيل (Passed/Failed) */}
      <AnimatePresence>
        {(resultsUploadStatus.success !== null || resultsUploadStatus.loading) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`rounded-[20px] p-6 border ${
              resultsUploadStatus.loading 
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : resultsUploadStatus.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-start gap-3">
              {resultsUploadStatus.loading ? (
                <Loader2 size={20} className="animate-spin text-blue-600 mt-0.5" />
              ) : resultsUploadStatus.success ? (
                <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-600 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className="font-[800] text-[14px]">
                  {resultsUploadStatus.loading ? 'Processing Results Excel File...' : resultsUploadStatus.message}
                </h4>

                {resultsUploadStatus.errors.length > 0 && (
                  <div className="mt-3 max-h-[150px] overflow-y-auto rounded-xl bg-white/50 p-3 text-[12px] space-y-1">
                    <p className="font-bold text-[#1e293b] mb-1">Execution Details / Warnings:</p>
                    {resultsUploadStatus.errors.map((err, idx) => (
                      <p key={idx} className="text-red-700 flex items-center gap-1">
                        • {err}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              {!resultsUploadStatus.loading && (
                <button 
                  onClick={() => setResultsUploadStatus({ loading: false, success: null, errors: [], message: '' })}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats.loading ? '...' : stats.studentsCount}
          icon={GraduationCap}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />
        <StatCard
          title="Total Professors"
          value={stats.loading ? '...' : stats.professorsCount}
          icon={Users}
          iconBg="bg-green-50"
          iconColor="text-green-500"
        />
        <StatCard
          title="Active Courses"
          value={stats.loading ? '...' : stats.activeCoursesCount}
          icon={BookOpen}
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.loading ? '...' : stats.pendingApprovalsCount}
          icon={Clock}
          iconBg="bg-red-50"
          iconColor="text-red-500"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.8fr_1fr]">
        {/* Recent Enrollments */}
        <div className="rounded-[24px] border border-[#e2e8f0] bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-[18px] font-[800] text-[#1e293b]">Recent Enrollments</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-[11px] font-[800] uppercase tracking-widest text-[#94a3b8]">
                  <th className="pb-5">STUDENT</th>
                  <th className="pb-5">COURSE</th>
                  <th className="pb-5">COURSE LEVEL</th>
                  <th className="pb-5">COURSE SEMESTER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {enrollmentLoading ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#94a3b8] text-[13px]">
                      <Loader2 size={18} className="animate-spin inline mr-2" />
                      Loading...
                    </td>
                  </tr>
                ) : recentEnrollment ? (
                  <tr className="group text-[13px] text-[#1e293b] transition-colors hover:bg-[#f8fafc]">
                    <td className="py-5 font-medium">{recentEnrollment.studentName}</td>
                    <td className="py-5 text-[#64748b]">{recentEnrollment.courseName}</td>
                    <td className="py-5">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-[11px] font-[800] text-blue-600">
                        {recentEnrollment.courseLevel}
                      </span>
                    </td>
                    <td className="py-5 text-[#64748b]">{recentEnrollment.courseSemester}</td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#94a3b8] text-[13px]">
                      No enrollments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-[24px] border border-[#e2e8f0] bg-white p-8 shadow-sm">
          <h2 className="mb-8 text-[18px] font-[800] text-[#1e293b]">System Health</h2>
          {systemHealth.loading ? (
            <div className="flex items-center justify-center py-10 text-[#94a3b8]">
              <Loader2 size={20} className="animate-spin mr-2" /> Checking status...
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-[#64748b]">Database</span>
                <span className={`text-[14px] font-[800] ${healthColor(systemHealth.database)}`}>
                  {systemHealth.database}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium text-[#64748b]">Auth Service</span>
                <span className={`text-[14px] font-[800] ${healthColor(systemHealth.authService)}`}>
                  {systemHealth.authService}
                </span>
              </div>
              <div className="pt-4">
                <div className="h-2 w-full rounded-full bg-[#f1f5f9]">
                  <div
                    className="h-full rounded-full bg-[#3d6c8a]"
                    style={{ width: `${systemHealth.loadPercentage ?? 0}%` }}
                  ></div>
                </div>
                <p className="mt-4 text-[12px] font-semibold text-[#94a3b8]">
                  {systemHealth.loadPercentage ?? 0}% Load Used
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}