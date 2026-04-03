import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { setStep, resetCourseState } from "../../../../redux/slices/courseSlice";
import { editCourse } from "../../../../services/courseAPI";

export default function PublishCourse() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { course } = useSelector((s) => s.course);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: { status: course?.status === "Published" },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    await dispatch(editCourse(course._id, { status: data.status ? "Published" : "Draft" }));
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
    setLoading(false);
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    await dispatch(editCourse(course._id, { status: "Draft" }));
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
    setLoading(false);
  };

  return (
    <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6">
      <h2 className="text-richblack-5 font-bold text-lg mb-2">Publish Your Course</h2>
      <p className="text-richblack-400 text-sm mb-6">
        Choose whether to publish your course now or save it as a draft.
      </p>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="flex items-center gap-3 cursor-pointer mb-6">
          <input type="checkbox" {...register("status")} className="w-4 h-4 accent-richyellow-50" />
          <span className="text-richblack-25 text-sm font-medium">Publish this course now</span>
        </label>

        <div className="flex gap-3 justify-between">
          <button type="button" onClick={() => dispatch(setStep(2))} className="btn-secondary text-sm">
            ← Back
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={handleSaveDraft} disabled={loading} className="btn-secondary text-sm">
              Save as Draft
            </button>
            <button type="submit" disabled={loading} className="btn-primary text-sm">
              {loading ? "Saving..." : "Publish Course"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
