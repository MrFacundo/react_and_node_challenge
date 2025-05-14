import PropTypes from 'prop-types';

function TaskList({
  tasks, onToggleCompletion, onEditTask, onDeleteTask, onToggleSortOrder,
}) {
  return (
    <div
      className="task-list"
    >
      <span className="title"
        role="button"
        tabIndex={0}
        onClick={tasks.length > 1 ? onToggleSortOrder : null}
      >
        Tasks ↑↓
      </span>
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleCompletion(task.id)}
          />
          <span className={task.completed ? 'completed' : ''}>{task.text}</span>
          <button type="button" onClick={() => onEditTask(task)}>Edit</button>
          <button type="button" onClick={() => onDeleteTask(task.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

TaskList.propTypes = {
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      text: PropTypes.string.isRequired,
      completed: PropTypes.bool.isRequired,
    }),
  ).isRequired,
  onToggleCompletion: PropTypes.func.isRequired,
  onEditTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onToggleSortOrder: PropTypes.func.isRequired,
};

export default TaskList;
