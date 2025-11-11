import React, { useState } from 'react';
import './Todo.css';

const Update = ({ task, onUpdate, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [body, setBody] = useState(task.body);
  const [category, setCategory] = useState(task.category || 'General');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [priority, setPriority] = useState(task.priority || 'medium');

  const handleUpdate = () => {
    if (title.trim() && body.trim()) {
      onUpdate({ 
        ...task, 
        title, 
        body,
        category,
        dueDate: dueDate || null,
        priority
      });
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Task</h2>
        <input
          className="modal-input"
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="modal-textarea"
          placeholder="Task Description"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        
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
          
          <input
            type="date"
            className="task-date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          
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
        
        <div className="modal-buttons">
          <button onClick={handleUpdate} className="modal-update-btn">Update</button>
          <button onClick={onClose} className="modal-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Update;