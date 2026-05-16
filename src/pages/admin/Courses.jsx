import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2, X, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminCourses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);

  const [courseToDelete, setCourseToDelete] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newSemester, setNewSemester] = useState('');

  const [currentCourse, setCurrentCourse] = useState({
    courseId: '',
    name: '',
    dept: '',
    adminSsn: '',
    semester: '',
    level: '1',
    credits: '',
    prerequisiteId: '',
    type: 'Mandatory',
  });

  const [errors, setErrors] = useState({});

  const [coursesData, setCoursesData] = useState([
    {
      id: 1,
      courseId: 'CS101',
      name: 'Introduction To Programming',
      dept: 'Computer Science',
      adminSsn: '111222333',
      semester: 'First Semester',
      level: '1',
      credits: 3,
      prerequisiteId: 'None',
      type: 'Mandatory',
    },
    {
      id: 2,
      courseId: 'CS201',
      name: 'Data Structures',
      dept: 'Computer Science',
      adminSsn: '111222333',
      semester: 'First Semester',
      level: '2',
      credits: 3,
      prerequisiteId: 'CS101',
      type: 'Mandatory',
    },
    {
      id: 3,
      courseId: 'CS301',
      name: 'Algorithms',
      dept: 'Computer Science',
      adminSsn: '111222333',
      semester: 'Second Semester',
      level: '3',
      credits: 3,
      prerequisiteId: 'CS201',
      type: 'Mandatory',
    },
    {
      id: 4,
      courseId: 'CS401',
      name: 'Machine Learning',
      dept: 'Computer Science',
      adminSsn: '222333444',
      semester: 'Second Semester',
      level: '4',
      credits: 3,
      prerequisiteId: 'CS301',
      type: 'Elective',
    },
  ]);

  const capitalize = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());

  const validate = () => {
    const e = {};
    const data = currentCourse;

    if (!data.courseId.trim()) e.courseId = 'Course ID is required';
    if (!data.name.trim()) e.name = 'Course name is required';
    if (!data.semester.trim()) e.semester = 'Semester is required';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const openAddModal = () => {
    setCurrentCourse({
      courseId: '',
      name: '',
      dept: '',
      adminSsn: '',
      semester: '',
      level: '1',
      credits: '',
      prerequisiteId: '',
      type: 'Mandatory',
    });
    setEditingCourse(null);
    setErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (course) => {
    setCurrentCourse({ ...course });
    setEditingCourse(course);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!validate()) return;

    const data = currentCourse;
    const saved = {
      ...data,
      name: capitalize(data.name),
      credits: Number(data.credits) || 0,
    };

    if (editingCourse) {
      setCoursesData((prev) =>
        prev.map((c) => (c.id === editingCourse.id ? { ...saved, id: editingCourse.id } : c))
      );
    } else {
      setCoursesData((prev) => [...prev, { ...saved, id: Date.now() }]);
    }

    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (!courseToDelete) return;
    setCoursesData((prev) => prev.filter((c) => c.id !== courseToDelete.id));
    setIsDeleteModalOpen(false);
    setCourseToDelete(null);
  };

  const handleUpdateSemester = () => {
    if (!newSemester.trim()) return;
    setCoursesData((prev) => prev.map((c) => ({ ...c, semester: newSemester.trim() })));
    setIsSemesterModalOpen(false);
    setNewSemester('');
  };

  const filtered = useMemo(() => {
    let list = coursesData;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) || c.courseId.toLowerCase().includes(q)
      );
    }
    return list;
  }, [coursesData, searchTerm]);

  return (
    <div className="relative rounded-[20px] border border-[#e2e8f0] bg-white p-[20px]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-[17px] font-bold text-[#1e293b]">Course Management</h3>
          <p className="text-sm text-[#64748b]">Manage academic curriculum and instructors.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => setIsSemesterModalOpen(true)}
            className="flex items-center gap-1.5 rounded-[10px] bg-[#3d6c8a] px-4 py-2 text-sm font-bold text-white transition-all hover:scale-[1.02] cursor-pointer"
          >
            <RefreshCw size={15} /> Update Semester
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 rounded-[10px] bg-[#3d6c8a] px-4 py-2 text-sm font-bold text-white transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus size={16} /> Add Course
          </button>
        </div>
      </div>

      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex w-[300px] items-center gap-2.5 rounded-[10px] border border-[#e2e8f0] bg-white px-[15px] py-[8px]">
          <Search size={16} className="text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search courses..."
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
              <th className="p-3">COURSE NAME</th>
              <th>COURSE ID</th>
              <th>SEMESTER</th>
              <th>PREREQUISITE</th>
              <th>TYPE</th>
              <th>CREDITS</th>
              <th className="text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[13px] text-[#94a3b8]">
                  No courses found.
                </td>
              </tr>
            ) : (
              filtered.map((course) => (
                <tr
                  key={course.id}
                  className="border-b border-[#f8fafc] text-[13px] h-[45px] hover:bg-slate-50 transition-colors"
                >
                  <td className="p-3 font-semibold text-[#1e293b] text-sm">{course.name}</td>
                  <td className="text-[13px] text-[#64748b]">{course.courseId}</td>
                  <td className="text-[13px] text-[#64748b]">{course.semester}</td>
                  <td className="text-[13px] text-[#64748b]">{course.prerequisiteId}</td>
                  <td>
                    <span
                      className={`rounded-[6px] px-2.5 py-1 text-[12px] font-semibold ${
                        course.type === 'Mandatory'
                          ? 'bg-[#e0f2fe] text-[#0369a1]'
                          : 'bg-[#f0fdf4] text-[#16a34a]'
                      }`}
                    >
                      {course.type}
                    </span>
                  </td>
                  <td className="text-center text-[13px] text-[#64748b]">{course.credits}</td>
                  <td className="text-right">
                    <div className="flex justify-end gap-3">
                      <Edit2
                        size={16}
                        className="cursor-pointer text-[#3d6c8a]"
                        onClick={() => openEditModal(course)}
                      />
                      <Trash2
                        size={16}
                        className="cursor-pointer opacity-80 text-[#ef4444]"
                        onClick={() => {
                          setCourseToDelete(course);
                          setIsDeleteModalOpen(true);
                        }}
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
        Showing {filtered.length} of {coursesData.length} courses
      </p>

      {/* Modal Delete */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
          <div className="w-[360px] rounded-[28px] bg-white p-[35px] text-center shadow-2xl">
            <div className="mb-[15px] flex justify-center text-[#ef4444]">
              <AlertCircle size={55} />
            </div>
            <h3 className="m-0 text-[22px] font-bold text-[#1e293b]">Remove Course?</h3>
            <p className="my-[15px] text-[14px] text-[#64748b]">
              Are you sure you want to delete <b>{courseToDelete?.name}</b>?
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
                className="rounded-[12px] bg-[#ef4444] px-[25px] py-[10px] font-bold text-white shadow-lg hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
          <div className="w-[480px] rounded-[20px] bg-white p-[30px] shadow-2xl">
            <div className="mb-[25px] flex items-center justify-between">
              <h3 className="m-0 text-lg font-semibold text-[#1e293b]">
                {editingCourse ? 'Update Course' : 'Add New Course'}
              </h3>
              <X
                size={20}
                className="cursor-pointer text-[#94a3b8]"
                onClick={() => setIsModalOpen(false)}
              />
            </div>

            <div className="grid grid-cols-2 gap-[15px]">
              <ModalField label="Course ID" error={errors.courseId}>
                <input
                  className={`w-full rounded-[10px] border bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a] ${
                    errors.courseId ? 'border-[#ef4444]' : 'border-[#e2e8f0]'
                  }`}
                  value={currentCourse.courseId}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, courseId: e.target.value })}
                  placeholder="e.g. CS301"
                />
              </ModalField>

              <ModalField label="Course Name" error={errors.name}>
                <input
                  className={`w-full rounded-[10px] border bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a] ${
                    errors.name ? 'border-[#ef4444]' : 'border-[#e2e8f0]'
                  }`}
                  value={currentCourse.name}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, name: e.target.value })}
                  placeholder="Data Structures"
                />
              </ModalField>

              <ModalField label="Department">
                <input
                  className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a]"
                  value={currentCourse.dept}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, dept: e.target.value })}
                  placeholder="Computer Science"
                />
              </ModalField>

              <ModalField label="Admin SSN">
                <input
                  className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a]"
                  value={currentCourse.adminSsn}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, adminSsn: e.target.value })}
                  placeholder="123456789"
                />
              </ModalField>

              <ModalField label="Semester" error={errors.semester}>
                <select
                  className={`w-full rounded-[10px] border bg-[#f8fafc] p-2.5 text-sm outline-none focus:border-[#3d6c8a] ${
                    errors.semester ? 'border-[#ef4444]' : 'border-[#e2e8f0]'
                  }`}
                  value={currentCourse.semester}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, semester: e.target.value })}
                >
                  <option value="">Select Semester</option>
                  <option value="First Semester">First Semester</option>
                  <option value="Second Semester">Second Semester</option>
                </select>
              </ModalField>

              <ModalField label="Level">
                <select
                  className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-sm outline-none focus:border-[#3d6c8a]"
                  value={currentCourse.level}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, level: e.target.value })}
                >
                  {['1', '2', '3', '4'].map((l) => (
                    <option key={l} value={l}>
                      Level {l}
                    </option>
                  ))}
                </select>
              </ModalField>

              <ModalField label="Credit Hours">
                <input
                  className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a]"
                  type="number"
                  min={1}
                  value={currentCourse.credits}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, credits: e.target.value })}
                  placeholder="3"
                />
              </ModalField>

              <ModalField label="Prerequisite Course ID">
                <input
                  className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a]"
                  value={currentCourse.prerequisiteId}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, prerequisiteId: e.target.value })}
                  placeholder="None"
                />
              </ModalField>

              <ModalField label="Course Type" fullWidth>
                <select
                  className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-sm outline-none focus:border-[#3d6c8a]"
                  value={currentCourse.type}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, type: e.target.value })}
                >
                  <option value="Mandatory">Mandatory</option>
                  <option value="Elective">Elective</option>
                </select>
              </ModalField>
            </div>

            <div className="mt-[25px] flex justify-end gap-2.5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-2.5 font-semibold text-[#64748b]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 font-bold text-white shadow-lg"
              >
                {editingCourse ? 'Save Changes' : 'Add Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Update Semester */}
      {isSemesterModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
          <div className="w-[380px] rounded-[20px] bg-white p-[30px] shadow-2xl">
            <div className="mb-[25px] flex items-center justify-between">
              <h3 className="m-0 text-lg font-semibold text-[#1e293b]">Update Semester</h3>
              <X
                size={20}
                className="cursor-pointer text-[#94a3b8]"
                onClick={() => setIsSemesterModalOpen(false)}
              />
            </div>

            <div className="flex flex-col gap-1.25">
              <label className="text-[13px] font-bold text-[#1e293b]">New Semester</label>
              <select
                className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-2.5 text-sm outline-none focus:border-[#3d6c8a]"
                value={newSemester}
                onChange={(e) => setNewSemester(e.target.value)}
              >
                <option value="">Select Semester</option>
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
              </select>
              <p className="mt-1.5 text-[12px] text-[#94a3b8]">
                This will update the semester for all courses.
              </p>
            </div>

            <div className="mt-[25px] flex justify-end gap-2.5">
              <button
                onClick={() => setIsSemesterModalOpen(false)}
                className="rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-2.5 font-semibold text-[#64748b]"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSemester}
                className="rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 font-bold text-white shadow-lg"
              >
                Update All
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

