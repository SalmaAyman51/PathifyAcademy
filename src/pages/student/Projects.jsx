import React, { useState } from 'react';
import {
  Plus, Users, Lightbulb,
  UserCheck, CheckCheck, ChevronLeft, ArrowRight,
  Star, Trash2, X, ExternalLink
} from 'lucide-react';

export default function StudentProjects() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPastProjects, setShowPastProjects] = useState(false);

  // --- حالة أعضاء الفريق (Team Builder) ---
  const [members, setMembers] = useState([
    { id: 1, name: 'You', email: 'you@uni.edu', isLeader: true, isFixed: true }, // أنت العضو الثابت
  ]);

  const maxMembers = 6;

  // إضافة عضو جديد
  const addMember = () => {
    if (members.length >= maxMembers) {
      alert(`لا يمكنك إضافة أكثر من ${maxMembers} أعضاء.`);
      return;
    }
    const newId = Date.now();
    setMembers([...members, { id: newId, name: '', email: '', isLeader: false, isFixed: false }]);
  };

  // حذف عضو (يمنع حذف العضو الثابت "You")
  const removeMember = (id) => {
    const member = members.find(m => m.id === id);
    if (member?.isFixed) {
      alert("لا يمكن حذف نفسك (You) من الفريق.");
      return;
    }
    if (members.length <= 1) {
      alert("يجب أن يبقى عضو واحد على الأقل.");
      return;
    }
    setMembers(members.filter(m => m.id !== id));
  };

  // تعيين قائد الفريق
  const setAsLeader = (id) => {
    setMembers(members.map(m => ({ ...m, isLeader: m.id === id })));
  };

  // تحديث الاسم أو الإيميل
  const updateMember = (id, field, value) => {
    setMembers(members.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

   const pastProjects = [
    { id: 1, title: "AI Health Monitor", team: "Zeyad Ali, Ahmed Hassan", year: "2025", description: "ML-based patient monitoring system" },
    { id: 2, title: "Secure Voting System", team: "Layla Nour, Kareem Adel", year: "2025", description: "Blockchain voting application" },
    { id: 3, title: "Smart Traffic Flow", team: "Hassan Karim, Nour El-Din", year: "2024", description: "IoT traffic optimization" },
    { id: 4, title: "E-Learning VR Lab", team: "Mona Ahmed, Salma Yasser", year: "2024", description: "Virtual reality science lab" },
    { id: 5, title: "Fintech Fraud Shield", team: "Omar Fayed, Mostafa Mahmoud", year: "2023", description: "Anomaly detection for payments" },
  ];

  const steps = [
    { title: 'Team Building', icon: Users },
    { title: 'Idea Submission', icon: Lightbulb },
    { title: 'Supervisor Request', icon: UserCheck },
    { title: 'Final Approval', icon: CheckCheck },
  ];

  return (
    <div className="flex flex-col gap-6 font-sans">
   {/* Past Projects Modal */}
      {showPastProjects && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">📚 Past Years Projects</h2>
              <button onClick={() => setShowPastProjects(false)} className="rounded-full p-2 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastProjects.map(project => (
                <div key={project.id} className="rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900">{project.title}</h3>
                    <span className="text-xs font-bold text-[#3d6c8a] bg-[#3d6c8a]/10 px-2 py-1 rounded-full">{project.year}</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{project.description}</p>
                  <p className="text-xs text-slate-400">Team: {project.team}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      {/* Header section (مع تعديل الزر) */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-[800] tracking-tight text-slate-900">Project Management</h1>
          <p className="text-sm text-slate-500">Manage your graduation project and team collaborations.</p>
        </div>
        <button
          onClick={() => setShowPastProjects(true)}
          className="flex items-center gap-2 rounded-lg bg-[#3d6c8a] px-5 py-3 text-sm font-medium text-white shadow-md transition-all hover:bg-black hover:-translate-y-0.5"
        >
          Projects From Past Years
        </button>
      </div>

      {/* Stepper Container (نفس الكود الأصلي بدون تغيير) */}
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
              <div key={index} className="relative z-10 flex cursor-pointer flex-col items-center gap-4 transition-all group"
                onClick={() => setCurrentStep(index)}>
                <div className={`flex h-[60px] w-[60px] items-center justify-center rounded-full border-2 transition-all duration-500
                  ${isActive ? 'border-[#3d6c8a] bg-gradient-to-br from-[#3d6c8a] to-[#5a9dc7] text-white scale-110 shadow-[0_10px_20px_rgba(61,108,138,0.3)] rotate-3'
                    : isCompleted ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-100'
                    : 'border-slate-200 bg-white text-slate-400 group-hover:border-slate-300'}`}>
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
          {/* Step 0: Team Builder - مُعدّل بالكامل */}
          {currentStep === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-slideIn">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-slate-900">Team Builder</h2>
                <p className="text-sm text-slate-500">Build your team (up to 6 members). You are already included as a member.</p>
              </div>

              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/40 p-4 transition-all hover:border-slate-300">
                    <div className="flex flex-wrap items-start gap-3 sm:flex-nowrap">
                      {/* حقل الاسم */}
                      <div className="flex-1">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                          placeholder="Full name"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#3d6c8a] focus:ring-2 focus:ring-[#3d6c8a]/20"
                        />
                      </div>
                      {/* حقل الإيميل */}
                      <div className="flex-[1.5]">
                        <input
                          type="email"
                          value={member.email}
                          onChange={(e) => updateMember(member.id, 'email', e.target.value)}
                          placeholder="Email address"
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all focus:border-[#3d6c8a] focus:ring-2 focus:ring-[#3d6c8a]/20"
                        />
                      </div>
                      {/* أزرار الإجراءات */}
                      <div className="flex shrink-0 gap-2">
                        {!member.isLeader ? (
                          <button
                            onClick={() => setAsLeader(member.id)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 transition-all hover:border-[#3d6c8a] hover:text-[#3d6c8a] hover:shadow-sm"
                          >
                            <Star size={14} /> Set Leader
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 rounded-lg bg-[#3d6c8a]/10 px-3 py-2 text-xs font-bold text-[#3d6c8a]">
                            <Star size={14} fill="#3d6c8a" /> Leader
                          </span>
                        )}
                        <button
                          onClick={() => removeMember(member.id)}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-400 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* زر إضافة عضو جديد */}
                {members.length < maxMembers && (
                  <button
                    onClick={addMember}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white py-4 text-sm font-semibold text-slate-500 transition-all hover:border-[#3d6c8a] hover:text-[#3d6c8a] hover:-translate-y-0.5"
                  >
                    <Plus size={18} /> Add Member
                  </button>
                )}
              </div>

              {/* ملاحظة بعدد الأعضاء */}
              <div className="mt-6 text-center text-xs text-slate-400">
                {members.length} / {maxMembers} members
              </div>

              {/* أزرار التنقل */}
              <div className="mt-8 flex items-center justify-between gap-4">
                {currentStep > 0 ? (
                  <button
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-[#3d6c8a] active:scale-95"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    <ChevronLeft size={18} /> Back
                  </button>
                ) : <div />}
                <button
                  className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#3d6c8a] to-[#2d5169] px-10 py-4 text-sm font-bold text-white shadow-lg shadow-[#3d6c8a]/20 transition-all hover:scale-[1.03] hover:shadow-xl active:scale-95"
                  onClick={() => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1)}
                >
                  <span className="relative z-10">
                    {currentStep === steps.length - 1 ? 'Finish Project' : `Next: ${steps[currentStep + 1]?.title}`}
                  </span>
                  <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>
              </div>
            </div>
          )}

          {/* باقي الخطوات (بدون تغيير) - Step 1, 2, 3 بنفس الكود الأصلي */}
          {/* Step 1: Idea Submission */}
          {currentStep === 1 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm animate-slideIn">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Idea Submission</h2>
                <p className="text-sm text-slate-500">Describe your project goals and objectives</p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Project Title</label>
                  <input type="text" placeholder="e.g. Smart Campus IoT System" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-[#3d6c8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#3d6c8a]/10" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Project Description</label>
                  <textarea placeholder="Describe the problem..." className="min-h-[130px] w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-[#3d6c8a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#3d6c8a]/10"></textarea>
                </div>
                <div className="mt-8 flex items-center justify-between gap-4">
                  {currentStep > 0 ? (
                    <button
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-[#3d6c8a] active:scale-95"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      <ChevronLeft size={18} /> Back
                    </button>
                  ) : <div />}
                  <button
                    className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#3d6c8a] to-[#2d5169] px-10 py-4 text-sm font-bold text-white shadow-lg shadow-[#3d6c8a]/20 transition-all hover:scale-[1.03] hover:shadow-xl active:scale-95"
                    onClick={() => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1)}
                  >
                    <span className="relative z-10">
                      {currentStep === steps.length - 1 ? 'Finish Project' : `Next: ${steps[currentStep + 1]?.title}`}
                    </span>
                    <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Supervisor Request (بدون تغيير) */}
          {currentStep === 2 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm animate-slideIn">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-slate-900">Supervisor Request</h2>
                <p className="text-sm text-slate-500">Choose your preferred supervisor and list your team members' emails.</p>
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Preferred Supervisor 1</label>
                  <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-[#4a90e2] focus:outline-none focus:ring-4 focus:ring-[#4a90e2]/10">
                    <option value="">Select supervisors</option>
                    <option value="dr-sarah">Dr. Ali Mohammed</option>
                    <option value="dr-ahmed">Dr. Ahmed Ali</option>
                    <option value="dr-john">Dr. Maged Askar</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Preferred Supervisor 2</label>
                  <select className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-[#4a90e2] focus:outline-none focus:ring-4 focus:ring-[#4a90e2]/10">
                    <option value="">Select supervisors</option>
                    <option value="dr-sarah">Dr. Ali Mohammed</option>
                    <option value="dr-ahmed">Dr. Ahmed Ali</option>
                    <option value="dr-john">Dr. Maged Askar</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700">Team Members (Institutional Email)</label>
                  <input
                    type="text"
                    placeholder="e.g. student1@uni.edu, student2@uni.edu"
                    className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm transition-all focus:border-[#4a90e2] focus:outline-none focus:ring-4 focus:ring-[#4a90e2]/10"
                  />
                </div>
                <div className="mt-8 flex items-center justify-between gap-4">
                  {currentStep > 0 ? (
                    <button
                      className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-[#3d6c8a] active:scale-95"
                      onClick={() => setCurrentStep(currentStep - 1)}
                    >
                      <ChevronLeft size={18} /> Back
                    </button>
                  ) : <div />}
                  <button
                    className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#3d6c8a] to-[#2d5169] px-10 py-4 text-sm font-bold text-white shadow-lg shadow-[#3d6c8a]/20 transition-all hover:scale-[1.03] hover:shadow-xl active:scale-95"
                    onClick={() => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1)}
                  >
                    <span className="relative z-10">
                      {currentStep === steps.length - 1 ? 'Finish Project' : `Next: ${steps[currentStep + 1]?.title}`}
                    </span>
                    <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Final Approval (بدون تغيير) */}
          {currentStep === 3 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 py-[60px] text-center shadow-sm animate-slideIn">
              <div className="mb-6 flex justify-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ecfdf5] text-[#1078b9]">
                  <CheckCheck size={32} />
                </div>
              </div>
              <div className="mb-10 text-center">
                <h2 className="mb-3 text-2xl font-bold text-slate-900">Finalize Submission</h2>
                <p className="mx-auto max-w-[400px] text-base leading-relaxed text-slate-500">
                  Your proposal will be formally submitted to the
                  academic board and your selected supervisor.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between gap-4">
                {currentStep > 0 ? (
                  <button
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-bold text-slate-500 transition-all hover:bg-slate-50 hover:text-[#3d6c8a] active:scale-95"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    <ChevronLeft size={18} /> Back
                  </button>
                ) : <div />}
                <button
                  className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-[#3d6c8a] to-[#2d5169] px-10 py-4 text-sm font-bold text-white shadow-lg shadow-[#3d6c8a]/20 transition-all hover:scale-[1.03] hover:shadow-xl active:scale-95"
                  onClick={() => currentStep < steps.length - 1 && setCurrentStep(currentStep + 1)}
                >
                  <span className="relative z-10">
                    {currentStep === steps.length - 1 ? 'Finish Project' : `Next: ${steps[currentStep + 1]?.title}`}
                  </span>
                  <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* اللوحة الجانبية (Guidelines, Need Help) - نفس الكود الأصلي */}
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-8 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-slate-900">Project Guidelines</h3>
            <ul className="space-y-4">
              {[
                'Teams must consist of 6 members.',
                'Submit proposal before June 30.',
                'Supervisor can be from your department or another department.',
                'The idea must be different from the ideas of previous years.'
              ].map((text, i) => (
                <li key={i} className="relative pl-7 text-sm leading-relaxed text-slate-500">
                  <div className="absolute left-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#e0e7ff] text-[12px] font-bold text-[#3d6c8a]">✓</div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-to-b from-[#3d6c8a] via-[#3d6c8a] to-[#334155] p-8 text-white shadow-lg">
            <h3 className="mb-2 text-lg font-bold">Need Help?</h3>
            <p className="text-sm leading-relaxed text-white/90">Check our documentation or contact academic office.</p>
            <button className="mt-8 flex w-full items-center justify-center rounded-lg bg-white/10 py-3.5 px-7 font-bold text-white transition-all hover:bg-white/20 hover:-translate-y-0.5">
              View Documentation
            </button>
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