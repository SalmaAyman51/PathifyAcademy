
// import React, { useState, useEffect } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { User, Users, FolderGit2, Lightbulb } from 'lucide-react';

// const API = import.meta.env.VITE_API_URL;

// export default function ExternalProfessor() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const currentView = searchParams.get('view') || 'teams';

//   const [teams, setTeams] = useState([]);
//   const [proposals, setProposals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const token = localStorage.getItem('userToken');

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [teamsRes, proposalsRes] = await Promise.all([
//           fetch(`${API}/api/Professor/external/supervised-teams`, {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           fetch(`${API}/api/Professor/external/pending-proposals`, {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//         ]);

//         if (!teamsRes.ok) throw new Error('Failed to fetch teams');
//         if (!proposalsRes.ok) throw new Error('Failed to fetch proposals');

//         setTeams(await teamsRes.json());
//         setProposals(await proposalsRes.json());
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const switchView = (view) => setSearchParams({ view });

//   if (loading) return <div className="p-10 text-center text-slate-400 text-sm">Loading...</div>;
//   if (error) return <div className="p-10 text-center text-red-400 text-sm">{error}</div>;

//   return (
//     <div className="space-y-6">
//       <div className="flex border-b border-slate-200 gap-6 text-[13px] font-semibold text-slate-400">
//         <button
//           onClick={() => switchView('teams')}
//           className={`flex items-center gap-2 pb-3 transition-all border-b-2 ${currentView === 'teams' ? 'border-[#3d6c8a] text-[#3d6c8a]' : 'border-transparent hover:text-slate-700'}`}
//         >
//           <FolderGit2 size={16} /> My Supervised Teams
//         </button>
//         <button
//           onClick={() => switchView('pending')}
//           className={`flex items-center gap-2 pb-3 transition-all border-b-2 ${currentView === 'pending' ? 'border-[#3d6c8a] text-[#3d6c8a]' : 'border-transparent hover:text-slate-700'}`}
//         >
//           <Lightbulb size={16} /> Pending Projects ({proposals.length})
//         </button>
//       </div>

//       {currentView === 'teams' ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {teams.length === 0 ? (
//             <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs col-span-2">
//               No supervised teams yet.
//             </div>
//           ) : (
//             teams.map((team) => (
//               <div key={team.teamId} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm space-y-4">
//                 <div className="space-y-1">
//                   <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded w-max">External Tracking</div>
//                   <h3 className="font-bold text-slate-800 text-base pt-1">Team #{team.teamId}</h3>
//                   <p className="text-[11px] text-slate-400">
//                     Created: {new Date(team.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
//                   <div className="flex items-center gap-2 text-slate-600">
//                     <User size={14} className="text-slate-400" />
//                     <span><strong>Leader:</strong> {team.leaderName}</span>
//                   </div>
//                   <div className="flex items-start gap-2 text-slate-600">
//                     <Users size={14} className="text-slate-400 mt-0.5" />
//                     <div className="flex flex-wrap gap-1">
//                       <strong>Members:</strong>
//                       {team.members?.length > 0 ? (
//                         team.members.map((m, i) => (
//                           <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
//                             {m.fname}
//                           </span>
//                         ))
//                       ) : (
//                         <span className="text-slate-400">No members</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {proposals.length === 0 ? (
//             <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
//               No pending projects remaining.
//             </div>
//           ) : (
//             proposals.map((proposal) => (
//               <div key={proposal.proposalId} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
//                 <div>
//                   <h3 className="font-bold text-slate-800 text-base">{proposal.projectName}</h3>
//                   <p className="text-[11px] text-slate-400 mt-0.5">
//                     Submitted by: <span className="font-semibold">{proposal.leaderName}</span>
//                     {' · '}
//                     {new Date(proposal.createdAt).toLocaleDateString()}
//                   </p>
//                 </div>
//                 <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
//                   {proposal.projectDescription}
//                 </p>
//                 <div className="flex justify-end items-center border-t border-slate-100 pt-3 gap-2">
//                   <button className="border border-slate-200 text-slate-500 font-semibold px-4 py-1.5 rounded-xl text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all">
//                     Reject
//                   </button>
//                   <button className="bg-[#3d6c8a] text-white font-semibold px-4 py-1.5 rounded-xl text-xs hover:opacity-95 shadow-sm transition-all">
//                     Approve
//                   </button>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, FolderGit2, Lightbulb, FolderOpen, Search, X, CheckCircle2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const StatCard = ({ title, value, icon: Icon, iconBg, iconColor }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -8 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
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

export default function ExternalProfessor() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view') || 'teams';

  const [teams, setTeams] = useState([]);
  const [proposals, setProposals] = useState([]);

  // --- All Projects State ---
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, proposalId: null });
  const [rejectionReason, setRejectionReason] = useState('');

  const token = localStorage.getItem('userToken');

  // جلب بيانات الفرق المراقبة والمقترحات المعلقة
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [teamsRes, proposalsRes] = await Promise.all([
          fetch(`${API}/api/Professor/external/supervised-teams`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API}/api/Professor/external/pending-proposals`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!teamsRes.ok) throw new Error('Failed to fetch teams');
        if (!proposalsRes.ok) throw new Error('Failed to fetch proposals');

        setTeams(await teamsRes.json());
        setProposals(await proposalsRes.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // جلب كل المشاريع اللي الدكتور ده مشرف عليها (داخلي أو خارجي) عند فتح تبويب All Projects
  // الـ API بيحدد الدكتور من الـ SSN اللي جوه التوكن، مفيش داعي نبعت أي id يدوي
  useEffect(() => {
    if (currentView === 'all') {
      const fetchMyProjects = async () => {
        setProjectsLoading(true);
        setProjectsError(null);
        try {
          const res = await fetch(`${API}/api/Professor/all-projects`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || 'Failed to fetch projects');
          }

          const data = await res.json();
          setApprovedProjects(data);
        } catch (err) {
          setProjectsError(err.message);
          console.error('Error loading projects', err);
        } finally {
          setProjectsLoading(false);
        }
      };
      fetchMyProjects();
    }
  }, [currentView]);

  // فلترة المشاريع بناءً على البحث (اسم المشروع أو اسم أي من المشرفين)
  const filteredProjects = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return approvedProjects.filter((project) =>
      project.projectName?.toLowerCase().includes(search) ||
      project.internalProfessorName?.toLowerCase().includes(search) ||
      project.externalProfessorName?.toLowerCase().includes(search)
    );
  }, [approvedProjects, searchTerm]);

  const handleReview = async (proposalId, approved, reason = null) => {
    try {
      const res = await fetch(`${API}/api/Professor/review-proposal-external/${proposalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ approved, rejectionReason: reason })
      });

      if (!res.ok) throw new Error('Failed to submit review');

      setProposals(prev => prev.filter(p => p.proposalId !== proposalId));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) return;
    await handleReview(rejectModal.proposalId, false, rejectionReason);
    setRejectModal({ open: false, proposalId: null });
    setRejectionReason('');
  };

  const switchView = (view) => {
    setSearchTerm('');
    setSearchParams({ view });
  };

  if (loading) return <div className="p-10 text-center text-slate-400 text-sm">Loading...</div>;
  if (error) return <div className="p-10 text-center text-red-400 text-sm">{error}</div>;

  return (
    <div className="space-y-6">
      {/* قسم كروت الإحصائيات بعد إضافة كارت المشاريع */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-6xl">
        <StatCard
          title="Supervised Teams"
          value={teams.length}
          icon={FolderGit2}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />
        <StatCard
          title="Pending Proposals"
          value={proposals.length}
          icon={Lightbulb}
          iconBg="bg-yellow-50"
          iconColor="text-yellow-500"
        />
        <StatCard
          title="All Projects"
          value={approvedProjects.length || '...'}
          icon={FolderOpen}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-500"
        />
      </div>

      {/* التبويبات العلوية */}
      <div className="flex border-b border-slate-200 gap-6 text-[13px] font-semibold text-slate-400 items-center justify-between">
        <div className="flex gap-6">
          <button
            onClick={() => switchView('teams')}
            className={`flex items-center gap-2 pb-3 transition-all border-b-2 ${currentView === 'teams' ? 'border-[#3d6c8a] text-[#3d6c8a]' : 'border-transparent hover:text-slate-700'}`}
          >
            <FolderGit2 size={16} /> My Supervised Teams
          </button>
          <button
            onClick={() => switchView('pending')}
            className={`flex items-center gap-2 pb-3 transition-all border-b-2 ${currentView === 'pending' ? 'border-[#3d6c8a] text-[#3d6c8a]' : 'border-transparent hover:text-slate-700'}`}
          >
            <Lightbulb size={16} /> Pending Projects ({proposals.length})
          </button>
          <button
            onClick={() => switchView('all')}
            className={`flex items-center gap-2 pb-3 transition-all border-b-2 ${currentView === 'all' ? 'border-[#3d6c8a] text-[#3d6c8a]' : 'border-transparent hover:text-slate-700'}`}
          >
            <FolderOpen size={16} /> All Projects
          </button>
        </div>

        {/* شريط البحث يظهر فقط عند الانتقال إلى تبويب All Projects */}
        {currentView === 'all' && (
          <div className="relative pb-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by project or professor name..."
              className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#3d6c8a]/30 w-64"
            />
          </div>
        )}
      </div>

      {/* عرض المحتوى حسب الـ View */}
      {currentView === 'teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs col-span-2">
              No supervised teams yet.
            </div>
          ) : (
            teams.map((team) => (
              <div key={team.teamId} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm space-y-4">
                <div className="space-y-1">
                  <div className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded w-max">External Tracking</div>
                  <h3 className="font-bold text-slate-800 text-base pt-1">Team #{team.teamId}</h3>
                  <p className="text-[11px] text-slate-400">
                    Created: {new Date(team.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User size={14} className="text-slate-400" />
                    <span><strong>Leader:</strong> {team.leaderName}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600">
                    <Users size={14} className="text-slate-400 mt-0.5" />
                    <div className="flex flex-wrap gap-1">
                      <strong>Members:</strong>
                      {team.members?.length > 0 ? (
                        team.members.map((m, i) => (
                          <span key={i} className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[11px]">
                            {m.fname}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400">No members</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {currentView === 'pending' && (
        <div className="space-y-4">
          {proposals.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No pending projects remaining.
            </div>
          ) : (
            proposals.map((proposal) => (
              <div key={proposal.proposalId} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{proposal.projectName}</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Submitted by: <span className="font-semibold">{proposal.leaderName}</span>
                    {' · '}
                    {new Date(proposal.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {proposal.projectDescription}
                </p>
                <div className="flex justify-end items-center border-t border-slate-100 pt-3 gap-2">
                  <button
                    onClick={() => setRejectModal({ open: true, proposalId: proposal.proposalId })}
                    className="border border-slate-200 text-slate-500 font-semibold px-4 py-1.5 rounded-xl text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleReview(proposal.proposalId, true)}
                    className="bg-[#3d6c8a] text-white font-semibold px-4 py-1.5 rounded-xl text-xs hover:opacity-95 shadow-sm transition-all"
                  >
                    Approve
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* تبويب عرض كل المشاريع اللي الدكتور مشرف عليها (داخلي أو خارجي) - من api/Professor/all-projects */}
      {currentView === 'all' && (
        <div>
          {projectsLoading ? (
            <div className="p-10 text-center text-slate-400 text-sm">Loading your projects...</div>
          ) : projectsError ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-red-200 text-red-400 text-xs">
              {projectsError}
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No projects found.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.projectId}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedProject(project)}
                  className="cursor-pointer bg-white rounded-[20px] border border-[#e2e8f0] p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {project.supervisionType === 'Internal' ? 'You supervise (Internal)' : 'You supervise (External)'}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#1e293b] text-base line-clamp-2 leading-snug">
                      {project.projectName}
                    </h3>
                    <p className="text-xs text-[#64748b] line-clamp-3 leading-relaxed">
                      {project.projectDescription}
                    </p>
                  </div>

                  <div className="border-t border-[#f1f5f9] pt-4 flex items-center justify-between text-xs text-[#64748b]">
                    <div>
                      <span className="font-medium text-[#94a3b8]">Team:</span>{' '}
                      <span className="font-semibold text-[#334155]">#{project.teamId}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} />
                      <span>{project.students?.length || 0} students</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* الـ Modal الخاص بتفاصيل المشروع */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] shadow-2xl p-8 w-full max-w-2xl max-h-[85vh] overflow-y-auto relative space-y-6 mx-4"
            >
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
              >
                <X size={20} />
              </button>

              <div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-3">
                  {selectedProject.supervisionType === 'Internal' ? 'Internal Supervision' : 'External Supervision'}
                </span>
                <h2 className="text-xl font-bold text-[#1e293b] leading-tight">
                  {selectedProject.projectName}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Team #{selectedProject.teamId}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Description</h4>
                <div className="bg-[#f8fafc] p-4 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed max-h-[200px] overflow-y-auto">
                  {selectedProject.projectDescription}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border-t border-slate-100 pt-4">
                <div>
                  <span className="text-slate-400 block font-medium">Internal Professor</span>
                  <span className="font-semibold text-slate-700 text-sm mt-0.5 block">
                    {selectedProject.internalProfessorName || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">External Professor</span>
                  <span className="font-semibold text-slate-700 text-sm mt-0.5 block">
                    {selectedProject.externalProfessorName || 'N/A'}
                  </span>
                </div>
              </div>

              {selectedProject.students?.length > 0 && (
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Students</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.students.map((s) => (
                      <span
                        key={s.studentSsn}
                        className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg text-[11px]"
                      >
                        {s.fname} {s.lname}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* الـ Modal الأصلي للرفض */}
      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Reject Proposal</h3>
            <p className="text-xs text-slate-500">Please provide a reason for rejecting this proposal.</p>
            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Write your rejection reason here..."
              className="w-full border border-slate-200 rounded-xl p-3 text-xs text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => { setRejectModal({ open: false, proposalId: null }); setRejectionReason(''); }}
                className="border border-slate-200 text-slate-500 font-semibold px-4 py-1.5 rounded-xl text-xs hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="bg-red-500 text-white font-semibold px-4 py-1.5 rounded-xl text-xs hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}