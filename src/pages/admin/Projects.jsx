import React, { useState } from 'react';
import { Search, ChevronRight, User, GraduationCap } from 'lucide-react';

export default function AdminProjects() {
    const [hoveredId, setHoveredId] = useState(null);
    const [projectData] = useState([
        {
            id: 1,
            title: 'Smart Campus IoT',
            leader: 'Ahmed Ali',
            professor: 'Dr. Sarah Smith',
            status: 'in-progress',
            members: 'Ahmed, Nour, Omar'
        },
        {
            id: 2,
            title: 'AI Health Assistant',
            leader: 'Laila Karim',
            professor: 'Dr. James Wilson',
            status: 'proposal',
            members: 'Laila, Karim'
        },
        {
            id: 3,
            title: 'E-Learning Platform',
            leader: 'Mona Salem',
            professor: 'Dr. Robert Brown',
            status: 'completed',
            members: 'Mona, Hany, Sali'
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');

    const filteredProjects = projectData.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.leader.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="relative rounded-[20px] border border-[#e2e8f0] bg-white p-[20px]">
                <div className="mb-5">
                    <h3 className="text-[17px] font-bold text-[#1e293b]">Project Monitoring</h3>
                    <p className="text-sm text-[#64748b]">Monitor graduation project progress and teams.</p>
                </div>

                <div className="mb-5">
                    <div className="flex w-[300px] items-center gap-2.5 rounded-[10px] border border-[#e2e8f0] bg-white px-[15px] py-[8px]">
                        <Search size={16} className="text-[#94a3b8]" />
                        <input
                            type="text"
                            placeholder="Search by project or leader..."
                            className="w-full bg-transparent text-[13px] outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            onMouseEnter={() => setHoveredId(project.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`
                                cursor-pointer rounded-[16px] bg-white p-5 transition-all duration-300
                                border ${hoveredId === project.id ? 'border-[#3d6c8a]' : 'border-[#e2e8f0]'}
                                ${hoveredId === project.id ? 'translate-y-[-6px] shadow-[0_12px_30px_rgba(0,0,0,0.15)]' : 'translate-y-0 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]'}
                            `}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <h4 className="m-0 text-[16px] font-[700] text-[#1e293b]">{project.title}</h4>
                                </div>
                                <span className={`
                                    text-[10px] px-2 py-0.5 rounded-full border border-slate-200
                                    ${project.status === 'in-progress' ? 'bg-blue-50 text-blue-600' : 
                                      project.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-600'}
                                `}>
                                    {project.status}
                                </span>
                            </div>

                            <div className="mb-3">
                                <p className="text-[11px] font-[600] text-[#94a3b8] mb-1 uppercase">TEAM MEMBERS</p>
                                <div className="flex items-center gap-1.5 text-[13px] text-[#475569]">
                                    <User size={14} className="text-[#64748b]" />
                                    <span>{project.members}</span>
                                </div>
                            </div>

                            <div className="mb-5">
                                <p className="text-[11px] font-[600] text-[#94a3b8] mb-1 uppercase">SUPERVISOR</p>
                                <div className="flex items-center gap-1.5 text-[13px] text-[#475569]">
                                    <GraduationCap size={14} className="text-[#64748b]" />
                                    <span>{project.professor}</span>
                                </div>
                            </div>

                            <button
                                className="w-full flex items-center justify-center gap-1.5 rounded-[10px] bg-[#3d6c8a] p-2.5 text-[13px] font-[600] text-white transition-opacity hover:opacity-90"
                                onClick={() => alert(`View details for: ${project.title}`)}
                            >
                                View Details <ChevronRight size={14} />
                            </button>
                        </div>
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center p-10 text-[#94a3b8]">
                        No projects found.
                    </div>
                )}
        </div>
    );
}
