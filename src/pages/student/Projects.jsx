// import React, { useState, useEffect } from 'react';
// import {
//   Plus, Users, Lightbulb,
//   UserCheck, CheckCheck, ChevronLeft, ArrowRight,
//   Star, Trash2, X, Clock, Building, Mail, Phone, ShieldCheck, Loader2, AlertCircle
// } from 'lucide-react';

// const API = import.meta.env.VITE_API_URL;

// export default function StudentProjects() {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [showPastProjects, setShowPastProjects] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);

//   const [isTeamBuildingStarted, setIsTeamBuildingStarted] = useState(false);
//   const [isTeamSubmitted, setIsTeamSubmitted] = useState(false);
//   const [isAdminApproved, setIsAdminApproved] = useState(false);
//   const [hasCheckedSupervisors, setHasCheckedSupervisors] = useState(false);

//   const [projectTitle, setProjectTitle] = useState('');
//   const [projectDescription, setProjectDescription] = useState('');
//   const [isIdeaSubmitted, setIsIdeaSubmitted] = useState(false);
//   const [isSupervisorsApproved, setIsSupervisorsApproved] = useState(false);
//   const [isSuperAdminApproved, setIsSuperAdminApproved] = useState(false);
//   const [proposalData, setProposalData] = useState(null);

//   const [members, setMembers] = useState([]);

//   // ===================== TEAM LIMIT (from DB, configured by SuperAdmin) =====================
//   const [minMembers, setMinMembers] = useState(2);
//   const [maxMembers, setMaxMembers] = useState(6); // fallback default لحد ما يوصل الرد من السيرفر

//   const fetchTeamLimit = async () => {
//     try {
//       const token = localStorage.getItem('userToken');
//       const res = await fetch(`${API}/api/ProjectManagement/team-limit`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (res.ok) {
//         const data = await res.json();
//         if (data?.minMembers) setMinMembers(data.minMembers);
//         if (data?.maxMembers) setMaxMembers(data.maxMembers);
//       }
//     } catch (err) {
//       // في حالة فشل الطلب، هيفضل يشتغل بالقيم الافتراضية (2 - 6)
//       console.error('Failed to load team limit', err);
//     }
//   };

//   const [apiError, setApiError] = useState(null);
//   const [validationErrors, setValidationErrors] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // ===================== SUPERVISORS (from DB via /my-supervisors) =====================
//   const [supervisorsData, setSupervisorsData] = useState(null); // { internal_: {...}, external: {...} }
//   const [supervisorsLoading, setSupervisorsLoading] = useState(false);
//   const [supervisorsError, setSupervisorsError] = useState(null);

//   const fetchSupervisors = async () => {
//     setSupervisorsLoading(true);
//     setSupervisorsError(null);
//     try {
//       const token = localStorage.getItem('userToken');
//       const res = await fetch(`${API}/api/ProjectManagement/my-supervisors`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (!res.ok) {
//         setSupervisorsError('Failed to load supervisors info.');
//         setSupervisorsData(null);
//         return;
//       }
//       const data = await res.json();
//       setSupervisorsData(data);
//     } catch (err) {
//       setSupervisorsError('Unable to connect to the server.');
//       setSupervisorsData(null);
//     } finally {
//       setSupervisorsLoading(false);
//     }
//   };

//   // ===================== PAST YEARS PROJECTS =====================
//   const [pastProjects, setPastProjects] = useState([]);
//   const [pastProjectsLoading, setPastProjectsLoading] = useState(false);
//   const [pastProjectsError, setPastProjectsError] = useState(null);

//   const fetchPastProjects = async () => {
//     setPastProjectsLoading(true);
//     setPastProjectsError(null);
//     try {
//       const token = localStorage.getItem('userToken');
//       // GET endpoint موجود في ProjectManagementController
//       const res = await fetch(`${API}/api/ProjectManagement/past-projects`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (!res.ok) {
//         setPastProjectsError('Failed to load past years projects.');
//         setPastProjects([]);
//         return;
//       }
//       const data = await res.json();
//       setPastProjects(data);
//     } catch (err) {
//       setPastProjectsError('Unable to connect to the server.');
//       setPastProjects([]);
//     } finally {
//       setPastProjectsLoading(false);
//     }
//   };

//   const handleOpenPastProjects = () => {
//     setShowPastProjects(true);
//     fetchPastProjects();
//   };

//   // ===================== FETCH STATUS ON LOAD =====================
//   useEffect(() => {
//     const fetchStatus = async () => {
//       const token = localStorage.getItem('userToken');
//       setPageLoading(true);
//       try {
//         const res = await fetch(`${API}/api/ProjectManagement/my-status`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         if (!res.ok) return;
//         const data = await res.json();

//         const { step, subStep, proposal } = data;

//         if (subStep === 'noTeam') {
//           // لا team → Step 0 ابدأ من الأول
//           setCurrentStep(0);

//         } else if (subStep === 'waitingSupervisor') {
//           // عنده team بس لا supervisor assigned لسه
//           setCurrentStep(0);
//           setIsTeamBuildingStarted(true);
//           setIsTeamSubmitted(true);
//           setIsAdminApproved(false);

//         } else if (subStep === 'waitingProposal') {
//           // عنده team و supervisor assigned، ينتقل لصفحة الـ supervisors
//           setCurrentStep(0);
//           setIsTeamBuildingStarted(true);
//           setIsTeamSubmitted(true);
//           setIsAdminApproved(true);
//           fetchSupervisors();

//         } else if (subStep === 'pendingProfessors') {
//           // بعت proposal وفي انتظار الدكاترة
//           setCurrentStep(1);
//           setIsTeamBuildingStarted(true);
//           setIsTeamSubmitted(true);
//           setIsAdminApproved(true);
//           setIsIdeaSubmitted(true);
//           setProposalData(proposal);
//           setProjectTitle(proposal.projectName);
//           setProjectDescription(proposal.projectDescription);
//           fetchSupervisors();

//         } else if (subStep === 'rejected') {
//           // اتردت
//           setCurrentStep(1);
//           setIsTeamBuildingStarted(true);
//           setIsTeamSubmitted(true);
//           setIsAdminApproved(true);
//           setIsIdeaSubmitted(true);
//           setProposalData(proposal);
//           setProjectTitle(proposal.projectName);
//           setProjectDescription(proposal.projectDescription);
//           fetchSupervisors();

//         } else if (subStep === 'pendingSuperAdmin') {
//           // الدكاترة وافقوا، في انتظار super admin
//           setCurrentStep(1);
//           setIsTeamBuildingStarted(true);
//           setIsTeamSubmitted(true);
//           setIsAdminApproved(true);
//           setIsIdeaSubmitted(true);
//           setIsSupervisorsApproved(true);
//           setProposalData(proposal);
//           setProjectTitle(proposal.projectName);
//           setProjectDescription(proposal.projectDescription);
//           fetchSupervisors();

//         } else if (subStep === 'approved') {
//           // اتموافق عليه نهائياً
//           setCurrentStep(3);
//           setIsTeamBuildingStarted(true);
//           setIsTeamSubmitted(true);
//           setIsAdminApproved(true);
//           setIsIdeaSubmitted(true);
//           setIsSupervisorsApproved(true);
//           setIsSuperAdminApproved(true);
//           setProposalData(proposal);
//           setProjectTitle(proposal.projectName);
//           setProjectDescription(proposal.projectDescription);
//           fetchSupervisors();
//         }

//       } catch (err) {
//         console.error(err);
//       } finally {
//         setPageLoading(false);
//       }
//     };

//     fetchStatus();
//     fetchTeamLimit();
//   }, []);

//   // ===================== HANDLERS =====================
//   const handleStartTeamBuilding = async () => {
//     setIsTeamBuildingStarted(true);
//     setIsLoading(true);
//     setApiError(null);
//     try {
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API}/api/ProjectManagement/my-info`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });

//       if (!response.ok) {
//         setApiError("Failed to load your info. Please try again.");
//         setIsTeamBuildingStarted(false); // نرجع الصفحة لحالتها الأولى لأن مفيش بيانات صحيحة للقائد
//         return;
//       }

//       const data = await response.json();

//       if (!data?.fullName || !data?.ssn) {
//         setApiError("Your info is incomplete. Please contact the admin.");
//         setIsTeamBuildingStarted(false);
//         return;
//       }

//       setMembers([{
//         id: Date.now(),
//         fullName: data.fullName,
//         ssn: data.ssn,
//         isLeader: true,
//         isFixed: true
//       }]);
//     } catch (err) {
//       setApiError("Failed to load your info.");
//       setIsTeamBuildingStarted(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const addMember = () => {
//     if (members.length >= maxMembers) {
//       alert(`You cannot add more than ${maxMembers} members.`);
//       return;
//     }
//     setMembers([...members, { id: Date.now(), fullName: '', ssn: '', isLeader: false, isFixed: false }]);
//   };

//   const removeMember = (id) => {
//     const member = members.find(m => m.id === id);
//     if (member?.isFixed) return;
//     setMembers(members.filter(m => m.id !== id));
//   };

//   const updateMember = (id, field, value) => {
//     const member = members.find(m => m.id === id);
//     if (member?.isLeader) return;
//     let filteredValue = value;
//     if (field === 'fullName') filteredValue = value.replace(/[^a-zA-Z\s\u0600-\u06FF]/g, '');
//     else if (field === 'ssn') filteredValue = value.replace(/[^\d]/g, '');
//     setMembers(members.map(m => m.id === id ? { ...m, [field]: filteredValue } : m));
//   };

//   const isTeamFormValid = () => {
//     if (members.length !== maxMembers) return false;
//     return members.every(m => (m.fullName ?? '').trim() !== '' && (m.ssn ?? '').trim() !== '');
//   };

//   const handleRegisterTeam = async () => {
//     if (!isTeamFormValid()) return;
//     setIsLoading(true);
//     setApiError(null);
//     setValidationErrors([]);

//     const apiMembers = members
//       .filter(m => !m.isLeader)
//       .map(m => ({ fullName: m.fullName, ssn: m.ssn }));

//     try {
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API}/api/ProjectManagement/register-team`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ members: apiMembers })
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setIsTeamSubmitted(true);
//       } else {
//         if (data.errors) setValidationErrors(data.errors);
//         else setApiError(data.message || data || "حدث خطأ أثناء تسجيل الفريق");
//       }
//     } catch (error) {
//       setApiError("عذراً، تعذر الاتصال بالسيرفر.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleResubmitProposal = async () => {
//     setIsLoading(true);
//     setApiError(null);
//     try {
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API}/api/ProjectManagement/resubmit-proposal`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       const data = await response.json();
//       if (response.ok) {
//         // نرجع الطالب لفورم تقديم فكرة جديدة من الأول
//         setIsIdeaSubmitted(false);
//         setProposalData(null);
//         setProjectTitle('');
//         setProjectDescription('');
//         setIsSupervisorsApproved(false);
//         setIsSuperAdminApproved(false);
//       } else {
//         setApiError(data.message || data || "حدث خطأ أثناء إعادة تقديم الفكرة");
//       }
//     } catch (error) {
//       setApiError("عذراً، تعذر الاتصال بالسيرفر.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSubmitProposal = async () => {

//     if (projectTitle.trim() === '' || projectDescription.trim() === '') return;
//     setIsLoading(true);
//     setApiError(null);

//     try {
//       const token = localStorage.getItem('userToken');
//       const response = await fetch(`${API}/api/ProjectManagement/submit-proposal`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
//         body: JSON.stringify({ projectName: projectTitle, projectDescription: projectDescription })
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setIsIdeaSubmitted(true);
//         const proposalRes = await fetch(`${API}/api/ProjectManagement/my-proposal`, {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         if (proposalRes.ok) {
//           const proposalInfo = await proposalRes.json();
//           setProposalData(proposalInfo);
//         }
//       } else {
//         setApiError(data.message || data || "حدث خطأ أثناء تقديم الفكرة");
//       }
//     } catch (error) {
//       setApiError("عذراً، تعذر الاتصال بالسيرفر.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const steps = [
//     { title: 'Team Building', icon: Users },
//     { title: 'Idea Submission', icon: Lightbulb },
//     { title: 'Supervisor Approval', icon: UserCheck },
//     { title: 'Final Approval', icon: CheckCheck },
//   ];

//   // ===================== PAGE LOADING =====================
//   if (pageLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-slate-400 text-sm animate-pulse">Loading your project status...</div>
//       </div>
//     );
//   }

//   // ===================== RENDER =====================
//   return (
//     <div className="flex flex-col gap-6 font-sans">

//       {showPastProjects && (
//         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
//           <div className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-xl font-bold text-slate-900">📚 Past Years Projects</h2>
//               <button onClick={() => setShowPastProjects(false)} className="rounded-full p-2 hover:bg-slate-100">
//                 <X size={20} />
//               </button>
//             </div>

//             {pastProjectsLoading ? (
//               <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
//                 <Loader2 size={18} className="animate-spin mr-2" /> Loading projects...
//               </div>
//             ) : pastProjectsError ? (
//               <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//                 <AlertCircle size={16} /> {pastProjectsError}
//               </div>
//             ) : pastProjects.length === 0 ? (
//               <div className="py-12 text-center text-sm text-slate-400">
//                 No past years projects available yet.
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 gap-4">
//                 {pastProjects.map(project => (
//                   <div key={project.id} className="rounded-xl border border-slate-200 p-4">
//                     <h3 className="font-bold text-slate-900">{project.title} ({project.year})</h3>
//                     <p className="text-sm text-slate-500">{project.description}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-2xl font-[800] tracking-tight text-slate-900">Project Management</h1>
//           <p className="text-sm text-slate-500">Manage your graduation project and team collaborations.</p>
//         </div>
//         <button
//           onClick={handleOpenPastProjects}
//           className="flex items-center gap-2 rounded-lg bg-[#3d6c8a] px-5 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-black hover:-translate-y-0.5"
//         >
//           Projects From Past Years
//         </button>
//       </div>

//       {apiError && (
//         <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
//           ⚠️ {apiError}
//         </div>
//       )}

//       {/* Stepper */}
//       <div className="relative mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
//         <div className="absolute top-[60px] left-[10%] right-[10%] h-[4px] rounded-full bg-slate-100">
//           <div className="h-full bg-gradient-to-r from-[#3d6c8a] to-[#77bfde] transition-all duration-700 ease-out"
//             style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
//         </div>
//         <div className="relative flex justify-between">
//           {steps.map((step, index) => {
//             const Icon = step.icon;
//             const isActive = currentStep === index;
//             const isCompleted = currentStep > index;
//             return (
//               <div key={index} className="relative z-10 flex flex-col items-center gap-4">
//                 <div className={`flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 transition-all duration-500
//                   ${isActive ? 'border-[#3d6c8a] bg-gradient-to-br from-[#3d6c8a] to-[#5a9dc7] text-white scale-110 shadow-[0_10px_20px_rgba(61,108,138,0.3)]'
//                     : isCompleted ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-100'
//                     : 'border-slate-200 bg-white text-slate-400'}`}>
//                   {isCompleted ? <CheckCheck size={24} /> : <Icon size={24} />}
//                 </div>
//                 <span className={`text-[13px] font-bold transition-all duration-300 ${isActive ? 'text-[#3d6c8a]' : 'text-slate-400'}`}>
//                   {step.title}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
//         <div className="flex flex-col gap-6">

//           {/* STEP 0 */}
//           {currentStep === 0 && (
//             <>
//               {!isTeamBuildingStarted ? (
//                 // لا team خالص
//                 <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm animate-slideIn">
//                   <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
//                     <Users size={32} />
//                   </div>
//                   <h2 className="text-xl font-bold text-slate-900 mb-2">No Team Found</h2>
//                   <p className="mx-auto max-w-md text-sm text-slate-500 mb-8">
//                     You haven't initialized your graduation team yet. Start the builder to register yourself as the leader.
//                   </p>
//                   <button onClick={handleStartTeamBuilding} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3d6c8a] to-[#2d5169] px-6 py-3.5 text-sm font-bold text-white shadow-md">
//                     <Plus size={18} /> Start Building Team
//                   </button>
//                 </div>

//               ) : isTeamSubmitted && !isAdminApproved ? (
//                 // عنده team بس لسه مفيش supervisor assigned
//                 <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm animate-slideIn">
//                   <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#ecfdf5] text-[#3d6c8a] animate-pulse">
//                     <Clock size={36} />
//                   </div>
//                   <h2 className="text-xl font-bold text-slate-900 mb-3">Team Registered & Processing</h2>
//                   <p className="mx-auto max-w-[460px] text-sm leading-relaxed text-slate-500 mb-6">
//                     Your team details have been locked in the system database. Waiting for supervisor assignment.
//                   </p>
//                   <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-400">
//                     <Building size={14} /> Status: Awaiting Supervisor Assignment
//                   </div>
//                 </div>

//               ) : isAdminApproved ? (
//                 // عنده team و supervisor assigned → يعرض الـ supervisors ويتقدم لـ Step 1
//                 <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm animate-slideIn">
//                   <div className="mb-6">
//                     <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 mb-2">
//                       <CheckCheck size={12} /> Team Structure Configured
//                     </div>
//                     <h2 className="text-xl font-bold text-slate-900">Your Assigned Supervisors</h2>
//                     <p className="text-sm text-slate-500">Review your designated academic guidance advisors contact cards below.</p>
//                   </div>

//                   {supervisorsLoading ? (
//                     <div className="flex items-center justify-center py-10 text-slate-400 text-sm mb-8">
//                       <Loader2 size={18} className="animate-spin mr-2" /> Loading supervisors...
//                     </div>
//                   ) : supervisorsError ? (
//                     <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-8">
//                       <AlertCircle size={16} /> {supervisorsError}
//                     </div>
//                   ) : supervisorsData ? (
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
//                       <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
//                         <span className="text-[10px] font-bold text-[#3d6c8a] bg-[#3d6c8a]/10 px-2 py-0.5 rounded uppercase tracking-wider">Internal Advisor</span>
//                         <h3 className="font-bold text-slate-800 text-base mt-2 mb-3">{supervisorsData.internal_?.name}</h3>
//                         <div className="space-y-1.5 text-xs text-slate-500">
//                           <div className="flex items-center gap-2"><Mail size={14} /> {supervisorsData.internal_?.email}</div>
//                           {supervisorsData.internal_?.phone && (
//                             <div className="flex items-center gap-2"><Phone size={14} /> {supervisorsData.internal_?.phone}</div>
//                           )}
//                           {supervisorsData.internal_?.dept && (
//                             <div className="flex items-center gap-2"><Building size={14} /> {supervisorsData.internal_?.dept}</div>
//                           )}
//                         </div>
//                       </div>
//                       <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
//                         <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider">External Advisor</span>
//                         <h3 className="font-bold text-slate-800 text-base mt-2 mb-3">{supervisorsData.external?.name}</h3>
//                         <div className="space-y-1.5 text-xs text-slate-500">
//                           <div className="flex items-center gap-2"><Mail size={14} /> {supervisorsData.external?.email}</div>
//                           {supervisorsData.external?.phone && (
//                             <div className="flex items-center gap-2"><Phone size={14} /> {supervisorsData.external?.phone}</div>
//                           )}
//                           {supervisorsData.external?.dept && (
//                             <div className="flex items-center gap-2"><Building size={14} /> {supervisorsData.external?.dept}</div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ) : null}

//                   <div className="flex justify-end border-t border-slate-100 pt-5">
//                     <button
//                       onClick={() => { setHasCheckedSupervisors(true); setCurrentStep(1); }}
//                       className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3d6c8a] to-[#2d5169] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02]"
//                     >
//                       Proceed to Idea Submission <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
//                     </button>
//                   </div>
//                 </div>

//               ) : (
//                 // فورم بناء الفريق
//                 <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-slideIn">
//                   <div className="mb-5">
//                     <h2 className="text-xl font-bold text-slate-900">Team Builder Form</h2>
//                     <p className="text-xs text-slate-400 mt-1">Teams must consist of exactly {maxMembers} members to lock structure.</p>
//                   </div>
//                   {validationErrors.length > 0 && (
//                     <div className="mb-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs space-y-1">
//                       <p className="font-bold">⚠️ توجد بعض المشاكل في بيانات الأعضاء:</p>
//                       {validationErrors.map((err, i) => <p key={i}>• {err}</p>)}
//                     </div>
//                   )}
//                   <div className="space-y-4">
//                     {members.map((member, index) => (
//                       <div key={member.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4">
//                         <input
//                           type="text"
//                           value={member.fullName}
//                           onChange={(e) => updateMember(member.id, 'fullName', e.target.value)}
//                           placeholder={index === 0 ? "Leader Name" : "Member Name"}
//                           readOnly={member.isLeader}
//                           className={`flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ${member.isLeader ? 'bg-slate-100 text-slate-500 cursor-not-allowed select-none' : 'bg-white'}`}
//                         />
//                         <input
//                           type="text"
//                           value={member.ssn}
//                           onChange={(e) => updateMember(member.id, 'ssn', e.target.value)}
//                           placeholder={index === 0 ? "Leader National ID (SSN)" : "Member Academic ID (SSN)"}
//                           readOnly={member.isLeader}
//                           className={`flex-[1.2] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ${member.isLeader ? 'bg-slate-100 text-slate-500 cursor-not-allowed select-none' : 'bg-white'}`}
//                         />
//                         {index === 0 ? (
//                           <span className="flex items-center gap-1 rounded-lg bg-[#3d6c8a]/10 px-3 py-2 text-xs font-bold text-[#3d6c8a]"><Star size={14} fill="#3d6c8a" /> Leader</span>
//                         ) : (
//                           <button onClick={() => removeMember(member.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
//                         )}
//                       </div>
//                     ))}
//                     {members.length < maxMembers && (
//                       <button onClick={addMember} className="w-full flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-4 text-sm font-semibold text-slate-500 hover:border-[#3d6c8a] hover:text-[#3d6c8a]">
//                         <Plus size={18} /> Add Team Member Field
//                       </button>
//                     )}
//                   </div>
//                   <div className="mt-8 flex items-center justify-between gap-4">
//                     <div className="text-xs text-slate-400">
//                       {members.length !== maxMembers && (
//                         <span className="text-amber-600 font-medium">
//                           ⚠️ Team size must be exactly {maxMembers} members. ({members.length}/{maxMembers})
//                         </span>
//                       )}
//                     </div>
//                     <button
//                       disabled={!isTeamFormValid() || isLoading}
//                       onClick={handleRegisterTeam}
//                       className={`rounded-full px-10 py-4 text-sm font-bold text-white transition-all ${isTeamFormValid() && !isLoading ? 'bg-[#3d6c8a] hover:scale-[1.02] cursor-pointer' : 'bg-slate-300 opacity-60 cursor-not-allowed'}`}
//                     >
//                       {isLoading ? 'Saving...' : 'Save & Register Team'}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}

//           {/* STEP 1 */}
//           {currentStep === 1 && (
//             <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm animate-slideIn">
//               <div className="mb-6">
//                 <h2 className="text-xl font-bold text-slate-900">Idea Submission Phase</h2>
//                 <p className="text-sm text-slate-500">Provide Project's Idea And Description.</p>
//               </div>

//               {!isIdeaSubmitted ? (
//                 <div className="flex flex-col gap-4">
//                   <div className="flex flex-col gap-2">
//                     <label className="text-sm font-bold text-slate-700">Project Title</label>
//                     <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="e.g. Smart Campus IoT System" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-[#3d6c8a]" />
//                   </div>
//                   <div className="flex flex-col gap-2">
//                     <label className="text-sm font-bold text-slate-700">Project Description</label>
//                     <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Describe the abstract problem scope statement..." className="min-h-[130px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-[#3d6c8a]"></textarea>
//                   </div>
//                   <div className="mt-8 flex items-center justify-between">
//                     <button onClick={() => setCurrentStep(0)} className="flex items-center gap-2 text-sm font-bold text-slate-500"><ChevronLeft size={18} /> View Supervisors</button>
//                     <button
//                       disabled={projectTitle.trim() === '' || projectDescription.trim() === '' || isLoading}
//                       onClick={handleSubmitProposal}
//                       className={`rounded-full px-10 py-4 text-sm font-bold text-white ${projectTitle.trim() !== '' && projectDescription.trim() !== '' && !isLoading ? 'bg-[#3d6c8a]' : 'bg-slate-300'}`}
//                     >
//                       {isLoading ? 'Submitting...' : 'Submit Idea Once'}
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="space-y-6 py-4">

//                   {(() => {
//                     const supervisorRejected = proposalData?.status === 'Rejected' && proposalData?.rejectedBy === 'Supervisor';
//                     const superAdminRejected = proposalData?.status === 'Rejected' && proposalData?.rejectedBy === 'SuperAdmin';

//                     if (!supervisorRejected && !superAdminRejected) return null;

//                     return (
//                       <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
//                         <div className="space-y-1">
//                           <p className="text-xs font-bold text-red-600">❌ Proposal Rejected</p>

//                           {supervisorRejected ? (
//                             <div className="space-y-1 mt-1">
//                               {proposalData.internalRejectionReason && (
//                                 <p className="text-xs text-red-500">
//                                   <span className="font-semibold">Internal Supervisor: </span>
//                                   {proposalData.internalRejectionReason}
//                                 </p>
//                               )}
//                               {proposalData.externalRejectionReason && (
//                                 <p className="text-xs text-red-500">
//                                   <span className="font-semibold">External Supervisor: </span>
//                                   {proposalData.externalRejectionReason}
//                                 </p>
//                               )}
//                               {!proposalData.internalRejectionReason && !proposalData.externalRejectionReason && (
//                                 <p className="text-xs text-red-500">
//                                   <span className="font-semibold">Reason: </span>No reason provided
//                                 </p>
//                               )}
//                             </div>
//                           ) : (
//                             <p className="text-xs text-red-500">
//                               <span className="font-semibold">Reason: </span>
//                               {proposalData.rejectionReason || 'No reason provided'}
//                             </p>
//                           )}
//                         </div>
//                         <button
//                           disabled={isLoading}
//                           onClick={handleResubmitProposal}
//                           className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
//                         >
//                           {isLoading ? 'جاري التحضير...' : 'Submit a New Idea'}
//                         </button>
//                       </div>
//                     );
//                   })()}

//                   {(() => {
//                     // ✅ نستنتج مين اللي رفض من rejectedBy بدل ما نعتمد على state محلي بس
//                     const supervisorRejected = proposalData?.status === 'Rejected' && proposalData?.rejectedBy === 'Supervisor';
//                     const superAdminRejected = proposalData?.status === 'Rejected' && proposalData?.rejectedBy === 'SuperAdmin';
//                     // لو السوبر أدمن رفض، يبقى المشرفين وافقوا أكيد (وصلت للمرحلة دي أصلاً)
//                     const supervisorsApproved = isSupervisorsApproved || superAdminRejected;

//                     return (
//                       <div className="rounded-xl border p-5 bg-slate-50 flex flex-col gap-3">
//                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concept Verification Status:</div>

//                         <div className="flex items-center justify-between border-b pb-3 border-slate-200">
//                           <span className="text-sm font-medium text-slate-700">1. Internal & External Supervisor Review</span>
//                           {supervisorRejected ? (
//                             <span className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full flex items-center gap-1">❌ Rejected</span>
//                           ) : supervisorsApproved ? (
//                             <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1"><CheckCheck size={12} /> Approved</span>
//                           ) : (
//                             <span className="text-xs font-bold bg-amber-50 text-amber-600 px-3 py-1 rounded-full flex items-center gap-1 animate-pulse"><Clock size={12} /> Pending Supervisor Signoff</span>
//                           )}
//                         </div>

//                         <div className="flex items-center justify-between">
//                           <span className="text-sm font-medium text-slate-700">2. Superadmin Approval</span>
//                           {superAdminRejected ? (
//                             <span className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full flex items-center gap-1">❌ Rejected</span>
//                           ) : isSuperAdminApproved ? (
//                             <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1"><ShieldCheck size={12} /> Approved</span>
//                           ) : supervisorsApproved ? (
//                             <span className="text-xs font-bold bg-amber-50 text-amber-600 px-3 py-1 rounded-full flex items-center gap-1 animate-pulse"><Clock size={12} /> Pending Superadmin Approval</span>
//                           ) : (
//                             <span className="text-xs font-medium bg-slate-100 text-slate-400 px-3 py-1 rounded-full">Awaiting Tier 1 Review</span>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })()}

//                   <div className="p-4 rounded-xl border border-slate-200 text-sm bg-white space-y-1">
//                     <div><span className="font-bold text-slate-500">Project Title:</span> {projectTitle}</div>
//                     <div><span className="font-bold text-slate-500">Description:</span> {projectDescription}</div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}

//           {/* STEP 2 */}
//           {currentStep === 2 && (
//             <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm animate-slideIn">
//               <div className="mb-6">
//                 <h2 className="text-xl font-bold text-slate-900">Idea Verification</h2>
//               </div>
//               <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
//                 <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
//                   <ShieldCheck size={24} />
//                 </div>
//                 <h4 className="font-bold text-slate-800 mb-1">Idea Validated & Authorized</h4>
//                 <p className="text-xs text-slate-400 max-w-sm mx-auto">
//                   Supervisors and Academic superadmins have certified your submitted Idea.
//                 </p>
//               </div>
//               <div className="mt-8 flex justify-between">
//                 <button onClick={() => setCurrentStep(1)} className="flex items-center gap-2 text-sm font-bold text-slate-500"><ChevronLeft size={18} /> View Pipeline Status</button>
//                 <button onClick={() => setCurrentStep(3)} className="rounded-full bg-[#3d6c8a] px-10 py-4 text-sm font-bold text-white">Next: Final Approval</button>
//               </div>
//             </div>
//           )}

//           {/* STEP 3 */}
//           {currentStep === 3 && (
//             <div className="rounded-2xl border border-slate-200 bg-white p-10 py-[60px] text-center shadow-sm animate-slideIn">
//               <div className="mb-6 flex justify-center">
//                 <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ecfdf5] text-[#1078b9]"><CheckCheck size={32} /></div>
//               </div>
//               <h2 className="mb-3 text-2xl font-bold text-slate-900">Project Approved!</h2>
//               <p className="mx-auto max-w-[400px] text-sm text-slate-500 mb-4">Your graduation project has been fully approved.</p>
              
//             </div>
//           )}

//         </div>

//         {/* Sidebar */}
//         <div className="flex flex-col gap-6">
//           <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 shadow-sm">
//             <h3 className="mb-4 text-lg font-bold text-slate-900">Project Guidelines</h3>
//             <ul className="space-y-4 text-sm text-slate-500">
//               <li className="relative pl-7"><div className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#e0e7ff] text-[12px] font-bold text-[#3d6c8a]">✓</div>Team size configuration requires exactly {maxMembers} entries.</li>
//               <li className="relative pl-7"><div className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#e0e7ff] text-[12px] font-bold text-[#3d6c8a]">✓</div>Concept designs loop through internal/external checks prior to Superadmin clearance.</li>
//               <li className="relative pl-7"><div className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#e0e7ff] text-[12px] font-bold text-[#3d6c8a]">✓</div>Project idea must not be similar to any project from previous years.</li>
//             </ul>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes slideIn {
//             from { opacity: 0; transform: translateY(15px); }
//             to { opacity: 1; transform: translateY(0); }
//         }
//         .animate-slideIn { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
//       `}</style>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import {
  Plus, Users, Lightbulb,
  UserCheck, CheckCheck, ChevronLeft, ArrowRight,
  Star, Trash2, X, Clock, Building, Mail, Phone, ShieldCheck, Loader2, AlertCircle,
  Lock
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

export default function StudentProjects() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPastProjects, setShowPastProjects] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // ===================== SENIOR (4th YEAR) ACCESS CHECK =====================
  // null = لسه بنتأكد، true = سنة رابعة (مسموح)، false = مش سنة رابعة (ممنوع)
  const [isSenior, setIsSenior] = useState(null);
  const [seniorCheckError, setSeniorCheckError] = useState(null);

  useEffect(() => {
    const checkAcademicLevel = async () => {
      try {
        const token = localStorage.getItem('userToken');
        const res = await fetch(`${API}/api/Account/my-profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          setSeniorCheckError('Failed to verify your academic level.');
          setIsSenior(false);
          return;
        }

        const data = await res.json();
        setIsSenior(Boolean(data.isSenior ?? data.IsSenior));
      } catch (err) {
        setSeniorCheckError('Unable to connect to the server.');
        setIsSenior(false);
      }
    };

    checkAcademicLevel();
  }, []);

  const [isTeamBuildingStarted, setIsTeamBuildingStarted] = useState(false);
  const [isTeamSubmitted, setIsTeamSubmitted] = useState(false);
  const [isAdminApproved, setIsAdminApproved] = useState(false);
  const [hasCheckedSupervisors, setHasCheckedSupervisors] = useState(false);

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isIdeaSubmitted, setIsIdeaSubmitted] = useState(false);
  const [isSupervisorsApproved, setIsSupervisorsApproved] = useState(false);
  const [isSuperAdminApproved, setIsSuperAdminApproved] = useState(false);
  const [proposalData, setProposalData] = useState(null);

  const [members, setMembers] = useState([]);

  // ===================== TEAM LIMIT (from DB, configured by SuperAdmin) =====================
  const [minMembers, setMinMembers] = useState(2);
  const [maxMembers, setMaxMembers] = useState(6); // fallback default لحد ما يوصل الرد من السيرفر

  const fetchTeamLimit = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${API}/api/ProjectManagement/team-limit`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.minMembers) setMinMembers(data.minMembers);
        if (data?.maxMembers) setMaxMembers(data.maxMembers);
      }
    } catch (err) {
      // في حالة فشل الطلب، هيفضل يشتغل بالقيم الافتراضية (2 - 6)
      console.error('Failed to load team limit', err);
    }
  };

  const [apiError, setApiError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // ===================== SUPERVISORS (from DB via /my-supervisors) =====================
  const [supervisorsData, setSupervisorsData] = useState(null); // { internal_: {...}, external: {...} }
  const [supervisorsLoading, setSupervisorsLoading] = useState(false);
  const [supervisorsError, setSupervisorsError] = useState(null);

  const fetchSupervisors = async () => {
    setSupervisorsLoading(true);
    setSupervisorsError(null);
    try {
      const token = localStorage.getItem('userToken');
      const res = await fetch(`${API}/api/ProjectManagement/my-supervisors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setSupervisorsError('Failed to load supervisors info.');
        setSupervisorsData(null);
        return;
      }
      const data = await res.json();
      setSupervisorsData(data);
    } catch (err) {
      setSupervisorsError('Unable to connect to the server.');
      setSupervisorsData(null);
    } finally {
      setSupervisorsLoading(false);
    }
  };

  // ===================== PAST YEARS PROJECTS =====================
  const [pastProjects, setPastProjects] = useState([]);
  const [pastProjectsLoading, setPastProjectsLoading] = useState(false);
  const [pastProjectsError, setPastProjectsError] = useState(null);

  const fetchPastProjects = async () => {
    setPastProjectsLoading(true);
    setPastProjectsError(null);
    try {
      const token = localStorage.getItem('userToken');
      // GET endpoint موجود في ProjectManagementController
      const res = await fetch(`${API}/api/ProjectManagement/past-projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setPastProjectsError('Failed to load past years projects.');
        setPastProjects([]);
        return;
      }
      const data = await res.json();
      setPastProjects(data);
    } catch (err) {
      setPastProjectsError('Unable to connect to the server.');
      setPastProjects([]);
    } finally {
      setPastProjectsLoading(false);
    }
  };

  const handleOpenPastProjects = () => {
    setShowPastProjects(true);
    fetchPastProjects();
  };

  // ===================== FETCH STATUS ON LOAD =====================
  // بننادي على my-status بس لو أكدنا إن الطالب سنة رابعة، مفيش داعي نجيب بيانات مشروع لطالب مش مسموحله
  useEffect(() => {
    if (isSenior !== true) return;

    const fetchStatus = async () => {
      const token = localStorage.getItem('userToken');
      setPageLoading(true);
      try {
        const res = await fetch(`${API}/api/ProjectManagement/my-status`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();

        const { step, subStep, proposal } = data;

        if (subStep === 'noTeam') {
          // لا team → Step 0 ابدأ من الأول
          setCurrentStep(0);

        } else if (subStep === 'waitingSupervisor') {
          // عنده team بس لا supervisor assigned لسه
          setCurrentStep(0);
          setIsTeamBuildingStarted(true);
          setIsTeamSubmitted(true);
          setIsAdminApproved(false);

        } else if (subStep === 'waitingProposal') {
          // عنده team و supervisor assigned، ينتقل لصفحة الـ supervisors
          setCurrentStep(0);
          setIsTeamBuildingStarted(true);
          setIsTeamSubmitted(true);
          setIsAdminApproved(true);
          fetchSupervisors();

        } else if (subStep === 'pendingProfessors') {
          // بعت proposal وفي انتظار الدكاترة
          setCurrentStep(1);
          setIsTeamBuildingStarted(true);
          setIsTeamSubmitted(true);
          setIsAdminApproved(true);
          setIsIdeaSubmitted(true);
          setProposalData(proposal);
          setProjectTitle(proposal.projectName);
          setProjectDescription(proposal.projectDescription);
          fetchSupervisors();

        } else if (subStep === 'rejected') {
          // اتردت
          setCurrentStep(1);
          setIsTeamBuildingStarted(true);
          setIsTeamSubmitted(true);
          setIsAdminApproved(true);
          setIsIdeaSubmitted(true);
          setProposalData(proposal);
          setProjectTitle(proposal.projectName);
          setProjectDescription(proposal.projectDescription);
          fetchSupervisors();

        } else if (subStep === 'pendingSuperAdmin') {
          // الدكاترة وافقوا، في انتظار super admin
          setCurrentStep(1);
          setIsTeamBuildingStarted(true);
          setIsTeamSubmitted(true);
          setIsAdminApproved(true);
          setIsIdeaSubmitted(true);
          setIsSupervisorsApproved(true);
          setProposalData(proposal);
          setProjectTitle(proposal.projectName);
          setProjectDescription(proposal.projectDescription);
          fetchSupervisors();

        } else if (subStep === 'approved') {
          // اتموافق عليه نهائياً
          setCurrentStep(3);
          setIsTeamBuildingStarted(true);
          setIsTeamSubmitted(true);
          setIsAdminApproved(true);
          setIsIdeaSubmitted(true);
          setIsSupervisorsApproved(true);
          setIsSuperAdminApproved(true);
          setProposalData(proposal);
          setProjectTitle(proposal.projectName);
          setProjectDescription(proposal.projectDescription);
          fetchSupervisors();
        }

      } catch (err) {
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchStatus();
    fetchTeamLimit();
  }, [isSenior]);

  // ===================== HANDLERS =====================
  const handleStartTeamBuilding = async () => {
    setIsTeamBuildingStarted(true);
    setIsLoading(true);
    setApiError(null);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API}/api/ProjectManagement/my-info`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        setApiError("Failed to load your info. Please try again.");
        setIsTeamBuildingStarted(false); // نرجع الصفحة لحالتها الأولى لأن مفيش بيانات صحيحة للقائد
        return;
      }

      const data = await response.json();

      if (!data?.fullName || !data?.ssn) {
        setApiError("Your info is incomplete. Please contact the admin.");
        setIsTeamBuildingStarted(false);
        return;
      }

      setMembers([{
        id: Date.now(),
        fullName: data.fullName,
        ssn: data.ssn,
        isLeader: true,
        isFixed: true
      }]);
    } catch (err) {
      setApiError("Failed to load your info.");
      setIsTeamBuildingStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  const addMember = () => {
    if (members.length >= maxMembers) {
      alert(`You cannot add more than ${maxMembers} members.`);
      return;
    }
    setMembers([...members, { id: Date.now(), fullName: '', ssn: '', isLeader: false, isFixed: false }]);
  };

  const removeMember = (id) => {
    const member = members.find(m => m.id === id);
    if (member?.isFixed) return;
    setMembers(members.filter(m => m.id !== id));
  };

  const updateMember = (id, field, value) => {
    const member = members.find(m => m.id === id);
    if (member?.isLeader) return;
    let filteredValue = value;
    if (field === 'fullName') filteredValue = value.replace(/[^a-zA-Z\s\u0600-\u06FF]/g, '');
    else if (field === 'ssn') filteredValue = value.replace(/[^\d]/g, '');
    setMembers(members.map(m => m.id === id ? { ...m, [field]: filteredValue } : m));
  };

  const isTeamFormValid = () => {
    if (members.length !== maxMembers) return false;
    return members.every(m => (m.fullName ?? '').trim() !== '' && (m.ssn ?? '').trim() !== '');
  };

  const handleRegisterTeam = async () => {
    if (!isTeamFormValid()) return;
    setIsLoading(true);
    setApiError(null);
    setValidationErrors([]);

    const apiMembers = members
      .filter(m => !m.isLeader)
      .map(m => ({ fullName: m.fullName, ssn: m.ssn }));

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API}/api/ProjectManagement/register-team`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ members: apiMembers })
      });
      const data = await response.json();
      if (response.ok) {
        setIsTeamSubmitted(true);
      } else {
        if (data.errors) setValidationErrors(data.errors);
        else setApiError(data.message || data || "حدث خطأ أثناء تسجيل الفريق");
      }
    } catch (error) {
      setApiError("Failed to register team ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResubmitProposal = async () => {
    setIsLoading(true);
    setApiError(null);
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API}/api/ProjectManagement/resubmit-proposal`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        // نرجع الطالب لفورم تقديم فكرة جديدة من الأول
        setIsIdeaSubmitted(false);
        setProposalData(null);
        setProjectTitle('');
        setProjectDescription('');
        setIsSupervisorsApproved(false);
        setIsSuperAdminApproved(false);
      } else {
        setApiError(data.message || data || "حدث خطأ أثناء إعادة تقديم الفكرة");
      }
    } catch (error) {
      setApiError("عذراً، تعذر الاتصال بالسيرفر.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitProposal = async () => {

    if (projectTitle.trim() === '' || projectDescription.trim() === '') return;
    setIsLoading(true);
    setApiError(null);

    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${API}/api/ProjectManagement/submit-proposal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ projectName: projectTitle, projectDescription: projectDescription })
      });
      const data = await response.json();
      if (response.ok) {
        setIsIdeaSubmitted(true);
        const proposalRes = await fetch(`${API}/api/ProjectManagement/my-proposal`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (proposalRes.ok) {
          const proposalInfo = await proposalRes.json();
          setProposalData(proposalInfo);
        }
      } else {
        setApiError(data.message || data || "حدث خطأ أثناء تقديم الفكرة");
      }
    } catch (error) {
      setApiError("عذراً، تعذر الاتصال بالسيرفر.");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { title: 'Team Building', icon: Users },
    { title: 'Idea Submission', icon: Lightbulb },
    { title: 'Supervisor Approval', icon: UserCheck },
    { title: 'Final Approval', icon: CheckCheck },
  ];

  // ===================== SENIOR CHECK LOADING =====================
  if (isSenior === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 text-sm animate-pulse">Checking your eligibility...</div>
      </div>
    );
  }

  // ===================== NOT SENIOR → PAGE LOCKED =====================
  if (isSenior === false) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm mx-auto max-w-2xl mt-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <Lock size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">This Page Isn't Available Yet</h2>
        <p className="mx-auto max-w-md text-sm text-slate-500">
          Graduation project management is only available for 4th year students.
          {seniorCheckError && ' We also had trouble verifying your academic level — please try again later.'}
        </p>
      </div>
    );
  }

  // ===================== PAGE LOADING =====================
  if (pageLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 text-sm animate-pulse">Loading your project status...</div>
      </div>
    );
  }

  // ===================== RENDER =====================
  return (
    <div className="flex flex-col gap-6 font-sans">

      {showPastProjects && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">📚 Past Years Projects</h2>
              <button onClick={() => setShowPastProjects(false)} className="rounded-full p-2 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            {pastProjectsLoading ? (
              <div className="flex items-center justify-center py-12 text-slate-400 text-sm">
                <Loader2 size={18} className="animate-spin mr-2" /> Loading projects...
              </div>
            ) : pastProjectsError ? (
              <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={16} /> {pastProjectsError}
              </div>
            ) : pastProjects.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-400">
                No past years projects available yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pastProjects.map(project => (
                  <div key={project.id} className="rounded-xl border border-slate-200 p-4">
                    <h3 className="font-bold text-slate-900">{project.title} ({project.year})</h3>
                    <p className="text-sm text-slate-500">{project.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-[800] tracking-tight text-slate-900">Project Management</h1>
          <p className="text-sm text-slate-500">Manage your graduation project and team collaborations.</p>
        </div>
        <button
          onClick={handleOpenPastProjects}
          className="flex items-center gap-2 rounded-lg bg-[#3d6c8a] px-5 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-black hover:-translate-y-0.5"
        >
          Projects From Past Years
        </button>
      </div>

      {apiError && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
          ⚠️ {apiError}
        </div>
      )}

      {/* Stepper */}
      <div className="relative mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="absolute top-[60px] left-[10%] right-[10%] h-[4px] rounded-full bg-slate-100">
          <div className="h-full bg-gradient-to-r from-[#3d6c8a] to-[#77bfde] transition-all duration-700 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }} />
        </div>
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;
            return (
              <div key={index} className="relative z-10 flex flex-col items-center gap-4">
                <div className={`flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 transition-all duration-500
                  ${isActive ? 'border-[#3d6c8a] bg-gradient-to-br from-[#3d6c8a] to-[#5a9dc7] text-white scale-110 shadow-[0_10px_20px_rgba(61,108,138,0.3)]'
                    : isCompleted ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                    : 'border-slate-200 bg-white text-slate-400'}`}>
                  {isCompleted ? <CheckCheck size={24} /> : <Icon size={24} />}
                </div>
                <span className={`text-[13px] font-bold transition-all duration-300 ${isActive ? 'text-[#3d6c8a]' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">

          {/* STEP 0 */}
          {currentStep === 0 && (
            <>
              {!isTeamBuildingStarted ? (
                // لا team خالص
                <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm animate-slideIn">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50 text-slate-400">
                    <Users size={32} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2">No Team Found</h2>
                  <p className="mx-auto max-w-md text-sm text-slate-500 mb-8">
                    You haven't initialized your graduation team yet. Start the builder to register yourself as the leader.
                  </p>
                  <button onClick={handleStartTeamBuilding} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3d6c8a] to-[#2d5169] px-6 py-3.5 text-sm font-bold text-white shadow-md">
                    <Plus size={18} /> Start Building Team
                  </button>
                </div>

              ) : isTeamSubmitted && !isAdminApproved ? (
                // عنده team بس لسه مفيش supervisor assigned
                <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm animate-slideIn">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#ecfdf5] text-[#3d6c8a] animate-pulse">
                    <Clock size={36} />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-3">Team Registered & Processing</h2>
                  <p className="mx-auto max-w-[460px] text-sm leading-relaxed text-slate-500 mb-6">
                    Your team details have been locked in the system database. Waiting for supervisor assignment.
                  </p>
                  <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs text-slate-400">
                    <Building size={14} /> Status: Awaiting Supervisor Assignment
                  </div>
                </div>

              ) : isAdminApproved ? (
                // عنده team و supervisor assigned → يعرض الـ supervisors ويتقدم لـ Step 1
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm animate-slideIn">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 mb-2">
                      <CheckCheck size={12} /> Team Structure Configured
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Your Assigned Supervisors</h2>
                    <p className="text-sm text-slate-500">Review your designated academic guidance advisors contact cards below.</p>
                  </div>

                  {supervisorsLoading ? (
                    <div className="flex items-center justify-center py-10 text-slate-400 text-sm mb-8">
                      <Loader2 size={18} className="animate-spin mr-2" /> Loading supervisors...
                    </div>
                  ) : supervisorsError ? (
                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-8">
                      <AlertCircle size={16} /> {supervisorsError}
                    </div>
                  ) : supervisorsData ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                        <span className="text-[10px] font-bold text-[#3d6c8a] bg-[#3d6c8a]/10 px-2 py-0.5 rounded uppercase tracking-wider">Internal Advisor</span>
                        <h3 className="font-bold text-slate-800 text-base mt-2 mb-3">{supervisorsData.internal_?.name}</h3>
                        <div className="space-y-1.5 text-xs text-slate-500">
                          <div className="flex items-center gap-2"><Mail size={14} /> {supervisorsData.internal_?.email}</div>
                          {supervisorsData.internal_?.phone && (
                            <div className="flex items-center gap-2"><Phone size={14} /> {supervisorsData.internal_?.phone}</div>
                          )}
                          {supervisorsData.internal_?.dept && (
                            <div className="flex items-center gap-2"><Building size={14} /> {supervisorsData.internal_?.dept}</div>
                          )}
                        </div>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5">
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-wider">External Advisor</span>
                        <h3 className="font-bold text-slate-800 text-base mt-2 mb-3">{supervisorsData.external?.name}</h3>
                        <div className="space-y-1.5 text-xs text-slate-500">
                          <div className="flex items-center gap-2"><Mail size={14} /> {supervisorsData.external?.email}</div>
                          {supervisorsData.external?.phone && (
                            <div className="flex items-center gap-2"><Phone size={14} /> {supervisorsData.external?.phone}</div>
                          )}
                          {supervisorsData.external?.dept && (
                            <div className="flex items-center gap-2"><Building size={14} /> {supervisorsData.external?.dept}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}

                  <div className="flex justify-end border-t border-slate-100 pt-5">
                    <button
                      onClick={() => { setHasCheckedSupervisors(true); setCurrentStep(1); }}
                      className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#3d6c8a] to-[#2d5169] px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:scale-[1.02]"
                    >
                      Proceed to Idea Submission <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>

              ) : (
                // فورم بناء الفريق
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-slideIn">
                  <div className="mb-5">
                    <h2 className="text-xl font-bold text-slate-900">Team Builder Form</h2>
                    <p className="text-xs text-slate-400 mt-1">Teams must consist of exactly {maxMembers} members to lock structure.</p>
                  </div>
                  {validationErrors.length > 0 && (
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs space-y-1">
                      <p className="font-bold">⚠️ توجد بعض المشاكل في بيانات الأعضاء:</p>
                      {validationErrors.map((err, i) => <p key={i}>• {err}</p>)}
                    </div>
                  )}
                  <div className="space-y-4">
                    {members.map((member, index) => (
                      <div key={member.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4">
                        <input
                          type="text"
                          value={member.fullName}
                          onChange={(e) => updateMember(member.id, 'fullName', e.target.value)}
                          placeholder={index === 0 ? "Leader Name" : "Member Name"}
                          readOnly={member.isLeader}
                          className={`flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ${member.isLeader ? 'bg-slate-100 text-slate-500 cursor-not-allowed select-none' : 'bg-white'}`}
                        />
                        <input
                          type="text"
                          value={member.ssn}
                          onChange={(e) => updateMember(member.id, 'ssn', e.target.value)}
                          placeholder={index === 0 ? "Leader National ID (SSN)" : "Member Academic ID (SSN)"}
                          readOnly={member.isLeader}
                          className={`flex-[1.2] rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ${member.isLeader ? 'bg-slate-100 text-slate-500 cursor-not-allowed select-none' : 'bg-white'}`}
                        />
                        {index === 0 ? (
                          <span className="flex items-center gap-1 rounded-lg bg-[#3d6c8a]/10 px-3 py-2 text-xs font-bold text-[#3d6c8a]"><Star size={14} fill="#3d6c8a" /> Leader</span>
                        ) : (
                          <button onClick={() => removeMember(member.id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                        )}
                      </div>
                    ))}
                    {members.length < maxMembers && (
                      <button onClick={addMember} className="w-full flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-4 text-sm font-semibold text-slate-500 hover:border-[#3d6c8a] hover:text-[#3d6c8a]">
                        <Plus size={18} /> Add Team Member Field
                      </button>
                    )}
                  </div>
                  <div className="mt-8 flex items-center justify-between gap-4">
                    <div className="text-xs text-slate-400">
                      {members.length !== maxMembers && (
                        <span className="text-amber-600 font-medium">
                          ⚠️ Team size must be exactly {maxMembers} members. ({members.length}/{maxMembers})
                        </span>
                      )}
                    </div>
                    <button
                      disabled={!isTeamFormValid() || isLoading}
                      onClick={handleRegisterTeam}
                      className={`rounded-full px-10 py-4 text-sm font-bold text-white transition-all ${isTeamFormValid() && !isLoading ? 'bg-[#3d6c8a] hover:scale-[1.02] cursor-pointer' : 'bg-slate-300 opacity-60 cursor-not-allowed'}`}
                    >
                      {isLoading ? 'Saving...' : 'Save & Register Team'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm animate-slideIn">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Idea Submission Phase</h2>
                <p className="text-sm text-slate-500">Provide Project's Idea And Description.</p>
              </div>

              {!isIdeaSubmitted ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Project Title</label>
                    <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} placeholder="e.g. Smart Campus IoT System" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-[#3d6c8a]" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-700">Project Description</label>
                    <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Describe the abstract problem scope statement..." className="min-h-[130px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:border-[#3d6c8a]"></textarea>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <button onClick={() => setCurrentStep(0)} className="flex items-center gap-2 text-sm font-bold text-slate-500"><ChevronLeft size={18} /> View Supervisors</button>
                    <button
                      disabled={projectTitle.trim() === '' || projectDescription.trim() === '' || isLoading}
                      onClick={handleSubmitProposal}
                      className={`rounded-full px-10 py-4 text-sm font-bold text-white ${projectTitle.trim() !== '' && projectDescription.trim() !== '' && !isLoading ? 'bg-[#3d6c8a]' : 'bg-slate-300'}`}
                    >
                      {isLoading ? 'Submitting...' : 'Submit Idea Once'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-4">

                  {(() => {
                    const supervisorRejected = proposalData?.status === 'Rejected' && proposalData?.rejectedBy === 'Supervisor';
                    const superAdminRejected = proposalData?.status === 'Rejected' && proposalData?.rejectedBy === 'SuperAdmin';

                    if (!supervisorRejected && !superAdminRejected) return null;

                    return (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4 space-y-3">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-red-600">❌ Proposal Rejected</p>

                          {supervisorRejected ? (
                            <div className="space-y-1 mt-1">
                              {proposalData.internalRejectionReason && (
                                <p className="text-xs text-red-500">
                                  <span className="font-semibold">Internal Supervisor: </span>
                                  {proposalData.internalRejectionReason}
                                </p>
                              )}
                              {proposalData.externalRejectionReason && (
                                <p className="text-xs text-red-500">
                                  <span className="font-semibold">External Supervisor: </span>
                                  {proposalData.externalRejectionReason}
                                </p>
                              )}
                              {!proposalData.internalRejectionReason && !proposalData.externalRejectionReason && (
                                <p className="text-xs text-red-500">
                                  <span className="font-semibold">Reason: </span>No reason provided
                                </p>
                              )}
                            </div>
                          ) : (
                            <p className="text-xs text-red-500">
                              <span className="font-semibold">Reason: </span>
                              {proposalData.rejectionReason || 'No reason provided'}
                            </p>
                          )}
                        </div>
                        <button
                          disabled={isLoading}
                          onClick={handleResubmitProposal}
                          className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
                        >
                          {isLoading ? 'جاري التحضير...' : 'Submit a New Idea'}
                        </button>
                      </div>
                    );
                  })()}

                  {(() => {
                    // ✅ نستنتج مين اللي رفض من rejectedBy بدل ما نعتمد على state محلي بس
                    const supervisorRejected = proposalData?.status === 'Rejected' && proposalData?.rejectedBy === 'Supervisor';
                    const superAdminRejected = proposalData?.status === 'Rejected' && proposalData?.rejectedBy === 'SuperAdmin';
                    // لو السوبر أدمن رفض، يبقى المشرفين وافقوا أكيد (وصلت للمرحلة دي أصلاً)
                    const supervisorsApproved = isSupervisorsApproved || superAdminRejected;

                    return (
                      <div className="rounded-xl border p-5 bg-slate-50 flex flex-col gap-3">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Concept Verification Status:</div>

                        <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                          <span className="text-sm font-medium text-slate-700">1. Internal & External Supervisor Review</span>
                          {supervisorRejected ? (
                            <span className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full flex items-center gap-1">❌ Rejected</span>
                          ) : supervisorsApproved ? (
                            <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1"><CheckCheck size={12} /> Approved</span>
                          ) : (
                            <span className="text-xs font-bold bg-amber-50 text-amber-600 px-3 py-1 rounded-full flex items-center gap-1 animate-pulse"><Clock size={12} /> Pending Supervisor Signoff</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-700">2. Superadmin Approval</span>
                          {superAdminRejected ? (
                            <span className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full flex items-center gap-1">❌ Rejected</span>
                          ) : isSuperAdminApproved ? (
                            <span className="text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1"><ShieldCheck size={12} /> Approved</span>
                          ) : supervisorsApproved ? (
                            <span className="text-xs font-bold bg-amber-50 text-amber-600 px-3 py-1 rounded-full flex items-center gap-1 animate-pulse"><Clock size={12} /> Pending Superadmin Approval</span>
                          ) : (
                            <span className="text-xs font-medium bg-slate-100 text-slate-400 px-3 py-1 rounded-full">Awaiting Tier 1 Review</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="p-4 rounded-xl border border-slate-200 text-sm bg-white space-y-1">
                    <div><span className="font-bold text-slate-500">Project Title:</span> {projectTitle}</div>
                    <div><span className="font-bold text-slate-500">Description:</span> {projectDescription}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm animate-slideIn">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Idea Verification</h2>
              </div>
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={24} />
                </div>
                <h4 className="font-bold text-slate-800 mb-1">Idea Validated & Authorized</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Supervisors and Academic superadmins have certified your submitted Idea.
                </p>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={() => setCurrentStep(1)} className="flex items-center gap-2 text-sm font-bold text-slate-500"><ChevronLeft size={18} /> View Pipeline Status</button>
                <button onClick={() => setCurrentStep(3)} className="rounded-full bg-[#3d6c8a] px-10 py-4 text-sm font-bold text-white">Next: Final Approval</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 py-[60px] text-center shadow-sm animate-slideIn">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ecfdf5] text-[#1078b9]"><CheckCheck size={32} /></div>
              </div>
              <h2 className="mb-3 text-2xl font-bold text-slate-900">Project Approved!</h2>
              <p className="mx-auto max-w-[400px] text-sm text-slate-500 mb-4">Your graduation project has been fully approved.</p>
              
            </div>
          )}

        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Project Guidelines</h3>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="relative pl-7"><div className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#e0e7ff] text-[12px] font-bold text-[#3d6c8a]">✓</div>Team size configuration requires exactly {maxMembers} entries.</li>
              <li className="relative pl-7"><div className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#e0e7ff] text-[12px] font-bold text-[#3d6c8a]">✓</div>Concept designs loop through internal/external checks prior to Superadmin clearance.</li>
              <li className="relative pl-7"><div className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#e0e7ff] text-[12px] font-bold text-[#3d6c8a]">✓</div>Project idea must not be similar to any project from previous years.</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideIn { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}