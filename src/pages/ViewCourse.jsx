import { useEffect, useState } from "react";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsChevronDown, BsChevronUp, BsPlayCircleFill, BsCheckCircleFill } from "react-icons/bs";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { fetchCourseDetails } from "../services/courseAPI";
import {
  setCourseSectionData, setCourseEntireData,
  setCompletedLectures, setTotalNoOfLectures,
} from "../redux/slices/viewCourseSlice";

export default function ViewCourse() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseSectionData, courseEntireData, completedLectures } = useSelector((s) => s.viewCourse);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    fetchCourseDetails(courseId).then((data) => {
      if (!data?.data) return;
      dispatch(setCourseEntireData(data.data));
      dispatch(setCourseSectionData(data.data.courseContent || []));
      const total = data.data.courseContent?.reduce((a, s) => a + s.subSection.length, 0) || 0;
      dispatch(setTotalNoOfLectures(total));
      // Open first section by default
      if (data.data.courseContent?.[0]) {
        setOpenSections({ [data.data.courseContent[0]._id]: true });
      }
    });
  }, [courseId, dispatch]);

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Sidebar toggle (mobile) */}
      <button
        onClick={() => setSidebarOpen((p) => !p)}
        className="fixed bottom-4 left-4 z-50 md:hidden bg-richyellow-50 text-richblack-900 p-2.5 rounded-full shadow-lg"
      >
        {sidebarOpen ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </button>

      {/* Course Sidebar */}
      <aside className={`
        ${sidebarOpen ? "w-72" : "w-0"}
        flex-shrink-0 bg-richblack-800 border-r border-richblack-700
        overflow-y-auto transition-all duration-300
        absolute md:relative z-40 h-full md:h-auto
      `}>
        {sidebarOpen && (
          <div className="p-4">
            {/* Course title */}
            <h2 className="text-richblack-5 font-bold text-sm mb-1 line-clamp-2">
              {courseEntireData?.courseName}
            </h2>
            <p className="text-richblack-400 text-xs mb-4">
              {completedLectures.length} / {courseSectionData.reduce((a, s) => a + s.subSection.length, 0)} completed
            </p>

            {/* Progress bar */}
            <div className="w-full bg-richblack-700 rounded-full h-1.5 mb-5">
              <div
                className="bg-richyellow-50 h-1.5 rounded-full transition-all"
                style={{
                  width: `${courseSectionData.reduce((a, s) => a + s.subSection.length, 0) > 0
                    ? (completedLectures.length / courseSectionData.reduce((a, s) => a + s.subSection.length, 0)) * 100
                    : 0}%`
                }}
              />
            </div>

            {/* Sections */}
            {courseSectionData.map((section) => (
              <div key={section._id} className="mb-2">
                <button
                  onClick={() => toggleSection(section._id)}
                  className="w-full flex items-center justify-between py-2 text-richblack-25 text-xs font-semibold"
                >
                  <span className="text-left">{section.sectionName}</span>
                  {openSections[section._id] ? <BsChevronUp size={12} /> : <BsChevronDown size={12} />}
                </button>
                {openSections[section._id] && (
                  <div className="space-y-0.5 mt-1">
                    {section.subSection.map((sub) => {
                      const isDone = completedLectures.includes(sub._id);
                      return (
                        <button
                          key={sub._id}
                          onClick={() =>
                            navigate(`/view-course/${courseId}/section/${section._id}/sub-section/${sub._id}`)
                          }
                          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left hover:bg-richblack-700 transition-colors"
                        >
                          {isDone
                            ? <BsCheckCircleFill size={14} className="text-caribbeangreen-50 flex-shrink-0" />
                            : <BsPlayCircleFill size={14} className="text-richblack-500 flex-shrink-0" />
                          }
                          <span className={`text-xs line-clamp-1 ${isDone ? "text-caribbeangreen-25" : "text-richblack-300"}`}>
                            {sub.title}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto" onClick={() => { if (sidebarOpen && window.innerWidth < 768) setSidebarOpen(false); }}>
        <Outlet />
      </main>
    </div>
  );
}
