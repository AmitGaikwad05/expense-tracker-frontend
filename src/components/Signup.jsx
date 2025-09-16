import { useState, useRef, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { signupUser } from '../store/authSlice';


const Signup = () => {
  const name = useRef("");
  const email = useRef("");
  const password = useRef("");
  const confirmPassword = useRef("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDispatched, setDispatched] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (password.current.value !== confirmPassword.current.value) {
      setPasswordError("password does not match");
      return;
    }
    setPasswordError("");

    const formData = {
      name: name.current.value,
      email: email.current.value,
      password: password.current.value,
    };

    dispatch(signupUser(formData));
    setDispatched(true);
    email.current.value = "";
    password.current.value = "";
    confirmPassword.current.value = "";
  };

  useEffect(() => {
    if(isDispatched){
      navigate("/login");
    }
  }, [isDispatched]);

  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-8 ">
      <form onSubmit={handleSignup} method="POST" className="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-center mb-6 text-green-600">Create your account</h1>

        <div className="mb-4">
          <label htmlFor="signup_name" className="block text-sm mb-1">Full name</label>
          <input id="signup_name" type="text" ref={name} placeholder="Firstname Lastname" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
        </div>

        <div className="mb-4">
          <label htmlFor="signup_email" className="block text-sm mb-1">Email</label>
          <input id="signup_email" type="email" ref={email} placeholder="you@gmail.com" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
        </div>

        <div className="mb-4">
          <label htmlFor="signup_password" className="block text-sm mb-1">Password</label>
          <div className="relative">
            <input
              id="signup_password"
              type={showPassword ? "text" : "password"}
              ref={password}
              placeholder="Create password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-300"
              onInput={() => { if (passwordError) setPasswordError(""); }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div className="mb-1">
          <label htmlFor="signup_confirm_password" className="block text-sm mb-1">Confirm password</label>
          <div className="relative">
            <input
              id="signup_confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              ref={confirmPassword}
              placeholder="Confirm password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-300"
              onInput={() => { if (passwordError) setPasswordError(""); }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-600 text-sm mt-2">{passwordError}</p>
          )}
        </div>

        <button type="submit" className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition">Signup</button>
        <p className="text-center text-sm mt-4">Already have an account? <NavLink className="text-green-500 hover:underline" to="/login">Login</NavLink></p>
      </form>
    </div>
  );
};

export default Signup;
