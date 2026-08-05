import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/images/logo3.png';
import {
  Search, Bell, Clock, FolderOpen, Users, GraduationCap, BookOpen,
  Settings, Loader2, CheckCircle2, AlertCircle, X
} from 'lucide-react';

const BASE_URL = import.meta.env.VITE_API_URL;

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

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // --- Projects State ---
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // --- Pending Teams State ---
  const [pendingTeams, setPendingTeams] = useState([]);
  const [internalProfessors, setInternalProfessors] = useState([]);
  const [externalProfessors, setExternalProfessors] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [assignLoading, setAssignLoading] = useState(null);

  // Selected professors per team: { [teamId]: { internalSsn, externalSsn } }
  const [selections, setSelections] = useState({});

  // --- Error State ---
  const [apiError, setApiError] = useState(null);

  // --- Reject Reason Modal State ---
  const [rejectModal, setRejectModal] = useState({ open: false, proposalId: null });
  const [rejectionReason, setRejectionReason] = useState('');

  // --- Dashboard Stats (independent counts from DB) ---
  const [stats, setStats] = useState({
    totalProjects: 0,
    pendingProjects: 0,
    pendingTeamsCount: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // ─────────────────────────────────────────
  // Team Limit Configuration (Min/Max team size)
  // ─────────────────────────────────────────
  const [showTeamLimitModal, setShowTeamLimitModal] = useState(false);
  const [teamLimitForm, setTeamLimitForm] = useState({ minMembers: '', maxMembers: '' });
  const [teamLimitStatus, setTeamLimitStatus] = useState({
    loading: false,
    success: null,
    message: ''
  });

  const getToken = () => localStorage.getItem('userToken');

  const fetchCurrentTeamLimit = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/ProjectManagement/team-limit`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTeamLimitForm({
          minMembers: data.minMembers ?? '',
          maxMembers: data.maxMembers ?? ''
        });
      }
    } catch (err) {
      console.error('Failed to load current team limit', err);
    }
  };

  const handleOpenTeamLimitModal = () => {
    setTeamLimitStatus({ loading: false, success: null, message: '' });
    setShowTeamLimitModal(true);
    fetchCurrentTeamLimit();
  };

  const handleSaveTeamLimit = async () => {
    const min = parseInt(teamLimitForm.minMembers, 10);
    const max = parseInt(teamLimitForm.maxMembers, 10);

    if (!min || !max || min <= 0 || max <= 0 || min > max) {
      setTeamLimitStatus({
        loading: false,
        success: false,
        message: 'Please enter valid numbers (Min must be less than or equal to Max).'
      });
      return;
    }

    setTeamLimitStatus({ loading: true, success: null, message: '' });

    try {
      const res = await fetch(`${BASE_URL}/api/SuperAdmin/team-limit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ minMembers: min, maxMembers: max })
      });

      const data = await res.json();

      if (res.ok) {
        setTeamLimitStatus({
          loading: false,
          success: true,
          message: data.message || 'Team limit updated successfully.'
        });
      } else {
        setTeamLimitStatus({
          loading: false,
          success: false,
          message: data.message || 'Failed to update team limit.'
        });
      }
    } catch (err) {
      setTeamLimitStatus({
        loading: false,
        success: false,
        message: 'Unable to connect to the server. Please try again later.'
      });
    }
  };

  // ─────────────────────────────────────────
  // Fetch: Dashboard Stats (3 independent counts)
  // ─────────────────────────────────────────
  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const [totalRes, pendingRes, teamsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/SuperAdmin/total-projects-count`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        }),
        fetch(`${BASE_URL}/api/SuperAdmin/pending-projects-count`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        }),
        fetch(`${BASE_URL}/api/SuperAdmin/pending-teams-count`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        }),
      ]);

      const totalData = await totalRes.json();
      const pendingData = await pendingRes.json();
      const teamsData = await teamsRes.json();

      setStats({
        totalProjects: totalRes.ok ? totalData.totalProjects : 0,
        pendingProjects: pendingRes.ok ? pendingData.pendingProjects : 0,
        pendingTeamsCount: teamsRes.ok ? teamsData.pendingTeams : 0,
      });
    } catch {
      setApiError('Connection error while loading dashboard stats');
    } finally {
      setStatsLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Fetch: Pending Proposals (PendingSuperAdmin)
  // ─────────────────────────────────────────
  const fetchPendingProposals = async () => {
    setProjectsLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/SuperAdmin/pending-proposals`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data);
      } else {
        setApiError(data.message || 'Failed to load pending proposals');
      }
    } catch {
      setApiError('Connection error while loading proposals');
    } finally {
      setProjectsLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Fetch: All Approved Projects
  // ─────────────────────────────────────────
  const fetchApprovedProjects = async () => {
    setProjectsLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/SuperAdmin/approved-projects`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok) {
        setProjects(data);
      } else {
        setApiError(data.message || 'Failed to load projects');
      }
    } catch {
      setApiError('Connection error while loading projects');
    } finally {
      setProjectsLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Fetch: Teams Without Professors
  // ─────────────────────────────────────────
  const fetchPendingTeams = async () => {
    setTeamsLoading(true);
    setApiError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/SuperAdmin/teams-without-professors`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPendingTeams(data);
        const initial = {};
        data.forEach(t => {
          initial[t.teamId] = { internalSsn: '', externalSsn: '' };
        });
        setSelections(initial);
      } else {
        setApiError(data.message || 'Failed to load teams');
      }
    } catch {
      setApiError('Connection error while loading teams');
    } finally {
      setTeamsLoading(false);
    }
  };

  // ─────────────────────────────────────────
  // Fetch: Internal Professors
  // ─────────────────────────────────────────
  const fetchInternalProfessors = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/SuperAdmin/internal-professors`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok) setInternalProfessors(data);
    } catch {
      console.error('Failed to load internal professors');
    }
  };

  // ─────────────────────────────────────────
  // Fetch: External Professors
  // ─────────────────────────────────────────
  const fetchExternalProfessors = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/SuperAdmin/external-professors`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok) setExternalProfessors(data);
    } catch {
      console.error('Failed to load external professors');
    }
  };

  // ─────────────────────────────────────────
  // useEffect: fetch stats once on mount
  // ─────────────────────────────────────────
  useEffect(() => {
    fetchStats();
  }, []);

  // ─────────────────────────────────────────
  // useEffect: fetch on tab change
  // ─────────────────────────────────────────
  useEffect(() => {
    setApiError(null);
    if (activeTab === 'pending') fetchPendingProposals();
    if (activeTab === 'all') fetchApprovedProjects();
    if (activeTab === 'pending_teams') {
      fetchPendingTeams();
      fetchInternalProfessors();
      fetchExternalProfessors();
    }
  }, [activeTab]);

  // ─────────────────────────────────────────
  // Handlers: Approve / Reject
  // ─────────────────────────────────────────
  const handleApprove = async (proposalId) => {
    try {
      const res = await fetch(`${BASE_URL}/api/SuperAdmin/final-approve-proposal/${proposalId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.proposalId !== proposalId));
        setSelectedProject(null);
        fetchStats();
      } else {
        const data = await res.json();
        setApiError(data.message || 'Approval failed');
      }
    } catch {
      setApiError('Connection error during approval');
    }
  };

  const handleReject = async (proposalId, reason = '') => {
    try {
      const res = await fetch(`${BASE_URL}/api/SuperAdmin/final-reject-proposal/${proposalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ rejectionReason: reason })
      });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.proposalId !== proposalId));
        setSelectedProject(null);
        fetchStats();
      } else {
        const data = await res.json();
        setApiError(data.message || 'Rejection failed');
      }
    } catch {
      setApiError('Connection error during rejection');
    }
  };

  // Confirms rejection from the reason modal (mirrors InternalProfessor pattern)
  const handleConfirmReject = async () => {
    if (!rejectionReason.trim()) return;
    await handleReject(rejectModal.proposalId, rejectionReason);
    setRejectModal({ open: false, proposalId: null });
    setRejectionReason('');
  };

  // ─────────────────────────────────────────
  // Handlers: Assign Professors
  // ─────────────────────────────────────────
  const handleSelectProf = (teamId, field, value) => {
    setSelections(prev => ({
      ...prev,
      [teamId]: { ...prev[teamId], [field]: value }
    }));
  };

  const handleAssignProfessors = async (teamId) => {
    const sel = selections[teamId];
    if (!sel?.internalSsn || !sel?.externalSsn) return;

    setAssignLoading(teamId);
    setApiError(null);
    try {
      const res = await fetch(`${BASE_URL}/api/SuperAdmin/assign-professors`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          teamId: teamId,
          internalProfessorSsn: sel.internalSsn,
          externalProfessorSsn: sel.externalSsn
        })
      });
      const data = await res.json();
      if (res.ok) {
        setPendingTeams(prev => prev.filter(t => t.teamId !== teamId));
        fetchStats();
      } else {
        setApiError(data.message || 'Failed to assign professors');
      }
    } catch {
      setApiError('Connection error while assigning professors');
    } finally {
      setAssignLoading(null);
    }
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  // ─────────────────────────────────────────
  // Filter projects for search
  // ─────────────────────────────────────────
  const filteredProjects = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return projects.filter(project =>
      project.title?.toLowerCase().includes(search) ||
      project.leader?.toLowerCase().includes(search)
    );
  }, [projects, searchTerm]);

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] font-sans">

      {/* ─── Sidebar ─── */}
      <aside className="flex w-[240px] flex-col border-r border-[#cbd5e1] bg-[#e2e8f0] p-[15px]">
        <div className="mb-[30px] flex items-center gap-2.5">
          <img src={Logo} alt="Pathify Logo" className="h-[60px] w-[100px] rounded-[7px] object-contain" />
        </div>

        <nav className="flex-1 space-y-1">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex w-full items-center gap-3 px-[15px] py-[11px] rounded-[9px] text-[13px] font-medium transition-all duration-200 outline-none
              ${activeTab === 'pending' ? 'bg-[#3d6c8a] text-white shadow-lg' : 'text-[#1e293b] hover:bg-[#dee4ed] hover:translate-x-1'}`}
          >
            <Clock size={18} /><span>Pending Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('all')}
            className={`flex w-full items-center gap-3 px-[15px] py-[11px] rounded-[9px] text-[13px] font-medium transition-all duration-200 outline-none
              ${activeTab === 'all' ? 'bg-[#3d6c8a] text-white shadow-lg' : 'text-[#1e293b] hover:bg-[#dee4ed] hover:translate-x-1'}`}
          >
            <FolderOpen size={18} /><span>All Projects</span>
          </button>

          <button
            onClick={() => setActiveTab('pending_teams')}
            className={`flex w-full items-center gap-3 px-[15px] py-[11px] rounded-[9px] text-[13px] font-medium transition-all duration-200 outline-none
              ${activeTab === 'pending_teams' ? 'bg-[#3d6c8a] text-white shadow-lg' : 'text-[#1e293b] hover:bg-[#dee4ed] hover:translate-x-1'}`}
          >
            <Users size={18} /><span>Pending Teams</span>
          </button>
        </nav>

        <div
          onClick={handleLogout}
          className="mt-auto flex cursor-pointer items-center gap-2 border-t border-[#cbd5e1] p-[15px] font-semibold text-[#ef4444] hover:opacity-80 transition-opacity"
        >
          <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-[13px]">Logout</span>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Header */}
        <header className="flex h-[60px] items-center justify-between border-b border-[#e2e8f0] bg-white px-[30px]">
          <div className="flex w-[280px] items-center gap-2.5 rounded-[10px] bg-[#f1f5f9] px-[15px] py-[7px]">
            <Search size={16} className="text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-[13px] outline-none"
            />
          </div>
          <div className="flex items-center gap-[25px]">
            <Bell size={19} className="cursor-pointer text-[#64748b]" />
            <div className="flex items-center gap-2.5">
              <div className="text-right">
                <p className="text-[13px] font-bold text-[#1e293b]">Super Admin</p>
                <p className="text-[11px] text-[#94a3b8]">Administrator</p>
              </div>
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#3d6c8a] text-[13px] font-bold text-white">SA</div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-[32px_40px_40px_40px] flex flex-col gap-6">

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-[800] text-[#1e293b] m-0">Super Admin Dashboard</h2>
              <p className="text-[13px] text-[#64748b] mt-1 m-0 font-medium">Manage the Pathify academic ecosystem.</p>
            </div>
            <button
              onClick={handleOpenTeamLimitModal}
              className="flex items-center gap-2 rounded-xl bg-[#3d6c8a] px-5 py-3 text-[13px] font-[800] text-white shadow-sm transition-all hover:bg-[#2c526b]"
            >
              <Settings size={18} />
              Set Team Members Limit
            </button>
          </div>

          {/* API Error Banner */}
          {apiError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
              ⚠️ {apiError}
            </div>
          )}

          {/* Stat Cards — each value comes from its own independent DB count */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6">
            <StatCard
              title="Total Projects"
              value={statsLoading ? '...' : stats.totalProjects}
              icon={GraduationCap}
              iconBg="bg-blue-50"
              iconColor="text-blue-500"
            />
            <StatCard
              title="Pending Projects"
              value={statsLoading ? '...' : stats.pendingProjects}
              icon={Clock}
              iconBg="bg-red-50"
              iconColor="text-red-500"
            />
            <StatCard
              title="Pending Teams"
              value={statsLoading ? '...' : stats.pendingTeamsCount}
              icon={Users}
              iconBg="bg-emerald-50"
              iconColor="text-emerald-500"
            />
            <div />
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-[#e2e8f0]">
            <button
              onClick={() => setActiveTab('pending')}
              className={`bg-none border-none text-sm font-bold pb-3 cursor-pointer ${activeTab === 'pending' ? 'text-[#3d6c8a] border-b-2 border-[#3d6c8a]' : 'text-[#718096]'}`}
            >
              Pending Projects
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`bg-none border-none text-sm font-bold pb-3 cursor-pointer ${activeTab === 'all' ? 'text-[#3d6c8a] border-b-2 border-[#3d6c8a]' : 'text-[#718096]'}`}
            >
              All Projects
            </button>
            <button
              onClick={() => setActiveTab('pending_teams')}
              className={`bg-none border-none text-sm font-bold pb-3 cursor-pointer ${activeTab === 'pending_teams' ? 'text-[#3d6c8a] border-b-2 border-[#3d6c8a]' : 'text-[#718096]'}`}
            >
              Pending Teams ({pendingTeams.length})
            </button>
          </div>

          {/* ─── Pending Teams Tab ─── */}
          {activeTab === 'pending_teams' ? (
            teamsLoading ? (
              <div className="flex items-center justify-center py-20 text-[#94a3b8] text-sm font-medium">
                Loading teams...
              </div>
            ) : pendingTeams.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-[#94a3b8] text-sm font-medium">
                ✅ All teams have been assigned professors.
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6">
                {pendingTeams.map((team) => {
                  const sel = selections[team.teamId] || { internalSsn: '', externalSsn: '' };
                  const canAssign = sel.internalSsn && sel.externalSsn;
                  const isAssigning = assignLoading === team.teamId;

                  return (
                    <div key={team.teamId} className="interactive-card bg-white rounded-[24px] flex flex-col overflow-hidden shadow-sm border border-[#e2e8f0]">
                      <div className="flex justify-between items-center p-6 pb-4">
                        <h3 className="text-lg font-[800] text-[#1e293b] m-0">Team #{team.teamId}</h3>
                        <span className="text-[11px] py-1 px-2.5 rounded-full bg-[#edf2f7] text-[#64748b] font-[800]">Needs Professors</span>
                      </div>
                      <div className="p-6 pt-0 pb-5 flex flex-col gap-3.5">
                        <p className="text-[13px] text-[#1e293b] m-0">
                          <strong>👤 LEADER:</strong> {team.leaderName}
                        </p>

                        {/* Internal Professor Dropdown */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-bold text-[#64748b]">Assign Internal Professor:</label>
                          <select
                            value={sel.internalSsn}
                            onChange={(e) => handleSelectProf(team.teamId, 'internalSsn', e.target.value)}
                            className="p-2.5 rounded-[12px] border border-[#cbd5e1] bg-[#f7fafc] text-[13px] outline-none text-[#1a202c] w-full"
                          >
                            <option value="">-- Select Internal Professor --</option>
                            {internalProfessors.map((prof) => (
                              <option key={prof.internalProfessorSsn} value={prof.internalProfessorSsn}>
                                {prof.internalProfessorName}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* External Professor Dropdown */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[12px] font-bold text-[#64748b]">Assign External Professor:</label>
                          <select
                            value={sel.externalSsn}
                            onChange={(e) => handleSelectProf(team.teamId, 'externalSsn', e.target.value)}
                            className="p-2.5 rounded-[12px] border border-[#cbd5e1] bg-[#f7fafc] text-[13px] outline-none text-[#1a202c] w-full"
                          >
                            <option value="">-- Select External Professor --</option>
                            {externalProfessors.map((prof) => (
                              <option key={prof.externalProfessorSsn} value={prof.externalProfessorSsn}>
                                {prof.externalProfessorName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2 p-[0_24px_24px_24px]">
                        <button
                          onClick={() => handleAssignProfessors(team.teamId)}
                          disabled={!canAssign || isAssigning}
                          className={`w-full py-3 rounded-[14px] text-[13px] font-bold transition-all
                            ${canAssign && !isAssigning
                              ? 'bg-[#3d6c8a] text-white cursor-pointer hover:bg-[#2d5169]'
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                        >
                          {isAssigning ? 'Assigning...' : 'Assign Professors'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )

          ) : (
            /* ─── Projects Grid (Pending & All) ─── */
            projectsLoading ? (
              <div className="flex items-center justify-center py-20 text-[#94a3b8] text-sm font-medium">
                Loading projects...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-[#94a3b8] text-sm font-medium">
                {activeTab === 'pending' ? '✅ No pending proposals.' : '📂 No approved projects yet.'}
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-6">
                {filteredProjects.map((project) => {
                  // pending tab uses proposalId, all tab uses id
                  const cardId = activeTab === 'pending' ? project.proposalId : project.id;

                  return (
                    <div key={cardId} className="group interactive-card relative flex flex-col overflow-hidden rounded-[24px] bg-white p-6 shadow-sm border border-transparent">
                      <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#3d6c8a] transition-all bottom-line"></div>

                      <div className="flex justify-between items-center mb-4">
                        <div className="flex w-10 h-10 items-center justify-center rounded-[12px] bg-[#3d6c8a] text-white text-lg">📄</div>
                        <span className="text-[11px] font-[800] text-[#3d6c8a] bg-[#3d6c8a0f] py-1.5 px-3 rounded-full">
                          {project.course || 'General'}
                        </span>
                      </div>

                      <h4 className="text-base font-[800] text-[#1e293b] m-[0_0_16px_0] project-title-text">{project.title}</h4>

                      <div className="flex flex-col gap-3 rounded-[16px] bg-[#f7fafc] p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-[#3d6c8a]"></div>
                            <p className="text-[11px] font-[800] text-[#94a3b8] uppercase m-0">Leader</p>
                          </div>
                          <p className="text-[13px] font-bold text-[#1e293b] m-0">{project.leader}</p>
                        </div>

                        <div className="flex flex-col gap-1 items-start">
                          <div className="flex items-center gap-2">
                            <span className="text-[12px] text-[#94a3b8]">👥</span>
                            <p className="text-[11px] font-[800] text-[#94a3b8] uppercase m-0">Team Members</p>
                          </div>
                          <p className="text-[13px] font-bold text-[#1e293b] m-[2px_0_0_0] pl-5 leading-normal">
                            {project.members?.join(', ') || '—'}
                          </p>
                        </div>

                        <div className="mt-2 pt-3 border-t border-[#edf2f7] flex justify-between items-center">
                          <p className="text-[10px] font-[800] text-[#a0aec0] m-0">Date</p>
                          <div className="flex items-center gap-1.5 text-[#3d6c8a]">
                            <span className="text-[10px]">📅</span>
                            <span className="text-[12px] font-bold">{project.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="flex-1 rounded-[14px] bg-[#3d6c8a] py-3 text-[13px] font-bold text-white border-none cursor-pointer text-center"
                        >
                          {activeTab === 'all' ? 'View Details' : '✓ Review & Approve'}
                        </button>
                        {activeTab === 'pending' && (
                          <button
                            onClick={() => setRejectModal({ open: true, proposalId: project.proposalId })}
                            className="rounded-[14px] border border-[#e2e8f0] bg-white px-4 text-[#ef4444] cursor-pointer hover:bg-red-50 hover:border-red-200 transition-all"
                          >
                            🗑
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* ─── Project Details / Approval Modal ─── */}
          {selectedProject && (
            <div
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-[4px] p-4"
              onClick={() => setSelectedProject(null)}
            >
              <div
                className="w-full max-w-[480px] rounded-[24px] bg-white p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] bg-[#3d6c8a] text-white text-2xl">📄</div>
                  <button onClick={() => setSelectedProject(null)} className="p-2 border-none bg-transparent text-[#a0aec0] cursor-pointer text-lg">✕</button>
                </div>

                <h3 className="text-2xl font-[800] text-[#1e293b] m-[0_0_6px_0]">{selectedProject.title}</h3>
                <p className="text-sm font-bold text-[#3d6c8a] m-0">{selectedProject.course || 'General Project'}</p>

                <div className="flex flex-col gap-5 mt-5">
                  <div>
                    <p className="text-[11px] font-[800] text-[#a0aec0] uppercase mb-2 m-0">Description</p>
                    <p className="text-sm text-[#4a5568] leading-relaxed bg-[#f7fafc] p-4 rounded-[16px] m-0">
                      {selectedProject.description || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* Cancel / Approve — only on pending tab (Reject lives on the 🗑 button outside this modal) */}
                {activeTab === 'pending' && (
                  <div className="mt-9 flex gap-4">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="flex-1 rounded-[14px] border border-[#e2e8f0] py-3.5 text-sm font-bold text-[#64748b] cursor-pointer bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleApprove(selectedProject.proposalId)}
                      className="flex-1 rounded-[14px] bg-[#3d6c8a] py-3.5 text-sm font-bold text-white border-none cursor-pointer"
                    >
                      Approve
                    </button>
                  </div>
                )}

                {/* Close — only on all tab */}
                {activeTab === 'all' && (
                  <div className="mt-9">
                    <button
                      onClick={() => setSelectedProject(null)}
                      className="w-full rounded-[14px] border border-[#e2e8f0] py-3.5 text-sm font-bold text-[#64748b] cursor-pointer bg-white"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Reject Reason Modal (same design as InternalProfessor) ─── */}
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
                    onClick={handleConfirmReject}
                    disabled={!rejectionReason.trim()}
                    className="bg-red-500 text-white font-semibold px-4 py-1.5 rounded-xl text-xs hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Confirm Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─── Team Limit Configuration Modal ─── */}
          {showTeamLimitModal && (
            <div
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-[4px] p-4"
              onClick={() => setShowTeamLimitModal(false)}
            >
              <div
                className="w-full max-w-[420px] rounded-[24px] bg-white p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[16px] bg-[#3d6c8a] text-white">
                    <Settings size={24} />
                  </div>
                  <button onClick={() => setShowTeamLimitModal(false)} className="p-2 border-none bg-transparent text-[#a0aec0] cursor-pointer">
                    <X size={20} />
                  </button>
                </div>

                <h3 className="text-xl font-[800] text-[#1e293b] m-[0_0_6px_0]">Team Members Limit</h3>
                <p className="text-sm text-[#64748b] m-0 mb-6">Set the minimum and maximum allowed team size for all students.</p>

                <AnimatePresence>
                  {teamLimitStatus.message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`mb-5 rounded-[14px] p-4 text-sm font-medium flex items-center gap-2 ${
                        teamLimitStatus.success ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
                      }`}
                    >
                      {teamLimitStatus.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                      {teamLimitStatus.message}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-[#64748b]">Minimum Members</label>
                    <input
                      type="number"
                      min={1}
                      value={teamLimitForm.minMembers}
                      onChange={(e) => setTeamLimitForm(prev => ({ ...prev, minMembers: e.target.value }))}
                      className="p-3 rounded-[12px] border border-[#cbd5e1] bg-[#f7fafc] text-[14px] outline-none text-[#1a202c] w-full"
                      placeholder="e.g. 2"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[12px] font-bold text-[#64748b]">Maximum Members</label>
                    <input
                      type="number"
                      min={1}
                      value={teamLimitForm.maxMembers}
                      onChange={(e) => setTeamLimitForm(prev => ({ ...prev, maxMembers: e.target.value }))}
                      className="p-3 rounded-[12px] border border-[#cbd5e1] bg-[#f7fafc] text-[14px] outline-none text-[#1a202c] w-full"
                      placeholder="e.g. 6"
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={() => setShowTeamLimitModal(false)}
                    className="flex-1 rounded-[14px] border border-[#e2e8f0] py-3.5 text-sm font-bold text-[#64748b] cursor-pointer bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTeamLimit}
                    disabled={teamLimitStatus.loading}
                    className="flex-1 flex items-center justify-center gap-2 rounded-[14px] bg-[#3d6c8a] py-3.5 text-sm font-bold text-white border-none cursor-pointer hover:bg-[#2c526b] disabled:opacity-50"
                  >
                    {teamLimitStatus.loading ? <Loader2 size={16} className="animate-spin" /> : null}
                    {teamLimitStatus.loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Hover styles */}
      <style>{`
        .interactive-card { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease !important; border: 1px solid #e2e8f0 !important; }
        .interactive-card:hover { transform: translateY(-6px); border-color: #3d6c8a !important; box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.05) !important; }
        .interactive-card:hover .bottom-line { width: 100% !important; }
        .interactive-card:hover .project-title-text { color: #3d6c8a !important; }
      `}</style>
    </div>
  );
}