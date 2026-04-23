import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { updateCompletedLectures } from "../../../redux/slices/viewCourseSlice";
import { markLectureComplete } from "../../../services/paymentAPI";
import { createReview } from "../../../services/courseAPI";
import { BsFilePdf, BsDownload } from "react-icons/bs";

export default function VideoDetails() {
  const { courseId, sectionId, subSectionId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseSectionData, completedLectures } = useSelector((s) => s.viewCourse);

  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const playerRef = useRef(null);

  useEffect(() => {
    const section = courseSectionData.find((s) => s._id === sectionId);
    const sub = section?.subSection.find((s) => s._id === subSectionId);
    setCurrentVideo(sub || null);
    setLoading(false);
    // Scroll to top when lecture changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [courseSectionData, sectionId, subSectionId]);

  const handleVideoEnd = async () => {
    if (!completedLectures.includes(subSectionId)) {
      dispatch(updateCompletedLectures(subSectionId));
      await markLectureComplete(courseId, subSectionId, sectionId);
    }
    goNext();
  };

  const goNext = () => {
  for (let si = 0; si < courseSectionData.length; si++) {
    const section = courseSectionData[si];
    if (!section.subSection?.length) continue;
    for (let li = 0; li < section.subSection.length; li++) {
      if (section.subSection[li]._id === subSectionId) {
        // Next lecture in same section
        if (li < section.subSection.length - 1) {
          navigate(`/view-course/${courseId}/section/${section._id}/sub-section/${section.subSection[li + 1]._id}`);
          return;
        }
        // First lecture of next non-empty section
        for (let nsi = si + 1; nsi < courseSectionData.length; nsi++) {
          const next = courseSectionData[nsi];
          if (next?.subSection?.length > 0) {
            navigate(`/view-course/${courseId}/section/${next._id}/sub-section/${next.subSection[0]._id}`);
            return;
          }
        }
        // Already on the last lecture — do nothing
        return;
      }
    }
  }
};

  const goPrev = () => {
    for (let si = 0; si < courseSectionData.length; si++) {
      const section = courseSectionData[si];
      for (let li = 0; li < section.subSection.length; li++) {
        if (section.subSection[li]._id === subSectionId) {
          if (li > 0) {
            navigate(`/view-course/${courseId}/section/${section._id}/sub-section/${section.subSection[li - 1]._id}`);
          } else if (si > 0) {
            const prevSection = courseSectionData[si - 1];
            const last = prevSection.subSection[prevSection.subSection.length - 1];
            navigate(`/view-course/${courseId}/section/${prevSection._id}/sub-section/${last._id}`);
          }
          return;
        }
      }
    }
  };

  const handleReviewSubmit = async () => {
    if (rating === 0) return;
    await createReview(rating, review, courseId);
    setShowReview(false);
  };

  const handleMarkComplete = async () => {
    dispatch(updateCompletedLectures(subSectionId));
    await markLectureComplete(courseId, subSectionId, sectionId);
  };

  // PDF resources attached to this lecture
  const pdfResources = currentVideo?.resources?.filter((r) => r.type === "pdf") || [];

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <div className="w-8 h-8 border-4 border-richblack-600 border-t-richyellow-50 rounded-full animate-spin" />
    </div>
  );
  if (!currentVideo) return (
    <div className="flex justify-center items-center h-full text-richblack-400">
      Lecture not found.
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">

      {/* ── Video Player ───────────────────────────────────────────── */}
      <div className="rounded-xl overflow-hidden mb-4 bg-black">
        {currentVideo.videoUrl ? (
          <Player
            ref={playerRef}
            src={currentVideo.videoUrl}
            fluid
            onEnded={handleVideoEnd}
          />
        ) : (
          <div className="flex items-center justify-center h-48 text-richblack-400 text-sm">
            No video available for this lecture.
          </div>
        )}
      </div>

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={goPrev} className="btn-secondary text-sm">← Previous</button>
        <button onClick={goNext} className="btn-primary text-sm">Next →</button>
      </div>

      {/* ── Title & description ────────────────────────────────────── */}
      <h1 className="text-richblack-5 font-bold text-xl mb-2">{currentVideo.title}</h1>
      {currentVideo.description && (
        <p className="text-richblack-300 text-sm mb-5">{currentVideo.description}</p>
      )}

      {/* ── PDF Resources ──────────────────────────────────────────── */}
      {pdfResources.length > 0 && (
        <div className="mb-5">
          <h2 className="text-richblack-100 font-semibold text-sm mb-2">📎 Lecture Resources</h2>
          <div className="space-y-2">
            {pdfResources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noreferrer"
                download={`${resource.title || "lecture-notes"}.pdf`}
                className="flex items-center gap-3 bg-richblack-800 border border-richblack-700 hover:border-richyellow-50 rounded-lg px-4 py-3 transition-colors group"
              >
                <BsFilePdf className="text-red-400 flex-shrink-0" size={20} />
                <span className="text-richblack-200 text-sm flex-1 group-hover:text-richyellow-50 transition-colors">
                  {resource.title || "Lecture Notes"}
                </span>
                <BsDownload className="text-richblack-400 group-hover:text-richyellow-50 flex-shrink-0" size={16} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ── Mark complete & review ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 mb-5">
        {!completedLectures.includes(subSectionId) && (
          <button onClick={handleMarkComplete} className="btn-secondary text-sm">
            ✓ Mark as Complete
          </button>
        )}
        {completedLectures.includes(subSectionId) && (
          <span className="flex items-center gap-1.5 text-caribbeangreen-50 text-sm font-medium">
            ✓ Completed
          </span>
        )}
        <button onClick={() => setShowReview((p) => !p)} className="btn-secondary text-sm">
          ★ Rate This Course
        </button>
      </div>

      {/* ── Inline review form ─────────────────────────────────────── */}
      {showReview && (
        <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-5 max-w-lg">
          <h3 className="text-richblack-5 font-semibold mb-3">Rate this course</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition-colors ${star <= rating ? "text-richyellow-50" : "text-richblack-500"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={3}
            className="form-input mb-3"
            placeholder="Share your experience..."
          />
          <div className="flex gap-3">
            <button onClick={() => setShowReview(false)} className="btn-secondary text-sm">Cancel</button>
            <button onClick={handleReviewSubmit} disabled={rating === 0} className="btn-primary text-sm">Submit</button>
          </div>
        </div>
      )}
    </div>
  );
}
