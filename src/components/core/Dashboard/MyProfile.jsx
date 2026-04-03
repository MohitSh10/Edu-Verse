import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { VscEdit } from "react-icons/vsc";
import {
  HiOutlineBookOpen, HiOutlineLightningBolt, HiOutlineStar,
  HiOutlineAcademicCap, HiOutlineChartBar,
} from "react-icons/hi";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

function Field({ label, value }) {
  return (
    <div>
      <p className="text-richblack-400 text-xs mb-1 uppercase tracking-wide">{label}</p>
      <p className="text-richblack-25 text-sm font-medium">{value || "Not provided"}</p>
    </div>
  );
}

function StatBadge({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-richblack-700 rounded-xl p-4 flex items-center gap-3 border border-richblack-600">
      <div className={`p-2 rounded-lg bg-richblack-800 ${color}`}><Icon size={20} /></div>
      <div>
        <p className="text-richblack-5 font-bold text-lg leading-none">{value}</p>
        <p className="text-richblack-400 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function MyProfile() {
  const { user } = useSelector((s) => s.profile);
  const profile = user?.additionalDetails;
  const isInstructor = user?.accountType === "Instructor";
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "Recently";

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header Hero Card */}
      <div className="relative bg-gradient-to-br from-richblack-800 to-richblack-900 border border-richblack-700 rounded-2xl overflow-hidden">
        <div className={`h-1.5 w-full ${isInstructor
          ? "bg-gradient-to-r from-blue-100 via-caribbeangreen-50 to-richyellow-50"
          : "bg-gradient-to-r from-richyellow-50 via-pink-100 to-blue-100"}`} />
        <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={user?.image} alt={user?.firstName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-richblack-600 shadow-lg" />
              <span className={`absolute -bottom-1 -right-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
                isInstructor
                  ? "bg-blue-100/20 border-blue-100/40 text-blue-100"
                  : "bg-richyellow-50/20 border-richyellow-50/40 text-richyellow-50"}`}>
                {isInstructor ? "✦ Instructor" : "✧ Student"}
              </span>
            </div>
            <div>
              <h1 className="text-richblack-5 font-bold text-xl">{user?.firstName} {user?.lastName}</h1>
              <p className="text-richblack-400 text-sm">{user?.email}</p>
              <p className="text-richblack-500 text-xs mt-1">Member since {joinDate}</p>
            </div>
          </div>
          <Link to="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-richblack-700 hover:bg-richblack-600 text-richblack-25 text-sm transition-colors border border-richblack-600">
            <VscEdit size={15} /> Edit Profile
          </Link>
        </div>
        <div className="px-6 pb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {isInstructor ? (
            <>
              <StatBadge icon={HiOutlineBookOpen} label="Courses Created" value="—" color="text-blue-100" />
              <StatBadge icon={HiOutlineAcademicCap} label="Total Students" value="—" color="text-caribbeangreen-50" />
              <StatBadge icon={HiOutlineStar} label="Avg Rating" value="—" color="text-richyellow-50" />
              <StatBadge icon={HiOutlineChartBar} label="Total Revenue" value="—" color="text-pink-100" />
            </>
          ) : (
            <>
              <StatBadge icon={HiOutlineBookOpen} label="Enrolled" value="—" color="text-richyellow-50" />
              <StatBadge icon={HiOutlineLightningBolt} label="In Progress" value="—" color="text-blue-100" />
              <StatBadge icon={HiOutlineStar} label="Completed" value="—" color="text-caribbeangreen-50" />
              <StatBadge icon={HiOutlineAcademicCap} label="Certificates" value="—" color="text-pink-100" />
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* About */}
        <div className="lg:col-span-2 bg-richblack-800 border border-richblack-700 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-richblack-5 font-semibold text-base">About Me</h2>
            <Link to="/dashboard/settings" className="text-richyellow-50 text-xs hover:underline">Edit</Link>
          </div>
          <p className="text-richblack-300 text-sm leading-relaxed">
            {profile?.about || (
              <span className="text-richblack-500 italic">
                No bio added yet. Share your background, goals, or what you're passionate about!
              </span>
            )}
          </p>
          <div className="mt-5 pt-5 border-t border-richblack-700 flex gap-3 items-center">
            <span className="text-richblack-400 text-xs">Connect:</span>
            {[FaLinkedin, FaTwitter, FaGithub].map((Icon, i) => (
              <button key={i} className="p-2 rounded-lg bg-richblack-700 text-richblack-400 hover:text-richblack-25 hover:bg-richblack-600 transition-colors">
                <Icon size={15} />
              </button>
            ))}
            <span className="text-richblack-600 text-xs ml-auto italic">Add in settings</span>
          </div>
        </div>

        {/* Role CTA */}
        <div className={`rounded-2xl p-6 border flex flex-col justify-between ${
          isInstructor
            ? "bg-gradient-to-br from-blue-100/10 to-richblack-800 border-blue-100/20"
            : "bg-gradient-to-br from-richyellow-50/10 to-richblack-800 border-richyellow-50/20"}`}>
          <div>
            <div className={`inline-flex items-center gap-2 text-sm font-semibold mb-3 ${isInstructor ? "text-blue-100" : "text-richyellow-50"}`}>
              <HiOutlineAcademicCap size={18} />
              {isInstructor ? "Instructor Account" : "Student Account"}
            </div>
            <p className="text-richblack-300 text-sm leading-relaxed">
              {isInstructor
                ? "Create, publish, and manage courses. Share your expertise and earn revenue."
                : "Access expert-led courses. Track your learning journey and earn certificates."}
            </p>
          </div>
          <Link
            to={isInstructor ? "/dashboard/add-course" : "/"}
            className={`mt-5 text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${
              isInstructor
                ? "bg-blue-100/20 hover:bg-blue-100/30 text-blue-100 border border-blue-100/30"
                : "bg-richyellow-50/20 hover:bg-richyellow-50/30 text-richyellow-50 border border-richyellow-50/30"}`}>
            {isInstructor ? "➕ Create a Course" : "📚 Browse Courses"}
          </Link>
        </div>
      </div>

      {/* Personal Details */}
      <div className="bg-richblack-800 border border-richblack-700 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-richblack-5 font-semibold text-base">Personal Details</h2>
          <Link to="/dashboard/settings" className="text-richyellow-50 text-xs hover:underline">Edit</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Field label="First Name" value={user?.firstName} />
          <Field label="Last Name" value={user?.lastName} />
          <Field label="Email Address" value={user?.email} />
          <Field label="Phone Number" value={profile?.contactNumber} />
          <Field label="Date of Birth" value={profile?.dateOfBirth} />
          <Field label="Gender" value={profile?.gender} />
        </div>
      </div>
    </div>
  );
}
