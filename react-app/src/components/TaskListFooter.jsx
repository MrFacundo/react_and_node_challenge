import PropTypes from 'prop-types';

function TaskListFooter({ hideCompleted, onToggleHideCompleted }) {
  return (
    <div className="task-list-footer">
      <label htmlFor="hide-completed-checkbox">
        <input
          id="hide-completed-checkbox"
          type="checkbox"
          checked={hideCompleted}
          onChange={onToggleHideCompleted}
        />
        Hide completed
      </label>
    </div>
  );
}

TaskListFooter.propTypes = {
  hideCompleted: PropTypes.bool.isRequired,
  onToggleHideCompleted: PropTypes.func.isRequired,
};

export default TaskListFooter;
