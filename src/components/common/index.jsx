// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = "md" }) {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className="flex justify-center items-center">
      <div className={`${sizes[size]} border-4 border-richblack-600 border-t-richyellow-50 rounded-full animate-spin`} />
    </div>
  );
}

// ─── IconButton ───────────────────────────────────────────────────────────────
export function IconButton({ text, onClick, children, type = "button", disabled = false, outline = false, customClasses = "" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all
        ${outline
          ? "border border-richblack-600 text-richblack-25 hover:bg-richblack-700"
          : "bg-richyellow-50 text-richblack-900 hover:bg-richyellow-100"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "active:scale-[0.98]"}
        ${customClasses}`}
    >
      {children}
      {text}
    </button>
  );
}

// ─── ConfirmationModal ────────────────────────────────────────────────────────
export function ConfirmationModal({ modalData }) {
  if (!modalData) return null;
  const { text1, text2, btn1Text, btn2Text, btn1Handler, btn2Handler } = modalData;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-card">
        <h3 className="text-richblack-5 font-bold text-xl mb-2">{text1}</h3>
        <p className="text-richblack-300 text-sm mb-6">{text2}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={btn2Handler}
            className="btn-secondary text-sm"
          >
            {btn2Text}
          </button>
          <button
            onClick={btn1Handler}
            className="bg-pink-100 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-50 transition-colors"
          >
            {btn1Text}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── RatingStars ──────────────────────────────────────────────────────────────
export function RatingStars({ review_count, Star_Size = 14 }) {
  const stars = [];
  const fullStars = Math.floor(review_count);
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= fullStars ? "#E7C009" : "#6E727F", fontSize: Star_Size }}>
        ★
      </span>
    );
  }
  return <div className="flex">{stars}</div>;
}

// ─── Tab ─────────────────────────────────────────────────────────────────────
export function Tab({ tabData, field, setField }) {
  return (
    <div className="flex rounded-full bg-richblack-800 p-1 gap-1">
      {tabData.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setField(tab.type)}
          className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
            field === tab.type
              ? "bg-richblack-900 text-richblack-5 shadow"
              : "text-richblack-400 hover:text-richblack-100"
          }`}
        >
          {tab.tabName}
        </button>
      ))}
    </div>
  );
}
