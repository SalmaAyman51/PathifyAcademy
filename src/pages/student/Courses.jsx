import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, CheckCircle2, Search, Calculator, Building, PieChart, Ruler, Settings, Scale, BookOpen, Loader2, AlertCircle, X, CheckCheck, AlertTriangle, Info } from 'lucide-react';

const BASE_URL = 'https://localhost:7061/api/CourseEnrollment';
const FALLBACK = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop';

// ✅ نفس ترتيب الـ Enum بتاع الباك إند: Pending = 0, Passed = 1, Failed = 2
const PASS_STATUS = {
  PENDING: 0,
  PASSED: 1,
  FAILED: 2,
};

const DEPT_ICONS = {
  BIS: Settings, Accounting: Calculator, Management: Building,
  Economics: PieChart, Statistics: Ruler, Politics: Scale, default: BookOpen,
};
const DEPT_IMAGES = {
  BIS: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  Accounting: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
  Management: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
  Economics: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
  Statistics: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=800&auto=format&fit=crop',
  Politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=800&auto=format&fit=crop',
};

const getToken = () => localStorage.getItem('userToken');

function calcMaxCourses(gpa, level) {
  if (level === 1 || !gpa || gpa === 0) return 6;
  return gpa >= 2 ? 6 : 4;
}

function mapApiCourse(c) {
  const id = c.courseId ?? c.CourseId;
  const name = c.courseName ?? c.CourseName;
  const dept = c.departmentName ?? c.DepartmentName ?? '';
  const credits = c.creditHours ?? c.CreditHours ?? 3;
  const type = c.courseType ?? c.CourseType ?? '';
  const prereq = c.preRequisite ?? c.PreRequisite ?? c.preReqCourseId ?? c.PreReqCourseId ?? null;
  const hasPrereq = c.hasPrerequisite ?? c.HasPrerequisite ?? !!prereq;
  const source = c.source ?? c.Source ?? '';
  const level = c.courseLevel ?? c.CourseLevel;
  return {
    id, code: id, title: name,
    desc: `${dept} · Level ${level} · ${credits} Credit Hours · ${type}`,
    icon: DEPT_ICONS[dept] || DEPT_ICONS.default,
    image: DEPT_IMAGES[dept] || FALLBACK,
    creditHours: credits, courseType: type, departmentName: dept,
    hasPrerequisite: hasPrereq, preRequisite: prereq, source, courseLevel: level,
  };
}

function mapSelectedCourse(c) {
  const id = c.CourseId ?? c.courseId;
  const name = c.CourseName ?? c.courseName;
  const dept = c.DepartmentName ?? c.departmentName ?? '';
  const credits = c.CreditHours ?? c.creditHours ?? 3;
  const type = c.CourseType ?? c.courseType ?? '';
  const level = c.CourseLevel ?? c.courseLevel ?? '';
  return {
    id, code: id, title: name,
    desc: `${dept} · Level ${level} · ${credits} Credit Hours · ${type}`,
    icon: DEPT_ICONS[dept] || DEPT_ICONS.default,
    image: DEPT_IMAGES[dept] || FALLBACK,
    creditHours: credits, courseType: type, departmentName: dept,
    hasPrerequisite: false, preRequisite: null, source: '',
  };
}

// ✅ التعديل هنا — passed بقى Enum (0/1/2) زى صفحة الادمن، مش boolean
function mapEnrolledCourse(c) {
  const id = c.CourseId ?? c.courseId;
  const name = c.CourseName ?? c.courseName;
  const dept = c.DepartmentName ?? c.departmentName ?? '';
  const credits = c.CreditHours ?? c.creditHours ?? 3;
  const passed = c.Passed ?? c.passed ?? PASS_STATUS.PENDING;
  return {
    id, code: id, title: name,
    desc: `${dept ? dept + ' · ' : ''}${credits} Credit Hours`,
    icon: DEPT_ICONS[dept] || DEPT_ICONS.default,
    image: DEPT_IMAGES[dept] || FALLBACK,
    creditHours: credits, departmentName: dept,
    passed,
    hasPrerequisite: false, preRequisite: null, source: '',
  };
}

// ─── Toast ────────────────────────────────────────────────────────────────────
const TOAST_ICONS = {
  success: <CheckCheck size={18} />,
  error:   <AlertCircle size={18} />,
  warning: <AlertTriangle size={18} />,
  info:    <Info size={18} />,
};
const TOAST_COLORS = {
  success: { bg: '#f0fdf4', border: '#bbf7d0', icon: '#16a34a', text: '#15803d' },
  error:   { bg: '#fef2f2', border: '#fecaca', icon: '#dc2626', text: '#b91c1c' },
  warning: { bg: '#fffbeb', border: '#fde68a', icon: '#d97706', text: '#b45309' },
  info:    { bg: '#eff6ff', border: '#bfdbfe', icon: '#2563eb', text: '#1d4ed8' },
};

function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
      {toasts.map(t => {
        const c = TOAST_COLORS[t.type] || TOAST_COLORS.info;
        return (
          <div
            key={t.id}
            style={{ background: c.bg, borderColor: c.border }}
            className="flex items-start gap-3 rounded-[14px] border px-4 py-3 shadow-lg animate-[slideIn_0.3s_ease]"
          >
            <span style={{ color: c.icon }} className="mt-0.5 shrink-0">{TOAST_ICONS[t.type]}</span>
            <p style={{ color: c.text }} className="text-[13px] font-[600] leading-snug flex-1">{t.message}</p>
            <button onClick={() => onRemove(t.id)} className="shrink-0 text-[#94a3b8] hover:text-[#475569]">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ─── CourseCard ───────────────────────────────────────────────────────────────
const CourseCard = ({ course, enrolled, selected, onToggle, onRemove, mode }) => {
  const [hover, setHover] = useState(false);
  const isCurrentLevel = course.source === 'Current Level';

  let badgeBg = '#f1f5f9', badgeColor = '#475569', badgeText = course.code;
  if (enrolled)            { badgeBg = '#d1fae5'; badgeColor = '#059669'; badgeText = 'Enrolled'; }
  else if (selected)       { badgeBg = '#3d6c8a'; badgeColor = '#fff';    badgeText = 'Selected'; }
  else if (isCurrentLevel) { badgeBg = '#fef3c7'; badgeColor = '#d97706'; badgeText = course.code; }

  let btnBg = 'transparent', btnColor = '#3d6c8a', btnBorder = '#3d6c8a', btnText = 'Enroll Now';
  if (enrolled)      { btnBg = '#f1f5f9'; btnColor = '#94a3b8'; btnBorder = '#f1f5f9'; btnText = 'Enrolled ✔'; }
  else if (selected) { btnBg = '#10b981'; btnColor = '#fff';    btnBorder = '#10b981'; btnText = 'Selected ✔'; }

  // ✅ التعديل هنا — نفس منطق الـ Enum بتاع صفحة الادمن (Pending=0, Passed=1, Failed=2)
  const passedBadge = mode === 'enrolled'
    ? course.passed === PASS_STATUS.PASSED
      ? <span className="mt-1 inline-block rounded-[6px] bg-[#dcfce7] px-2 py-0.5 text-[10px] font-[700] text-[#166534]">Passed</span>
      : course.passed === PASS_STATUS.FAILED
        ? <span className="mt-1 inline-block rounded-[6px] bg-[#fee2e2] px-2 py-0.5 text-[10px] font-[700] text-[#991b1b]">Failed</span>
        : <span className="mt-1 inline-block rounded-[6px] bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-[700] text-[#64748b]">Pending</span>
    : null;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`flex flex-col overflow-hidden rounded-[20px] border bg-white transition-all duration-300
        ${hover ? '-translate-y-1.5 border-[#eef2f6] shadow-[0_12px_30px_rgba(61,108,138,0.12)]' : 'border-[#eef2f6] shadow-[0_2px_8px_rgba(0,0,0,0.02)]'}`}
    >
      <div className="relative h-[140px] overflow-hidden">
        <img
          src={course.image}
          onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK; }}
          alt={course.title}
          className={`h-full w-full object-cover transition-transform duration-700 ${hover ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute top-0 left-0 h-10 w-full bg-gradient-to-b from-black/20 to-transparent" />
        <span
          style={{ background: badgeBg, color: badgeColor }}
          className="absolute top-3 left-3 rounded-[8px] px-3 py-1 text-[10px] font-[800] uppercase shadow-sm"
        >
          {badgeText}
        </span>
        {isCurrentLevel && !enrolled && !selected && (
          <span className="absolute top-3 right-3 rounded-[8px] bg-[#16a34a] px-2 py-1 text-[9px] font-[700] uppercase text-white shadow-sm">
            ⭐ Recommended
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="min-h-[65px]">
          <h3 className="mb-1.5 text-[15px] font-[700] leading-tight text-[#1e293b]">{course.title}</h3>
          <p className="text-[12px] leading-relaxed text-[#64748b]">{course.desc}</p>
          {course.hasPrerequisite && (
            <p className="mt-1 text-[11px] text-[#f59e0b] font-[600]">Prerequisite: {course.preRequisite}</p>
          )}
          {passedBadge}
        </div>
        {mode === 'selection' ? (
          <button
            onClick={() => onRemove(course.id)}
            className="w-full rounded-[12px] border border-[#fee2e2] bg-[#fff5f5] py-2.5 text-[11px] font-[700] text-[#ef4444] transition-colors hover:bg-red-100"
          >
            Remove from list
          </button>
        ) : mode === 'enrolled' ? null : (
          <button
            onClick={() => !enrolled && onToggle(course)}
            disabled={!!enrolled}
            style={{ backgroundColor: btnBg, color: btnColor, borderColor: btnBorder }}
            className={`w-full rounded-[12px] border-[1.5px] py-2.5 text-[11px] font-[700] uppercase transition-all
              ${enrolled ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
          >
            {btnText}
          </button>
        )}
      </div>
    </div>
  );
};

// ─── EmptyState ───────────────────────────────────────────────────────────────
function EmptyState({ icon: Icon, title, desc, btnText, onBtn }) {
  return (
    <div className="my-5 flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] px-10 py-[60px] text-center gap-3">
      <div className="rounded-full bg-white p-5 shadow-sm text-[#3d6c8a]"><Icon size={40} /></div>
      <h2 className="text-lg font-[700] text-[#1e293b]">{title}</h2>
      <p className="max-w-[300px] text-[13px] text-[#94a3b8]">{desc}</p>
      <button onClick={onBtn}
        className="mt-2.5 rounded-[12px] bg-[#3d6c8a] px-8 py-3 text-[13px] font-[700] text-white shadow-lg shadow-[#3d6c8a]/30 transition-transform hover:scale-105 active:scale-95">
        {btnText}
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StudentCourses() {
  const [activeTab, setActiveTab]             = useState('available');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [search, setSearch]                   = useState('');
  const [courses, setCourses]                 = useState([]);
  const [studentInfo, setStudentInfo]         = useState(null);
  const [maxCourses, setMaxCourses]           = useState(6);
  const [loading, setLoading]                 = useState(true);
  const [selLoading, setSelLoading]           = useState(true);
  const [enrollLoading, setEnrollLoading]     = useState(false);
  const [confirmLoading, setConfirmLoading]   = useState(false);
  const [error, setError]                     = useState(null);
  const [toasts, setToasts]                   = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);
  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  // 1. Available courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true); setError(null);
        const res = await fetch(`${BASE_URL}/available-courses`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();

        const gpa         = data.gpa              ?? data.GPA             ?? 0;
        const level       = data.currentLevel     ?? data.CurrentLevel    ?? 1;
        const apiMax      = data.maxCoursesAllowed ?? data.MaxCoursesAllowed ?? null;
        const resolvedMax = apiMax !== null ? apiMax : calcMaxCourses(gpa, level);

        setStudentInfo({
          name: data.studentName ?? data.StudentName,
          level, semester: data.currentSemester ?? data.CurrentSemester,
          gpa, maxCourses: resolvedMax,
        });
        setMaxCourses(resolvedMax);
        setCourses((data.availableCourses ?? data.AvailableCourses ?? []).map(mapApiCourse));
      } catch (err) {
        setError(err.message);
      } finally { setLoading(false); }
    };
    fetchCourses();
  }, []);

  // 2. Selected courses
  const fetchSelectedCourses = useCallback(async () => {
    try {
      setSelLoading(true);
      const res = await fetch(`${BASE_URL}/selected-courses`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const apiMax = data.MaxCoursesAllowed ?? data.maxCoursesAllowed ?? null;
      if (apiMax !== null) setMaxCourses(apiMax);
      setSelectedCourses((data.SelectedCourses ?? data.selectedCourses ?? []).map(mapSelectedCourse));
    } catch (_) {}
    finally { setSelLoading(false); }
  }, []);

  useEffect(() => { fetchSelectedCourses(); }, [fetchSelectedCourses]);

  // 3. Enrolled courses
  const fetchEnrolledCourses = useCallback(async () => {
    try {
      setEnrollLoading(true);
      const res = await fetch(`${BASE_URL}/my-enrolled-courses`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const list = data.Courses ?? data.courses ?? [];
      setEnrolledCourses(list.map(mapEnrolledCourse));
    } catch (_) {}
    finally { setEnrollLoading(false); }
  }, []);

  useEffect(() => { fetchEnrolledCourses(); }, [fetchEnrolledCourses]);

  const isEnrolled = (id) => enrolledCourses.find(c => c.id === id);
  const isSelected = (id) => selectedCourses.find(c => c.id === id);
  const totalSelectedCredits = selectedCourses.reduce((sum, c) => sum + (c.creditHours || 3), 0);
  const remainingSlots = maxCourses - selectedCourses.length;

  // 4. Toggle add/remove selected
  const toggleCourse = async (course) => {
    if (isEnrolled(course.id)) return;

    if (isSelected(course.id)) {
      try {
        const res = await fetch(`${BASE_URL}/remove-from-selected/${course.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          addToast(err.message ?? 'Failed to remove course', 'error');
          return;
        }
        setSelectedCourses(prev => prev.filter(c => c.id !== course.id));
        addToast(`"${course.title}" removed from your selection`, 'info');
      } catch (err) { addToast('Network error: ' + err.message, 'error'); }
      return;
    }

    if (selectedCourses.length >= maxCourses) {
      const gpa = studentInfo?.gpa;
      const msg = (!gpa || gpa === 0)
        ? `You've reached the maximum of ${maxCourses} courses.`
        : gpa >= 2
          ? `You've reached the maximum of ${maxCourses} courses (GPA ≥ 2).`
          : `You can only select ${maxCourses} courses because your GPA (${gpa}) is below 2.`;
      addToast(msg, 'warning');
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/add-to-selected`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ courseIds: [course.id] }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        addToast(err.message ?? 'Failed to add course', 'error');
        return;
      }
      const result = await res.json();
      const newMax = result.MaxAllowed ?? result.maxAllowed ?? null;
      if (newMax !== null) setMaxCourses(newMax);

      const errors = result.Errors ?? result.errors ?? [];
      if (errors.length > 0) { errors.forEach(e => addToast(e, 'warning')); return; }

      setSelectedCourses(prev => [...prev, course]);
      addToast(`"${course.title}" added to your selection`, 'success');
    } catch (err) { addToast('Network error: ' + err.message, 'error'); }
  };

  // 5. Remove from selection tab
  const removeCourse = async (id) => {
    const course = selectedCourses.find(c => c.id === id);
    try {
      const res = await fetch(`${BASE_URL}/remove-from-selected/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        addToast(err.message ?? 'Failed to remove course', 'error');
        return;
      }
      setSelectedCourses(prev => prev.filter(c => c.id !== id));
      addToast(`"${course?.title}" removed from your selection`, 'info');
    } catch (err) { addToast('Network error: ' + err.message, 'error'); }
  };

  // 6. Confirm enrollment
  const handleEnroll = async () => {
    if (selectedCourses.length === 0) {
      addToast('Please select at least one course before confirming.', 'warning');
      return;
    }
    try {
      setConfirmLoading(true);
      const res = await fetch(`${BASE_URL}/confirm-enrollment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        const msg = result.Message ?? result.message ?? `Enrollment failed (${res.status})`;
        addToast(msg, 'error');
        return;
      }

      const enrolledIds = result.EnrolledCourses ?? result.enrolledCourses ?? [];
      const errors      = result.Errors          ?? result.errors          ?? [];

      if (enrolledIds.length > 0) {
        addToast(
          `Successfully enrolled in ${enrolledIds.length} course${enrolledIds.length > 1 ? 's' : ''}! 🎉`,
          'success'
        );
      }
      errors.forEach(e => addToast(e, 'warning'));

      await fetchEnrolledCourses();
      setSelectedCourses([]);
      setActiveTab('enrolled');
    } catch (err) {
      addToast('Network error: ' + err.message, 'error');
    } finally { setConfirmLoading(false); }
  };

  const filteredEnrolled = enrolledCourses.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.code?.toLowerCase().includes(search.toLowerCase())
  );

  const gpaLabel = (() => {
    const gpa = studentInfo?.gpa;
    if (!gpa || gpa === 0) return null;
    return gpa >= 2 ? `GPA ${gpa} ≥ 2 → 6 courses` : `GPA ${gpa} < 2 → 4 courses`;
  })();

  return (
    <div className="mx-auto max-w-7xl p-5 font-sans">
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}`}</style>

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="mb-1 text-[28px] font-[800] text-[#1e293b]">
            {studentInfo ? `Welcome, ${studentInfo.name}` : 'Pathify Courses'}
          </h1>
          <p className="text-sm text-[#64748b]">
            {studentInfo
              ? `Level ${studentInfo.level} · ${studentInfo.semester} · GPA: ${studentInfo.gpa} · Max ${maxCourses} courses`
              : 'Manage your academic journey with ease.'}
          </p>
        </div>
        <div className="flex rounded-[14px] bg-[#f1f5f9] p-1">
          {[
            { id: 'available', label: 'Available' },
            { id: 'selection', label: `Selected (${selectedCourses.length}/${maxCourses})` },
            { id: 'enrolled',  label: `Enrolled (${enrolledCourses.length})` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`rounded-[10px] px-5 py-2.5 text-[13px] font-[700] transition-all
                ${activeTab === tab.id ? 'bg-white text-[#3d6c8a] shadow-sm' : 'text-[#64748b] hover:text-[#3d6c8a]'}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Available Tab */}
      {activeTab === 'available' && (
        <>
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-[#64748b]">
              <Loader2 size={40} className="animate-spin text-[#3d6c8a]" />
              <p className="text-sm font-[600]">Loading available courses...</p>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="rounded-full bg-red-50 p-5 text-red-400"><AlertCircle size={40} /></div>
              <p className="text-sm font-[700] text-red-500">Failed to load courses</p>
              <p className="text-xs text-[#94a3b8]">{error}</p>
            </div>
          )}
          {!loading && !error && courses.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {courses.map(course => (
                <CourseCard key={course.id} course={course} mode="available"
                  enrolled={!!isEnrolled(course.id)} selected={!!isSelected(course.id)}
                  onToggle={toggleCourse} />
              ))}
            </div>
          )}
          {!loading && !error && courses.length === 0 && (
            <EmptyState icon={BookOpen} title="No courses available"
              desc="There are no available courses at this time."
              btnText="Refresh" onBtn={() => window.location.reload()} />
          )}
        </>
      )}

      {/* Selection Tab */}
      {activeTab === 'selection' && (
        selLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-[#64748b]">
            <Loader2 size={40} className="animate-spin text-[#3d6c8a]" />
            <p className="text-sm font-[600]">Loading selected courses...</p>
          </div>
        ) : selectedCourses.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="Your selection is empty"
            desc="Browse available courses and add them to your selection."
            btnText="Browse Courses" onBtn={() => setActiveTab('available')} />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-center gap-3 rounded-[16px] bg-[#f0f7ff] border border-[#bfdbfe] px-6 py-3">
              <span className="text-sm font-[700] text-[#1e40af]">
                {selectedCourses.length} / {maxCourses} courses · {totalSelectedCredits} credit hours
              </span>
              <span className="text-xs text-[#64748b]">
                {remainingSlots > 0
                  ? `${remainingSlots} slot${remainingSlots > 1 ? 's' : ''} remaining`
                  : '🔒 Selection full'}
                {gpaLabel && ` · ${gpaLabel}`}
              </span>
            </div>

            <div className="mx-auto w-full max-w-md h-2 rounded-full bg-[#e2e8f0] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#3d6c8a] transition-all duration-500"
                style={{ width: `${Math.min((selectedCourses.length / maxCourses) * 100, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {selectedCourses.map(course => (
                <CourseCard key={course.id} course={course} mode="selection"
                  enrolled={false} selected={true} onRemove={removeCourse} />
              ))}
            </div>

            <div className="mt-5 flex justify-center">
              <button
                onClick={handleEnroll}
                disabled={confirmLoading}
                className="flex items-center gap-2 rounded-[16px] bg-[#3d6c8a] px-14 py-4 text-base font-[700] text-white shadow-xl shadow-[#3d6c8a]/20 transition-transform hover:scale-105 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {confirmLoading && <Loader2 size={18} className="animate-spin" />}
                {confirmLoading ? 'Confirming...' : 'Confirm My Enrollment'}
              </button>
            </div>
          </div>
        )
      )}

      {/* Enrolled Tab */}
      {activeTab === 'enrolled' && (
        enrollLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-[#64748b]">
            <Loader2 size={40} className="animate-spin text-[#3d6c8a]" />
            <p className="text-sm font-[600]">Loading enrolled courses...</p>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <EmptyState icon={CheckCircle2} title="No enrolled courses"
            desc="You haven't confirmed any courses yet."
            btnText="Start Selecting" onBtn={() => setActiveTab('available')} />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: 'Total',   value: enrolledCourses.length,                                                color: '#3d6c8a' },
                { label: 'Passed',  value: enrolledCourses.filter(c => c.passed === PASS_STATUS.PASSED).length,   color: '#059669' },
                { label: 'Failed',  value: enrolledCourses.filter(c => c.passed === PASS_STATUS.FAILED).length,   color: '#ef4444' },
                { label: 'Pending', value: enrolledCourses.filter(c => c.passed === PASS_STATUS.PENDING).length,  color: '#64748b' },
              ].map(s => (
                <div key={s.label} className="rounded-[14px] bg-white border border-[#eef2f6] px-5 py-3 text-center shadow-sm min-w-[80px]">
                  <p style={{ color: s.color }} className="text-[22px] font-[800]">{s.value}</p>
                  <p className="text-[11px] font-[600] text-[#94a3b8] uppercase">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="relative mx-auto w-full max-w-[400px]">
              <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-[#94a3b8]" />
              <input type="text" placeholder="Filter your enrolled courses..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full rounded-[15px] border border-[#e2e8f0] bg-[#f8fafc] py-3.5 pr-5 pl-12 text-sm text-[#1e293b] outline-none focus:border-[#3d6c8a]" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredEnrolled.map(course => (
                <CourseCard key={course.id} course={course} mode="enrolled"
                  enrolled={true} selected={false} onToggle={() => {}} />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}