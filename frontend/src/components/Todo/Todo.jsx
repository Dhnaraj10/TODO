// frontend/src/components/Todo/Todo.jsx
import React, { useState, useEffect } from 'react';
import './Todo.css';
import TodoCards from './TodoCards';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Update from './Update';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:1000';

const Todo = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('General');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [time, setTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [recurring, setRecurring] = useState({
    type: null,
    startTime: '',
    endTime: ''
  });
  const [showRecurringOptions, setShowRecurringOptions] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const userId = user?._id;

  // Fetch tasks
  useEffect(() => {
    if (isLoggedIn && userId) {
      axios.get(`${BASE_URL}/api/v2/getTasks/${userId}`)
        .then((res) => {
          // Filter out completed tasks - they should only appear in profile
          const activeTasks = (res.data.list || []).filter(task => !task.completed);
          setTasks(activeTasks);
        })
        .catch((error) => {
          console.error("Failed to load tasks:", error);
          toast.error("Failed to load tasks");
        });
    }
  }, [isLoggedIn, userId]);

  // Add Task
  const handleAdd = async () => {
    if (!isLoggedIn) {
      toast.warning("Your task is not saved. Please Sign Up", {
        onClick: () => navigate('/signup'),
        style: { cursor: 'pointer' }
      });
      return;
    }

    if (!userId) {
      toast.error("User not properly authenticated. Please log in again.");
      return;
    }

    if (title.trim() && body.trim()) {
      try {
        const taskData = {
          title,
          body,
          user: userId,
          completed: false, // New tasks are not completed by default
          category,
          dueDate: dueDate || null,
          priority,
          time: time || null,
          endTime: endTime || null
        };

        // Add recurring data if it exists
        if (recurring.type) {
          taskData.recurring = {
            type: recurring.type,
            startTime: recurring.startTime || null,
            endTime: recurring.endTime || null
          };
          // Remove dueDate for recurring tasks
          delete taskData.dueDate;
          delete taskData.time;
          delete taskData.endTime;
        }

        const res = await axios.post(`${BASE_URL}/api/v2/addTask`, taskData);

        if (res.data.message === "Task added successfully") {
          setTasks([...tasks, res.data.task]);
          setTitle('');
          setBody('');
          setCategory('General');
          setDueDate('');
          setPriority('medium');
          setTime('');
          setEndTime('');
          setRecurring({
            type: null,
            startTime: '',
            endTime: ''
          });
          setShowRecurringOptions(false);
          toast.success("Task added successfully");
        } else {
          toast.error(res.data.message || "Failed to add task");
        }
      } catch (error) {
        console.error("Error adding task:", error);
        const errorMsg = error.response?.data?.message || "An error occurred while adding task";
        toast.error(errorMsg);
      }
    } else {
      toast.error("Title and body are required");
    }
  };

  // Delete Task
  const handleDelete = async (taskId) => {
    try {
      const res = await axios.delete(`${BASE_URL}/api/v2/deleteTask/${taskId}`);
      if (res.data.message === "Task deleted successfully") {
        setTasks(tasks.filter(task => task._id !== taskId));
        toast.success("Task deleted successfully");
      } else {
        toast.error(res.data.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      const errorMsg = error.response?.data?.message || "An error occurred while deleting task";
      toast.error(errorMsg);
    }
  };

  // Update Task (mark as complete/incomplete)
  const handleUpdate = async (task) => {
    // If this is for editing, open the update modal
    if (!task.completed) {
      setEditingTask(task);
      return;
    }
    
    // Otherwise, this is for marking as complete
    try {
      const updatedTask = { ...task, completed: true };
      const res = await axios.put(`${BASE_URL}/api/v2/updateTask/${task._id}`, updatedTask);
      if (res.data.message === "Task updated successfully") {
        setTasks(tasks.filter(t => t._id !== task._id));
        toast.success("Task marked as complete");
      } else {
        toast.error(res.data.message || "Failed to update task");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      const errorMsg = error.response?.data?.message || "An error occurred while updating task";
      toast.error(errorMsg);
    }
  };

  const handleSaveUpdate = async (updatedTask) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/v2/updateTask/${updatedTask._id}`, updatedTask);
      if (res.data.message === "Task updated successfully") {
        setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
        setEditingTask(null);
        toast.success("Task updated successfully");
      } else {
        toast.error(res.data.message || "Failed to update task");
      }
    } catch (error) {
      console.error("Error saving task update:", error);
      const errorMsg = error.response?.data?.message || "An error occurred while updating task";
      toast.error(errorMsg);
    }
  };

  // Filter tasks based on search term, category, and priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.body.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
    
    const matchesPriority = filterPriority === 'All' || task.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(tasks.map(task => task.category))];

  // Close search and clear search data
  const closeSearch = () => {
    setShowSearch(false);
    setSearchTerm('');
    setFilterCategory('All');
    setFilterPriority('All');
  };

  return (
    <div className="todo-container">
      <div className="todo-content">
        <div className="todo-header">
          <h2 className="todo-heading">Task Management</h2>
          <button className="search-toggle-btn" onClick={() => setShowSearch(true)}>
            <FaSearch />
          </button>
        </div>
        
        <div className="todo-input-section">
          {/* Task Creation Form */}
          <input
            type="text"
            placeholder="Task Title"
            className="todo-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          
          <textarea
            placeholder="Task Description"
            className="todo-body"
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          
          <div className="task-options">
            <select 
              className="task-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="General">General</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
            </select>
            
            {!recurring.type && (
              <>
                <input
                  type="date"
                  className="task-date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <input
                  type="time"
                  className="task-time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
                <input
                  type="time"
                  className="task-time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="End Time"
                />
              </>
            )}
            
            <select 
              className="task-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          
          {/* Recurring Task Options */}
          <div className="recurring-section">
            <button 
              className="recurring-toggle"
              onClick={() => setShowRecurringOptions(!showRecurringOptions)}
            >
              {showRecurringOptions ? 'Hide Recurring Options' : 'Set Recurring Task'}
            </button>
            
            {showRecurringOptions && (
              <div className="recurring-options">
                <select
                  className="task-select"
                  value={recurring.type || ''}
                  onChange={(e) => setRecurring({...recurring, type: e.target.value || null})}
                >
                  <option value="">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
                
                {recurring.type && (
                  <>
                    <input
                      type="time"
                      className="task-time"
                      placeholder="Start Time"
                      value={recurring.startTime}
                      onChange={(e) => setRecurring({...recurring, startTime: e.target.value})}
                    />
                    <input
                      type="time"
                      className="task-time"
                      placeholder="End Time (Optional)"
                      value={recurring.endTime}
                      onChange={(e) => setRecurring({...recurring, endTime: e.target.value})}
                    />
                  </>
                )}
              </div>
            )}
          </div>
          
          <button className="add-btn" onClick={handleAdd}>Add Task</button>
        </div>
        
        <div className="todo-list">
          {isLoggedIn ? (
            filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
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
                  onDelete={() => handleDelete(task._id)}
                  onEdit={() => handleUpdate(task)}
                  onView={() => setViewingTask(task)}
                />
              ))
            ) : (
              <p className="no-tasks-message">No tasks found.</p>
            )
          ) : (
            <p className="login-message">Please log in to see your tasks</p>
          )}
        </div>
      </div>
      
      {/* Search Overlay */}
      {showSearch && (
        <div className="search-overlay" onClick={closeSearch}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-header">
              <h2>Search Tasks</h2>
              <button className="close-search-btn" onClick={closeSearch}>
                <FaTimes />
              </button>
            </div>
            
            <div className="search-filter-section">
              <input
                type="text"
                placeholder="Search tasks..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <div className="filter-controls">
                <select 
                  className="filter-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <select 
                  className="filter-select"
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              
              {/* Search Results */}
              <div className="search-results">
                {searchTerm || filterCategory !== 'All' || filterPriority !== 'All' ? (
                  <div>
                    <p>{filteredTasks.length} tasks found</p>
                    <div className="search-results-list">
                      {filteredTasks.map(task => (
                        <div key={task._id} className="search-result-item">
                          <h4>{task.title}</h4>
                          <p>{task.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>Enter search term or select filters to find tasks</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Task View Overlay */}
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
      
      <ToastContainer />
      {editingTask && (
        <Update
          task={editingTask}
          onUpdate={handleSaveUpdate}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default Todo;