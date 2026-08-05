import React, { useState, useMemo, useEffect } from 'react';
import { Search, AlertCircle, Edit2, Trash2, X, Loader2 } from 'lucide-react';

const API_BASE = 'https://localhost:7061/api/Admin';

// ✅ نفس ترتيب الـ Enum بتاع الباك إند: Pending = 0, Passed = 1, Failed = 2
const PASS_STATUS = {
  PENDING: 0,
  PASSED: 1,
  FAILED: 2,
};

const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
});

// ✅ دالة مساعدة تقرأ الـ response سواء JSON أو plain text
const parseResponse = async (res) => {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [semester, setSemester] = useState('First Semester');
  const [searchTerm, setSearchTerm] = useState('');

  const [loadingFetch, setLoadingFetch] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [currentEnrollment, setCurrentEnrollment] = useState({
    studentSsn: '',
    oldCourseId: '',
    newCourseId: '',
    courseName: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setLoadingFetch(true);
    setFetchError(null);
    try {
      const res = await fetch(`${API_BASE}/get-all-enrollments`, {
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch enrollments');
      const data = await res.json();
      setEnrollments(data);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setLoadingFetch(false);
    }
  };

  const openEditModal = (enrollment) => {
    setCurrentEnrollment({
      studentSsn: enrollment.studentSsn,
      oldCourseId: enrollment.courseId,
      newCourseId: enrollment.courseId,
      courseName: enrollment.courseName,
    });
    setEditingEnrollment(enrollment);
    setErrors({});
    setApiError(null);
    setIsEditModalOpen(true);
  };

  const validateEdit = () => {
    const e = {};
    if (!currentEnrollment.newCourseId.trim()) e.newCourseId = 'Course ID is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ✅ التعديل هنا — بنستخدم parseResponse بدل res.json()
  const handleEditSave = async () => {
    if (!validateEdit()) return;
    setLoadingEdit(true);
    setApiError(null);
    try {
      const res = await fetch(
        `${API_BASE}/edit-enrollment/${currentEnrollment.studentSsn}`,
        {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({
            oldCourseId: currentEnrollment.oldCourseId,
            newCourseId: currentEnrollment.newCourseId,
          }),
        }
      );

      const data = await parseResponse(res);

      if (!res.ok) {
        // لو data object فيه message، لو string خده مباشرة
        const msg = typeof data === 'object' ? data.message : data;
        throw new Error(msg || 'Edit failed');
      }

      await fetchEnrollments();
      setIsEditModalOpen(false);
      setEditingEnrollment(null);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoadingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setLoadingDelete(true);
    setApiError(null);
    try {
      const res = await fetch(
        `${API_BASE}/delete-enrollment/${itemToDelete.studentSsn}/${itemToDelete.courseId}`,
        {
          method: 'DELETE',
          headers: authHeaders(),
        }
      );

      const data = await parseResponse(res);

      if (!res.ok) {
        const msg = typeof data === 'object' ? data.message : data;
        throw new Error(msg || 'Delete failed');
      }

      await fetchEnrollments();
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return enrollments;
    const q = searchTerm.toLowerCase();
    return enrollments.filter(
      (e) =>
        e.studentSsn?.includes(q) ||
        e.courseId?.toLowerCase().includes(q) ||
        e.courseName?.toLowerCase().includes(q)
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
            placeholder="Search by SSN, course ID or course name..."
            className="w-full bg-transparent text-[13px] outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {apiError && !isEditModalOpen && !isDeleteModalOpen && (
        <div className="mb-4 flex items-center gap-2 rounded-[10px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[13px] text-[#ef4444]">
          <AlertCircle size={15} />
          {apiError}
        </div>
      )}

      <div className="mt-2.5 overflow-x-auto">
        {loadingFetch ? (
          <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-[#94a3b8]">
            <Loader2 size={18} className="animate-spin" />
            Loading enrollments...
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle size={36} className="text-[#ef4444]" />
            <p className="text-[13px] text-[#ef4444]">{fetchError}</p>
            <button
              onClick={fetchEnrollments}
              className="rounded-[10px] border border-[#e2e8f0] px-4 py-2 text-[13px] font-semibold text-[#64748b] hover:bg-[#f8fafc]"
            >
              Retry
            </button>
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[11px] font-bold text-[#94a3b8] uppercase">
                <th className="p-3">SSN</th>
                <th>COURSE ID</th>
                <th>COURSE NAME</th>
                <th>ENROLLMENT DATE</th>
                <th>PASSED</th>
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
                filtered.map((e, idx) => (
                  <tr
                    key={`${e.studentSsn}-${e.courseId}-${idx}`}
                    className="border-b border-[#f8fafc] text-[13px] h-[45px] hover:bg-slate-50 transition-colors"
                  >
                    <td className="p-3 font-mono text-[#64748b]">{e.studentSsn}</td>
                    <td className="text-[#64748b]">{e.courseId}</td>
                    <td className="font-medium text-[#1e293b]">{e.courseName}</td>
                    <td className="text-[#64748b]">
                      {e.enrollmentDate
                        ? new Date(e.enrollmentDate).toLocaleDateString()
                        : '—'}
                    </td>
                    <td>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                          e.passed === PASS_STATUS.PASSED
                            ? 'bg-[#dcfce7] text-[#166534]'
                            : e.passed === PASS_STATUS.FAILED
                            ? 'bg-[#fee2e2] text-[#991b1b]'
                            : 'bg-[#f1f5f9] text-[#64748b]'
                        }`}
                      >
                        {e.passed === PASS_STATUS.PASSED
                          ? 'Passed'
                          : e.passed === PASS_STATUS.FAILED
                          ? 'Failed'
                          : 'Pending'}
                      </span>
                    </td>
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
                            setApiError(null);
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
        )}
      </div>

      {!loadingFetch && !fetchError && (
        <p className="mt-3 text-[12px] text-[#94a3b8]">
          Showing {filtered.length} of {enrollments.length} enrollments
        </p>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingEnrollment && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/70 backdrop-blur-[5px]">
          <div className="w-[480px] rounded-[20px] bg-white p-[30px] shadow-2xl">
            <div className="mb-[25px] flex items-center justify-between">
              <h3 className="m-0 text-lg font-semibold text-[#1e293b]">Edit Enrollment</h3>
              <X
                size={20}
                className="cursor-pointer text-[#94a3b8]"
                onClick={() => { setIsEditModalOpen(false); setApiError(null); }}
              />
            </div>

            <div className="grid grid-cols-2 gap-[15px]">
              <ModalField label="Student SSN">
                <input
                  readOnly
                  className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#f1f5f9] p-[12px] font-mono text-sm text-[#94a3b8] outline-none cursor-not-allowed"
                  value={currentEnrollment.studentSsn}
                />
              </ModalField>

              <ModalField label="Current Course ID">
                <input
                  readOnly
                  className="w-full rounded-[10px] border border-[#e2e8f0] bg-[#f1f5f9] p-[12px] text-sm text-[#94a3b8] outline-none cursor-not-allowed"
                  value={currentEnrollment.oldCourseId}
                />
              </ModalField>

              <ModalField label="New Course ID" error={errors.newCourseId} fullWidth>
                <input
                  className={`w-full rounded-[10px] border bg-[#f8fafc] p-[12px] text-sm outline-none focus:border-[#3d6c8a] ${
                    errors.newCourseId ? 'border-[#ef4444]' : 'border-[#e2e8f0]'
                  }`}
                  value={currentEnrollment.newCourseId}
                  onChange={(e) =>
                    setCurrentEnrollment({ ...currentEnrollment, newCourseId: e.target.value })
                  }
                  placeholder="e.g. CS201"
                />
              </ModalField>
            </div>

            {apiError && (
              <div className="mt-4 flex items-center gap-2 rounded-[10px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[13px] text-[#ef4444]">
                <AlertCircle size={15} />
                {apiError}
              </div>
            )}

            <div className="mt-[25px] flex justify-end gap-2.5">
              <button
                onClick={() => { setIsEditModalOpen(false); setApiError(null); }}
                className="rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-2.5 font-semibold text-[#64748b]"
                disabled={loadingEdit}
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={loadingEdit}
                className="flex items-center gap-2 rounded-[10px] bg-[#3d6c8a] px-5 py-2.5 font-bold text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loadingEdit && <Loader2 size={14} className="animate-spin" />}
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
              Are you sure you want to remove SSN{' '}
              <b className="font-mono">{itemToDelete.studentSsn}</b> from{' '}
              <b>{itemToDelete.courseId}</b>?
            </p>

            {apiError && (
              <div className="mb-3 flex items-center gap-2 rounded-[10px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[13px] text-[#ef4444]">
                <AlertCircle size={15} />
                {apiError}
              </div>
            )}

            <div className="mt-[25px] flex justify-center gap-3">
              <button
                onClick={() => { setIsDeleteModalOpen(false); setApiError(null); }}
                disabled={loadingDelete}
                className="rounded-[10px] border border-[#e2e8f0] bg-white px-5 py-2.5 font-semibold text-[#64748b]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={loadingDelete}
                className="flex items-center gap-2 rounded-[12px] bg-[#ef4444] px-[25px] py-[10px] font-bold text-white shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingDelete && <Loader2 size={14} className="animate-spin" />}
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