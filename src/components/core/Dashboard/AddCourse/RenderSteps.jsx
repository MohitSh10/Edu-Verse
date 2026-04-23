import { useSelector } from "react-redux";
import { FiCheck } from "react-icons/fi";

const STEPS = [
  { id: 1, title: "Course Info" },
  { id: 2, title: "Course Builder" },
  { id: 3, title: "Publish" },
];

export default function RenderSteps() {
  const { step } = useSelector((s) => s.course);

  return (
    <div className="flex items-center gap-0 mb-2">
      {STEPS.map((s, i) => (
        <div key={s.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
              ${step > s.id
                ? "bg-richyellow-50 border-richyellow-50 text-richblack-900"
                : step === s.id
                  ? "border-richyellow-50 text-richyellow-50"
                  : "border-richblack-600 text-richblack-500"
              }`}
            >
              {step > s.id ? <FiCheck size={16} /> : s.id}
            </div>
            <p className={`text-xs mt-1.5 whitespace-nowrap ${
              step >= s.id ? "text-richblack-25" : "text-richblack-500"
            }`}>
              {s.title}
            </p>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > s.id ? "bg-richyellow-50" : "bg-richblack-600"}`} />
          )}
        </div>
      ))}
    </div>
  );
}
