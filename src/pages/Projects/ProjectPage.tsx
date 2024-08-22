import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API requests
import ProjectsTable from './ProjectsTable';
import Modal from '../../Models/ProjectModal';
import ProjectForm from './ProjectForm';
import { Project } from '../../types';
import { useAuth } from '../../context/AuthContext'; // Import useAuth for authentication

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // New state to handle form submission
  const { token } = useAuth(); // Get the token from context

  // Fetch projects from API on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/projects', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the bearer token
          },
        });
        setProjects(response.data); // Set the fetched projects to state
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, [token]); // Fetch projects when the token changes

  const handleAddClick = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (projectId: string) => {
    const project = projects.find(p => p.id === projectId) || null;
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (projectId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the bearer token
        },
      });
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

const handleSubmit = React.useCallback(async (values: { name: string; description: string }) => {
  if (isSubmitting) return; // Prevent submission if already submitting
  setIsSubmitting(true); // Set submitting state to true

  try {
    if (editingProject) {
      // Update existing project
      await axios.put(`http://localhost:5000/api/projects/${editingProject.id}`, values, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the bearer token
        },
      });
      const updatedProjects = projects.map(p => p.id === editingProject.id ? {
        ...p, 
        name: values.name, 
        description: values.description
      } : p);
      setProjects(updatedProjects);
    } else {
      // Add new project
      const response = await axios.post('http://localhost:5000/api/projects', values, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include the bearer token
        },
      });
      const newProject: Project = response.data;
      setProjects([...projects, newProject]);
    }
  } catch (error) {
    console.error('Error submitting project:', error);
  } finally {
    setIsModalOpen(false); // Close the modal after submission
    setIsSubmitting(false); // Reset submitting state
  }
}, [isSubmitting, editingProject, projects, token]);


  return (
    <div className="p-6">
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddClick}
          className="px-4 py-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm"
        >
          Add Project
        </button>
      </div>
      <ProjectsTable
        projects={projects}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ProjectForm
          initialValues={{
            name: editingProject?.name || '',
            description: editingProject?.description || '',
          }}
          onSubmit={handleSubmit}
        />
      </Modal>
    </div>
  );
};

export default ProjectsPage;
