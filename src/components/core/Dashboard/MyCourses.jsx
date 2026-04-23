import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VscEdit } from "react-icons/vsc";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdPublish } from "react-icons/md";
import { fetchInstructorCourses, deleteCourse, publishCourse } from "../../../services/courseAPI";
import { ConfirmationModal, Spinner } from "../../common/index";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(null);
  const navigate = useNavigate();

  const loadCourses = () => {
    setLoading(true);
    fetchInstructorCourses().then((data) => { setCourses(data || []); setLoading(false); });
  };

  useEffect(() => { loadCourses(); }, []);

  const handleDelete = (courseId, name) => {
    setConfirmModal({
      text1: `Delete "${name}"?`,
      text2: "This will permanently remove the course and unenroll all students.",
      btn1Text: "Delete",
      btn2Text: "Cancel",
      btn1Handler: async () => {
        await deleteCourse(courseId);
        setConfirmModal(null);
        loadCourses();
      },
      btn2Handler: () => setConfirmModal(null),
    });
  };

  const handlePublish = async (courseId) => {
    const result = await publishCourse(courseId);
    if (result) loadCourses();
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-richblack-5">My Courses</h1>
        <Link to="/dashboard/add-course" className="btn-primary text-sm">+ Add Course</Link>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-richblack-400 mb-4">You haven't created any courses yet.</p>
          <Link to="/dashboard/add-course" className="btn-primary">Create Your First Course</Link>
        </div>
      ) : (
        <div className="bg-richblack-800 border border-richblack-700 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-richblack-400 text-xs border-b border-richblack-700">
                <th className="text-left px-5 py-3">Course</th>
                <th className="text-right px-5 py-3">Price</th>
                <th className="text-right px-5 py-3">Students</th>
                <th className="text-right px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-richblack-700">
              {courses.map((course) => (
                <tr key={course._id} className="hover:bg-richblack-700 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=60"}
                        alt=""
                        className="w-14 h-10 object-cover rounded"
                        onError={e => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&q=60"; }}
                      />
                      <div>
                        <p className="text-richblack-25 font-medium">{course.courseName}</p>
                        <p className="text-richblack-500 text-xs">{course.category?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right text-richblack-300">
                    {course.price === 0 ? "Free" : `₹${course.price}`}
                  </td>
                  <td className="px-5 py-3 text-right text-richblack-300">
                    {course.studentsEnrolled?.length}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      course.status === "Published"
                        ? "bg-caribbeangreen-500/20 text-caribbeangreen-50"
                        : "bg-richblack-700 text-richblack-400"
                    }`}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {course.status === "Draft" && (
                        <button
                          onClick={() => handlePublish(course._id)}
                          className="p-1.5 text-richblack-400 hover:text-caribbeangreen-50 transition-colors"
                          title="Publish"
                        >
                          <MdPublish size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => navigate(`/dashboard/edit-course/${course._id}`)}
                        className="p-1.5 text-richblack-400 hover:text-richyellow-50 transition-colors"
                        title="Edit"
                      >
                        <VscEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(course._id, course.courseName)}
                        className="p-1.5 text-richblack-400 hover:text-pink-100 transition-colors"
                        title="Delete"
                      >
                        <RiDeleteBin6Line size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmationModal modalData={confirmModal} />
    </div>
  );
}
