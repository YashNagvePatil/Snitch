import React, { useState } from 'react';
import { Mail, Lock, Shield, Eye, EyeOff, Search } from 'lucide-react';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        
       
    try {
      // Running the login service
      const response = await handleLogin({
        email: formData.email,
        password: formData.password
      });


      if (response.role == "buyer" ){
        navigate("/")
      }
        else if(response.role == "seller"){
          navigate("/seller/dashboard")
        }


      if (response?.error){
        console.warn("login rejectoion",result.error)
      }
  
      const dynacmicRole = response?.user?.role;

      // Checking the role safely from your api response structure (data.user.role)
      if (dynacmicRole === "buyer") {
        navigate('/');
      } else if (dynacmicRole === "seller") {
        navigate('/seller/dashboard');
      }   
    } catch (error) {
      console.log("Login failed", error);
    }
  };

  return (
    // 1. Gritty Alleyway Entrance Background with Dark Linear Overlay
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 selection:bg-neutral-800 selection:text-white"
      style={{
        background: `
          linear-gradient(to bottom, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.95)), 
          url('https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1920') 
          no-repeat center center/cover
        `
      }}
    >
      
      {/* 2. Unified Glassmorphism Container */}
      <div className="w-full max-w-[500px] bg-white/5 backdrop-blur-xl rounded-3xl p-10 md:p-12 shadow-[0_0_80px_0_rgba(0,0,0,0.6)] border border-white/10 flex flex-col items-center">
        
        {/* Header Title */}
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none mb-12 self-start">
          Snitch: ACCESS THE VAULT
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-7">
          
          {/* Identity / Email Input Group */}
          <div className="group space-y-1">
            <label className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold block">Identity / Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full h-12 bg-neutral-900 border border-white/10 rounded-lg px-4 text-white font-mono placeholder:text-neutral-700 focus:outline-none focus:border-white transition-all focus:ring-1 focus:ring-white"
              />
              <Mail size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-white" />
            </div>
          </div>

          {/* Secret / Password Input Group */}
          <div className="group space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold block">Secret / Password</label>
              <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-neutral-500 hover:text-white transition-colors">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full h-12 bg-neutral-900 border border-white/10 rounded-lg px-4 pr-12 text-white font-mono placeholder:text-neutral-700 focus:outline-none focus:border-white transition-all focus:ring-1 focus:ring-white"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full mt-10 h-16 bg-neutral-900 text-white rounded-xl border border-neutral-700 flex items-center justify-center gap-4 transition-all hover:bg-neutral-800 hover:border-neutral-600 group active:scale-95"
          >
            <span className="text-xl font-bold uppercase tracking-widest">Sign In</span>
            <Shield size={20} className="text-neutral-500 group-hover:text-white transition-colors" />
          </button>
        </form>

        

        {/* Alternative Action */}
        <div className="mt-12 text-center">
          <p className="text-neutral-500 text-xs uppercase tracking-widest font-semibold">
            Not part of the crew?{' '}
          <a
              href="/api/auth/google"
              className="w-full border-2 border-white/20 text-white py-4 px-6 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-3 transition-all duration-300 hover:border-white hover:bg-white/5 active:scale-[0.99]"
            >
              {/* Minimal Google Icon */}
              <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.73 5.73 0 0 1 8.2 12.786a5.73 5.73 0 0 1 5.79-5.729c1.47 0 2.782.533 3.805 1.491l3.226-3.226C18.916 3.323 16.666 2 13.99 2 8.472 2 4 6.472 4 11.99q0 .034.001.067a9.96 9.96 0 0 0 9.99 9.943c5.523 0 10.009-4.486 10.009-10.01 0-.667-.07-1.33-.207-1.975z"/>
              </svg>
              Continue with Google
            </a>
          </p>
        </div>
      </div>

      {/* Aesthetic Footer/Caption */}
      <p className="mt-12 text-[10px] text-neutral-700 uppercase tracking-[0.4em] font-mono select-none">
        Est. Established // Global Access // Snitch 2077
      </p>
    </div>
  );
};

export default Login;