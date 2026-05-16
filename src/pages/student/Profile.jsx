import React, { useState } from 'react';
import { User, Mail, Phone, BookOpen, GraduationCap, CheckCircle, Edit3, Save, Zap, ShieldCheck } from 'lucide-react';

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "example@gmail.com",
    phone: "+20 111 222 3333",
    studentId: "20243",
    level: "Level 3",
    semester: "Second Semester"
  });

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

  const handleSave = () => {
    if (validate()) {
      setIsEditing(false);
      setErrors({});
    }
  };

  return (
    // تعديل 1: خلفية الصفحة بلون أزرق رمادي داكن لإبراز الكارد الأبيض
    <div className="min-h-screen w-full bg-[#f0f4f8] flex items-center justify-center p-8 font-sans">
      
      {/* تعديل 2: إضافة ظل (Shadow) أقوى للكارد ليعطيه عمقاً وبعداً عن الخلفية */}
      <div className={`w-full max-w-5xl bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 overflow-hidden transition-all duration-500 ${isEditing ? 'ring-4 ring-[#3d6c8a]/20' : ''}`}>
        
        {/* Header Section */}
        <div className={`px-12 py-10 border-b border-slate-100 flex justify-between items-center transition-colors ${isEditing ? 'bg-slate-50/50' : 'bg-white'}`}>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white bg-[#3d6c8a] shadow-lg">
              <Zap size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {isEditing ? 'Update Identity' : 'My Profile'}
              </h1>
              <p className="text-[#3d6c8a] text-[10px] font-black uppercase tracking-widest opacity-80">Pathify Academic System</p>
            </div>
          </div>
          
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`flex items-center gap-2.5 px-7 py-3.5 rounded-2xl font-black transition-all shadow-md active:scale-95 ${
              isEditing 
              ? 'bg-[#3d6c8a] text-white hover:bg-[#2d5269] shadow-[#3d6c8a]/30' 
              : 'bg-white text-[#3d6c8a] border-2 border-[#3d6c8a]/10 hover:bg-slate-50'
            }`}
          >
            {isEditing ? <><Save size={20} /> Save Changes</> : <><Edit3 size={20} /> Edit Profile</>}
          </button>
        </div>

        {/* Content Section */}
        <div className="p-12 lg:p-16">
          <div className="mb-14 flex items-center gap-8">
            {/* تعديل 3: خلفية أيقونة المستخدم بلون أزرق فاتح جداً لكسر حدة الأبيض */}
            <div className={`h-24 w-24 rounded-3xl bg-blue-50 border-2 flex items-center justify-center transition-all ${isEditing ? 'border-[#3d6c8a] text-[#3d6c8a]' : 'border-white shadow-md text-[#3d6c8a]/40'}`}>
              <User size={48} strokeWidth={1.5} />
            </div>
            <div>
              {/* تعديل 4: إضافة مسافة (Margin-bottom) لمنع التصاق الاسم بالعناصر تحتها */}
              <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tighter">{formData.name}</h2>
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-[#3d6c8a]/10 text-[#3d6c8a] text-[11px] font-black uppercase tracking-wider border border-[#3d6c8a]/20">
                  <ShieldCheck size={14} className="inline mr-1" /> BIS Department
                </span>
                <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Assiut University</span>
              </div>
            </div>
          </div>

          {/* تعديل 5: جعل الحقول بخلفية رمادية فاتحة جداً لتمييزها عن جسم الكارد الأبيض */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
            <InfoField 
              label="Full Name" 
              value={formData.name} 
              isEditing={isEditing} 
              icon={<User size={20} />} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              error={errors.name}
            />

            <InfoField 
              label="Academic Email" 
              value={formData.email} 
              isEditing={isEditing} 
              icon={<Mail size={20} />} 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              error={errors.email}
            />

            <InfoField 
              label="Phone Number" 
              value={formData.phone} 
              isEditing={isEditing} 
              icon={<Phone size={20} />} 
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              error={errors.phone}
            />

            <InfoField label="Student ID" value={formData.studentId} isEditing={false} icon={<CheckCircle size={20} />} locked />
            <InfoField label="Current Level" value={formData.level} isEditing={false} icon={<GraduationCap size={20} />} locked />
            <InfoField label="Semester" value={formData.semester} isEditing={false} icon={<BookOpen size={20} />} locked />
          </div>
        </div>
      </div>
    </div>
  );
}

const InfoField = ({ label, value, isEditing, icon, onChange, error, locked }) => (
  <div className="flex flex-col gap-3 relative">
    <label className={`text-[11px] font-black uppercase tracking-[0.15em] transition-colors ${isEditing && !locked ? 'text-[#3d6c8a]' : 'text-slate-400'}`}>
      {label}
    </label>
    
    <div className={`flex items-center transition-all duration-300 rounded-2xl p-4 border ${
      isEditing && !locked 
      ? (error ? 'border-red-300 bg-red-50/50 ring-4 ring-red-50' : 'border-[#3d6c8a]/30 bg-[#3d6c8a]/5 ring-4 ring-[#3d6c8a]/5') 
      : 'border-slate-100 bg-slate-50/50 shadow-sm' 
    }`}>
      <div className={`mr-4 ${isEditing && !locked ? 'text-[#3d6c8a]' : 'text-slate-300'}`}>
        {icon}
      </div>

      {isEditing && !locked ? (
        <input 
          value={value}
          onChange={onChange}
          className="w-full bg-transparent font-bold text-slate-700 outline-none placeholder:text-slate-300"
        />
      ) : (
        <p className={`font-bold text-lg ${locked ? 'text-slate-400' : 'text-slate-700'}`}>{value}</p>
      )}
    </div>
    
    {error && isEditing && (
      <span className="absolute -bottom-6 left-2 text-[10px] font-bold text-red-500 uppercase tracking-wider">
        {error}
      </span>
    )}
  </div>
);