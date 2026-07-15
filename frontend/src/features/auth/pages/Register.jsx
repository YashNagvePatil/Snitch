import React, { useState } from 'react';
import { useAuth } from "../hook/useAuth"; // Update with your actual path
import { useNavigate } from 'react-router';
// Using standard Lucide icons that fit the dark aesthetic
import { Mail, Lock, Footprints, MapPin, Search ,Eye,EyeOff} from 'lucide-react'; 

const Register = () => {
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contactNumber: '',
    password: '',
    role: "buyer", // Default role
  });

  const [showPass,setShowPass] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleRole = () => {
    setFormData((prev) => ({
      ...prev,
      role: prev.role === "buyer" ? "seller" : "buyer"
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Syndicate Registration:', formData);
    try {
      await handleRegister({
        email: formData.email,
        contact: formData.contactNumber, // Maps to backend 'contact'
        fullName: formData.fullname,
        role: formData.role,
        password: formData.password
      });
      navigate("/");
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    // 1. Gritty, Deep Background with full fade
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 selection:bg-neutral-800 selection:text-white"
      style={{
        background: `
          linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.95)), 
          url('bg img.png') 
          no-repeat center center/cover
        `
      }}
    >
      
      {/* 2. Glassmorphism Container with subtle outline */}
      <div className="w-full max-w-[500px] bg-white/5 backdrop-blur-xl rounded-3xl p-10 md:p-12 shadow-[0_0_80px_0_rgba(0,0,0,0.5)] border border-white/10 flex flex-col items-center">
        
        {/* Logo/Header in raw white font */}
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none mb-10 self-start">
          Snitch: JOIN THE SYNDICATE
        </h1>

        <form onSubmit={handleSubmit} className="w-full space-y-7">
          
          {/* User Name Input */}
          <div className="group space-y-1">
            <label className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold block">Full_Name</label>
            <div className="relative">
              <input
                type="text"
                name="fullname"
                required
                value={formData.fullname}
                onChange={handleChange}
                className="w-full h-12 bg-neutral-900 border border-white/10 rounded-lg px-4 text-white font-mono placeholder:text-neutral-700 focus:outline-none focus:border-white transition-all focus:ring-1 focus:ring-white"
              />
              <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-white" />
            </div>
          </div>

          {/* Contact Input (Required in backend) */}
          <div className="group space-y-1">
            <label className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold block">Phone_Info</label>
            <div className="relative">
              <input
                type="tel"
                name="contactNumber"
                required
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full h-12 bg-neutral-900 border border-white/10 rounded-lg px-4 text-white font-mono placeholder:text-neutral-700 focus:outline-none focus:border-white transition-all focus:ring-1 focus:ring-white"
              />
              <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-white" />
            </div>
          </div>

          {/* Email Input */}
          <div className="group space-y-1">
            <label className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold block">Email_Address</label>
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

          {/* Password Input */}
          <div className="group space-y-1">
            <label className="text-[11px] text-neutral-400 uppercase tracking-widest font-semibold block">Pass_Word</label>
            <div className="relative">
              <input
                type={showPass?"text":"password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full h-12 bg-neutral-900 border border-white/10 rounded-lg px-4 text-white font-mono placeholder:text-neutral-700 focus:outline-none focus:border-white transition-all focus:ring-1 focus:ring-white"
              />
              <button 
                              type="button"
                              onClick={() => setShowPass(!showPass)}
                              className="absolute right-4 bottom-4 text-white/10 hover:text-white transition-colors"
                            >
                              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
            </div>
          </div>

          {/* Gritty Toggle/Role Selector (Switched to buyer/seller logic) */}
          <div 
            onClick={toggleRole}
            className={`cursor-pointer group flex items-center justify-between h-14 w-full rounded-xl border transition-all duration-300 ${formData.role === "seller" ? 'bg-white border-white' : 'bg-neutral-900 border-white/10 hover:border-neutral-700'}`}
          >
            <span className={`px-5 text-sm uppercase tracking-widest font-bold ${formData.role === "seller" ? 'text-black' : 'text-neutral-400'}`}>
              Partner With Us
            </span>
            <div className="px-5">
              {formData.role === "seller" 
                ? <Footprints size={24} className="text-black group-hover:scale-110" /> 
                : <div className="h-6 w-12 border border-neutral-700 rounded-full flex items-center px-1"><div className="h-4 w-4 rounded-full bg-neutral-700"></div></div>
              }
            </div>
          </div>

          {/* Main Register Button */}
          <button
            type="submit"
            className="w-full mt-10 h-16 bg-neutral-900 text-white rounded-xl border border-neutral-700 flex items-center justify-center gap-4 transition-all hover:bg-neutral-800 hover:border-neutral-600 group active:scale-95"
          >
            <span className="text-xl font-bold uppercase tracking-widest">Register</span>
            <Footprints size={24} className="text-neutral-500 group-hover:text-white transition-colors" />
          </button>
        
            <a
              href="/api/auth/google"
              className="w-full border-2 border-white/20 text-white py-4 px-6 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-3 transition-all duration-300 hover:border-white hover:bg-white/5 active:scale-[0.99]"
            >
              {/* Minimal inline SVG for the Google Branding Icon */}
              <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.73 5.73 0 0 1 8.2 12.786a5.73 5.73 0 0 1 5.79-5.729c1.47 0 2.782.533 3.805 1.491l3.226-3.226C18.916 3.323 16.666 2 13.99 2 8.472 2 4 6.472 4 11.99q0 .034.001.067a9.96 9.96 0 0 0 9.99 9.943c5.523 0 10.009-4.486 10.009-10.01 0-.667-.07-1.33-.207-1.975z"/>
              </svg>
              Continue with Google
            </a>

        </form>
      </div>

      {/* Aesthetic Footer/Caption */}
      <p className="mt-12 text-[10px] text-neutral-700 uppercase tracking-[0.4em] font-mono select-none">
        Est. Established // Global Access // Snitch 2077
      </p>
    </div>
  );
};

export default Register;