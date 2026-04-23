import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { setStep, setCourse } from "../../../../redux/slices/courseSlice";
import { createCourse, editCourse, fetchCategories } from "../../../../services/courseAPI";
import { useTheme } from "../../../../context/ThemeContext";

const LEVELS = ["Beginner", "Intermediate", "Advanced", "All Levels"];

export default function CourseForm() {
  const dispatch = useDispatch();
  const { course, editCourse: isEdit } = useSelector((s) => s.course);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(course?.category?._id || "");
  const [tags, setTags] = useState(course?.tag || []);
  const [tagInput, setTagInput] = useState("");
  const [instructions, setInstructions] = useState(course?.instructions || []);
  const [instructionInput, setInstructionInput] = useState("");
  const [requirements, setRequirements] = useState(course?.requirements || []);
  const [requirementInput, setRequirementInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Theme-aware select style
  const selectStyle = {
    background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
    color: isLight ? "#0d1f30" : "#e8f4fd",
    border: `1px solid ${isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.1)"}`,
  };

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      courseName: course?.courseName || "",
      description: course?.description || "",
      price: course?.price ?? "",
      level: course?.level || "All Levels",
      language: course?.language || "English",
      whatYouWillLearn: course?.whatYouWillLearn || "",
      thumbnail: course?.thumbnail || "",
    },
  });

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const addInstruction = (e) => {
    if (e.key === "Enter" && instructionInput.trim()) {
      e.preventDefault();
      setInstructions([...instructions, instructionInput.trim()]);
      setInstructionInput("");
    }
  };
  const removeInstruction = (i) => setInstructions(instructions.filter((_, idx) => idx !== i));

  const addRequirement = (e) => {
    if (e.key === "Enter" && requirementInput.trim()) {
      e.preventDefault();
      setRequirements([...requirements, requirementInput.trim()]);
      setRequirementInput("");
    }
  };
  const removeRequirement = (i) => setRequirements(requirements.filter((_, idx) => idx !== i));

  const onSubmit = async (data) => {
    setLoading(true);
    const fd = new FormData();
    // text fields (never append thumbnail as text — it's a file field)
    ["courseName", "description", "price", "level", "language", "whatYouWillLearn"].forEach(
      (k) => fd.append(k, data[k] ?? "")
    );
    fd.append("category", category);
    fd.append("tag", JSON.stringify(tags));
    fd.append("instructions", JSON.stringify(instructions));
    fd.append("requirements", JSON.stringify(requirements));
    // File takes priority; fall back to URL string
    if (data.thumbnailFile?.[0]) {
      fd.append("thumbnail", data.thumbnailFile[0]); // multer field name = "thumbnail"
    } else if (data.thumbnailUrl?.trim()) {
      fd.append("thumbnail", data.thumbnailUrl.trim());
    }

    let result;
    if (isEdit && course?._id) {
      result = await dispatch(editCourse(course._id, fd));
    } else {
      result = await dispatch(createCourse(fd));
    }
    if (result) dispatch(setStep(2));
    setLoading(false);
  };

  const inputCls = "form-input";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 space-y-5">
      <div>
        <label className="block text-sm text-richblack-300 mb-1.5">Course Title *</label>
        <input {...register("courseName", { required: "Title is required" })} className={inputCls} placeholder="e.g. Complete React Developer 2024" />
        {errors.courseName && <p className="text-pink-100 text-xs mt-1">{errors.courseName.message}</p>}
      </div>

      <div>
        <label className="block text-sm text-richblack-300 mb-1.5">Description *</label>
        <textarea {...register("description", { required: "Description is required" })} rows={4} className={inputCls} placeholder="What is this course about?" />
        {errors.description && <p className="text-pink-100 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-richblack-300 mb-1.5">Price (₹) *</label>
          <input type="number" min="0" {...register("price", { required: true })} className={inputCls} placeholder="0 = Free" />
        </div>
        <div>
          <label className="block text-sm text-richblack-300 mb-1.5">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className={inputCls}
            style={selectStyle}
          >
            <option value="">Select category</option>
            {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-richblack-300 mb-1.5">Level</label>
          <select {...register("level")} className={inputCls} style={selectStyle}>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-richblack-300 mb-1.5">Language</label>
          <input {...register("language")} className={inputCls} placeholder="English" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-richblack-300 mb-1.5">What Will Students Learn?</label>
        <textarea {...register("whatYouWillLearn")} rows={3} className={inputCls} placeholder="List the key outcomes..." />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm text-richblack-300 mb-1.5">Tags (press Enter to add)</label>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          className={inputCls}
          placeholder="e.g. React, JavaScript"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((t) => (
            <span key={t} className="flex items-center gap-1 bg-richblack-700 text-richblack-100 text-xs px-2.5 py-1 rounded-full">
              {t}
              <button type="button" onClick={() => removeTag(t)} className="hover:text-pink-100">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm text-richblack-300 mb-1.5">Instructions (press Enter to add)</label>
        <input
          value={instructionInput}
          onChange={(e) => setInstructionInput(e.target.value)}
          onKeyDown={addInstruction}
          className={inputCls}
          placeholder="e.g. Install Node.js before starting"
        />
        <ul className="mt-2 space-y-1">
          {instructions.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-richblack-300 text-sm">
              <span className="flex-1">• {item}</span>
              <button type="button" onClick={() => removeInstruction(idx)} className="hover:text-pink-100 text-xs">×</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Requirements */}
      <div>
        <label className="block text-sm text-richblack-300 mb-1.5">Requirements (press Enter to add)</label>
        <input
          value={requirementInput}
          onChange={(e) => setRequirementInput(e.target.value)}
          onKeyDown={addRequirement}
          className={inputCls}
          placeholder="e.g. Basic knowledge of HTML"
        />
        <ul className="mt-2 space-y-1">
          {requirements.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 text-richblack-300 text-sm">
              <span className="flex-1">• {item}</span>
              <button type="button" onClick={() => removeRequirement(idx)} className="hover:text-pink-100 text-xs">×</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-sm text-richblack-300 mb-1.5">Course Thumbnail (Image)</label>
        <input
          type="file"
          accept="image/*"
          {...register("thumbnailFile")}
          className="form-input cursor-pointer"
        />
        <p className="text-richblack-500 text-xs mt-1">— or paste an image URL instead —</p>
        <input {...register("thumbnailUrl")} className={inputCls} placeholder="https://example.com/image.jpg" />
        {course?.thumbnail && (
          <img src={course.thumbnail} alt="thumbnail" className="mt-2 h-20 w-auto rounded-lg object-cover" />
        )}
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving..." : isEdit ? "Save & Next" : "Create & Next"}
        </button>
      </div>
    </form>
  );
}
