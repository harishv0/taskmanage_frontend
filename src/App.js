import { BrowserRouter, Route, Router, Routes } from 'react-router-dom';
import './App.css';
import Login from './Component/Authentication/Login/Login';
import Dashboard from './Component/Dashboard/Dashboard';
import SideBar from './Component/Dashboard/SideBar';
import Task from './Component/Dashboard/Task/Task';
import Employee from './Component/Dashboard/Employee/Employee';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/employee' element={<Employee/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
