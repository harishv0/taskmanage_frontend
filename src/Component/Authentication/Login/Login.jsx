import React, { useEffect, useState } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowDroprightCircle } from "react-icons/io"
import Cookies from 'js-cookie';
import axiosConfig from '../../../Api/axiosConfig';
import { toast } from 'react-toastify';
const Login = () => {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate();
  const [loginField, setloginField] = useState({
    mail: "",
    password : ""
})
const [signupField, setsignupField] = useState({
  name:"",
  mail:"",
  password:""
})
const handleLoginChange = (e) => {
  setloginField({
    ...loginField,
    [e.target.name]: e.target.value
  })
};

const handleSignup = (e) => {
  setsignupField({
    ...signupField,
    [e.target.name]: e.target.value
  })
};

const handleSignupnSubmit = async() => {
  try {
    if(signupField.name !== '' && signupField.mail !== "" && signupField.password !== ""){
      const response = await axiosConfig.post("/signup.php", {
        name: signupField.name,
        mail: signupField.mail,
        password: signupField.password
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      // console.log(response.data);
      setsignupField({ name: '', mail: '', password: ''});
      setIsLogin(true)
      toast.success("Signup Successfully")
    }
    else{
      toast.info("Fill the field");
    }
  } catch (error) {
    console.error("Error during signup:", error);
  }
}

const handleLoginSubmit = async() => {
  try {
    const response = await axiosConfig.get("/login.php", {
      params: {
        mail: loginField.mail,
        password: loginField.password
      },
      headers: {
        "Content-Type": "application/json",
      }
    
    });
    // console.log(response.data);
    
    if (response.data.message === "Login successful") {
      const data = response.data
      Cookies.set('userid',data?.data?.userid)
      toast.success(response.data.message)
      navigate('/dashboard');
    }else{
      toast.error(response.data.message)
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
}




  return (
    <div className='login'>
         { isLogin ?
            <div className='login-container'>
              <div className='login-header-div'>
                <p className='login-header'>Login</p>
                <p className='arrow' onClick={()=>setIsLogin(prev => !prev)}><IoIosArrowDroprightCircle /></p>
              </div>
              <input className='login-username' type="text" name='mail' placeholder='Email' onChange={handleLoginChange} required/>
              <input className='login-password'type="text" name='password' placeholder='Password' onChange={handleLoginChange} required/>
              <button className='login-button' onClick={handleLoginSubmit}>Login</button>
            </div>
         
          : 
          <div className='signin-container'>
              <div className='login-header-div'>
                <p className='login-header'>Signup</p>
                <p className='arrow' onClick={()=>setIsLogin(prev => !prev)}><IoIosArrowDroprightCircle /></p>
              </div>
              <input className='login-username' type="text" name='name' placeholder='UserName'  onChange={handleSignup} required/>
              <input className='login-username' type="mail" name='mail' placeholder='Email'  onChange={handleSignup} required/>
              <input className='login-password'type="password" name='password' placeholder='Password' onChange={handleSignup} required />
              <button className='login-button' onClick={handleSignupnSubmit}>Signup</button>
          </div>  
          }
    </div>
  )
}

export default Login