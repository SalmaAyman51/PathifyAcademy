import React, { useState, useEffect } from 'react';
import { 
  User, Mail, Phone, BookOpen, GraduationCap, CheckCircle, 
  Edit3, Save, Zap, ShieldCheck, Users, History 
} from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    level: "",
    semester: ""
  });

  const token = localStorage.getItem('userToken');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API}/api/ProjectManagement/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to fetch profile');

        const data = await res.json();
        setProfile(data);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          studentId: data.studentId || "",
          level: data.level || "",
          semester: data.semester || ""
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email address";
    if (formData.phone.length < 11) newErrors.phone = "Phone number is incomplete";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    try {
      const res = await fetch(`${API}/api/ProjectManagement/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        })
      });

      if (!res.ok) throw new Error('Failed to save changes');

      setIsEditing(false);
      setErrors({});
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4">
        <p className="text-slate-400 text-sm">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    );
  }

  const isSeniorStudent = profile?.isSeniorStudent;
  const teamProject = profile?.team;
  const courses = profile?.courses || [];

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 md:p-12 font-sans antialiased text-slate-800">
      
      <div className={`w-full max-w-6xl bg-white rounded-[32px] shadow-[0_30px_70px_rgba(15,23,42,0.06)] border border-slate-100 overflow-hidden transition-all duration-500 ${isEditing ? 'ring-4 ring-[#3d6c8a]/10' : ''}`}>
        
        {/* Header Section */}
        <div className={`px-8 py-8 md:px-12 md:py-10 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-colors ${isEditing ? 'bg-slate-50/60' : 'bg-white'}`}>
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white bg-[#3d6c8a] shadow-lg shadow-[#3d6c8a]/20">
              <Zap size={26} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {isEditing ? 'Account Settings' : 'Student Profile'}
              </h1>
              <p className="text-[#3d6c8a] text-[11px] font-black uppercase tracking-widest mt-1 opacity-90">Pathify Academic System</p>
            </div>
          </div>
          
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-98 ${
              isEditing 
              ? 'bg-[#3d6c8a] text-white hover:bg-[#2d5269] shadow-[#3d6c8a]/20' 
              : 'bg-slate-50 text-[#3d6c8a] border border-slate-200/80 hover:bg-slate-100/80 hover:text-[#2d5269]'
            }`}
          >
            {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit3 size={18} /> Edit Profile</>}
          </button>
        </div>

        {/* Top Info Banner */}
        <div className="px-8 pt-10 md:px-12 flex flex-col md:flex-row items-center gap-8">
          <div className={`h-28 w-28 rounded-[24px] bg-slate-50 border flex items-center justify-center transition-all ${isEditing ? 'border-[#3d6c8a]' : 'border-slate-100 text-slate-400'}`}>
            <User size={52} strokeWidth={1.5} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">{formData.name}</h2>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-[#3d6c8a] text-xs font-bold border border-blue-100">
                <ShieldCheck size={14} /> BIS Department
              </span>
              <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase">Assiut University</span>
            </div>
          </div>
        </div>

        {/* Dynamic Grid Layout based on student academic level */}
        <div className={`p-8 md:p-12 grid grid-cols-1 gap-12 ${isSeniorStudent ? 'lg:grid-cols-3' : 'lg:grid-cols-1'}`}>
          
          {/* Main Info Fields Form */}
          <div className={`${isSeniorStudent ? 'lg:col-span-2' : 'w-full'} space-y-12`}>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <User size={18} className="text-[#3d6c8a]" /> Personal & Academic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoField 
                  label="Full Name" 
                  value={formData.name} 
                  isEditing={isEditing} 
                  icon={<User size={18} />} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  error={errors.name}
                />
                <InfoField 
                  label="Academic Email" 
                  value={formData.email} 
                  isEditing={isEditing} 
                  icon={<Mail size={18} />} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  error={errors.email}
                />
                <InfoField 
                  label="Phone Number" 
                  value={formData.phone} 
                  isEditing={isEditing} 
                  icon={<Phone size={18} />} 
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  error={errors.phone}
                />
                <InfoField label="Student ID" value={formData.studentId} isEditing={false} icon={<CheckCircle size={18} />} locked />
                <InfoField label="Current Level" value={formData.level} isEditing={false} icon={<GraduationCap size={18} />} locked />
                <InfoField label="Current Semester" value={formData.semester} isEditing={false} icon={<BookOpen size={18} />} locked />
              </div>
            </div>

            {/* Course Registration History Section (no tabs, single combined list) */}
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <History size={18} className="text-[#3d6c8a]" /> Course Registration History
                </h3>
              </div>

              <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Code</th>
                      <th className="py-3 px-4">Course Name</th>
                      <th className="py-3 px-4 text-center">Credit Hours</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                    {courses.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 px-4 text-center text-slate-400 text-xs">
                          No course registrations yet.
                        </td>
                      </tr>
                    ) : (
                      courses.map((course, idx) => (
                        <tr key={idx} className="hover:bg-white/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-500">{course.code}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{course.name}</td>
                          <td className="py-3.5 px-4 text-center text-slate-600">{course.hours} Hrs</td>
                          <td className="py-3.5 px-4 text-right">
                            <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                              course.status === 'Passed' 
                                ? 'bg-blue-50 text-[#3d6c8a] border border-blue-100' 
                                : course.status === 'Failed'
                                ? 'bg-red-50 text-red-600 border border-red-100'
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {course.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Conditional Sidebar: Displays ONLY for Level 4 Students */}
          {isSeniorStudent && teamProject && (
            <div className="lg:col-span-1 space-y-6 lg:border-l lg:border-slate-100 lg:pl-10">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users size={18} className="text-[#3d6c8a]" /> Graduation Project Team
              </h3>
              
              <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/20 rounded-2xl border border-slate-100 space-y-4">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#3d6c8a] bg-[#3d6c8a]/10 px-2.5 py-1 rounded-md uppercase">
                    Project Title
                  </span>
                  <h4 className="text-xl font-extrabold text-slate-900 mt-2">{teamProject.projectName || 'Not assigned yet'}</h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{teamProject.description}</p>
                </div>

                <hr className="border-slate-200/60" />

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
                    Team Roster ({teamProject.members?.length || 0} Members)
                  </span>
                  <div className="space-y-3">
                    {teamProject.members?.map((member, idx) => (
                      <div key={idx} className="flex items-start justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <div>
                          <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            {member.name}
                            {member.isLeader && <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-md font-black uppercase">PM</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

const InfoField = ({ label, value, isEditing, icon, onChange, error, locked }) => (
  <div className="flex flex-col gap-2 relative">
    <label className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${isEditing && !locked ? 'text-[#3d6c8a]' : 'text-slate-400'}`}>
      {label}
    </label>
    
    <div className={`flex items-center transition-all duration-300 rounded-xl p-3.5 border ${
      isEditing && !locked 
      ? (error ? 'border-red-300 bg-red-50/30 ring-4 ring-red-50' : 'border-[#3d6c8a]/40 bg-white ring-4 ring-[#3d6c8a]/5') 
      : 'border-slate-100 bg-slate-50/50' 
    }`}>
      <div className={`mr-3 ${isEditing && !locked ? 'text-[#3d6c8a]' : 'text-slate-300'}`}>
        {icon}
      </div>

      {isEditing && !locked ? (
        <input 
          value={value}
          onChange={onChange}
          className="w-full bg-transparent font-semibold text-sm text-slate-800 outline-none placeholder:text-slate-300"
        />
      ) : (
        <p className={`font-semibold text-sm ${locked ? 'text-slate-400/90' : 'text-slate-800'}`}>{value}</p>
      )}
    </div>
    
    {error && isEditing && (
      <span className="text-[10px] font-semibold text-red-500 mt-1">
        {error}
      </span>
    )}
  </div>
);