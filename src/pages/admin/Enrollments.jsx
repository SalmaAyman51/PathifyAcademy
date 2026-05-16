import React, { useState, useMemo } from 'react';
import { Search, AlertCircle, Edit2, Trash2, X } from 'lucide-react';

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([
    {
      id: 1,
      student: 'Ahmed Hassan',
      ssn: '100001',
      courseId: 'CS101',
      courseName: 'Introduction To Programming',
    },
    {
      id: 2,
      student: 'Mariam Youssef',
      ssn: '100002',
      courseId: 'CS201',
      courseName: 'Data Structures',
    },
    {
      id: 3,
      student: 'Khaled Ibrahim',
      ssn: '100003',
      courseId: 'CS301',
      courseName: 'Algorithms',
    },
    {
      id: 4,
      student: 'Sara Mahmoud',
      ssn: '100004',
      courseId: 'CS401',
      courseName: 'Machine Learning',
    },
    {
      id: 5,
      student: 'Omar Nabil',
      ssn: '100005',
      courseId: 'CS101',
      courseName: 'Introduction To Programming',
    },
    {
      id: 6,
      student: 'Nour Tarek',
      ssn: '100006',
      courseId: 'CS201',
      courseName: 'Data Structures',
    },
  ]);

  const [semester, setSemester] = useState('First Semester');
  const [searchTerm, setSearchTerm] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [currentEnrollment, setCurrentEnrollment] = useState({
    student: '',
    ssn: '',
    courseId: '',
    courseName: '',
    semester: 'First Semester',
  });

  const [errors, setErrors] = useState({});

  const openEditModal = (enrollment) => {
    setCurrentEnrollment({ ...enrollment, semester });
    setEditingEnrollment(enrollment);
    setErrors({});
    setIsEditModalOpen(true);
  };

  const validateEdit = () => {
    const e = {};
    const data = currentEnrollment;

    if (!data.student.trim()) e.student = 'Student name is required';
    if (!data.courseId.trim()) e.courseId = 'Course ID is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleEditSave = () => {
    if (!validateEdit()) return;

    const data = currentEnrollment;

    setEnrollments((prev) =>
      prev.map((e) =>
        e.id === editingEnrollment.id
          ? {
              student: data.student,
              ssn: data.ssn,
              courseId: data.courseId,
              courseName: data.courseName,
              id: editingEnrollment.id,
            }
          : e
      )
    );

    setIsEditModalOpen(false);
    setEditingEnrollment(null);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;
    setEnrollments((prev) => prev.filter((e) => e.id !== itemToDelete.id));
    setIsDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return enrollments;
    const q = searchTerm.toLowerCase();

    return enrollments.filter(
      (e) =>
        e.student.toLowerCase().includes(q) ||
        e.courseId.toLowerCase().includes(q) ||
        e.courseName.toLowerCase().includes(q) ||
        e.ssn.includes(q)
    );
  }, [enrollments, searchTerm]);

  return (
    <div className="relative rounded-[20px] border border-[#e2e8f0] bg-white p-[20px]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-[17px] font-bold text-[#1e293b]">Enrollment Management</h3>
          <p className="text-sm text-[#64748b]">Manage student course enrollments.</p>
        </div>

        <div className="flex items-center gap-2 rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] px-3.5 py-2 text-[13px] text-[#64748b]">
          <span className="font-semibold text-[#1e293b]">Semester:</span>
          <select
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="cursor-pointer border-none bg-transparent font-semibold text-[#3d6c8a] outline-none"
          >
            <option value="First Semester">First Semester</option>
            <option value="Second Semester">Second Semester</option>
          </select>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex w-[350px] items-center gap-2.5 rounded-[10px] border border-[#e2e8f0] bg-white px-[15px] py-[8px]">
          <Search size={16} className="text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search by student, course or SSN..."
            className="w-full bg-transparent text-[13px] outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-2.5 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-[11px] font-bold text-[#94a3b8] uppercase">
              <th className="p-3">STUDENT NAME</th>
              <th>SSN</th>
              <th>COURSE ID</th>
              <th>COURSE NAME</th>
              <th>SEMESTER</th>
              <th className="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[13px] text-[#94a3b8]">
                  No enrollments found.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr
                  key={e.id}
                  className="border-b border-[#f8fafc] text-[13px] h-[45px] hover:bg-slate-50 transition-colors"
                >
                  <td className="p-3 font-semibold text-[#1e293b]">{e.student}</td>
                  <td className="font-mono text-[#64748b]">{e.ssn}</td>
                  <td className="text-[#64748b]">{e.courseId}</td>
                  <td className="font-medium text-[#1e293b]">{e.courseName}</td>
                  <td className="text-[#64748b]">{semester}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-3 pr-2">
                      <Edit2
                        size={16}
                        className="cursor-pointer text-[#3d6c8a]"
                        onClick={() => openEditModal(e)}
                        title="Edit"
                      />
                      <Trash2
                        size={16}
                        className="cursor-pointer opacity-80 text-[#ef4444]"
                        onClick={() => {
                          setItemToDelete(e);
                          setIsDeleteModalOpen(true);
                        }}
                        title="Delete"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[12px] text-[#94a3b8]">
        Showing {filtered.length} of {enrollments.length} enrollments
      </p>

      {/* Edit Modal */}
      {isEditModalOpen && editingEnrollment && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
          <div className="w-[480px] rounded-[20px] bg-white p-[30px] shadow-2xl">
            <div className="mb-[25px] flex items-center justify-between">
              <h3 className="m-0 text-lg font-semibold text-[#1e293b]">Edit Enrollment</h3>
              <X size={20} className="cursor-pointer text-[#94a3b8]" onClick={() => setIsEditModalOpen(false)} />
            </div>

            <div className="grid grid-cols-2 gap-[15px]">
              <ModalField label="Student Name" error={errors.student}>
                <input
                  className={`w-full rounded-[10px] border bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a] ${
                    errors.student ? 'border-[#ef4444]' : 'border-[#e2e8f0]'
                  }`}
                  value={currentEnrollment.student}
                  onChange={(e) =>
                    setCurrentEnrollment({ ...currentEnrollment, student: e.target.value })
                  }
                  placeholder="Ahmed Hassan"
                />
              </ModalField>

              <ModalField label="SSN">
                <input
                  className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a]"
                  value={currentEnrollment.ssn}
                  onChange={(e) => setCurrentEnrollment({ ...currentEnrollment, ssn: e.target.value })}
                  placeholder="100001"
                />
              </ModalField>

              <ModalField label="Course ID" error={errors.courseId}>
                <input
                  className={`w-full rounded-[10px] border bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a] ${
                    errors.courseId ? 'border-[#ef4444]' : 'border-[#e2e8f0]'
                  }`}
                  value={currentEnrollment.courseId}
                  onChange={(e) =>
                    setCurrentEnrollment({ ...currentEnrollment, courseId: e.target.value })
                  }
                  placeholder="CS101"
                />
              </ModalField>

              <ModalField label="Course Name">
                <input
                  className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a]"
                  value={currentEnrollment.courseName}
                  onChange={(e) =>
                    setCurrentEnrollment({ ...currentEnrollment, courseName: e.target.value })
                  }
                  placeholder="Introduction To Programming"
                />
              </ModalField>
            </div>

            <div className="mt-[25px] flex justify-end gap-2.5">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-2.5 font-semibold text-[#64748b]"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
          <div className="w-[360px] rounded-[28px] bg-white p-[35px] text-center shadow-2xl">
            <div className="mb-[15px] flex justify-center text-[#ef4444]">
              <AlertCircle size={55} />
            </div>
            <h3 className="m-0 text-[22px] font-bold text-[#1e293b]">Delete Enrollment?</h3>
            <p className="my-[15px] text-[14px] text-[#64748b]">
              Are you sure you want to delete <b>{itemToDelete.student}</b>'s enrollment record?
            </p>
            <div className="mt-[25px] flex justify-center gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-2.5 font-semibold text-[#64748b]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-[12px] bg-[#ef4444] px-[25px] py-[10px] font-bold text-white shadow-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ModalField = ({ label, children, error = null, fullWidth = false }) => (
  <div className={`flex flex-col gap-1.25 ${fullWidth ? 'col-span-2' : ''}`}>
    <label className="text-[13px] font-bold text-[#1e293b]">{label}</label>
    {children}
    {error && <span className="text-[11px] font-medium text-[#ef4444]">{error}</span>}
  </div>
);

