import React, { useEffect, useState } from 'react'
import './Task.css'
import Cookies from 'js-cookie'
import axiosConfig from '../../../Api/axiosConfig'
import { toast } from 'react-toastify'
const Task = ({data, onStatusChange}) => {
const [user, setuser] = useState('')
const [remainingDays, setRemainingDays] = useState(null);
const [iscomplete, setIscomplete] = useState(false);

const dateRemain = (enddate) => {
  const curr = new Date();
  const end = new Date(enddate);
  const diffTime = end - curr;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  setRemainingDays(diffDays);
  // console.log(diffDays);
  
};

const fetchuser = async() => {
  const response = await axiosConfig.get("/handletask.php",{
    params:{
      action:'fetchuserbyid',
      userid: Cookies.get('userid')
    }
  })
  setuser(response.data.data)
}

const taskStatusUpdate = async(taskid) => {
  const response = await axiosConfig.post("/handletask.php",{
      action: "taskstatusupdate",
      taskid: taskid,
      newstatus: "COMPLETED"
  },{
    headers: {
      "Content-Type" : "application/json"
    }
})
  // console.log(response.data);
  setIscomplete(false)
  toast.success(response.data.message)
  onStatusChange({name: user?.name})
}

const isExpired = async(taskid) => {
  if(remainingDays <= 0){
    if(data?.status !== "EXPIRED" && data?.status !== 'COMPLETED'){
      const response = await axiosConfig.post("/handletask.php",{
        action: "taskstatusupdate",
        taskid: taskid,
        newstatus: "EXPIRED"
      },{
        headers:{
          "Content-Type" : "application/json"
        }
      })
      // console.log(response.data);
      // onStatusChange({name: user?.name})
      }
    }
  }

  useEffect(() => {
    fetchuser();
  }, []); 

  useEffect(()=>{
    if (data?.enddate) {
      dateRemain(data.enddate);
    }
  },[data?.enddate])


  useEffect(() => {
    if (remainingDays !== null) {
      isExpired(data?.taskid);
    }
  }, [remainingDays]);

  return (
    <div className='task-container'>
        <div className='task-top'>
            <p className={ `${data?.status === 'PENDING' ? 'pending' : data?.status === 'COMPLETED' ? 'completed': 'expired' }`}>{data?.status}</p>
            <p>{data?.taskname}</p>
        </div>
        <div className='task-complete-div'>
          {
            user?.role === 'employee' && data?.status !== 'COMPLETED' && data?.status !== 'EXPIRED' &&
            <button className='task-complete' onClick={()=>setIscomplete(true)}>Complete</button>
          }
          {iscomplete &&
            <div className='task-complete-confirm-div'>
              <div className='task-complete-confirm'>
                  <div>
                      <p>Are you completed ?</p>
                  </div>
                  <div className='task-complete-confirm-buttons'>
                    <button className='task-complete-confirm-buttons-1' onClick={()=>setIscomplete(false)}>Cancel</button>
                    <button className='task-complete-confirm-buttons-2' onClick={()=>taskStatusUpdate(data?.taskid)}>Yes</button>
                  </div>
              </div>
            </div>
          }
        </div>
        <div className='task-bottom'>
            <p>{remainingDays !== null && remainingDays >= 0
            ? `Remaining Days: ${remainingDays}`
            : `Expired ${Math.abs(remainingDays)} days ago`}</p>
            <p>{data?.assignto}</p>
            <p className='task-manager'>by {data?.taskby}</p>
        </div>
    </div>
  )
}

export default Task