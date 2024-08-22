import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPages/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import ProjectPage from "./pages/Projects/ProjectPage";
import Sidebar from "./components/Sidebar";
import { AuthProvider, useAuth } from "./context/AuthContext";
import TasksPage from "./pages/Tasks/TasksPage";
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import default styles

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex h-screen">
      {isAuthenticated && <Sidebar />}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/projects" element={<ProjectPage />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
        <ToastContainer /> {/* Add ToastContainer here */}
      </AuthProvider>
    </Router>
  );
};

export default App;
