import React, { useEffect, useState } from 'react';
import './Employee.css';
import axiosConfig from '../../../Api/axiosConfig';
import SideBar from '../SideBar';

const Employee = () => {
  const [allusers, setAllusers] = useState([]);

  const fetchAllusers = async () => {
    const response = await axiosConfig.get("/handletask.php", {
      params: {
        action: "getallusers"
      }
    });
    setAllusers(response.data.data);
    console.log(response.data);
  }

  useEffect(() => {
    fetchAllusers();
  }, [])

  return (
    <div className='employee-page'>
  <div className='employee-sidebar'>
    <SideBar />
  </div>
  <div className='employee-right'>
    <h2 className="employee-title">Employee Details</h2>
    {allusers.length > 0 ? (
      <table className="employee-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {allusers.map((user, index) => (
            <tr key={index}>
              <td>{user.userid}</td>
              <td>{user.name}</td>
              <td>{user.mail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No employees found.</p>
    )}
  </div>
</div>

  );
};

export default Employee;
