import React, { useState, useEffect, useCallback } from 'react';
import './Profile.css';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TodoCards from '../Todo/TodoCards';
import { logout } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:1000';

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [viewingTask, setViewingTask] = useState(null);

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
      
      // For recurring tasks, we just toggle the status without moving between lists
      if (task.recurring && task.recurring.type) {
        const res = await axios.put(`${BASE_URL}/api/v2/updateTask/${task._id}`, updatedTask);
        
        if (res.data.message === "Task updated successfully") {
          // Update the task in its current list
          if (task.completed) {
            // Was completed, now active
            setCompletedTasks(completedTasks.filter(t => t._id !== task._id));
            setTasks([...tasks, updatedTask]);
          } else {
            // Was active, now completed
            setTasks(tasks.filter(t => t._id !== task._id));
            setCompletedTasks([...completedTasks, updatedTask]);
          }
          toast.success("Task updated successfully");
        } else {
          toast.error("Failed to update task");
        }
      } else {
        // For non-recurring tasks, move between lists
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
      }
    } catch (error) {
      toast.error("An error occurred while updating task");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/v1/deleteAccount/${user._id}`);
      if (res.data.message === "Account deleted successfully") {
        dispatch(logout());
        navigate('/');
        toast.success("Account deleted successfully");
      } else {
        toast.error(res.data.message || "Failed to delete account");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || "An error occurred while deleting account";
      toast.error(errorMsg);
    }
  };

  const confirmDeleteAccount = () => {
    setShowDeleteConfirmation(true);
  };

  const cancelDeleteAccount = () => {
    setShowDeleteConfirmation(false);
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
              <h2>{user?.username || 'User'}</h2>
              {user?.username && <p>{user?.email}</p>}
              {!user?.username && <p>{user?.email}</p>}
              <p>{tasks.length} active tasks</p>
              <p>{completedTasks.length} completed tasks</p>
            </div>
          </div>
          
          <div className="account-actions">
            <button className="delete-account-btn" onClick={confirmDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>

        {showDeleteConfirmation && (
          <div className="delete-confirmation-overlay">
            <div className="delete-confirmation-modal">
              <h2>Confirm Account Deletion</h2>
              <p>Are you sure you want to delete your account? This action will permanently remove all your data including:</p>
              <ul>
                <li>Your profile information</li>
                <li>All your tasks (active and completed)</li>
                <li>All associated data</li>
              </ul>
              <p>This action cannot be undone.</p>
              <div className="confirmation-buttons">
                <button className="confirm-delete-btn" onClick={handleDeleteAccount}>
                  Yes, Delete My Account
                </button>
                <button className="cancel-delete-btn" onClick={cancelDeleteAccount}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {viewingTask && (
          <div className="view-overlay" onClick={() => setViewingTask(null)}>
            <div className="view-modal" onClick={(e) => e.stopPropagation()}>
              <div className="view-header">
                <h2>{viewingTask.title}</h2>
                <button className="close-view-btn" onClick={() => setViewingTask(null)}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="view-content">
                <div className="view-meta">
                  {viewingTask.category && (
                    <span className="task-category">{viewingTask.category}</span>
                  )}
                  {viewingTask.dueDate && !viewingTask.recurring?.type && (
                    <span className="due-date">
                      Due: {new Date(viewingTask.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {viewingTask.time && !viewingTask.recurring?.type && (
                    <span className="time-info">
                      Time: {viewingTask.time}
                      {viewingTask.endTime && ` - ${viewingTask.endTime}`}
                    </span>
                  )}
                  {viewingTask.priority && (
                    <span className={`priority-badge priority-${viewingTask.priority}`}>
                      {viewingTask.priority.charAt(0).toUpperCase() + viewingTask.priority.slice(1)}
                    </span>
                  )}
                  {viewingTask.recurring && viewingTask.recurring.type && (
                    <span className="recurring-badge">
                      Repeats {viewingTask.recurring.type}
                    </span>
                  )}
                </div>
                
                <p className="view-body">{viewingTask.body}</p>
                
                {viewingTask.recurring && viewingTask.recurring.type && (
                  <div className="recurring-details">
                    <p>
                      <strong>Recurring:</strong> {viewingTask.recurring.type.charAt(0).toUpperCase() + viewingTask.recurring.type.slice(1)}
                    </p>
                    {viewingTask.recurring.startTime && (
                      <p>
                        <strong>Time:</strong> {viewingTask.recurring.startTime}
                        {viewingTask.recurring.endTime && ` - ${viewingTask.recurring.endTime}`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="tasks-section">
          <h2>Active Tasks</h2>
          <div className="tasks-list">
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <TodoCards
                  key={task._id}
                  title={task.title}
                  body={task.body}
                  category={task.category}
                  dueDate={task.dueDate}
                  priority={task.priority}
                  recurring={task.recurring}
                  time={task.time}
                  endTime={task.endTime}
                  completed={task.completed}
                  onDelete={() => handleDelete(task._id)}
                  onEdit={() => handleUpdate(task)}
                  onView={() => setViewingTask(task)}
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
                    category={task.category}
                    dueDate={task.dueDate}
                    priority={task.priority}
                    recurring={task.recurring}
                    time={task.time}
                    endTime={task.endTime}
                    completed={task.completed}
                    onDelete={() => handleDelete(task._id)}
                    onEdit={() => handleUpdate(task)}
                    onView={() => setViewingTask(task)}
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