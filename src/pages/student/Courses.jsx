
import React, { useState, useEffect } from 'react';
import { ShoppingCart, CheckCircle2, Search, Cpu, Calculator, Building, PieChart, Ruler, MessageSquare, Settings, Info, Library, Users, Wallet, Scale, BookOpen, Loader2, AlertCircle } from 'lucide-react';

const FALLBACK = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop';

// Icon map for course departments
const DEPT_ICONS = {
  BIS: Settings,
  Accounting: Calculator,
  Management: Building,
  Economics: PieChart,
  Statistics: Ruler,
  Politics: Scale,
  default: BookOpen,
};

// Image map by department
const DEPT_IMAGES = {
  BIS: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
  Accounting: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
  Management: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
  Economics: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop',
  Statistics: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?q=80&w=800&auto=format&fit=crop',
  Politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=800&auto=format&fit=crop',
};

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
    id,
    code: id,
    title: name,
    desc: `${dept} · ${credits} Credit Hours · ${type}`,
    icon: DEPT_ICONS[dept] || DEPT_ICONS.default,
    image: DEPT_IMAGES[dept] || FALLBACK,
    creditHours: credits,
    courseType: type,
    departmentName: dept,
    hasPrerequisite: hasPrereq,
    preRequisite: prereq,
    source,
    courseLevel: level,
  };
}

const CourseCard = ({ course, enrolled, selected, onToggle, onRemove, mode }) => {
  const [hover, setHover] = useState(false);
  const isCurrentLevel = course.source === 'Current Level';

  let badgeBg = '#f1f5f9', badgeColor = '#475569', badgeText = course.code;
  if (enrolled) { badgeBg = '#d1fae5'; badgeColor = '#059669'; badgeText = 'Enrolled'; }
  else if (selected) { badgeBg = '#3d6c8a'; badgeColor = '#fff'; badgeText = 'Selected'; }
  else if (isCurrentLevel) { badgeBg = '#fef3c7'; badgeColor = '#d97706'; badgeText = course.code; }

  let btnBg = 'transparent', btnColor = '#3d6c8a', btnBorder = '#3d6c8a', btnText = 'Enroll Now';
  if (enrolled) { btnBg = '#f1f5f9'; btnColor = '#94a3b8'; btnBorder = '#f1f5f9'; btnText = 'Enrolled ✔'; }
  else if (selected) { btnBg = '#10b981'; btnColor = '#fff'; btnBorder = '#10b981'; btnText = 'Selected ✔'; }

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`
        flex flex-col overflow-hidden rounded-[20px] border bg-white transition-all duration-300
        ${hover ? '-translate-y-1.5 border-[#eef2f6] shadow-[0_12px_30px_rgba(61,108,138,0.12)]' : 'border-[#eef2f6] shadow-[0_2px_8px_rgba(0,0,0,0.02)]'}
      `}
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
          <span className="absolute top-3 right-3 rounded-[8px] bg-[#3d6c8a] px-2 py-1 text-[9px] font-[700] uppercase text-white shadow-sm">
            Current
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="min-h-[65px]">
          <h3 className="mb-1.5 text-[15px] font-[700] leading-tight text-[#1e293b]">{course.title}</h3>
          <p className="text-[12px] leading-relaxed text-[#64748b]">{course.desc}</p>
          {course.hasPrerequisite && (
            <p className="mt-1 text-[11px] text-[#f59e0b] font-[600]">
              Prerequisite: {course.preRequisite}
            </p>
          )}
        </div>

        {mode === 'selection' ? (
          <button
            onClick={() => onRemove(course.id)}
            className="w-full rounded-[12px] border border-[#fee2e2] bg-[#fff5f5] py-2.5 text-[11px] font-[700] text-[#ef4444] transition-colors hover:bg-red-100"
          >
            Remove from list
          </button>
        ) : (
          <button
            onClick={() => !enrolled && onToggle(course)}
            disabled={!!enrolled}
            style={{ backgroundColor: btnBg, color: btnColor, borderColor: btnBorder }}
            className={`w-full rounded-[12px] border-[1.5px] py-2.5 text-[11px] font-[700] uppercase transition-all ${enrolled ? 'cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
          >
            {btnText}
          </button>
        )}
      </div>
    </div>
  );
};

function EmptyState({ icon: Icon, title, desc, btnText, onBtn }) {
  return (
    <div className="my-5 flex flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-[#e2e8f0] bg-[#f8fafc] px-10 py-[60px] text-center gap-3">
      <div className="rounded-full bg-white p-5 shadow-sm text-[#3d6c8a]">
        <Icon size={40} />
      </div>
      <h2 className="text-lg font-[700] text-[#1e293b]">{title}</h2>
      <p className="max-w-[300px] text-[13px] text-[#94a3b8]">{desc}</p>
      <button
        onClick={onBtn}
        className="mt-2.5 rounded-[12px] bg-[#3d6c8a] px-8 py-3 text-[13px] font-[700] text-white shadow-lg shadow-[#3d6c8a]/30 transition-transform hover:scale-105 active:scale-95"
      >
        {btnText}
      </button>
    </div>
  );
}

export default function StudentCourses() {
  const [activeTab, setActiveTab] = useState('available');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [search, setSearch] = useState('');

  // API state
  const [courses, setCourses] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('userToken');
        const response = await fetch('https://localhost:7061/api/CourseEnrollment/available-courses', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data = await response.json();
        console.log('API Response:', data);

        setStudentInfo({
          name: data.studentName ?? data.StudentName,
          level: data.currentLevel ?? data.CurrentLevel,
          semester: data.currentSemester ?? data.CurrentSemester,
          gpa: data.gpa ?? data.GPA,
          maxCourses: data.maxCoursesAllowed ?? data.MaxCoursesAllowed,
        });

        const list = data.availableCourses ?? data.AvailableCourses ?? [];
        setCourses(list.map(mapApiCourse));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const isEnrolled = (id) => enrolledCourses.find(c => c.id === id);
  const isSelected = (id) => selectedCourses.find(c => c.id === id);
  const maxCourses = studentInfo?.maxCourses || 6;
  const totalSelectedCredits = selectedCourses.reduce((sum, c) => sum + (c.creditHours || 3), 0);

  const toggleCourse = (course) => {
    if (isEnrolled(course.id)) return;
    if (isSelected(course.id)) {
      setSelectedCourses(selectedCourses.filter(c => c.id !== course.id));
    } else {
      if (selectedCourses.length >= maxCourses) {
        alert(`You can select a maximum of ${maxCourses} courses.`);
        return;
      }
      setSelectedCourses([...selectedCourses, course]);
    }
  };

  const removeCourse = (id) => setSelectedCourses(selectedCourses.filter(c => c.id !== id));

  const handleEnroll = () => {
    setEnrolledCourses([...enrolledCourses, ...selectedCourses]);
    setSelectedCourses([]);
    setActiveTab('enrolled');
  };

  const filteredEnrolled = enrolledCourses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl p-5 font-sans">
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
        <div>
          <h1 className="mb-1 text-[28px] font-[800] text-[#1e293b]">
            {studentInfo ? `Welcome, ${studentInfo.name}` : 'Pathify Courses'}
          </h1>
          <p className="text-sm text-[#64748b]">
            {studentInfo
              ? `Level ${studentInfo.level} · ${studentInfo.semester} · GPA: ${studentInfo.gpa} · Max ${studentInfo.maxCourses} courses`
              : 'Manage your academic journey with ease.'}
          </p>
        </div>

        <div className="flex rounded-[14px] bg-[#f1f5f9] p-1">
          {[
            { id: 'available', label: 'Available' },
            { id: 'selection', label: `Selected (${selectedCourses.length})` },
            { id: 'enrolled', label: 'Enrolled' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                rounded-[10px] px-5 py-2.5 text-[13px] font-[700] transition-all
                ${activeTab === tab.id ? 'bg-white text-[#3d6c8a] shadow-sm' : 'text-[#64748b] hover:text-[#3d6c8a]'}
              `}
            >
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
              <div className="rounded-full bg-red-50 p-5 text-red-400">
                <AlertCircle size={40} />
              </div>
              <p className="text-sm font-[700] text-red-500">Failed to load courses</p>
              <p className="text-xs text-[#94a3b8]">{error}</p>
            </div>
          )}

          {!loading && !error && courses.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {courses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  mode="available"
                  enrolled={!!isEnrolled(course.id)}
                  selected={!!isSelected(course.id)}
                  onToggle={toggleCourse}
                />
              ))}
            </div>
          )}

          {!loading && !error && courses.length === 0 && (
            <EmptyState
              icon={BookOpen}
              title="No courses available"
              desc="There are no available courses at this time."
              btnText="Refresh"
              onBtn={() => window.location.reload()}
            />
          )}
        </>
      )}

      {/* Selection Tab */}
      {activeTab === 'selection' && (
        selectedCourses.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Your selection is empty"
            desc="Browse available courses and add them to your selection."
            btnText="Browse Courses"
            onBtn={() => setActiveTab('available')}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {/* Credit hours summary */}
            <div className="flex items-center justify-center gap-3 rounded-[16px] bg-[#f0f7ff] border border-[#bfdbfe] px-6 py-3">
              <span className="text-sm font-[700] text-[#1e40af]">
                {selectedCourses.length} courses selected · {totalSelectedCredits} credit hours
              </span>
              <span className="text-xs text-[#64748b]">
                (Max {maxCourses} courses allowed)
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {selectedCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  mode="selection"
                  enrolled={false}
                  selected={true}
                  onRemove={removeCourse}
                />
              ))}
            </div>

            <div className="mt-5 flex justify-center">
              <button
                onClick={handleEnroll}
                className="rounded-[16px] bg-[#3d6c8a] px-14 py-4 text-base font-[700] text-white shadow-xl shadow-[#3d6c8a]/20 transition-transform hover:scale-105 active:scale-95"
              >
                Confirm My Enrollment
              </button>
            </div>
          </div>
        )
      )}

      {/* Enrolled Tab */}
      {activeTab === 'enrolled' && (
        enrolledCourses.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No enrolled courses"
            desc="You haven't confirmed any courses yet."
            btnText="Start Selecting"
            onBtn={() => setActiveTab('available')}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="relative mx-auto mb-2.5 w-full max-w-[400px]">
              <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Filter your enrolled courses..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-[15px] border border-[#e2e8f0] bg-[#f8fafc] py-3.5 pr-5 pl-12 text-sm text-[#1e293b] outline-none focus:border-[#3d6c8a]"
              />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredEnrolled.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  mode="enrolled"
                  enrolled={true}
                  selected={false}
                  onToggle={() => {}}
                />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}