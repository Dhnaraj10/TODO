import React, { useState } from 'react';
import './Todo.css';
import { FaTimes } from 'react-icons/fa';

const Update = ({ task, onUpdate, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [body, setBody] = useState(task.body);
  const [category, setCategory] = useState(task.category || 'General');
  const [dueDate, setDueDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [time, setTime] = useState(task.time || '');
  const [endTime, setEndTime] = useState(task.endTime || '');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [recurring, setRecurring] = useState(task.recurring || {
    type: null,
    startTime: '',
    endTime: ''
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
        time: time || null,
        endTime: endTime || null,
        priority
      };
      
      // Add recurring data if it exists
      if (recurring.type) {
        updatedTask.recurring = {
          type: recurring.type,
          startTime: recurring.startTime || null,
          endTime: recurring.endTime || null
        };
        // Remove dueDate for recurring tasks
        delete updatedTask.dueDate;
        delete updatedTask.time;
        delete updatedTask.endTime;
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
        
        <div className="modal-buttons">
          <button onClick={handleUpdate} className="modal-update-btn">Update</button>
          <button onClick={onClose} className="modal-cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Update;