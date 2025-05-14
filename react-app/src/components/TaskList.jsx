import React from 'react';

const TaskList = ({ tasks, onToggleCompletion, onEditTask, onDeleteTask, sortOrder, onToggleSortOrder }) => {
  return (
    <div className="task-list">
      <div className="task-list-header" onClick={onToggleSortOrder}>
        Tasks {sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '↑↓'}
      </div>
      {tasks.map(task => (
        <div key={task.id} className="task-item">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleCompletion(task.id)}
          />
          <span>{task.text}</span>
          <button onClick={() => onEditTask(task)}>Edit</button>
          <button onClick={() => onDeleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default TaskList;