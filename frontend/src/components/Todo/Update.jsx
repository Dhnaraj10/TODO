import React, { useState } from 'react';
import './Todo.css';
import { FaTimes } from 'react-icons/fa';

const Update = ({ task, onUpdate, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [body, setBody] = useState(task.body);
  const [category, setCategory] = useState(task.category || 'General');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [recurring, setRecurring] = useState(task.recurring || {
    type: null,
    startDate: '',
    endDate: ''
  });
  const [showRecurringOptions, setShowRecurringOptions] = useState(!!(task.recurring && task.recurring.type));

  const handleUpdate = () => {
    if (title.trim() && body.trim()) {
      const updatedTask = { 
        ...task, 
        title, 
        body,
        category,
        dueDate: dueDate || null,
        priority
      };
      
      // Add recurring data if it exists
      if (recurring.type) {
        updatedTask.recurring = {
          type: recurring.type,
          startDate: recurring.startDate || null,
          endDate: recurring.endDate || null
        };
      }
      
      onUpdate(updatedTask);
    }
  };

  const handleClose = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Update Task</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
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
                    type="date"
                    className="task-date"
                    placeholder="Start Date"
                    value={recurring.startDate}
                    onChange={(e) => setRecurring({...recurring, startDate: e.target.value})}
                  />
                  <input
                    type="date"
                    className="task-date"
                    placeholder="End Date (Optional)"
                    value={recurring.endDate}
                    onChange={(e) => setRecurring({...recurring, endDate: e.target.value})}
                  />
                </>
              )}
            </div>
          )}
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