import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { useEffect, useRef, useState } from "react";
import { logoutUser, verifyAuth, changePassword, deleteAccount } from "../store/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiKey, FiTrash2, FiLogOut, FiCheck, FiX } from "react-icons/fi";
import Loader from "./Loader";
import { Navigate } from "react-router-dom";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const currentPass = useRef("");
  const newPass = useRef("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);


  const handleLogout = () => {
    dispatch(logoutUser());
  };


  const handleChangePassword = (e) => {
    e.preventDefault();

    let currentPassword = currentPass.current.value;
    let newPassword = newPass.current.value;

    dispatch(changePassword({ currentPassword, newPassword })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setSuccessMsg("Password changed successfully");
        setShowChangePass(false);
        currentPass.current.value = "";
        newPass.current.value = "";
        setTimeout(() => setSuccessMsg(""), 2000);
      } else {
        setErrorMsg(res.error.message || "Failed to change password");
        setTimeout(() => setErrorMsg(""), 2000);
      }
    });


  };


  const handleDeleteAccount = () => {
    dispatch(deleteAccount()).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setSuccessMsg("Account deleted successfully");
        setShowDeleteConfirm(false);
        setTimeout(() => setSuccessMsg(""), 2000);
      } else {
        setErrorMsg(res.error.message || "Failed to delete account");
        setTimeout(() => setErrorMsg(""), 2000);
      }
    });
  };

  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex w-full h-full overflow-y-scroll">
      <Sidebar user={user} />
      <div className="flex flex-col items-center w-full min-h-screen py-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-500 ">Settings</h2>
        <div className="bg-white rounded p-8 w-96 flex flex-col gap-4">
          <div className="text-lg text-green-600">
            <span className="text-lg font-semibold text-green-700">Name:</span> {user?.name}
          </div>
          <div className="text-lg text-green-600">
            <span className="text-lg font-semibold text-green-700">Email:</span> {user?.email}
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 transition-all font-semibold text-white px-4 py-2 rounded mt-4"
            onClick={() => setShowChangePass(true)}
          >
            <FiKey /> Change Password
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-red-400 hover:bg-red-500 transition-all font-semibold text-white px-4 py-2 rounded mt-2"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <FiTrash2 /> Delete Account
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 transition-all font-semibold text-red-500 px-4 py-2 rounded mt-2"
            onClick={handleLogout}
          >
            <FiLogOut /> Logout
          </button>
        </div>

        {/* ------------------------- Change Password Form --------------------------- */}
        {showChangePass && (
          <form
            onSubmit={handleChangePassword}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded shadow-lg flex flex-col gap-4 w-96 z-50 border border-gray-100"
          >
            <h3 className="text-xl font-bold mb-2 text-sky-500 ">Change Password</h3>
            <div className="relative">
              <input
                type={showCurrentPass ? "text" : "password"}
                placeholder="Current Password"
                ref={currentPass}
                required
                className="border px-2 py-1 rounded w-full pr-10"
              />
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowCurrentPass((v) => !v)}
              >
                {showCurrentPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="relative">
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="New Password"
                ref={newPass}
                required
                className="border px-2 py-1 rounded w-full pr-10"
              />
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowNewPass((v) => !v)}
              >
                {showNewPass ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="flex gap-4 justify-end mt-2">
              <button type="submit" className="flex items-center gap-2 bg-sky-500 text-white  px-4 py-2 rounded">
                <FiCheck /> Change
              </button>
              <button
                type="button"
                className="flex items-center gap-2 bg-gray-300 px-4 py-2 rounded"
                onClick={() => setShowChangePass(false)}
              >
                <FiX /> Cancel
              </button>
            </div>
          </form>
        )}

        {/* ----------------------------- Delete Account Confirm div ---------------------------- */}
        {showDeleteConfirm && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-white p-8 rounded shadow-lg flex flex-col gap-4 w-96 border border-gray-100">
              <h3 className="text-xl font-bold mb-2 text-red-500">Confirm Delete Account</h3>
              <p>Are you sure you want to delete your account? This action cannot be undone.</p>
              <div className="flex gap-4 justify-end mt-2">
                <button
                  className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleDeleteAccount}
                >
                  <FiTrash2 /> Yes, Delete
                </button>
                <button
                  className="flex items-center gap-2 bg-gray-300 px-4 py-2 rounded"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  <FiX /> No
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ----------------------- Success/Error Message div---------------------------- */}
        {successMsg && (
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-100 text-green-800 px-8 py-4 rounded shadow-lg z-50 text-center text-lg font-semibold">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-100 text-red-800 px-8 py-4 rounded shadow-lg z-50 text-center text-lg font-semibold">
            {errorMsg}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
