import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import About from './pages/About';
import Profile from './profile/Profile';
import DrivingCourses from './pages/Admin/CreateDrivingCourse';
import AllDrivingCourses from './pages/AllDrivingCourses';
import ManageLessons from './pages/Admin/ManageLessons';
import ViewCourse from './pages/ViewCourse';
import Contact from './pages/Contact';
import AdminDashboard from './pages/Admin/AdminDashboard';
import EditDrivingCourse from './pages/Admin/EditDrivingCourse';

const App = () => {
  return (
    <div className="App">
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin/courses/create" element={<DrivingCourses />} />
        <Route path="/courses" element={<AllDrivingCourses />} />
        <Route path="/courses/:id/lessons" element={<ManageLessons />} />
        <Route path="/courses/view/:id" element={<ViewCourse />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/courses/edit/:courseId" element={<EditDrivingCourse/>} />
      </Routes>
    </div>
  );
};

export default App;








