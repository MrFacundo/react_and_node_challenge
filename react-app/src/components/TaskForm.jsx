import PropTypes from 'prop-types';

function TaskForm({
  task, onInputChange, onKeyPress, onCreateTask,
}) {
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
        type="button"
        disabled={!task.trim()}
        onClick={onCreateTask}
      >
        Create
      </button>
    </div>
  );
}

TaskForm.propTypes = {
  task: PropTypes.string.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onCreateTask: PropTypes.func.isRequired,
};

export default TaskForm;
