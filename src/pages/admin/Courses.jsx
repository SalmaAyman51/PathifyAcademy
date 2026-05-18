
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, X, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';

const BASE_URL = 'https://localhost:7061/api/Admin';
const getToken = () => localStorage.getItem('userToken');

export default function AdminCourses() {
  const [coursesData, setCoursesData]                 = useState([]);
  const [loading, setLoading]                         = useState(true);
  const [searchTerm, setSearchTerm]                   = useState('');

  const [isModalOpen, setIsModalOpen]                 = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen]     = useState(false);
  const [isSemesterModalOpen, setIsSemesterModalOpen] = useState(false);

  const [courseToDelete, setCourseToDelete]           = useState(null);
  const [editingCourse, setEditingCourse]             = useState(null);
  const [newSemester, setNewSemester]                 = useState('');

  const [saveLoading, setSaveLoading]                 = useState(false);
  const [deleteLoading, setDeleteLoading]             = useState(false);
  const [semesterLoading, setSemesterLoading]         = useState(false);
  const [apiError, setApiError]                       = useState('');
  const [errors, setErrors]                           = useState({});

  const [currentCourse, setCurrentCourse] = useState(null);

  // ─── Fetch All Courses ────────────────────────────────────────────────────────
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/get-all-courses`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCoursesData(data.map(c => ({
        id:             c.courseId,
        courseId:       c.courseId,
        name:           c.courseName,
        dept:           c.departmentName   ?? '',
        adminSsn:       c.adminSsn         ?? '',
        semester:       c.courseSemester   ?? '',
        level:          String(c.courseLevel ?? '1'),
        credits:        c.creditHours      ?? '',
        prerequisiteId: c.preReqCourseId   ?? 'None',
        type:           c.courseType       ?? 'Mandatory',
      })));
    } catch (_) {
      setCoursesData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  // ─── Validate ─────────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!currentCourse?.courseId?.trim()) e.courseId = 'Course ID is required';
    if (!currentCourse?.name?.trim())     e.name     = 'Course name is required';
    if (!currentCourse?.semester?.trim()) e.semester = 'Semester is required';
    if (!currentCourse?.adminSsn?.trim()) e.adminSsn = 'Admin SSN is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ─── Open Add Modal ───────────────────────────────────────────────────────────
  const openAddModal = () => {
    setCurrentCourse({
      courseId: '', name: '', dept: '', adminSsn: '',
      semester: '', level: '1', credits: '', prerequisiteId: '', type: 'Mandatory',
    });
    setEditingCourse(null);
    setErrors({});
    setApiError('');
    setIsModalOpen(true);
  };

  // ─── Open Edit Modal — fetches full course data first ─────────────────────────
  const openEditModal = async (course) => {
    setErrors({});
    setApiError('');
    setEditingCourse(course);
    setCurrentCourse(null);   // triggers spinner inside modal
    setIsModalOpen(true);

    try {
      const res = await fetch(`${BASE_URL}/get-course/${course.courseId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error('Failed to fetch course details');
      const data = await res.json();

      // .NET returns camelCase by default
      setCurrentCourse({
        courseId:       data.courseId       ?? '',
        name:           data.courseName     ?? '',
        dept:           data.departmentName ?? '',
        adminSsn:       data.adminSsn       ?? '',
        semester:       data.courseSemester ?? '',
        level:          String(data.courseLevel ?? '1'),
        credits:        data.creditHours    ?? '',
        prerequisiteId: data.preReqCourseId ?? 'None',
        type:           data.courseType     ?? 'Mandatory',
      });
    } catch (err) {
      setApiError('Failed to load course data: ' + err.message);
    }
  };

  // ─── Save (Add or Edit) ───────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;
    setSaveLoading(true);
    setApiError('');

    const body = {
      CourseId:       currentCourse.courseId,
      CourseName:     currentCourse.name,
      CourseSemester: currentCourse.semester,
      DepartmentName: currentCourse.dept        || null,
      AdminSsn:       currentCourse.adminSsn    || null,
      CourseLevel:    parseInt(currentCourse.level) || 1,
      PreReqCourseId: currentCourse.prerequisiteId && currentCourse.prerequisiteId !== 'None'
                        ? currentCourse.prerequisiteId : null,
      CreditHours:    Number(currentCourse.credits) || 0,
      CourseType:     currentCourse.type,
    };

    try {
      let res;
      if (editingCourse) {
        res = await fetch(`${BASE_URL}/edit-course/${editingCourse.courseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`${BASE_URL}/add-course`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
          body: JSON.stringify(body),
        });
      }

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setApiError(err.message ?? err.Message ?? (editingCourse ? 'Update failed' : 'Add failed'));
        return;
      }

      setIsModalOpen(false);
      fetchCourses();
    } catch (err) {
      setApiError('Network error: ' + err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!courseToDelete) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/delete-course/${courseToDelete.courseId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message ?? 'Delete failed');
        return;
      }
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
      fetchCourses();
    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // ─── Update Semester ──────────────────────────────────────────────────────────
  const handleUpdateSemester = async () => {
    if (!newSemester.trim()) return;
    setSemesterLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/update-semester`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(newSemester.trim()),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message ?? 'Update semester failed');
        return;
      }
      setIsSemesterModalOpen(false);
      setNewSemester('');
      fetchCourses();
    } catch (err) {
      alert('Network error: ' + err.message);
    } finally {
      setSemesterLoading(false);
    }
  };

  // ─── Filter ───────────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return coursesData;
    const q = searchTerm.toLowerCase();
    return coursesData.filter(
      (c) => c.name.toLowerCase().includes(q) || c.courseId.toLowerCase().includes(q)
    );
  }, [coursesData, searchTerm]);

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="relative rounded-[20px] border border-[#e2e8f0] bg-white p-[20px]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-[17px] font-bold text-[#1e293b]">Course Management</h3>
          <p className="text-sm text-[#64748b]">Manage academic curriculum and instructors.</p>
        </div>
        <div className="flex gap-2.5">
          <button
            onClick={() => { setNewSemester(''); setIsSemesterModalOpen(true); }}
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

      {/* Search */}
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

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-[#64748b]">
          <Loader2 size={24} className="animate-spin text-[#3d6c8a]" />
          <span className="text-sm font-[600]">Loading courses...</span>
        </div>
      ) : (
        <>
          <div className="mt-2.5 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="text-left text-[11px] font-bold text-[#94a3b8] uppercase">
                  <th className="p-3">COURSE NAME</th>
                  <th>COURSE ID</th>
                  <th>SEMESTER</th>
                  <th>PREREQUISITE</th>
                  <th>TYPE</th>
                  <th>LEVEL</th>
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
                      key={course.courseId}
                      className="border-b border-[#f8fafc] text-[13px] h-[45px] hover:bg-slate-50 transition-colors"
                    >
                      <td className="p-3 font-semibold text-[#1e293b] text-sm">{course.name}</td>
                      <td className="text-[13px] text-[#64748b]">{course.courseId}</td>
                      <td className="text-[13px] text-[#64748b]">{course.semester}</td>
                      <td className="text-[13px] text-[#64748b]">{course.prerequisiteId || 'None'}</td>
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
                      <td className="text-center text-[13px] text-[#64748b]">{course.level}</td>
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
        </>
      )}

      {/* ─── Delete Modal ──────────────────────────────────────────────────────── */}
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
                disabled={deleteLoading}
                className="flex items-center gap-2 rounded-[12px] bg-[#ef4444] px-[25px] py-[10px] font-bold text-white shadow-lg hover:opacity-90 disabled:opacity-60"
              >
                {deleteLoading && <Loader2 size={14} className="animate-spin" />}
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add / Edit Modal ──────────────────────────────────────────────────── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
          <div className="w-[480px] max-h-[85vh] overflow-y-auto rounded-[20px] bg-white p-[30px] shadow-2xl">

            {/* Header */}
            <div className="mb-[25px] flex items-center justify-between">
              <h3 className="m-0 text-lg font-semibold text-[#1e293b]">
                {editingCourse ? 'Update Course' : 'Add New Course'}
              </h3>
              <X size={20} className="cursor-pointer text-[#94a3b8]" onClick={() => setIsModalOpen(false)} />
            </div>

            {/* Spinner while fetching course data */}
            {!currentCourse ? (
              <>
                <div className="flex items-center justify-center py-16 gap-3 text-[#64748b]">
                  <Loader2 size={24} className="animate-spin text-[#3d6c8a]" />
                  <span className="text-sm font-[600]">Loading course data...</span>
                </div>
                {apiError && (
                  <div className="mt-4 rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] font-[600] text-red-500">
                    {apiError}
                  </div>
                )}
              </>
            ) : (
              <>
                {apiError && (
                  <div className="mb-4 rounded-[10px] bg-red-50 border border-red-200 px-4 py-3 text-[13px] font-[600] text-red-500">
                    {apiError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-[15px]">

                  <ModalField label="Course ID" error={errors.courseId}>
                    <input
                      className={`w-full rounded-[10px] border p-[12px] text-sm outline-none focus:border-[#3d6c8a]
                        ${errors.courseId ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}
                        ${editingCourse ? 'bg-[#f1f5f9] cursor-not-allowed' : 'bg-[#f8fafc]'}`}
                      value={currentCourse.courseId}
                      onChange={(e) => setCurrentCourse({ ...currentCourse, courseId: e.target.value })}
                      placeholder="e.g. CS301"
                      disabled={!!editingCourse}
                    />
                  </ModalField>

                  <ModalField label="Course Name" error={errors.name}>
                    <input
                      className={`w-full rounded-[10px] border bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a] ${errors.name ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
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

                  <ModalField label="Admin SSN" error={errors.adminSsn}>
                    <input
                      className={`w-full rounded-[10px] border bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a] ${errors.adminSsn ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
                      value={currentCourse.adminSsn}
                      onChange={(e) => setCurrentCourse({ ...currentCourse, adminSsn: e.target.value })}
                      placeholder="123456789"
                    />
                  </ModalField>

                  <ModalField label="Semester" error={errors.semester}>
                    <select
                      className={`w-full rounded-[10px] border bg-[#f8fafc] p-2.5 text-sm outline-none focus:border-[#3d6c8a] ${errors.semester ? 'border-[#ef4444]' : 'border-[#e2e8f0]'}`}
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
                        <option key={l} value={l}>Level {l}</option>
                      ))}
                    </select>
                  </ModalField>

                  <ModalField label="Credit Hours">
                    <input
                      type="number" min={1}
                      className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a]"
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
                    disabled={saveLoading}
                    className="flex items-center gap-2 rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 font-bold text-white shadow-lg disabled:opacity-60"
                  >
                    {saveLoading && <Loader2 size={14} className="animate-spin" />}
                    {saveLoading ? 'Saving...' : editingCourse ? 'Save Changes' : 'Add Course'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ─── Update Semester Modal ─────────────────────────────────────────────── */}
      {isSemesterModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
          <div className="w-[380px] rounded-[20px] bg-white p-[30px] shadow-2xl">
            <div className="mb-[25px] flex items-center justify-between">
              <h3 className="m-0 text-lg font-semibold text-[#1e293b]">Update Semester</h3>
              <X size={20} className="cursor-pointer text-[#94a3b8]" onClick={() => setIsSemesterModalOpen(false)} />
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
                This will update the semester for all students.
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
                disabled={semesterLoading || !newSemester}
                className="flex items-center gap-2 rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 font-bold text-white shadow-lg disabled:opacity-60"
              >
                {semesterLoading && <Loader2 size={14} className="animate-spin" />}
                {semesterLoading ? 'Updating...' : 'Update All'}
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