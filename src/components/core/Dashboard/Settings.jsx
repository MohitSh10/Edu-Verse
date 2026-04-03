import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { updateProfile, updateProfilePicture, deleteAccount } from "../../../services/profileAPI";
import { changePassword } from "../../../services/authAPI";
import { ConfirmationModal } from "../../common/index";

export default function Settings() {
  const { user, loading } = useSelector((s) => s.profile);
  const profile = user?.additionalDetails;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmModal, setConfirmModal] = useState(null);
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [imgFile, setImgFile] = useState(null);

  const { register: rProfile, handleSubmit: hsProfile } = useForm({
    defaultValues: {
      firstName: user?.firstName, lastName: user?.lastName,
      dateOfBirth: profile?.dateOfBirth, gender: profile?.gender,
      about: profile?.about, contactNumber: profile?.contactNumber,
    },
  });
  const { register: rPwd, handleSubmit: hsPwd, reset: resetPwd } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImgFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadPicture = () => {
    if (!imgFile) return;
    const fd = new FormData();
    fd.append("profileImage", imgFile);
    dispatch(updateProfilePicture(fd));
    setImgFile(null);
    setPreview(null);
  };

  const onProfileSubmit = (data) => dispatch(updateProfile(data));

  const onPasswordSubmit = (data) => {
    dispatch(changePassword(data.oldPassword, data.newPassword, data.confirmNewPassword));
    resetPwd();
  };

  const handleDelete = () =>
    setConfirmModal({
      text1: "Delete Account?",
      text2: "All your data will be permanently removed. This cannot be undone.",
      btn1Text: "Delete Account",
      btn2Text: "Cancel",
      btn1Handler: () => dispatch(deleteAccount(navigate)),
      btn2Handler: () => setConfirmModal(null),
    });

  const inputCls = "form-input";

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-richblack-5">Settings</h1>

      {/* Profile Picture */}
      <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6">
        <h2 className="text-richblack-5 font-semibold mb-4">Profile Picture</h2>
        <div className="flex items-center gap-5">
          <img
            src={preview || user?.image}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-richblack-600"
          />
          <div className="flex flex-col gap-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            <button onClick={() => fileRef.current.click()} className="btn-secondary text-sm">
              Choose Image
            </button>
            {imgFile && (
              <button onClick={uploadPicture} className="btn-primary text-sm">Upload</button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6">
        <h2 className="text-richblack-5 font-semibold mb-4">Profile Information</h2>
        <form onSubmit={hsProfile(onProfileSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-richblack-300 mb-1.5">First Name</label>
            <input {...rProfile("firstName")} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-richblack-300 mb-1.5">Last Name</label>
            <input {...rProfile("lastName")} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-richblack-300 mb-1.5">Date of Birth</label>
            <input type="date" {...rProfile("dateOfBirth")} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm text-richblack-300 mb-1.5">Gender</label>
            <select {...rProfile("gender")} className={inputCls}>
              <option value="">Select</option>
              {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-richblack-300 mb-1.5">Phone</label>
            <input {...rProfile("contactNumber")} className={inputCls} placeholder="+91 9999999999" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm text-richblack-300 mb-1.5">About</label>
            <textarea {...rProfile("about")} rows={3} className={inputCls} placeholder="Tell us about yourself..." />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" disabled={loading} className="btn-primary">Save Changes</button>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-richblack-800 border border-richblack-700 rounded-xl p-6">
        <h2 className="text-richblack-5 font-semibold mb-4">Change Password</h2>
        <form onSubmit={hsPwd(onPasswordSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-richblack-300 mb-1.5">Current Password</label>
            <input type="password" {...rPwd("oldPassword", { required: true })} className={inputCls} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm text-richblack-300 mb-1.5">New Password</label>
            <input type="password" {...rPwd("newPassword", { required: true, minLength: 8 })} className={inputCls} placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm text-richblack-300 mb-1.5">Confirm New Password</label>
            <input type="password" {...rPwd("confirmNewPassword", { required: true })} className={inputCls} placeholder="••••••••" />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn-primary">Update Password</button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-richblack-800 border border-pink-200 rounded-xl p-6">
        <h2 className="text-pink-100 font-semibold mb-2">Danger Zone</h2>
        <p className="text-richblack-400 text-sm mb-4">
          Deleting your account is permanent. All your data, courses, and progress will be removed.
        </p>
        <button
          onClick={handleDelete}
          className="bg-pink-100 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-pink-50 transition-colors"
        >
          Delete Account
        </button>
      </div>

      <ConfirmationModal modalData={confirmModal} />
    </div>
  );
}
