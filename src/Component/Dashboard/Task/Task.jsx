import React, { useEffect, useState } from 'react'
import './Task.css'
import Cookies from 'js-cookie'
import axiosConfig from '../../../Api/axiosConfig'
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
  console.log(diffDays);
  
};
const fetchuser = async() => {
  const response = await axiosConfig.get("handletask.php",{
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
  console.log(response.data);
  setIscomplete(false)
  onStatusChange({name: user?.name})
}

useEffect(()=>{
  fetchuser();
  if (data?.enddate) {
    dateRemain(data.enddate);
  }
},[data?.enddate])
  return (
    <div className='task-container'>
        <div className='task-top'>
            <p className={ `${data?.status === 'PENDING' ? 'pending' : 'completed'}`}>{data?.status}</p>
            <p>{data?.taskname}</p>
        </div>
        <div className='task-complete-div'>
          {
            user?.role === 'employee' && data?.status !== 'COMPLETED' && 
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