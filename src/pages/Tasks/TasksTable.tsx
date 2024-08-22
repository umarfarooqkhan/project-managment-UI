import React from 'react';
import { Task, Project } from '../../types';

interface TasksTableProps {
  tasks: Task[];
  projects: Project[]; // Add projects to the props
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TasksTable: React.FC<TasksTableProps> = ({ tasks, projects, onEdit, onDelete }) => {
  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Project</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id} className="border-b border-gray-200">
              <td className="px-4 py-2 text-sm text-gray-900">{task.name}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{task.description}</td>
              <td className="px-4 py-2 text-sm text-gray-900">{getProjectName(task.projectId)}</td>
              <td className="px-4 py-2 text-sm text-gray-900">
                <button
                  onClick={() => onEdit(task)}
                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTable;
