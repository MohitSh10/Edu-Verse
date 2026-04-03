import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStep, setCourse } from "../../../../redux/slices/courseSlice";
import {
  createSection, updateSection, deleteSection,
  createSubSection, updateSubSection, deleteSubSection,
} from "../../../../services/courseAPI";
import { BsChevronDown, BsChevronUp, BsPlayCircle } from "react-icons/bs";
import { VscEdit } from "react-icons/vsc";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdOutlineAddCircleOutline } from "react-icons/md";

function SubSectionModal({ sectionId, onClose, onSave, existing }) {
  const [title, setTitle] = useState(existing?.title || "");
  const [desc, setDesc] = useState(existing?.description || "");
  const [videoUrl, setVideoUrl] = useState(existing?.videoUrl || "");
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const isEdit = !!existing;

  const buildFormData = () => {
    const fd = new FormData();
    if (isEdit) {
      fd.append("subSectionId", existing._id);
    } else {
      fd.append("sectionId", sectionId);
    }
    fd.append("title", title);
    fd.append("description", desc);
    if (videoFile) {
      fd.append("video", videoFile); // file takes priority on server
    } else if (videoUrl) {
      fd.append("videoUrl", videoUrl);
    }
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasVideo = videoFile || videoUrl;
    if (!title || (!isEdit && !hasVideo)) return;
    setLoading(true);
    const fd = buildFormData();
    if (isEdit) {
      const result = await updateSubSection(fd);
      if (result) { onSave(result, sectionId, true); onClose(); }
    } else {
      const result = await createSubSection(fd);
      if (result) { onSave(result, sectionId, false); onClose(); }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 w-full max-w-md mx-4">
        <h3 className="text-richblack-5 font-bold mb-4">{isEdit ? "Edit Lecture" : "Add Lecture"}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-richblack-300 mb-1.5">Lecture Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-input" placeholder="Introduction" required />
          </div>
          <div>
            <label className="block text-sm text-richblack-300 mb-1.5">Description</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} className="form-input" rows={2} />
          </div>
          <div>
            <label className="block text-sm text-richblack-300 mb-1.5">
              Upload Video {isEdit ? "(leave blank to keep existing)" : "*"}
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0] || null)}
              className="form-input cursor-pointer"
            />
            <p className="text-richblack-500 text-xs mt-1">— or paste a video URL —</p>
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="form-input mt-1"
              placeholder="https://youtube.com/... or https://example.com/video.mp4"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={onClose} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary text-sm">
              {loading ? "Saving..." : isEdit ? "Save Changes" : "Add Lecture"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CourseBuilder() {
  const dispatch = useDispatch();
  const { course } = useSelector((s) => s.course);
  const [sections, setSections] = useState(course?.courseContent || []);
  const [newSectionName, setNewSectionName] = useState("");
  const [addingSection, setAddingSection] = useState(false);
  const [openSections, setOpenSections] = useState({});
  // modal: { sectionId, existing? } — existing present means edit mode
  const [modal, setModal] = useState(null);

  const handleAddSection = async () => {
    if (!newSectionName.trim()) return;
    const updated = await createSection(newSectionName.trim(), course._id);
    if (updated?.courseContent) {
      setSections(updated.courseContent);
      dispatch(setCourse(updated));
    }
    setNewSectionName("");
    setAddingSection(false);
  };

  const handleDeleteSection = async (sectionId) => {
    const updated = await deleteSection(sectionId, course._id);
    if (updated?.courseContent) {
      setSections(updated.courseContent);
      dispatch(setCourse(updated));
    }
  };

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const updatedSection = await deleteSubSection(subSectionId, sectionId);
    if (updatedSection) {
      setSections((prev) =>
        prev.map((s) => s._id === sectionId ? { ...s, subSection: updatedSection.subSection } : s)
      );
    }
  };

  // Called after add or edit subsection
  const handleSubSectionSaved = (result, sectionId, isEdit) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s._id !== sectionId) return s;
        if (isEdit) {
          // result is the updated subSection document
          return { ...s, subSection: s.subSection.map((sub) => sub._id === result._id ? result : sub) };
        } else {
          // result is the updated section with all subSections populated
          return result;
        }
      })
    );
  };

  const toggleSection = (id) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6 space-y-5">
      <p className="text-richblack-300 text-sm">
        Build your course structure by adding sections and lectures.
      </p>

      {/* Section list */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section._id} className="border border-richblack-700 rounded-xl overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between px-4 py-3 bg-richblack-700">
              <button
                onClick={() => toggleSection(section._id)}
                className="flex items-center gap-2 text-richblack-25 font-medium text-sm flex-1 text-left"
              >
                {openSections[section._id] ? <BsChevronUp size={14} /> : <BsChevronDown size={14} />}
                {section.sectionName}
                <span className="text-richblack-400 text-xs font-normal">
                  ({section.subSection?.length || 0} lectures)
                </span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setModal({ sectionId: section._id })}
                  className="text-xs text-richyellow-50 hover:underline"
                >
                  + Add Lecture
                </button>
                <button onClick={() => handleDeleteSection(section._id)} className="text-richblack-400 hover:text-pink-100">
                  <RiDeleteBin6Line size={14} />
                </button>
              </div>
            </div>

            {/* Sub-sections */}
            {openSections[section._id] && (
              <div className="divide-y divide-richblack-700">
                {section.subSection?.length === 0 ? (
                  <p className="text-richblack-500 text-xs px-4 py-3">No lectures yet.</p>
                ) : (
                  section.subSection?.map((sub) => (
                    <div key={sub._id} className="flex items-center gap-3 px-4 py-2.5 bg-richblack-900">
                      <BsPlayCircle className="text-richblack-400 flex-shrink-0" size={14} />
                      <span className="text-richblack-300 text-sm flex-1">{sub.title}</span>
                      <button
                        onClick={() => setModal({ sectionId: section._id, existing: sub })}
                        className="text-richblack-400 hover:text-richyellow-50"
                      >
                        <VscEdit size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteSubSection(sub._id, section._id)}
                        className="text-richblack-400 hover:text-pink-100"
                      >
                        <RiDeleteBin6Line size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add section */}
      {addingSection ? (
        <div className="flex gap-2">
          <input
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSection()}
            className="form-input flex-1"
            placeholder="Section name..."
            autoFocus
          />
          <button onClick={handleAddSection} className="btn-primary text-sm">Add</button>
          <button onClick={() => setAddingSection(false)} className="btn-secondary text-sm">Cancel</button>
        </div>
      ) : (
        <button
          onClick={() => setAddingSection(true)}
          className="flex items-center gap-2 text-richyellow-50 text-sm hover:underline"
        >
          <MdOutlineAddCircleOutline size={18} /> Add Section
        </button>
      )}

      <div className="flex justify-between pt-2">
        <button onClick={() => dispatch(setStep(1))} className="btn-secondary text-sm">← Back</button>
        <button
          onClick={() => dispatch(setStep(3))}
          disabled={sections.length === 0}
          className="btn-primary text-sm"
        >
          Next →
        </button>
      </div>

      {modal && (
        <SubSectionModal
          sectionId={modal.sectionId}
          existing={modal.existing || null}
          onClose={() => setModal(null)}
          onSave={handleSubSectionSaved}
        />
      )}
    </div>
  );
}
