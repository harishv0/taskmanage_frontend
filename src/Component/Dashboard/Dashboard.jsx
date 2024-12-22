import React, { useEffect, useState } from 'react'
import SideBar from './SideBar'
import './Dashboard.css'
import Task from './Task/Task'
import axios from 'axios'
import axiosConfig from '../../Api/axiosConfig'
import Cookies from 'js-cookie'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const [isAddTask, setisAddTask] = useState(false)
  const [user, setuser] = useState('');
  const [taskData, settaskData] = useState({
    taskname:"",
    assignto:"",
    enddate:"",
    taskby: ""
  })
  const [datas, setDatas] = useState([])
  
  const datavalidation = (datevalue) => {
    const currdate = new Date();
    const newdate = new Date(datevalue);
  
    const difftime = newdate - currdate;
    const diffdate = (difftime/(1000*60*60*24))
    
    if(diffdate >= 0){
      return true;
    }else{
      return false;
    }
  }

  const fetchuserbyid = async() => {
    const response = await axiosConfig.get("/handletask.php",{
      params:{
        action: "fetchuserbyid",
        userid: Cookies.get('userid')
      }
    })
    if(response.data.data.role === 'manager'){
      getAllTask();
    }else if(response.data.data.role === 'employee'){
      getUserTask({name: response.data.data.name});
    }else{
      console.log("error");
    }
    setuser(response.data.data)
  }

  const handleDataChange = (e) => {
    settaskData({
      ...taskData,
      [e.target.name] : e.target.value
  })
  }

  const handleSubmitTask = async() => {
    try {
      if(taskData.assignto !== '' && taskData.enddate !== '' && taskData.taskname !== ''){
        if(datavalidation(taskData.enddate)){
          const response = await axiosConfig.post("/handletask.php",{
            action: "addtask", 
            data: {
              taskname: taskData.taskname,
              assignto: taskData.assignto,
              enddate: taskData.enddate,
              taskby: user?.name
            }
          }, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          toast.info(response.data.message);
          
          settaskData("");
          setisAddTask(false);
          getAllTask();
        }else{
          // console.log("Give a valid date");
          toast.error("Give a valid date")
        }
        
      }else{
        toast.error("Fill the Field");
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  const getAllTask = async() => {
    try {
      const response = await axiosConfig.get("/handletask.php",{
        params:{
          action : "getalltask",
        }
      },{
        headers: {
          "Content-Type" : "application/json"
        }
      });
      const data = response.data;
      setDatas(data.data);
      
    } catch (error) {
      console.log(error);
    }
  }

  const getUserTask = async({name}) => {
    const response = await axiosConfig.get("/handletask.php",{
      params:{
        action: 'fetchusertaksbyname',
        name: name,
      }
    })
    // console.log(response.data);
    setDatas(response.data.data)
  }
  // useEffect(() => {
  //   if (user?.name) {
  //     settaskData((prevData) => ({
  //       ...prevData,
  //       taskby: user.name
  //     }));
  //   }
  // }, [user]);

  useEffect(()=>{
    fetchuserbyid();
  },[])
  
  return (
    <div className='dashboard'>
      <div className='dashboard_left'>
        <SideBar/>
      </div>
      <div className='dashboard_right'>
        <div className='dashboard_right-head'>
          {
            user?.role === 'manager' && 
            <p className='dashboard_right-head-button' onClick={()=>setisAddTask(true)}>Add task</p>
          }
          
          {isAddTask &&
            <div className='add_task'>
              <div className='add_task-container'>
                <p className='add_task-cancel' onClick={()=>setisAddTask(false)}>X</p>
                <div className='add_task-inputs'>
                  <input className='add_task-task' name='taskname' type="text" placeholder='Add a task' onChange={handleDataChange} required />
                  <input className='add_task-assign' name='assignto' type="text" placeholder='Assign to ' onChange={handleDataChange} required/>
                  <div className='add_task-date'>
                    <p>End date : </p>
                    <input name='enddate' type="date" onChange={handleDataChange} required/>
                  </div>
                  <button className='add_task-submit' onClick={handleSubmitTask}>Submit</button>
                </div>
              </div>
            </div>
          }
        </div>
          <div className='dashboard_right-tasks'>
          {
            datas?.length > 0 ?
            datas?.map((item,index) => (
              <Task data={item} key={index} onStatusChange={getUserTask}/>          
            ))
            : <p className='no-task'>No task available</p>
          }
          </div> 
      </div>
    </div>
  )
}

export default Dashboard
