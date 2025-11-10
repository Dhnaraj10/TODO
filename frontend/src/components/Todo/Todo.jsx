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

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:1000';

const Todo = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const userId = user?._id;

  // Fetch tasks
  useEffect(() => {
    if (isLoggedIn && userId) {
      axios.get(`${BASE_URL}/api/v2/getTasks/${userId}`)
        .then((res) => {
          setTasks(res.data.list || []);
        })
        .catch(() => {
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

    if (title.trim() && body.trim()) {
      try {
        const res = await axios.post(`${BASE_URL}/api/v2/addTask`, {
          title,
          body,
          user: userId
        });

        if (res.data.message === "Task added successfully") {
          setTasks([...tasks, res.data.task]);
          setTitle('');
          setBody('');
          toast.success("Task added successfully");
        } else {
          toast.error("Failed to add task");
        }
      } catch (error) {
        toast.error("An error occurred while adding task");
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
        toast.error("Failed to delete task");
      }
    } catch (error) {
      toast.error("An error occurred while deleting task");
    }
  };

  // Update Task
  const handleUpdate = async (task) => {
    setEditingTask(task);
  };

  const handleSaveUpdate = async (updatedTask) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/v2/updateTask/${updatedTask._id}`, updatedTask);
      if (res.data.message === "Task updated successfully") {
        setTasks(tasks.map(task => task._id === updatedTask._id ? updatedTask : task));
        setEditingTask(null);
        toast.success("Task updated successfully");
      } else {
        toast.error("Failed to update task");
      }
    } catch (error) {
      toast.error("An error occurred while updating task");
    }
  };

  return (
    <>
      <div className="todo">
        <div className="todo-main">
          <div className="todo-input">
            <input
              type="text"
              placeholder='Title'
              className='todo-inputs'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder='Body'
              className='todo-inputs'
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <button className='todo-button' onClick={handleAdd}>Add Task</button>
          </div>
          <div className="todo-cards">
            {isLoggedIn ? (
              tasks.map((task) => (
                <TodoCards
                  key={task._id}
                  task={task}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))
            ) : (
              <p>Please log in to see your tasks</p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
      {editingTask && (
        <Update
          task={editingTask}
          onSave={handleSaveUpdate}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </>
  );
};

export default Todo;