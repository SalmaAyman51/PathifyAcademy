// import React from 'react';
// import { BookOpen, CheckCircle2, FileText, Clock } from 'lucide-react';

// // --- MetricCard Component ---
// const MetricCard = ({ label, value, icon: Icon, iconBg, iconColor }) => {
//   return (
//     <div className="flex cursor-pointer items-center gap-[15px] rounded-[16px] border border-[#e2e8f0] bg-white p-[20px] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
//       <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[10px]" style={{ background: iconBg, color: iconColor }}>
//         <Icon size={22} />
//       </div>
//       <div>
//         <p className="mb-1.5 text-[10px] font-bold tracking-[0.08em] text-[#94a3b8] uppercase">
//           {label}
//         </p>
//         <h2 className="text-[26px] font-[800] leading-none text-[#1e293b]">
//           {value}
//         </h2>
//       </div>
//     </div>
//   );
// };

// // --- ProjectCard Component ---
// const ProjectCard = () => {
//   return (
//     <div className="w-full rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-sm">
//       <div className="mb-5 flex items-start justify-between">
//         <div>
//           <h3 className="mb-1 text-[17px] font-bold text-[#1e293b]">
//             Smart Campus IoT System
//           </h3>
//           <p className="text-[13px] text-[#64748b]">Supervisor: Dr. Ahmed Ali</p>
//         </div>
//         <span className="rounded-full border border-[#fde68a] bg-[#fef3c7] px-3 py-1 text-[11px] font-bold tracking-[0.05em] text-[#d97706] uppercase">
//           In Review
//         </span>
//       </div>

//       <div className="mb-6">
//         <div className="mb-2 flex justify-between">
//           <span className="text-[13px] font-semibold text-[#475569]">Overall Progress</span>
//           <span className="text-[13px] text-[#94a3b8]">35%</span>
//         </div>
//         <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
//           <div className="h-full rounded-full bg-[#3d6c8a]" style={{ width: '35%' }} />
//         </div>
//       </div>

//       <div className="grid grid-cols-3 gap-4 border-t border-[#f1f5f9] pt-5">
//         <div>
//           <p className="mb-1.5 text-[10px] font-bold tracking-[0.08em] text-[#94a3b8] uppercase">Proposal</p>
//           <div className="h-1.5 w-full rounded-full border border-[#e2e8f0] bg-[#f1f5f9]" />
//         </div>
//         <div>
//           <p className="mb-1.5 text-[10px] font-bold tracking-[0.08em] text-[#94a3b8] uppercase">Deadline</p>
//           <p className="text-[14px] font-bold text-[#1e293b]">May 15</p>
//         </div>
//         <div>
//           <p className="mb-1.5 text-[10px] font-bold tracking-[0.08em] text-[#94a3b8] uppercase">Team</p>
//           <p className="text-[14px] font-bold text-[#1e293b]">6 Members</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // --- Main Dashboard Component ---
// export default function StudentDashboard() {
//   return (
//     <div className="flex flex-col gap-7 p-6 max-w-full">
//       {/* Header Section */}
//       <div className="flex flex-wrap items-end justify-between gap-4">
//         <div>
//           <h1 className="mb-1 text-2xl font-[800] text-[#1e293b]">
//             Welcome back, John!
//           </h1>
//           <p className="text-sm text-[#64748b]">
//             Your academic journey is progressing beautifully.
//           </p>
//         </div>
//         <span className="rounded-full bg-[#e0f2fe] px-4 py-1.5 text-[11px] font-bold tracking-[0.08em] text-[#3d6c8a] uppercase">
//           Spring Semester 2025
//         </span>
//       </div>

//       {/* Metrics Grid */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <MetricCard label="Enrolled Courses"   value="4"     icon={BookOpen}     iconBg="#eff6ff" iconColor="#3b82f6" />
//         <MetricCard label="Completed Credits"  value="12"    icon={CheckCircle2} iconBg="#f0fdf4" iconColor="#10b981" />
//         <MetricCard label="Pending Requests"   value="2"     icon={Clock}        iconBg="#fffbeb" iconColor="#f59e0b" />
//         <MetricCard label="Project Status"     value="Draft" icon={FileText}     iconBg="#f8fafc" iconColor="#475569" />
//       </div>

//       {/* Project Section - Modified for Full Width */}
//       <div className="w-full">
//         <div className="mb-4">
//           <h2 className="mb-0.5 text-[17px] font-bold text-[#1e293b]">Current Project</h2>
//           <p className="text-[13px] text-[#94a3b8]">Graduation project progress</p>
//         </div>
//         <ProjectCard />
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, FileText, Clock } from 'lucide-react';

const BASE_URL = 'https://localhost:7061/api/StudentDashboard';
const getToken = () => localStorage.getItem('userToken');

function getSSNFromToken() {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.SSN ?? payload.ssn ?? null;
  } catch {
    return null;
  }
}

// --- MetricCard Component ---
const MetricCard = ({ label, value, icon: Icon, iconBg, iconColor, loading }) => {
  return (
    <div className="flex cursor-pointer items-center gap-[15px] rounded-[16px] border border-[#e2e8f0] bg-white p-[20px] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_20px_rgba(0,0,0,0.08)]">
      <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[10px]" style={{ background: iconBg, color: iconColor }}>
        <Icon size={22} />
      </div>
      <div>
        <p className="mb-1.5 text-[10px] font-bold tracking-[0.08em] text-[#94a3b8] uppercase">
          {label}
        </p>
        {loading
          ? <div className="h-7 w-12 animate-pulse rounded-md bg-[#e2e8f0]" />
          : <h2 className="text-[26px] font-[800] leading-none text-[#1e293b]">{value}</h2>
        }
      </div>
    </div>
  );
};

// --- ProjectCard Component ---
const ProjectCard = () => {
  return (
    <div className="w-full rounded-[20px] border border-[#e2e8f0] bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="mb-1 text-[17px] font-bold text-[#1e293b]">
            Smart Campus IoT System
          </h3>
          <p className="text-[13px] text-[#64748b]">Supervisor: Dr. Ahmed Ali</p>
        </div>
        <span className="rounded-full border border-[#fde68a] bg-[#fef3c7] px-3 py-1 text-[11px] font-bold tracking-[0.05em] text-[#d97706] uppercase">
          In Review
        </span>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex justify-between">
          <span className="text-[13px] font-semibold text-[#475569]">Overall Progress</span>
          <span className="text-[13px] text-[#94a3b8]">35%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#f1f5f9]">
          <div className="h-full rounded-full bg-[#3d6c8a]" style={{ width: '35%' }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-[#f1f5f9] pt-5">
        <div>
          <p className="mb-1.5 text-[10px] font-bold tracking-[0.08em] text-[#94a3b8] uppercase">Proposal</p>
          <div className="h-1.5 w-full rounded-full border border-[#e2e8f0] bg-[#f1f5f9]" />
        </div>
        <div>
          <p className="mb-1.5 text-[10px] font-bold tracking-[0.08em] text-[#94a3b8] uppercase">Deadline</p>
          <p className="text-[14px] font-bold text-[#1e293b]">May 15</p>
        </div>
        <div>
          <p className="mb-1.5 text-[10px] font-bold tracking-[0.08em] text-[#94a3b8] uppercase">Team</p>
          <p className="text-[14px] font-bold text-[#1e293b]">6 Members</p>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---
export default function StudentDashboard() {
  const [enrolledCount, setEnrolledCount]       = useState(null);
  const [completedCredits, setCompletedCredits] = useState(null);
  const [metricsLoading, setMetricsLoading]     = useState(true);

  const ssn = getSSNFromToken();

  useEffect(() => {
    if (!ssn) return;
    const fetchMetrics = async () => {
      setMetricsLoading(true);
      try {
        const [enrolledRes, creditsRes] = await Promise.all([
          fetch(`${BASE_URL}/enrolled-courses/${ssn}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          fetch(`${BASE_URL}/completed-credits/${ssn}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
        ]);

        if (enrolledRes.ok) {
          const count = await enrolledRes.json();
          setEnrolledCount(count);
        }

        if (creditsRes.ok) {
          const data = await creditsRes.json();
          setCompletedCredits(data.completedCredits ?? data.CompletedCredits ?? 0);
        }
      } catch (_) {}
      finally { setMetricsLoading(false); }
    };
    fetchMetrics();
  }, [ssn]);

  return (
    <div className="flex flex-col gap-7 p-6 max-w-full">

      {/* Header Section */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-[800] text-[#1e293b]">
            Welcome back!
          </h1>
          <p className="text-sm text-[#64748b]">
            Your academic journey is progressing beautifully.
          </p>
        </div>
        <span className="rounded-full bg-[#e0f2fe] px-4 py-1.5 text-[11px] font-bold tracking-[0.08em] text-[#3d6c8a] uppercase">
          Spring Semester 2025
        </span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Enrolled Courses"
          value={enrolledCount ?? '—'}
          icon={BookOpen}
          iconBg="#eff6ff" iconColor="#3b82f6"
          loading={metricsLoading}
        />
        <MetricCard
          label="Completed Credits"
          value={completedCredits ?? '—'}
          icon={CheckCircle2}
          iconBg="#f0fdf4" iconColor="#10b981"
          loading={metricsLoading}
        />
        <MetricCard
          label="Pending Requests"
          value="2"
          icon={Clock}
          iconBg="#fffbeb" iconColor="#f59e0b"
          loading={false}
        />
        <MetricCard
          label="Project Status"
          value="Draft"
          icon={FileText}
          iconBg="#f8fafc" iconColor="#475569"
          loading={false}
        />
      </div>

      {/* Project Section */}
      <div className="w-full">
        <div className="mb-4">
          <h2 className="mb-0.5 text-[17px] font-bold text-[#1e293b]">Current Project</h2>
          <p className="text-[13px] text-[#94a3b8]">Graduation project progress</p>
        </div>
        <ProjectCard />
      </div>

    </div>
  );
}