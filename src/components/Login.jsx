import {useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/authSlice';
import { useEffect } from 'react';
import { FaEye as FaEyeIcon, FaEyeSlash as FaEyeSlashIcon } from 'react-icons/fa6';

const Login = () => {

  const email = useRef("");
  const password = useRef("");
    const [showPassword, setShowPassword] = useState(false);
  const [isDispatched, setDispatched] = useState(false)
  
const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error: authError } = useSelector((state) => state.auth);
  
  const handleLogin = async (e)=>{
   e.preventDefault();

   const formData = {
    email: email.current.value,
    password: password.current.value
   }

      await dispatch(loginUser(formData));
      setDispatched(true);
      email.current.value = "";
      password.current.value = "";
  }

  useEffect(()=>{

    if(isDispatched){
    navigate("/dashboard", { replace: true })
    }
  }, [isDispatched]);


  return (
    <div className="w-full min-h-[calc(100vh-140px)] flex items-center justify-center px-4 py-8">

 <form onSubmit={handleLogin} method="POST" className="w-full max-w-md bg-white border border-gray-300 rounded-2xl shadow-lg p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-center mb-6 text-green-600">Welcome back</h1>
        <div className="mb-4">
          <label htmlFor="login_email" className="block text-sm mb-1">Email</label>
          <input id="login_email" type="email" ref={email} placeholder="you@example.com" required className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
        </div>
        <div className="mb-1">
          <label htmlFor="login_password" className="block text-sm mb-1">Password</label>
          <div className="relative">
            <input
              id="login_password"
              type={showPassword ? "text" : "password"}
              ref={password}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlashIcon/> : <FaEyeIcon/>}
            </button>
          </div>
        </div>
        {authError && (
          <p className=" text-red-600 text-sm mt-2 transition">Incorrect username or password</p>
        )}
        <button type="submit" className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition">Login</button>
        <p className="text-center text-sm mt-4">New here? <NavLink className="text-green-500 hover:underline" to="/signup">Create your account</NavLink></p>
      </form>

    </div>
  )
}

export default Login 