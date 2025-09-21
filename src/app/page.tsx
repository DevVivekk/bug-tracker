'use client';
import callApi from "@/helpers/apiHit";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Page = () => {
  const [check, setCheck] = useState(0);
  const [bgColor, setBgColor] = useState("bg-gradient-to-r from-indigo-500 to-purple-600");
  const [data,setData] = useState({username:"",email:"",password:""});
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value} = e.target;
    setData((item)=>({...item,[name]:value}))
  }
  const handleCheck = (item: number) => {
    setCheck(item);
  };
  const router = useRouter()
  const submit = async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    e.preventDefault()
    const tempdata = {...data,role:check==0?"Admin":"Reporter"}
    const ans = {method:'POST',data:tempdata,path:`${process.env.NEXT_PUBLIC_URL}/server/api/v1/user/signup`}
    const res =  await callApi(ans);
    console.log(res)
    if(!res.status){
      alert(res.message);
    }else{
      //success case
      setData({username:"",email:"",password:""})
      alert(res.message)
      router.push('/login')
    }
  }

  useEffect(() => {
    if (check === 0) {
      setBgColor("bg-gradient-to-r from-indigo-500 to-purple-600");
    } else {
      setBgColor("bg-gradient-to-r from-cyan-500 to-blue-600");
    }
  }, [check]);


  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${bgColor}`}>
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02]">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">BugZero</span>
          </h1>
          <p className="text-center text-gray-600 mb-8">Choose your role to get started</p>
          
          <div className="flex bg-gray-100 rounded-xl p-1 mb-8 shadow-inner">
            <button 
              onClick={() => handleCheck(0)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${check === 0 ? 
                'bg-white text-indigo-700 shadow-md' : 
                'text-gray-600 hover:text-indigo-600'}`}
            >
              <i className={`fas fa-crown mr-2 ${check === 0 ? 'text-yellow-500' : ''}`}></i>
              Join as Admin
            </button>
            <button 
              onClick={() => handleCheck(1)}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${check === 1 ? 
                'bg-white text-blue-700 shadow-md' : 
                'text-gray-600 hover:text-blue-600'}`}
            >
              <i className={`fas fa-bug mr-2 ${check === 1 ? 'text-green-500' : ''}`}></i>
              Join as Reporter
            </button>
          </div>

          <div className="overflow-hidden">
              <form className="animate-fadeIn">
                <h2 className="text-xl font-semibold text-indigo-700 mb-6 text-center">{check==0?"Admin Registration":"Reporter Registration"}</h2>
                <div className="space-y-4">
                  <div className="relative">
                    <i className="fas fa-user absolute left-3 top-3 text-gray-500"></i>
                    <input onChange={(e)=>handleChange(e)}
                    value={data.username} name="username"
                      type="text" 
                      placeholder="Enter your username" 
                      className=" text-black w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="relative">
                    <i className="fas fa-envelope absolute left-3 top-3 text-gray-500"></i>
                    <input onChange={(e)=>handleChange(e)}
                      type="text" 
                      value={data.email} name="email"
                      placeholder="Enter your email" 
                      className="w-full pl-10 pr-4 text-black py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-3 top-3 text-gray-500"></i>
                    <input onChange={(e)=>handleChange(e)}
                      type="password" 
                    value={data.password} name="password"
                      placeholder="Enter your password" 
                      className="w-full text-black pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => submit(e)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                   {check==0?"Create Admin Account":"Create Reporter Account"}
                  </button>
                </div>
              </form>
          </div>
          
          <p className="text-center text-gray-500 text-sm mt-8">
            Already have an account? <a href="/login" className="text-indigo-600 font-semibold hover:underline">Sign In</a>
          </p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Page;