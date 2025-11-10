import React, { useState, useEffect, useCallback } from 'react';
import './Profile.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TodoCards from '../Todo/TodoCards';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:1000';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/v2/getTasks/${user._id}`);
      const allTasks = res.data.list || [];
      
      // Separate completed and active tasks
      const completed = allTasks.filter(task => task.completed);
      const active = allTasks.filter(task => !task.completed);
      
      setTasks(active);
      setCompletedTasks(completed);
    } catch (error) {
      toast.error("Failed to load tasks");
    }
  }, [user?._id]);

  useEffect(() => {
    if (isLoggedIn && user?._id) {
      fetchTasks();
    }
  }, [isLoggedIn, user, fetchTasks]);

  const handleDelete = async (taskId) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/v2/deleteTask/${taskId}`);
      if (res.data.message === "Task deleted successfully") {
        setTasks(tasks.filter(task => task._id !== taskId));
        setCompletedTasks(completedTasks.filter(task => task._id !== taskId));
        toast.success("Task deleted successfully");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (error) {
      toast.error("An error occurred while deleting task");
    }
  };

  const handleUpdate = async (task) => {
    try {
      // Toggle completed status
      const updatedTask = { ...task, completed: !task.completed };
      const res = await axios.put(`${BASE_URL}/api/v2/updateTask/${task._id}`, updatedTask);
      
      if (res.data.message === "Task updated successfully") {
        if (updatedTask.completed) {
          // Move to completed tasks
          setTasks(tasks.filter(t => t._id !== task._id));
          setCompletedTasks([...completedTasks, updatedTask]);
        } else {
          // Move to active tasks
          setCompletedTasks(completedTasks.filter(t => t._id !== task._id));
          setTasks([...tasks, updatedTask]);
        }
        toast.success("Task updated successfully");
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      toast.error("An error occurred while updating task");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <h2>Please log in to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        <div className="profile-header">
          <h1>Profile</h1>
          <div className="user-info">
            <img
              className="profile-user-icon"
              src="https://static.vecteezy.com/system/resources/previews/005/005/788/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"
              alt="user"
            />
            <div className="user-details">
              <h2>{user?.email}</h2>
              <p>{tasks.length} active tasks</p>
              <p>{completedTasks.length} completed tasks</p>
            </div>
          </div>
        </div>

        <div className="tasks-section">
          <h2>Active Tasks</h2>
          <div className="tasks-list">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TodoCards
                  key={task._id}
                  title={task.title}
                  body={task.body}
                  onDelete={() => handleDelete(task._id)}
                  onEdit={() => handleUpdate(task)}
                />
              ))
            ) : (
              <p className="no-tasks">No active tasks found</p>
            )}
          </div>
        </div>

        <div className="tasks-section">
          <h2>Completed Tasks</h2>
          <div className="tasks-list">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <div key={task._id} className="todo-card completed">
                  <TodoCards
                    title={task.title}
                    body={task.body}
                    onDelete={() => handleDelete(task._id)}
                    onEdit={() => handleUpdate(task)}
                  />
                </div>
              ))
            ) : (
              <p className="no-tasks">No completed tasks found</p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Profile;