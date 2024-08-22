import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TasksTable from './TasksTable';
import TaskForm from './TaskForm';
import { Task, Project } from '../../types';
import { useAuth } from '../../context/AuthContext';


const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const { token } = useAuth(); // Get the token from context
  const [userId, setUserId] = useState<number | null>(null);


  useEffect(() => {
    // Check localStorage for token on component mount
    const getUserID = localStorage.getItem('userId');
    if (getUserID) {
        setUserId(parseInt(getUserID));
    }
  }, []);



 
  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}` // Include the Bearer token
          }
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [token]);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}` // Include the Bearer token
          }
        });
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [token]);

  const handleAddClick = () => {
    setEditingTask({ id: '', name: '', description: '', projectId: '', status: 'Open' });
    setShowForm(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the Bearer token
        }
      });

      // Refresh the task list after deletion
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: {
          'Authorization': `Bearer ${token}` // Include the Bearer token
        }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleFormSubmit = async (task: Task) => {
    const payload = {
      ...task,
      assignedTo: userId,
      projectId: parseInt(task.projectId),
    };

    try {
      let response;
      if (editingTask?.id) {
        // Updating existing task
        response = await axios.put(`http://localhost:5000/api/tasks/${task.id}`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      } else {
        // Creating new task
        response = await axios.post('http://localhost:5000/api/tasks', payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }

      if (response.status === 200 || response.status === 201) {
        const createdOrUpdatedTask = response.data as Task; // Type assertion

        if (editingTask?.id) {
            try {
                const response = await axios.get('http://localhost:5000/api/tasks', {
                  headers: {
                    'Authorization': `Bearer ${token}` // Include the Bearer token
                  }
                });
                setTasks(response.data);
              } catch (error) {
                console.error('Error fetching tasks:', error);
              }
        } else {
            try {
                const response = await axios.get('http://localhost:5000/api/tasks', {
                  headers: {
                    'Authorization': `Bearer ${token}` // Include the Bearer token
                  }
                });
                setTasks(response.data);
              } catch (error) {
                console.error('Error fetching tasks:', error);
              }
        }
        setShowForm(false);
      } else {
        console.error('Failed to save the task:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm"
        >
          Add Task
        </button>
      </div>

      <TasksTable tasks={tasks} onEdit={handleEdit} onDelete={handleDelete} projects={projects} />

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <TaskForm
              initialValues={editingTask || { id: '', name: '', description: '', projectId: '', status: 'Open' }}
              projects={projects}
              onSubmit={handleFormSubmit}
            />
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;
