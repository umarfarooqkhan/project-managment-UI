import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import FormInput from '../../components/FormInput';
import axios from 'axios'; // Import axios
import { useAuth } from '../../context/AuthContext'; // Import useAuth for authentication
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import default styles

interface ProjectFormProps {
  initialValues?: {
    name?: string;
    description?: string;
  };
  onSubmit?: (values: { name: string; description: string }) => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ initialValues = { name: '', description: '' }, onSubmit }) => {
  const { token } = useAuth(); // Access the token from context

  const formik = useFormik({
    initialValues: {
      name: initialValues.name || '',
      description: initialValues.description || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        // const response = await axios.post(
        //   'http://localhost:5000/api/projects',
        //   {
        //     name: values.name,
        //     description: values.description,
        //   },
        //   {
        //     headers: {
        //       'Content-Type': 'application/json',
        //       'Authorization': `Bearer ${token}`, // Include the bearer token
        //     },
        //   }
        // );

        // // Notify user of success
        // toast.success('Project added successfully!');

        // Optional: Call the onSubmit prop if provided
        if (onSubmit) {
          onSubmit({
            name: values.name,
            description: values.description,
          }); // Pass the response data to the onSubmit callback
        }

        // Optionally clear form fields
        formik.resetForm();
      } catch (error: any) {
        // Handle errors from API response
        if (error.response && error.response.data && error.response.data.message) {
          // Show error message from API response
          toast.error(`Error: ${error.response.data.message}`);
        } else {
          // Show generic error message
          toast.error('An error occurred while adding the project. Please try again.');
        }
      }
    },
  });

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add Project</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <FormInput
          id="name"
          name="name"
          type="text"
          label="Project Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name ? formik.errors.name : undefined}
        />

        <FormInput
          id="description"
          name="description"
          type="text"
          label="Description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
        />

        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Project
        </button>
      </form>
    </div>
  );
};

export default ProjectForm;