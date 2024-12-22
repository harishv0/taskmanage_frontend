import React, { useEffect, useState } from 'react'
import './SIdeBar.css'
import Cookies from 'js-cookie'
import axiosConfig from '../../Api/axiosConfig'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
const SideBar = () => {
  const [user, setuser] = useState('')
  const navigate = useNavigate();

  const fetchuserbyid = async() => {
    const response = await axiosConfig.get("/handletask.php",{
        params:{
          action: "fetchuserbyid",
          userid: Cookies.get('userid')
        }
      })
      setuser(response.data.data)
    }

  const handleLogout = () => {
    Cookies.remove('userid');
    navigate('/')
    toast.success("Logout successfully")
  }
  
  useEffect(()=>{
    fetchuserbyid();
  },[])

  return (
    <div className='sidebar'>
        <div className='sidebar_top'>
            <h1>Welcome</h1>
        </div>
        <div className='sidebar_bottom'>
            <p onClick={()=> navigate("/dashboard")}>Task</p>
            {
              user?.role === 'manager' && <p onClick={()=>navigate('/employee')}>Employees</p>
            }
            <p className='logout' onClick={handleLogout}>Logout</p>
        </div>
    </div>
  )
}

export default SideBar