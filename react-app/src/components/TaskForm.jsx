import React from 'react';

const TaskForm = ({ task, onInputChange, onKeyPress, onCreateTask }) => {
  return (
    <div className="task-form">
      <input
        type="text"
        placeholder="Write new task here..."
        value={task}
        onChange={onInputChange}
        onKeyDown={onKeyPress}
      />
      <button
        disabled={!task.trim()}
        onClick={onCreateTask}>Create</button>
    </div>
  );
};

export default TaskForm;