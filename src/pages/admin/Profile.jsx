import React, { useEffect, useState } from 'react';
import {
  User, Phone, ShieldCheck, Edit3, Save, Zap, Fingerprint
} from 'lucide-react';
import API from '../../api';

export default function StudentProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  // بيانات الأدمن جايه من جدول Adminstration في الباك اند
  const [formData, setFormData] = useState({
    adminSsn: '',
    fname: '',
    lname: '',
    fullName: '',
    phone: ''
  });

  // جلب بيانات الأدمن الحالي من السيرفر
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await API.get('/Admin/Profile');
        const data = res.data;

        // الباك اند بيرجع PascalCase زي الموديل، فبنطابقها هنا
        setFormData((prev) => ({
          ...prev,
          adminSsn: data.AdminSsn || data.adminSsn || '',
          fname: data.Fname || data.fname || '',
          lname: data.Lname || data.lname || '',
          fullName: data.FullName || data.fullName || '',
          phone:
            (data.AdminPhones && data.AdminPhones[0]?.Phone) ||
            (data.adminPhones && data.adminPhones[0]?.phone) ||
            ''
        }));
      } catch (err) {
        console.error(err);
        setApiError('Could not load admin profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const validate = () => {
    let newErrors = {};
    if (!formData.fname.trim()) newErrors.fname = 'First name is required';
    if (!formData.lname.trim()) newErrors.lname = 'Last name is required';
    if (formData.phone && formData.phone.length < 11) newErrors.phone = 'Phone number is incomplete';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      await API.put('/Admin/Profile', {
        Fname: formData.fname,
        Lname: formData.lname,
        Phone: formData.phone
      });

      setIsEditing(false);
      setErrors({});
    } catch (err) {
      console.error(err);
      setApiError('Could not save admin profile changes.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center font-sans">
        <p className="text-slate-400 font-semibold text-sm">Loading admin profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] flex items-start justify-center p-4 md:p-12 pt-6 md:pt-10 font-sans antialiased text-slate-800">

      <div className={`w-full max-w-6xl bg-white rounded-[32px] shadow-[0_30px_70px_rgba(15,23,42,0.06)] border border-slate-100 overflow-hidden transition-all duration-500 ${isEditing ? 'ring-4 ring-[#3d6c8a]/10' : ''}`}>

        {/* Header Section */}
        <div className={`px-8 py-8 md:px-12 md:py-10 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 transition-colors ${isEditing ? 'bg-slate-50/60' : 'bg-white'}`}>
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-white bg-[#3d6c8a] shadow-lg shadow-[#3d6c8a]/20">
              <Zap size={26} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {isEditing ? 'Account Settings' : 'Admin Profile'}
              </h1>
              <p className="text-[#3d6c8a] text-[11px] font-black uppercase tracking-widest mt-1 opacity-90">Pathify Academic System</p>
            </div>
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold transition-all shadow-md active:scale-98 ${
              isEditing
                ? 'bg-[#3d6c8a] text-white hover:bg-[#2d5269] shadow-[#3d6c8a]/20'
                : 'bg-slate-50 text-[#3d6c8a] border border-slate-200/80 hover:bg-slate-100/80 hover:text-[#2d5269]'
            }`}
          >
            {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit3 size={18} /> Edit Profile</>}
          </button>
        </div>

        {apiError && (
          <div className="mx-8 mt-6 md:mx-12 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
            {apiError}
          </div>
        )}

        {/* Top Info Banner */}
        <div className="px-8 pt-10 md:px-12 flex flex-col md:flex-row items-center gap-8">
          <div className={`h-28 w-28 rounded-[24px] bg-slate-50 border flex items-center justify-center transition-all ${isEditing ? 'border-[#3d6c8a]' : 'border-slate-100 text-slate-400'}`}>
            <User size={52} strokeWidth={1.5} />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              {formData.fullName || `${formData.fname} ${formData.lname}`}
            </h2>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 text-[#3d6c8a] text-xs font-bold border border-blue-100">
                <ShieldCheck size={14} /> Administrator
              </span>
              <span className="text-slate-400 font-semibold text-xs tracking-wider uppercase">Assiut University</span>
            </div>
          </div>
        </div>

        {/* Main Info Fields Form */}
        <div className="p-8 md:p-12 space-y-12">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <User size={18} className="text-[#3d6c8a]" /> Administrator Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoField
                label="First Name"
                value={formData.fname}
                isEditing={isEditing}
                icon={<User size={18} />}
                onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                error={errors.fname}
              />
              <InfoField
                label="Last Name"
                value={formData.lname}
                isEditing={isEditing}
                icon={<User size={18} />}
                onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                error={errors.lname}
              />
              <InfoField
                label="Phone Number"
                value={formData.phone}
                isEditing={isEditing}
                icon={<Phone size={18} />}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                error={errors.phone}
              />
              <InfoField label="Admin SSN" value={formData.adminSsn} isEditing={false} icon={<Fingerprint size={18} />} locked />
            </div>
          </div>

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
        <p className={`font-semibold text-sm ${locked ? 'text-slate-400/90' : 'text-slate-800'}`}>{value || '—'}</p>
      )}
    </div>

    {error && isEditing && (
      <span className="text-[10px] font-semibold text-red-500 mt-1">
        {error}
      </span>
    )}
  </div>
);