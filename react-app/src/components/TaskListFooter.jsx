import React from 'react';

const TaskListFooter = ({ hideCompleted, onToggleHideCompleted }) => {
  return (
    <div className="task-list-footer">
      <label>
        <input
          type="checkbox"
          checked={hideCompleted}
          onChange={onToggleHideCompleted}
        />
        Hide completed
      </label>
    </div>
  );
};

export default TaskListFooter;