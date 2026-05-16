import React, { useState } from 'react';
import { Search, Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';

export default function AdminStudents() {
  const [students, setStudents] = useState([
    { id: '20241', ssn: '12345678901234', name: 'Ahmed Amr', email: 'ahmed.amr@gmail.com', gpa: '3.8', level: 'Level 4', gender: 'Male', birthdate: '2002-05-15', enrollmentYear: '2020', teamId: 'T-04', projectId: 'P-101' },
    { id: '20240', ssn: '23456789012345', name: 'Marina Bassem', email: 'marina@gmail.com', gpa: '3.9', level: 'Level 4', gender: 'Female', birthdate: '2002-08-20', enrollmentYear: '2020', teamId: 'T-04', projectId: 'P-101' },
    { id: '20243', ssn: '34567890123456', name: 'Noran Ahmed', email: 'noran@gmail.com', gpa: '3.7', level: 'Level 3', gender: 'Female', birthdate: '2003-01-10', enrollmentYear: '2021', teamId: '', projectId: '' },
    { id: '20244', ssn: '45678901234567', name: 'Omar Khaled', email: 'omar@outlook.com', gpa: '3.5', level: 'Level 2', gender: 'Male', birthdate: '2004-11-30', enrollmentYear: '2022', teamId: '', projectId: '' }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState({ 
    id: '', ssn: '', name: '', email: '', gpa: '', level: '', 
    gender: '', birthdate: '', enrollmentYear: '', teamId: '', projectId: '' 
  });
  
  const [errors, setErrors] = useState({ name: '', email: '' });
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().startsWith(searchTerm.toLowerCase()) || 
    s.ssn.startsWith(searchTerm)
  );

  const openEditModal = (student) => {
    setCurrentStudent({ ...student });
    setErrors({ name: '', email: '' });
    setIsModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setCurrentStudent({ ...currentStudent, [field]: value });
    
    if (field === 'name') {
      if (value.trim().length < 3) {
        setErrors(prev => ({ ...prev, name: 'Full name must be at least 3 characters' }));
      } else {
        setErrors(prev => ({ ...prev, name: '' }));
      }
    }
    
    if (field === 'email') {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Enter a valid email (e.g., name@mail.com)' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    }
  };

  const handleSave = () => {
    if (errors.name || errors.email || !currentStudent.name || !currentStudent.email) return;
    setStudents(prev => prev.map(s => s.id === currentStudent.id ? currentStudent : s));
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
    setIsDeleteModalOpen(false);
    setStudentToDelete(null);
  };

  return (
    <div className="relative rounded-[20px] border border-[#e2e8f0] bg-white p-[20px]">
        <div className="mb-[20px]">
            <h3 className="text-[17px] font-bold text-[#1e293b]">Student Management</h3>
            <p className="text-sm text-[#64748b]">Administrative view for student records.</p>
        </div>

        <div className="mb-[20px]">
          <div className="flex w-[300px] items-center gap-[10px] rounded-[10px] border border-[#e2e8f0] bg-white px-[15px] py-[8px]">
            <Search size={16} className="text-[#94a3b8]" />
            <input 
              type="text" 
              placeholder="Search by name or SSN..." 
              className="w-full bg-transparent text-[13px] outline-none" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[11px] font-bold text-[#94a3b8] uppercase">
              <th className="pb-[12px]">SSN</th>
              <th className="pb-[12px]">FULL NAME</th>
              <th className="pb-[12px]">STUDENT ID</th>
              <th className="pb-[12px]">LEVEL</th>
              <th className="pb-[12px] text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-[#f8fafc] text-[13px] h-[45px] hover:bg-slate-50 transition-colors">
                <td>{student.ssn}</td>
                <td className="font-semibold text-[#1e293b]">{student.name}</td>
                <td>{student.id}</td>
                <td>{student.level}</td>
                <td>
                  <div className="flex gap-[10px] justify-end">
                    <Pencil size={16} className="cursor-pointer text-[#3d6c8a]" onClick={() => openEditModal(student)} />
                    <Trash2 size={16} className="cursor-pointer text-[#ef4444]" onClick={() => {
                       setStudentToDelete(student);
                       setIsDeleteModalOpen(true);
                    }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      {/* Modal Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
          <div className="w-[650px] max-h-[85vh] overflow-y-auto rounded-[20px] bg-white p-[30px] shadow-2xl"> 
            <div className="mb-[25px] flex items-center justify-between">
              <h3 className="m-0 text-xl font-bold">Student Profile</h3>
              <X size={20} className="cursor-pointer" onClick={() => setIsModalOpen(false)} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">SSN (Fixed)</label>
                <input className="rounded-[10px] border border-[#e2e8f0] bg-[#f1f5f9] p-[12px] text-sm" value={currentStudent.ssn} readOnly />
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">Student ID (Fixed)</label>
                <input className="rounded-[10px] border border-[#e2e8f0] bg-[#f1f5f9] p-[12px] text-sm" value={currentStudent.id} readOnly />
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">Full Name</label>
                <input 
                  className={`rounded-[10px] border p-[12px] text-sm bg-slate-50 outline-none focus:border-[#3d6c8a] ${errors.name ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`} 
                  value={currentStudent.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)} 
                />
                {errors.name && <span className="text-[11px] font-medium text-[#ef4444]">{errors.name}</span>}
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">Personal Email</label>
                <input 
                  className={`rounded-[10px] border p-[12px] text-sm bg-slate-50 outline-none focus:border-[#3d6c8a] ${errors.email ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`} 
                  value={currentStudent.email} 
                  onChange={(e) => handleInputChange('email', e.target.value)} 
                />
                {errors.email && <span className="text-[11px] font-medium text-[#ef4444]">{errors.email}</span>}
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">Birth Date</label>
                <input type="date" className="rounded-[10px] border border-[#e2e8f0] bg-slate-50 p-[12px] text-sm outline-none" value={currentStudent.birthdate} onChange={(e) => handleInputChange('birthdate', e.target.value)} />
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">Enrollment Year</label>
                <input list="enrollment-years" className="rounded-[10px] border border-[#e2e8f0] bg-slate-50 p-[12px] text-sm outline-none" value={currentStudent.enrollmentYear} onChange={(e) => handleInputChange('enrollmentYear', e.target.value)} />
                <datalist id="enrollment-years">
                  {[...Array(21)].map((_, i) => (<option key={i} value={(2010 + i).toString()} />))}
                </datalist>
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">Academic Level</label>
                <select className="rounded-[10px] border border-[#e2e8f0] bg-slate-50 p-[12px] text-sm outline-none" value={currentStudent.level} onChange={(e) => handleInputChange('level', e.target.value)}>
                    <option value="Level 1">Level 1</option>
                    <option value="Level 2">Level 2</option>
                    <option value="Level 3">Level 3</option>
                    <option value="Level 4">Level 4</option>
                </select>
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">Gender</label>
                <select className="rounded-[10px] border border-[#e2e8f0] bg-slate-50 p-[12px] text-sm outline-none" value={currentStudent.gender} onChange={(e) => handleInputChange('gender', e.target.value)}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">GPA</label>
                <input className="rounded-[10px] border border-[#e2e8f0] bg-slate-50 p-[12px] text-sm outline-none" value={currentStudent.gpa} onChange={(e) => handleInputChange('gpa', e.target.value)} />
              </div>

              {currentStudent.level === 'Level 4' && (
                <>
                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[13px] font-bold text-[#1e293b]">Team ID</label>
                    <input className="rounded-[10px] border border-[#e2e8f0] bg-slate-50 p-[12px] text-sm outline-none" value={currentStudent.teamId} placeholder="T-04" onChange={(e) => handleInputChange('teamId', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-[5px]">
                    <label className="text-[13px] font-bold text-[#1e293b]">Project ID</label>
                    <input className="rounded-[10px] border border-[#e2e8f0] bg-slate-50 p-[12px] text-sm outline-none" value={currentStudent.projectId} placeholder="P-101" onChange={(e) => handleInputChange('projectId', e.target.value)} />
                  </div>
                </>
              )}
            </div>

            <div className="mt-[25px] flex justify-end gap-[10px]">
              <button onClick={() => setIsModalOpen(false)} className="rounded-[10px] border border-[#e2e8f0] bg-white px-[20px] py-[10px] font-semibold text-[#64748b] hover:bg-slate-50">Discard</button>
              <button 
                onClick={handleSave} 
                className={`rounded-[10px] bg-[#3d6c8a] px-[20px] py-[10px] font-bold text-white shadow-lg transition-transform hover:scale-105 ${ (errors.name || errors.email || !currentStudent.name || !currentStudent.email) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer' }`}
                disabled={!!(errors.name || errors.email || !currentStudent.name || !currentStudent.email)}
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
          <div className="w-[380px] rounded-[20px] bg-white p-[30px] text-center shadow-2xl">
            <div className="mb-[15px] flex justify-center text-[#ef4444]"><AlertCircle size={48} /></div>
            <h3 className="text-xl font-bold">Remove Student?</h3>
            <p className="mb-[20px] text-[14px] text-[#64748b]">Are you sure you want to delete <b>{studentToDelete?.name}</b>?</p>
            <div className="flex justify-center gap-[10px]">
               <button onClick={() => setIsDeleteModalOpen(false)} className="rounded-[10px] border border-[#e2e8f0] bg-white px-[20px] py-[10px] font-semibold text-[#64748b]">Cancel</button>
               <button onClick={confirmDelete} className="rounded-[10px] bg-[#ef4444] px-[20px] py-[10px] font-bold text-white shadow-lg">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
