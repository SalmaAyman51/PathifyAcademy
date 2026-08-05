// // import React, { useState } from 'react';
// // import { Search, Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';

// // export default function AdminProfessors() {
// //   const [professors, setProfessors] = useState([
// //     { id: 1, ssn: '123456789', name: 'DR. Ahmed Ali', department: "IT", phone: '01012345678', type: 'Internal' },
// //     { id: 2, ssn: '987654321', name: 'DR. Noha Hassan', department: "CS", phone: '01112345678', type: 'External' },
// //     { id: 3, ssn: '456789123', name: 'DR. Norhan Khaled', department: "IT", phone: '01212345678', type: 'Internal' },
// //     { id: 4, ssn: '321654987', name: 'DR. Asmaa Khaled', department: "CS", phone: '01512345678', type: 'Internal' },
// //     { id: 5, ssn: '159263487', name: 'DR. Mahmoud Reda', department: "IS", phone: '01098765432', type: 'External' },
// //     { id: 6, ssn: '753159842', name: 'DR. Sara Ahmed', department: "AI", phone: '01145678901', type: 'Internal' },
// //     { id: 7, ssn: '852963741', name: 'DR. Hany Youssef', department: "CS", phone: '01233445566', type: 'External' },
// //     { id: 8, ssn: '963852741', name: 'DR. Mona El-Sayed', department: "IT", phone: '01555667788', type: 'Internal' },
// //     { id: 9, ssn: '147258369', name: 'DR. Ibrahim Hassan', department: "IS", phone: '01022334455', type: 'External' }
// //   ]);

// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
// //   const [currentProfessor, setCurrentProfessor] = useState({ 
// //     ssn: '', name: '', department: '', phone: '', type: '' 
// //   });
// //   const [profToDelete, setProfToDelete] = useState(null);
// //   const [isEditing, setIsEditing] = useState(false);
  
// //   const [errors, setErrors] = useState({});
// //   const [searchTerm, setSearchTerm] = useState('');

// //   const filteredProfessors = professors.filter(p => 
// //     p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
// //     p.ssn.includes(searchTerm)
// //   );

// //   const validate = () => {
// //     let tempErrors = {};
// //     const data = currentProfessor;
// //     if (!data.ssn.trim()) tempErrors.ssn = "SSN is required";
// //     if (!data.name.trim()) tempErrors.name = "Name is required";
// //     setErrors(tempErrors);
// //     return Object.keys(tempErrors).length === 0;
// //   };

// //   const openAddModal = (type) => {
// //     setCurrentProfessor({ ssn: '', name: '', department: '', phone: '', type: type });
// //     setIsEditing(false);
// //     setErrors({});
// //     setIsModalOpen(true);
// //   };

// //   const openEditModal = (prof) => {
// //     setCurrentProfessor(prof);
// //     setIsEditing(true);
// //     setErrors({});
// //     setIsModalOpen(true);
// //   };

// //   const handleSave = () => {
// //     if (!validate()) return;
// //     const data = currentProfessor;
// //     if (isEditing) {
// //       setProfessors(professors.map(p => p.id === data.id ? data : p));
// //     } else {
// //       setProfessors([...professors, { ...data, id: Date.now() }]);
// //     }
// //     setIsModalOpen(false);
// //   };

// //   return (
// //     <div className="relative rounded-[20px] border border-[#e2e8f0] bg-white p-[20px]">
// //         <div className="mb-[20px] flex items-center justify-between">
// //           <div>
// //             <h3 className="text-[17px] font-bold text-[#1e293b]">Professor Management</h3>
// //             <p className="text-sm text-[#64748b]">Manage internal and external academic staff.</p>
// //           </div>
// //           <div className="flex gap-[10px]">
// //             <button onClick={() => openAddModal('Internal')} className="flex items-center gap-2 rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer " >
// //               <Plus size={16} /> Add Internal Professor
// //             </button>
// //             <button onClick={() => openAddModal('External')} className="flex items-center gap-2 rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer">
// //               <Plus size={16} /> Add External Professor
// //             </button>
// //           </div>
// //         </div>

// //         <div className="mb-[20px]">
// //           <div className="flex w-[300px] items-center gap-[10px] rounded-[10px] border border-[#e2e8f0] bg-white px-[15px] py-[8px]">
// //             <Search size={16} className="text-[#94a3b8]" />
// //             <input 
// //               type="text" 
// //               placeholder="Search by SSN or name..." 
// //               className="w-full bg-transparent text-[13px] outline-none" 
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //           </div>
// //         </div>

// //         <table className="w-full border-collapse">
// //           <thead>
// //             <tr className="text-left text-[11px] font-bold text-[#94a3b8] uppercase">
// //               <th className="pb-[12px]">SSN</th>
// //               <th className="pb-[12px]">Full Name</th>
// //               <th className="pb-[12px]">Department</th>
// //               <th className="pb-[12px]">Phone</th>
// //               <th className="pb-[12px]">Type</th>
// //               <th className="pb-[12px] text-right">ACTIONS</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {filteredProfessors.map((prof) => (
// //               <tr key={prof.id} className="border-b border-[#f8fafc] text-[13px] h-[45px] hover:bg-slate-50 transition-colors">
// //                 <td className="text-[#64748b]">{prof.ssn}</td>
// //                 <td className="font-semibold text-[#1e293b]">{prof.name}</td>
// //                 <td>{prof.department}</td>
// //                 <td>{prof.phone || '-'}</td>
// //                 <td>
// //                   <span className={`rounded-[6px] px-2 py-1 text-[12px] font-medium ${prof.type === 'Internal' ? 'bg-[#e0f2fe] text-[#0369a1]' : 'bg-[#f1f5f9] text-[#475569]'}`}>
// //                     {prof.type}
// //                   </span>
// //                 </td>
// //                 <td>
// //                   <div className="flex gap-[10px] justify-end">
// //                     <Pencil size={16} className="cursor-pointer text-[#3d6c8a]" onClick={() => openEditModal(prof)} />
// //                     <Trash2 size={16} className="cursor-pointer text-[#ef4444]" onClick={() => {
// //                        setProfToDelete(prof);
// //                        setIsDeleteModalOpen(true);
// //                     }} />
// //                   </div>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>

// //       {/* Modal */}
// //       {isModalOpen && (
// //         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
// //           <div className="w-[400px] rounded-[20px] bg-white p-[30px] shadow-2xl">
// //             <div className="mb-[25px] flex items-center justify-between">
// //               <h3 className="m-0 text-xl font-bold">
// //                 {isEditing ? `Edit ${currentProfessor.type} Prof` : `New ${currentProfessor.type} Prof`}
// //               </h3>
// //               <X size={20} className="cursor-pointer" onClick={() => setIsModalOpen(false)} />
// //             </div>
            
// //             <div className="flex flex-col gap-[15px]">
// //               <div className="flex flex-col gap-[5px]">
// //                 <label className="text-[13px] font-bold text-[#1e293b]">SSN</label>
// //                 <input 
// //                   className={`rounded-[10px] border p-[12px] text-sm outline-none bg-slate-50 focus:border-[#3d6c8a] ${errors.ssn ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`} 
// //                   value={currentProfessor.ssn} 
// //                   onChange={(e) => setCurrentProfessor({...currentProfessor, ssn: e.target.value})}
// //                   placeholder="National ID"
// //                 />
// //                 {errors.ssn && <span className="text-[11px] font-medium text-[#ef4444]">{errors.ssn}</span>}
// //               </div>

// //               <div className="flex flex-col gap-[5px]">
// //                 <label className="text-[13px] font-bold text-[#1e293b]">Professor Name</label>
// //                 <input 
// //                   className={`rounded-[10px] border p-[12px] text-sm outline-none bg-slate-50 focus:border-[#3d6c8a] ${errors.name ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`} 
// //                   value={currentProfessor.name} 
// //                   onChange={(e) => setCurrentProfessor({...currentProfessor, name: e.target.value})}
// //                   placeholder="Enter name"
// //                 />
// //                 {errors.name && <span className="text-[11px] font-medium text-[#ef4444]">{errors.name}</span>}
// //               </div>

// //               <div className="flex flex-col gap-[5px]">
// //                 <label className="text-[13px] font-bold text-[#1e293b]">Department</label>
// //                 <input 
// //                   className="rounded-[10px] border border-[#e2e8f0] bg-slate-50 p-[12px] text-sm outline-none focus:border-[#3d6c8a]" 
// //                   value={currentProfessor.department} 
// //                   onChange={(e) => setCurrentProfessor({...currentProfessor, department: e.target.value})}
// //                   placeholder="e.g. IT, CS"
// //                 />
// //               </div>

// //               <div className="flex flex-col gap-[5px]">
// //                 <label className="text-[13px] font-bold text-[#1e293b]">Phone</label>
// //                 <input 
// //                   className="rounded-[10px] border border-[#e2e8f0] bg-slate-50 p-[12px] text-sm outline-none focus:border-[#3d6c8a]" 
// //                   value={currentProfessor.phone} 
// //                   onChange={(e) => setCurrentProfessor({...currentProfessor, phone: e.target.value})}
// //                   placeholder="Phone number"
// //                 />
// //               </div>
// //             </div>

// //             <div className="mt-[25px] flex justify-end gap-[10px]">
// //               <button onClick={() => setIsModalOpen(false)} className="rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-2.5 font-semibold text-[#64748b]">Cancel</button>
// //               <button onClick={handleSave} className="rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 font-bold text-white shadow-lg">Save Changes</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Delete Modal */}
// //       {isDeleteModalOpen && (
// //         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
// //           <div className="w-[350px] rounded-[20px] bg-white p-[30px] text-center shadow-2xl">
// //             <div className="mb-[15px] flex justify-center text-[#ef4444]"><AlertCircle size={48} /></div>
// //             <h3 className="text-xl font-bold">Remove Professor?</h3>
// //             <p className="my-[15px] text-[14px] text-[#64748b]">Delete <b>{profToDelete?.name}</b>?</p>
// //             <div className="flex justify-center gap-[10px]">
// //                <button onClick={() => setIsDeleteModalOpen(false)} className="rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-2.5 font-semibold text-[#64748b]">Cancel</button>
// //                <button onClick={() => {
// //                  setProfessors(professors.filter(p => p.id !== profToDelete.id));
// //                  setIsDeleteModalOpen(false);
// //                }} className="rounded-[10px] bg-[#ef4444] px-5 py-2.5 font-bold text-white shadow-lg">Delete</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// import React, { useState, useEffect } from 'react';
// import { Search, Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';

// const BASE_URL = 'https://localhost:7061/api/Admin';

// export default function AdminProfessors() {
//   const [professors, setProfessors] = useState([]);

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   const [currentProfessor, setCurrentProfessor] = useState({
//     ssn: '', name: '', department: '', phone: '', type: '', password: ''
//   });
//   const [profToDelete, setProfToDelete] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   const [errors, setErrors] = useState({});
//   const [searchTerm, setSearchTerm] = useState('');

//   // ── API helpers ──────────────────────────────────────────
//   const getToken = () => localStorage.getItem('userToken') ?? '';
//   const authHeaders = () => ({
//     'Content-Type': 'application/json',
//     Authorization: `Bearer ${getToken()}`,
//   });

//   // ── Fetch on mount ───────────────────────────────────────
//   useEffect(() => {
//     const fetchProfessors = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/admin-get-all`, { headers: authHeaders() });
//         if (!res.ok) throw new Error();
//         const data = await res.json();
//         // backend returns: { id, name, dept, phone, type }
//         // type = "Internal" | "External"  (after backend fix)
//         setProfessors(data.map((p) => ({
//           id:         p.id,
//           ssn:        p.id,
//           name:       p.name,
//           department: p.dept,
//           phone:      p.phone,
//           type:       p.type,
//         })));
//       } catch {
//         alert('Failed to load professors.');
//       }
//     };
//     fetchProfessors();
//   }, []);

//   // ── Filter ───────────────────────────────────────────────
//   const filteredProfessors = professors.filter(p =>
//     p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     p.ssn.includes(searchTerm)
//   );

//   // ── Validate ─────────────────────────────────────────────
//   const validate = () => {
//     let tempErrors = {};
//     const data = currentProfessor;
//     if (!data.ssn.trim())        tempErrors.ssn        = 'SSN is required';
//     if (!data.name.trim())       tempErrors.name       = 'Name is required';
//     if (!data.department.trim()) tempErrors.department = 'Department is required';
//     if (!data.phone.trim())      tempErrors.phone      = 'Phone is required';
//     if (!isEditing && !data.password.trim()) tempErrors.password = 'Password is required';
//     setErrors(tempErrors);
//     return Object.keys(tempErrors).length === 0;
//   };

//   // ── Open modals ──────────────────────────────────────────
//   const openAddModal = (type) => {
//     setCurrentProfessor({ ssn: '', name: '', department: '', phone: '', type, password: '' });
//     setIsEditing(false);
//     setErrors({});
//     setIsModalOpen(true);
//   };

//   const openEditModal = (prof) => {
//     setCurrentProfessor({ ...prof, password: '' });
//     setIsEditing(true);
//     setErrors({});
//     setIsModalOpen(true);
//   };

//   // ── Save ─────────────────────────────────────────────────
//   const handleSave = async () => {
//     if (!validate()) return;
//     const data = currentProfessor;

//     try {
//       if (isEditing) {
//         // PUT — pick endpoint based on type (comes from backend)
//         const isInternal = data.type === 'Internal';
//         const url = isInternal
//           ? `${BASE_URL}/admin-update-internal/${data.ssn}`
//           : `${BASE_URL}/admin-update-external/${data.ssn}`;

//         const body = isInternal
//           ? { InternalProfessorName: data.name, DeptName: data.department, InternalProfessorPhones: [{ PhoneNumber: data.phone }] }
//           : { ExternalProfessorName: data.name, DeptName: data.department, ExternalProfessorPhones: [{ PhoneNumber: data.phone }] };

//         const res = await fetch(url, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) });
//         if (!res.ok) { const msg = await res.text(); throw new Error(msg); }

//         setProfessors(professors.map(p => p.ssn === data.ssn ? { ...data } : p));

//       } else {
//         // POST — endpoint based on type from the button clicked
//         const isInternal = data.type === 'Internal';
//         const url = isInternal
//           ? `${BASE_URL}/add-internal-professor`
//           : `${BASE_URL}/add-external-professor`;

//         const body = {
//           SSN:         data.ssn,
//           FullName:    data.name,
//           DeptName:    data.department,
//           PhoneNumber: data.phone,
//           Password:    data.password,
//         };

//         const res = await fetch(url, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
//         if (!res.ok) { const msg = await res.text(); throw new Error(msg); }

//         setProfessors([...professors, { ...data, id: data.ssn }]);
//       }

//       setIsModalOpen(false);
//     } catch (err) {
//       alert(err.message || 'Something went wrong.');
//     }
//   };

//   // ── Delete (local only — no delete endpoint provided) ────
//   const handleDelete = () => {
//     setProfessors(professors.filter(p => p.id !== profToDelete.id));
//     setIsDeleteModalOpen(false);
//   };

//   // ── Render ───────────────────────────────────────────────
//   return (
//     <div className="relative rounded-[20px] border border-[#e2e8f0] bg-white p-[20px]">
//       <div className="mb-[20px] flex items-center justify-between">
//         <div>
//           <h3 className="text-[17px] font-bold text-[#1e293b]">Professor Management</h3>
//           <p className="text-sm text-[#64748b]">Manage internal and external academic staff.</p>
//         </div>
//         <div className="flex gap-[10px]">
//           <button onClick={() => openAddModal('Internal')} className="flex items-center gap-2 rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer">
//             <Plus size={16} /> Add Internal Professor
//           </button>
//           <button onClick={() => openAddModal('External')} className="flex items-center gap-2 rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer">
//             <Plus size={16} /> Add External Professor
//           </button>
//         </div>
//       </div>

//       <div className="mb-[20px]">
//         <div className="flex w-[300px] items-center gap-[10px] rounded-[10px] border border-[#e2e8f0] bg-white px-[15px] py-[8px]">
//           <Search size={16} className="text-[#94a3b8]" />
//           <input
//             type="text"
//             placeholder="Search by SSN or name..."
//             className="w-full bg-transparent text-[13px] outline-none"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <table className="w-full border-collapse">
//         <thead>
//           <tr className="text-left text-[11px] font-bold text-[#94a3b8] uppercase">
//             <th className="pb-[12px]">SSN</th>
//             <th className="pb-[12px]">Full Name</th>
//             <th className="pb-[12px]">Department</th>
//             <th className="pb-[12px]">Phone</th>
//             <th className="pb-[12px]">Type</th>
//             <th className="pb-[12px] text-right">ACTIONS</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredProfessors.map((prof) => (
//             <tr key={prof.ssn} className="border-b border-[#f8fafc] text-[13px] h-[45px] hover:bg-slate-50 transition-colors">
//               <td className="text-[#64748b]">{prof.ssn}</td>
//               <td className="font-semibold text-[#1e293b]">{prof.name}</td>
//               <td>{prof.department}</td>
//               <td>{prof.phone || '-'}</td>
//               <td>
//                 <span className={`rounded-[6px] px-2 py-1 text-[12px] font-medium ${prof.type === 'Internal' ? 'bg-[#e0f2fe] text-[#0369a1]' : 'bg-[#f1f5f9] text-[#475569]'}`}>
//                   {prof.type}
//                 </span>
//               </td>
//               <td>
//                 <div className="flex gap-[10px] justify-end">
//                   <Pencil size={16} className="cursor-pointer text-[#3d6c8a]" onClick={() => openEditModal(prof)} />
//                   <Trash2 size={16} className="cursor-pointer text-[#ef4444]" onClick={() => {
//                     setProfToDelete(prof);
//                     setIsDeleteModalOpen(true);
//                   }} />
//                 </div>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
//           <div className="w-[400px] rounded-[20px] bg-white p-[30px] shadow-2xl">
//             <div className="mb-[25px] flex items-center justify-between">
//               <h3 className="m-0 text-xl font-bold">
//                 {isEditing ? `Edit ${currentProfessor.type} Prof` : `New ${currentProfessor.type} Prof`}
//               </h3>
//               <X size={20} className="cursor-pointer" onClick={() => setIsModalOpen(false)} />
//             </div>

//             <div className="flex flex-col gap-[15px]">
//               <div className="flex flex-col gap-[5px]">
//                 <label className="text-[13px] font-bold text-[#1e293b]">SSN</label>
//                 <input
//                   className={`rounded-[10px] border p-[12px] text-sm outline-none bg-slate-50 focus:border-[#3d6c8a] ${errors.ssn ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
//                   value={currentProfessor.ssn}
//                   disabled={isEditing}
//                   onChange={(e) => setCurrentProfessor({...currentProfessor, ssn: e.target.value})}
//                   placeholder="National ID"
//                 />
//                 {errors.ssn && <span className="text-[11px] font-medium text-[#ef4444]">{errors.ssn}</span>}
//               </div>

//               <div className="flex flex-col gap-[5px]">
//                 <label className="text-[13px] font-bold text-[#1e293b]">Professor Name</label>
//                 <input
//                   className={`rounded-[10px] border p-[12px] text-sm outline-none bg-slate-50 focus:border-[#3d6c8a] ${errors.name ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
//                   value={currentProfessor.name}
//                   onChange={(e) => setCurrentProfessor({...currentProfessor, name: e.target.value})}
//                   placeholder="Enter name"
//                 />
//                 {errors.name && <span className="text-[11px] font-medium text-[#ef4444]">{errors.name}</span>}
//               </div>

//               <div className="flex flex-col gap-[5px]">
//                 <label className="text-[13px] font-bold text-[#1e293b]">Department</label>
//                 <input
//                   className={`rounded-[10px] border p-[12px] text-sm outline-none bg-slate-50 focus:border-[#3d6c8a] ${errors.department ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
//                   value={currentProfessor.department}
//                   onChange={(e) => setCurrentProfessor({...currentProfessor, department: e.target.value})}
//                   placeholder="e.g. IT, CS"
//                 />
//                 {errors.department && <span className="text-[11px] font-medium text-[#ef4444]">{errors.department}</span>}
//               </div>

//               <div className="flex flex-col gap-[5px]">
//                 <label className="text-[13px] font-bold text-[#1e293b]">Phone</label>
//                 <input
//                   className={`rounded-[10px] border p-[12px] text-sm outline-none bg-slate-50 focus:border-[#3d6c8a] ${errors.phone ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
//                   value={currentProfessor.phone}
//                   onChange={(e) => setCurrentProfessor({...currentProfessor, phone: e.target.value})}
//                   placeholder="Phone number"
//                 />
//                 {errors.phone && <span className="text-[11px] font-medium text-[#ef4444]">{errors.phone}</span>}
//               </div>

//               {/* Password — Add only (backend requires it) */}
//               {!isEditing && (
//                 <div className="flex flex-col gap-[5px]">
//                   <label className="text-[13px] font-bold text-[#1e293b]">Password</label>
//                   <input
//                     type="password"
//                     className={`rounded-[10px] border p-[12px] text-sm outline-none bg-slate-50 focus:border-[#3d6c8a] ${errors.password ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
//                     value={currentProfessor.password}
//                     onChange={(e) => setCurrentProfessor({...currentProfessor, password: e.target.value})}
//                     placeholder="Set account password"
//                   />
//                   {errors.password && <span className="text-[11px] font-medium text-[#ef4444]">{errors.password}</span>}
//                 </div>
//               )}
//             </div>

//             <div className="mt-[25px] flex justify-end gap-[10px]">
//               <button onClick={() => setIsModalOpen(false)} className="rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-2.5 font-semibold text-[#64748b]">Cancel</button>
//               <button onClick={handleSave} className="rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 font-bold text-white shadow-lg">Save Changes</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Delete Modal */}
//       {isDeleteModalOpen && (
//         <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
//           <div className="w-[350px] rounded-[20px] bg-white p-[30px] text-center shadow-2xl">
//             <div className="mb-[15px] flex justify-center text-[#ef4444]"><AlertCircle size={48} /></div>
//             <h3 className="text-xl font-bold">Remove Professor?</h3>
//             <p className="my-[15px] text-[14px] text-[#64748b]">Delete <b>{profToDelete?.name}</b>?</p>
//             <div className="flex justify-center gap-[10px]">
//               <button onClick={() => setIsDeleteModalOpen(false)} className="rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-2.5 font-semibold text-[#64748b]">Cancel</button>
//               <button onClick={handleDelete} className="rounded-[10px] bg-[#ef4444] px-5 py-2.5 font-bold text-white shadow-lg">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';

const BASE_URL = 'https://localhost:7061/api/Admin';

export default function AdminProfessors() {
  const [professors, setProfessors] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentProfessor, setCurrentProfessor] = useState({
    ssn: '', name: '', department: '', phone: '', type: '', email: ''
  });
  const [profToDelete, setProfToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // ── API helpers ──────────────────────────────────────────
  const getToken = () => localStorage.getItem('userToken') ?? '';
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${getToken()}`,
  });

  // ── Fetch on mount ───────────────────────────────────────
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const res = await fetch(`${BASE_URL}/admin-get-all`, { headers: authHeaders() });
        if (!res.ok) throw new Error();
        const data = await res.json();
        // backend returns: { id, name, dept, phone, type }
        // type = "Internal" | "External"  (after backend fix)
        setProfessors(data.map((p) => ({
          id:         p.id,
          ssn:        p.id,
          name:       p.name,
          department: p.dept,
          phone:      p.phone,
          type:       p.type,
        })));
      } catch {
        alert('Failed to load professors.');
      }
    };
    fetchProfessors();
  }, []);

  // ── Filter ───────────────────────────────────────────────
  const filteredProfessors = professors.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ssn.includes(searchTerm)
  );

  // ── Validate ─────────────────────────────────────────────
  const validate = () => {
    let tempErrors = {};
    const data = currentProfessor;
    if (!data.ssn.trim())        tempErrors.ssn        = 'SSN is required';
    if (!data.name.trim())       tempErrors.name       = 'Name is required';
    if (!data.department.trim()) tempErrors.department = 'Department is required';
    if (!data.phone.trim())      tempErrors.phone      = 'Phone is required';
    if (!data.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      tempErrors.email = 'Enter a valid email';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // ── Open modals ──────────────────────────────────────────
  const openAddModal = (type) => {
    setCurrentProfessor({ ssn: '', name: '', department: '', phone: '', type, email: '' });
    setIsEditing(false);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (prof) => {
    setCurrentProfessor({ ...prof, email: prof.email || '' });
    setIsEditing(true);
    setErrors({});
    setIsModalOpen(true);
  };

  // ── Save ─────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    const data = currentProfessor;

    try {
      if (isEditing) {
        // PUT — pick endpoint based on type (comes from backend)
        const isInternal = data.type === 'Internal';
        const url = isInternal
          ? `${BASE_URL}/admin-update-internal/${data.ssn}`
          : `${BASE_URL}/admin-update-external/${data.ssn}`;

        const body = isInternal
          ? { InternalProfessorName: data.name, DeptName: data.department, InternalProfessorPhones: [{ PhoneNumber: data.phone }] }
          : { ExternalProfessorName: data.name, DeptName: data.department, ExternalProfessorPhones: [{ PhoneNumber: data.phone }] };

        const res = await fetch(url, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) });
        if (!res.ok) { const msg = await res.text(); throw new Error(msg); }

        setProfessors(professors.map(p => p.ssn === data.ssn ? { ...data } : p));

      } else {
        // POST — endpoint based on type from the button clicked
        const isInternal = data.type === 'Internal';
        const url = isInternal
          ? `${BASE_URL}/add-internal-professor`
          : `${BASE_URL}/add-external-professor`;

        const body = {
          SSN:         data.ssn,
          FullName:    data.name,
          DeptName:    data.department,
          PhoneNumber: data.phone,
          Email:       data.email,
        };

        const res = await fetch(url, { method: 'POST', headers: authHeaders(), body: JSON.stringify(body) });
        if (!res.ok) { const msg = await res.text(); throw new Error(msg); }

        setProfessors([...professors, { ...data, id: data.ssn }]);
      }

      setIsModalOpen(false);
    } catch (err) {
      alert(err.message || 'Something went wrong.');
    }
  };

  // ── Delete (local only — no delete endpoint provided) ────
  const handleDelete = () => {
    setProfessors(professors.filter(p => p.id !== profToDelete.id));
    setIsDeleteModalOpen(false);
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="relative rounded-[20px] border border-[#e2e8f0] bg-white p-[20px]">
      <div className="mb-[20px] flex items-center justify-between">
        <div>
          <h3 className="text-[17px] font-bold text-[#1e293b]">Professor Management</h3>
          <p className="text-sm text-[#64748b]">Manage internal and external academic staff.</p>
        </div>
        <div className="flex gap-[10px]">
          <button onClick={() => openAddModal('Internal')} className="flex items-center gap-2 rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer">
            <Plus size={16} /> Add Internal Professor
          </button>
          <button onClick={() => openAddModal('External')} className="flex items-center gap-2 rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer">
            <Plus size={16} /> Add External Professor
          </button>
        </div>
      </div>

      <div className="mb-[20px]">
        <div className="flex w-[300px] items-center gap-[10px] rounded-[10px] border border-[#e2e8f0] bg-white px-[15px] py-[8px]">
          <Search size={16} className="text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search by SSN or name..."
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
            <th className="pb-[12px]">Full Name</th>
            <th className="pb-[12px]">Department</th>
            <th className="pb-[12px]">Phone</th>
            <th className="pb-[12px]">Type</th>
            <th className="pb-[12px] text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfessors.map((prof) => (
            <tr key={prof.ssn} className="border-b border-[#f8fafc] text-[13px] h-[45px] hover:bg-slate-50 transition-colors">
              <td className="text-[#64748b]">{prof.ssn}</td>
              <td className="font-semibold text-[#1e293b]">{prof.name}</td>
              <td>{prof.department}</td>
              <td>{prof.phone || '-'}</td>
              <td>
                <span className={`rounded-[6px] px-2 py-1 text-[12px] font-medium ${prof.type === 'Internal' ? 'bg-[#e0f2fe] text-[#0369a1]' : 'bg-[#f1f5f9] text-[#475569]'}`}>
                  {prof.type}
                </span>
              </td>
              <td>
                <div className="flex gap-[10px] justify-end">
                  <Pencil size={16} className="cursor-pointer text-[#3d6c8a]" onClick={() => openEditModal(prof)} />
                  <Trash2 size={16} className="cursor-pointer text-[#ef4444]" onClick={() => {
                    setProfToDelete(prof);
                    setIsDeleteModalOpen(true);
                  }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
          <div className="w-[400px] rounded-[20px] bg-white p-[30px] shadow-2xl">
            <div className="mb-[25px] flex items-center justify-between">
              <h3 className="m-0 text-xl font-bold">
                {isEditing ? `Edit ${currentProfessor.type} Prof` : `New ${currentProfessor.type} Prof`}
              </h3>
              <X size={20} className="cursor-pointer" onClick={() => setIsModalOpen(false)} />
            </div>

            <div className="flex flex-col gap-[15px]">
              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">SSN</label>
                <input
                  className={`rounded-[10px] border p-[12px] text-sm outline-none bg-slate-50 focus:border-[#3d6c8a] ${errors.ssn ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
                  value={currentProfessor.ssn}
                  disabled={isEditing}
                  onChange={(e) => setCurrentProfessor({...currentProfessor, ssn: e.target.value})}
                  placeholder="National ID"
                />
                {errors.ssn && <span className="text-[11px] font-medium text-[#ef4444]">{errors.ssn}</span>}
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">Professor Name</label>
                <input
                  className={`rounded-[10px] border p-[12px] text-sm outline-none bg-slate-50 focus:border-[#3d6c8a] ${errors.name ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
                  value={currentProfessor.name}
                  onChange={(e) => setCurrentProfessor({...currentProfessor, name: e.target.value})}
                  placeholder="Enter name"
                />
                {errors.name && <span className="text-[11px] font-medium text-[#ef4444]">{errors.name}</span>}
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">Department</label>
                <input
                  className={`rounded-[10px] border p-[12px] text-sm outline-none bg-slate-50 focus:border-[#3d6c8a] ${errors.department ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
                  value={currentProfessor.department}
                  onChange={(e) => setCurrentProfessor({...currentProfessor, department: e.target.value})}
                  placeholder="e.g. IT, CS"
                />
                {errors.department && <span className="text-[11px] font-medium text-[#ef4444]">{errors.department}</span>}
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">Phone</label>
                <input
                  className={`rounded-[10px] border p-[12px] text-sm outline-none bg-slate-50 focus:border-[#3d6c8a] ${errors.phone ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
                  value={currentProfessor.phone}
                  onChange={(e) => setCurrentProfessor({...currentProfessor, phone: e.target.value})}
                  placeholder="Phone number"
                />
                {errors.phone && <span className="text-[11px] font-medium text-[#ef4444]">{errors.phone}</span>}
              </div>

              <div className="flex flex-col gap-[5px]">
                <label className="text-[13px] font-bold text-[#1e293b]">Email</label>
                <input
                  type="email"
                  className={`rounded-[10px] border p-[12px] text-sm outline-none bg-slate-50 focus:border-[#3d6c8a] ${errors.email ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
                  value={currentProfessor.email}
                  onChange={(e) => setCurrentProfessor({...currentProfessor, email: e.target.value})}
                  placeholder="Enter email address"
                />
                {errors.email && <span className="text-[11px] font-medium text-[#ef4444]">{errors.email}</span>}
              </div>
            </div>

            <div className="mt-[25px] flex justify-end gap-[10px]">
              <button onClick={() => setIsModalOpen(false)} className="rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-2.5 font-semibold text-[#64748b]">Cancel</button>
              <button onClick={handleSave} className="rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 font-bold text-white shadow-lg">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
          <div className="w-[350px] rounded-[20px] bg-white p-[30px] text-center shadow-2xl">
            <div className="mb-[15px] flex justify-center text-[#ef4444]"><AlertCircle size={48} /></div>
            <h3 className="text-xl font-bold">Remove Professor?</h3>
            <p className="my-[15px] text-[14px] text-[#64748b]">Delete <b>{profToDelete?.name}</b>?</p>
            <div className="flex justify-center gap-[10px]">
              <button onClick={() => setIsDeleteModalOpen(false)} className="rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-2.5 font-semibold text-[#64748b]">Cancel</button>
              <button onClick={handleDelete} className="rounded-[10px] bg-[#ef4444] px-5 py-2.5 font-bold text-white shadow-lg">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}