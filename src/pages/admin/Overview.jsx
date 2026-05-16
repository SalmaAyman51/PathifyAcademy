import React from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  Clock,
  Eye,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';

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
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* هنا حذفنا قسم الـ Header بالكامل اللي كان شايل العنوان والزرار */}
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value="3"
          icon={GraduationCap}
          iconBg="bg-blue-50"
          iconColor="text-blue-500"
        />
        <StatCard
          title="Total Professors"
          value="4"
          icon={Users}
          iconBg="bg-green-50"
          iconColor="text-green-500"
        />
        <StatCard
          title="Active Courses"
          value="3"
          icon={BookOpen}
          iconBg="bg-orange-50"
          iconColor="text-orange-500"
        />
        <StatCard
          title="Pending Approvals"
          value="2"
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
                  <th className="pb-5">STATUS</th>
                  <th className="pb-5">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                <tr className="group text-[13px] text-[#1e293b] transition-colors hover:bg-[#f8fafc]">
                  <td className="py-5 font-medium">Ahmed Ali</td>
                  <td className="py-5 text-[#64748b]">Software Engineering</td>
                  <td className="py-5">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-[11px] font-[800] text-orange-600">pending</span>
                  </td>
                  <td className="py-5">
                    <div className="flex gap-3">
                      <button className="text-[#3d6c8a] transition-colors hover:opacity-70">
                        <Eye size={18} />
                      </button>
                      <button className="text-red-500 transition-colors hover:opacity-70">
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health */}
        <div className="rounded-[24px] border border-[#e2e8f0] bg-white p-8 shadow-sm">
          <h2 className="mb-8 text-[18px] font-[800] text-[#1e293b]">System Health</h2>
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-[#64748b]">Database</span>
              <span className="text-[14px] font-[800] text-[#10b981]">Healthy</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-medium text-[#64748b]">Auth Service</span>
              <span className="text-[14px] font-[800] text-[#10b981]">Active</span>
            </div>
            <div className="pt-4">
              <div className="h-2 w-full rounded-full bg-[#f1f5f9]">
                <div className="h-full w-[42%] rounded-full bg-[#3d6c8a]"></div>
              </div>
              <p className="mt-4 text-[12px] font-semibold text-[#94a3b8]">42% Load Used</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}