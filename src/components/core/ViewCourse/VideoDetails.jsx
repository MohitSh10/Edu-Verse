import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { updateCompletedLectures } from "../../../redux/slices/viewCourseSlice";
import { markLectureComplete } from "../../../services/paymentAPI";
import { createReview } from "../../../services/courseAPI";

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
  }, [courseSectionData, sectionId, subSectionId]);

  const handleVideoEnd = async () => {
    if (!completedLectures.includes(subSectionId)) {
      dispatch(updateCompletedLectures(subSectionId));
      await markLectureComplete(courseId, subSectionId, sectionId);
    }
    // Auto-navigate to next lecture
    goNext();
  };

  const goNext = () => {
    for (let si = 0; si < courseSectionData.length; si++) {
      const section = courseSectionData[si];
      for (let li = 0; li < section.subSection.length; li++) {
        if (section.subSection[li]._id === subSectionId) {
          if (li < section.subSection.length - 1) {
            navigate(`/view-course/${courseId}/section/${section._id}/sub-section/${section.subSection[li + 1]._id}`);
          } else if (si < courseSectionData.length - 1) {
            const nextSection = courseSectionData[si + 1];
            navigate(`/view-course/${courseId}/section/${nextSection._id}/sub-section/${nextSection.subSection[0]._id}`);
          }
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

  if (loading) return <div className="flex justify-center items-center h-full"><div className="w-8 h-8 border-4 border-richblack-600 border-t-richyellow-50 rounded-full animate-spin" /></div>;
  if (!currentVideo) return <div className="flex justify-center items-center h-full text-richblack-400">Lecture not found.</div>;

  return (
    <div className="p-4 md:p-6">
      {/* Video Player */}
      <div className="rounded-xl overflow-hidden mb-4">
        <Player
          ref={playerRef}
          src={currentVideo.videoUrl}
          fluid
          onEnded={handleVideoEnd}
        />
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={goPrev} className="btn-secondary text-sm">← Previous</button>
        <button onClick={goNext} className="btn-primary text-sm">Next →</button>
      </div>

      {/* Title & description */}
      <h1 className="text-richblack-5 font-bold text-xl mb-2">{currentVideo.title}</h1>
      {currentVideo.description && (
        <p className="text-richblack-300 text-sm mb-5">{currentVideo.description}</p>
      )}

      {/* Mark complete & review */}
      <div className="flex flex-wrap gap-3 mb-5">
        {!completedLectures.includes(subSectionId) && (
          <button
            onClick={async () => {
              dispatch(updateCompletedLectures(subSectionId));
              await markLectureComplete(courseId, subSectionId, sectionId);
            }}
            className="btn-secondary text-sm"
          >
            ✓ Mark as Complete
          </button>
        )}
        <button onClick={() => setShowReview((p) => !p)} className="btn-secondary text-sm">
          ★ Rate This Course
        </button>
      </div>

      {/* Inline review form */}
      {showReview && (
        <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-5 max-w-lg">
          <h3 className="text-richblack-5 font-semibold mb-3">Rate this course</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className={`text-2xl ${star <= rating ? "text-richyellow-50" : "text-richblack-500"}`}>
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
