// import React, { useState, useMemo, useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import { Check, Search, AlertCircle, Cake, Users2, Trash2 } from 'lucide-react';
// import API from '../../api';

// export default function PendingAccounts() {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showRejectModal, setShowRejectModal] = useState(false);
//   const [selectedStudent, setSelectedStudent] = useState(null);
//   const [pendingStudents, setPendingStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchPending = async () => {
//       try {
//         const res = await API.get('/Admin/pending-approvals');
//         setPendingStudents(res.data);
//       } catch (err) {
//         setError("Failed to load pending accounts.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPending();
//   }, []);

//   const handleApprove = async (student) => {
//     try {
//       await API.post(`/Account/approve-user/${student.ssn}`);
//       setPendingStudents(prev => prev.filter(s => s.ssn !== student.ssn));
//       alert("✅ User approved successfully!");
//     } catch (err) {
//       console.error("Approve failed:", err);
//       alert("❌ Failed to approve student.");
//     }
//   };

//   const openRejectModal = (student) => {
//     setSelectedStudent(student);
//     setShowRejectModal(true);
//   };

//   const handleReject = async () => {
//     try {
//       await API.delete(`/Admin/reject-user/${selectedStudent.email}`);
//       setPendingStudents(prev => prev.filter(s => s.email !== selectedStudent.email));
//       setShowRejectModal(false);
//       setSelectedStudent(null);
//       alert("🗑️ User rejected successfully!");
//     } catch (err) {
//       console.error("Reject failed:", err);
//       alert("❌ Failed to reject student.");
//     }
//   };

//   const filteredStudents = useMemo(() => {
//     return pendingStudents.filter(s =>
//       `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       s.ssn?.includes(searchTerm)
//     );
//   }, [pendingStudents, searchTerm]);

//   return (
//     <div className="relative rounded-[20px] border border-[#e2e8f0] bg-white p-[20px]">

//       {/* REJECTION MODAL */}
//       {showRejectModal && (
//         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
//           <div className="w-full max-w-[400px] rounded-[28px] bg-white p-[35px] text-center shadow-2xl">
//             <div className="mb-[15px] flex justify-center text-[#ef4444]">
//               <AlertCircle size={55} />
//             </div>
//             <h3 className="m-0 text-[22px] font-bold text-[#1e293b]">Reject Account?</h3>
//             <p className="my-[15px] text-[14px] text-[#64748b]">
//               Are you sure you want to reject <b>{selectedStudent?.firstName} {selectedStudent?.lastName}</b>? This student's data will be removed.
//             </p>
//             <div className="mt-[25px] flex justify-center gap-3">
//               <button
//                 onClick={() => setShowRejectModal(false)}
//                 className="flex-1 rounded-xl border border-[#e2e8f0] bg-white px-5 py-3 font-bold text-[#64748b] hover:bg-slate-50 transition-all cursor-pointer"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleReject}
//                 className="group relative flex-[1.2] overflow-hidden rounded-xl bg-[#3d6c8a] py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#2d5269] cursor-pointer"
//               >
//                 Reject
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header */}
//       <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h3 className="text-[17px] font-bold text-[#1e293b]">Account Approvals</h3>
//           <p className="text-[12px] text-[#64748b]">Review registrations</p>
//         </div>
//         <div className="flex w-fit gap-1 rounded-xl bg-[#f1f5f9] p-1 text-[12px]">
//           <NavLink to="/admin/pending-accounts" className={({ isActive }) => `px-5 py-1.5 rounded-lg font-bold transition-all ${isActive ? 'bg-white text-[#3d6c8a] shadow-sm' : 'text-[#64748b]'}`}>Accounts</NavLink>
//           <NavLink to="/admin/pending-projects" className={({ isActive }) => `px-5 py-1.5 rounded-lg font-bold transition-all ${isActive ? 'bg-white text-[#3d6c8a] shadow-sm' : 'text-[#64748b]'}`}>Projects</NavLink>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="mb-6 flex w-full max-w-sm items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 focus-within:border-[#3d6c8a] focus-within:ring-1 focus-within:ring-[#3d6c8a]">
//         <Search size={16} className="text-[#94a3b8]" />
//         <input
//           type="text"
//           placeholder="Search by name or SSN..."
//           className="bg-transparent text-xs outline-none w-full"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {loading && <p className="text-center text-sm text-[#64748b] py-10">Loading...</p>}
//       {error && <p className="text-center text-sm text-red-400 py-10">{error}</p>}

//       {/* Cards */}
//       {!loading && !error && (
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
//           {filteredStudents.map((student, index) => (
//             <div key={student.ssn || index} className="group relative flex flex-col overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white p-4 transition-all duration-300 hover:-translate-y-2 hover:border-[#3d6c8a] hover:shadow-[0_10px_25px_-5px_rgba(61,108,138,0.2)]">

//               <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#3d6c8a] transition-all duration-500 group-hover:w-full"></div>

//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3d6c8a] text-[14px] font-bold text-white shadow-md">
//                     {student.firstName?.charAt(0)}
//                   </div>
//                   <div>
//                     <h4 className="text-[14px] font-extrabold text-[#1e293b] leading-tight group-hover:text-[#3d6c8a] transition-colors">
//                       {student.firstName} {student.lastName}
//                     </h4>
//                     <p className="text-[11px] text-[#64748b]">{student.email}</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-[10px] font-bold text-[#3d6c8a] bg-[#3d6c8a0a] px-2.5 py-1 rounded-full uppercase tracking-wider">
//                     Lvl {student.levelId || 'N/A'}
//                   </span>
//                   <p className="text-[11px] font-bold text-[#16a34a] mt-1.5">{student.gpa} GPA</p>
//                 </div>
//               </div>

//               <div className="space-y-3 rounded-xl bg-[#f8fafc] p-3.5 border border-[#f1f5f9] group-hover:bg-white group-hover:border-[#e2e8f0] transition-all duration-300">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Users2 size={12} className="text-[#94a3b8]" />
//                     <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-tighter">Gender</p>
//                   </div>
//                   <p className="text-[11px] font-bold text-[#1e293b]">{student.gender || 'N/A'}</p>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <Cake size={12} className="text-[#94a3b8]" />
//                     <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-tighter">Birthday</p>
//                   </div>
//                   <p className="text-[11px] font-bold text-[#1e293b]">
//                     {student.birthDate ? new Date(student.birthDate).toLocaleDateString() : 'N/A'}
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e2e8f0]">
//                   <div>
//                     <p className="text-[9px] font-bold text-[#94a3b8] uppercase">Phone</p>
//                     <p className="text-[11px] font-bold text-[#1e293b]">{student.phoneNumber || 'N/A'}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="text-[9px] font-bold text-[#94a3b8] uppercase">Enrollment</p>
//                     <p className="text-[11px] font-bold text-[#1e293b]">{student.enrollmentYear || 'N/A'}</p>
//                   </div>
//                 </div>

//                 <div className="mt-1 pt-2 border-t border-[#e2e8f0]">
//                   <p className="text-[9px] font-bold text-[#94a3b8] uppercase">SSN / National ID</p>
//                   <p className="text-[11px] font-bold text-[#3d6c8a] tracking-tight">{student.ssn}</p>
//                 </div>
//               </div>

//               {/* Actions */}
//               <div className="mt-5 flex gap-2">
//                 <button
//                   onClick={() => handleApprove(student)}
//                   className="flex-1 rounded-xl bg-[#3d6c8a] py-2.5 text-[12px] font-bold text-white transition-all hover:bg-[#2d5269] hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
//                 >
//                   <Check size={14} /> Approve
//                 </button>
//                 <button
//                   onClick={() => openRejectModal(student)}
//                   className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-[#3d6c8a] hover:bg-[#ef44440a] transition-all active:scale-95 cursor-pointer shadow-sm"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {!loading && !error && filteredStudents.length === 0 && (
//         <div className="py-20 text-center">
//           <p className="text-[#94a3b8] text-sm italic">No pending accounts found.</p>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useMemo, useEffect } from 'react';
import { Check, Search, AlertCircle, Cake, Users2, Trash2 } from 'lucide-react';
import API from '../../api';

export default function PendingAccounts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await API.get('/Admin/pending-approvals');
        setPendingStudents(res.data);
      } catch (err) {
        setError("No pending accounts.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const handleApprove = async (student) => {
    try {
      await API.post(`/Account/approve-user/${student.ssn}`);
      setPendingStudents(prev => prev.filter(s => s.ssn !== student.ssn));
      // alert("✅ User approved successfully!");
    } catch (err) {
      console.error("Approve failed:", err);
      // alert("❌ Failed to approve student.");
    }
  };

  const openRejectModal = (student) => {
    setSelectedStudent(student);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    try {
      await API.delete(`/Admin/reject-user/${selectedStudent.email}`);
      setPendingStudents(prev => prev.filter(s => s.email !== selectedStudent.email));
      setShowRejectModal(false);
      setSelectedStudent(null);
      // alert("🗑️ User rejected successfully!");
    } catch (err) {
      console.error("Reject failed:", err);
      // alert("❌ Failed to reject student.");
    }
  };

  const filteredStudents = useMemo(() => {
    return pendingStudents.filter(s =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ssn?.includes(searchTerm)
    );
  }, [pendingStudents, searchTerm]);

  return (
    <div className="relative rounded-[20px] border border-[#e2e8f0] bg-white p-[20px]">

      {/* REJECTION MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-[400px] rounded-[28px] bg-white p-[35px] text-center shadow-2xl">
            <div className="mb-[15px] flex justify-center text-[#ef4444]">
              <AlertCircle size={55} />
            </div>
            <h3 className="m-0 text-[22px] font-bold text-[#1e293b]">Reject Account?</h3>
            <p className="my-[15px] text-[14px] text-[#64748b]">
              Are you sure you want to reject <b>{selectedStudent?.firstName} {selectedStudent?.lastName}</b>? This student's data will be removed.
            </p>
            <div className="mt-[25px] flex justify-center gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 rounded-xl border border-[#e2e8f0] bg-white px-5 py-3 font-bold text-[#64748b] hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="group relative flex-[1.2] overflow-hidden rounded-xl bg-[#3d6c8a] py-3 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#2d5269] cursor-pointer"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-[17px] font-bold text-[#1e293b]">Account Approvals</h3>
          <p className="text-[12px] text-[#64748b]">Review registrations</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 flex w-full max-w-sm items-center gap-2 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 focus-within:border-[#3d6c8a] focus-within:ring-1 focus-within:ring-[#3d6c8a]">
        <Search size={16} className="text-[#94a3b8]" />
        <input
          type="text"
          placeholder="Search by name or SSN..."
          className="bg-transparent text-xs outline-none w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p className="text-center text-sm text-[#64748b] py-10">Loading...</p>}
      {error && <p className="text-center text-sm text-[#3d6c8a] py-10">{error}</p>}

      {/* Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredStudents.map((student, index) => (
            <div key={student.ssn || index} className="group relative flex flex-col overflow-hidden rounded-[16px] border border-[#e2e8f0] bg-white p-4 transition-all duration-300 hover:-translate-y-2 hover:border-[#3d6c8a] hover:shadow-[0_10px_25px_-5px_rgba(61,108,138,0.2)]">

              <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#3d6c8a] transition-all duration-500 group-hover:w-full"></div>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3d6c8a] text-[14px] font-bold text-white shadow-md">
                    {student.firstName?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-extrabold text-[#1e293b] leading-tight group-hover:text-[#3d6c8a] transition-colors">
                      {student.firstName} {student.lastName}
                    </h4>
                    <p className="text-[11px] text-[#64748b]">{student.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#3d6c8a] bg-[#3d6c8a0a] px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Lvl {student.levelId || 'N/A'}
                  </span>
                  <p className="text-[11px] font-bold text-[#16a34a] mt-1.5">{student.gpa} GPA</p>
                </div>
              </div>

              <div className="space-y-3 rounded-xl bg-[#f8fafc] p-3.5 border border-[#f1f5f9] group-hover:bg-white group-hover:border-[#e2e8f0] transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users2 size={12} className="text-[#94a3b8]" />
                    <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-tighter">Gender</p>
                  </div>
                  <p className="text-[11px] font-bold text-[#1e293b]">{student.gender || 'N/A'}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cake size={12} className="text-[#94a3b8]" />
                    <p className="text-[9px] font-bold text-[#94a3b8] uppercase tracking-tighter">Birthday</p>
                  </div>
                  <p className="text-[11px] font-bold text-[#1e293b]">
                    {student.birthDate ? new Date(student.birthDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e2e8f0]">
                  <div>
                    <p className="text-[9px] font-bold text-[#94a3b8] uppercase">Phone</p>
                    <p className="text-[11px] font-bold text-[#1e293b]">{student.phoneNumber || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-bold text-[#94a3b8] uppercase">Enrollment</p>
                    <p className="text-[11px] font-bold text-[#1e293b]">{student.enrollmentYear || 'N/A'}</p>
                  </div>
                </div>

                <div className="mt-1 pt-2 border-t border-[#e2e8f0]">
                  <p className="text-[9px] font-bold text-[#94a3b8] uppercase">SSN / National ID</p>
                  <p className="text-[11px] font-bold text-[#3d6c8a] tracking-tight">{student.ssn}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => handleApprove(student)}
                  className="flex-1 rounded-xl bg-[#3d6c8a] py-2.5 text-[12px] font-bold text-white transition-all hover:bg-[#2d5269] hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Check size={14} /> Approve
                </button>
                <button
                  onClick={() => openRejectModal(student)}
                  className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-2.5 text-[#3d6c8a] hover:bg-[#ef44440a] transition-all active:scale-95 cursor-pointer shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && filteredStudents.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-[#94a3b8] text-sm italic">No pending accounts found.</p>
        </div>
      )}
    </div>
  );
}