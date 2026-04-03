import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { resetCourseState, setEditCourse, setCourse } from "../../../redux/slices/courseSlice";
import { fetchCourseDetails } from "../../../services/courseAPI";
import CourseForm from "./AddCourse/CourseForm";
import CourseBuilder from "./AddCourse/CourseBuilder";
import PublishCourse from "./AddCourse/PublishCourse";
import RenderSteps from "./AddCourse/RenderSteps";

export function AddCourse() {
  const { step } = useSelector((s) => s.course);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetCourseState());
    dispatch(setEditCourse(false));
  }, [dispatch]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-richblack-5 mb-6">Add New Course</h1>
      <div className="max-w-3xl">
        <RenderSteps />
        <div className="mt-6">
          {step === 1 && <CourseForm />}
          {step === 2 && <CourseBuilder />}
          {step === 3 && <PublishCourse />}
        </div>
      </div>
    </div>
  );
}

export function EditCourse() {
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { step, course } = useSelector((s) => s.course);

  useEffect(() => {
    // Reset first so stale course/step from a previous session don't bleed in
    dispatch(resetCourseState());
    dispatch(setEditCourse(true));
    fetchCourseDetails(courseId).then((data) => {
      if (data?.data) dispatch(setCourse(data.data));
    });
    return () => dispatch(resetCourseState());
  }, [courseId, dispatch]);

  if (!course) return <div className="text-richblack-400 py-8">Loading course...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-richblack-5 mb-6">Edit Course</h1>
      <div className="max-w-3xl">
        <RenderSteps />
        <div className="mt-6">
          {step === 1 && <CourseForm />}
          {step === 2 && <CourseBuilder />}
          {step === 3 && <PublishCourse />}
        </div>
      </div>
    </div>
  );
}

export default AddCourse;
