import { useState } from 'react';
import {
  ClockIcon,
  MapPinIcon,
  CheckCircleIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { useStaffTasks } from '../../context/StaffTasksContext';

const TaskCard = ({ task }) => {
  const [expanded, setExpanded] = useState(false);
  const { updateTaskStatus, updateTaskChecklist, deleteTask } = useStaffTasks();

  const priorityColors = {
    high: 'bg-gold text-deepgreen',
    medium: 'bg-teal text-white',
    low: 'bg-beige text-deepgreen',
  };

  const statusColors = {
    todo: 'bg-neutral-100 text-neutral-700 border-neutral-300',
    in_progress: 'bg-teal/10 text-teal border-teal/30',
    completed: 'bg-deepgreen/10 text-deepgreen border-deepgreen/30',
  };

  const handleStatusChange = (newStatus) => {
    updateTaskStatus(task.id, newStatus);
  };

  const handleChecklistToggle = (checklistId, completed) => {
    updateTaskChecklist(task.id, checklistId, completed);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  const completedItems = task.checklist.filter(item => item.completed).length;
  const totalItems = task.checklist.length;
  const progress = (completedItems / totalItems) * 100;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-neutral-900">{task.title}</h3>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${priorityColors[task.priority]}`}>
              {task.priority.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-neutral-600">{task.description}</p>
        </div>
        <button
          onClick={handleDelete}
          className="ml-4 p-2 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm text-neutral-600">
        {task.roomNumber && task.roomNumber !== 'N/A' && (
          <div className="flex items-center">
            <MapPinIcon className="h-4 w-4 mr-1" />
            Room {task.roomNumber}
          </div>
        )}
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 mr-1" />
          Due: {task.dueTime}
        </div>
        <div className="text-neutral-500">
          By: {task.assignedBy}
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-neutral-600 mb-1">
          <span>Progress</span>
          <span>{completedItems}/{totalItems} completed</span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Status selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => handleStatusChange('todo')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
            task.status === 'todo'
              ? statusColors.todo
              : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
          }`}
        >
          To Do
        </button>
        <button
          onClick={() => handleStatusChange('in_progress')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
            task.status === 'in_progress'
              ? statusColors.in_progress
              : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => handleStatusChange('completed')}
          className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
            task.status === 'completed'
              ? statusColors.completed
              : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Checklist toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        <span>Checklist ({completedItems}/{totalItems})</span>
        {expanded ? (
          <ChevronUpIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </button>

      {/* Checklist */}
      {expanded && (
        <div className="mt-4 space-y-2 border-t border-neutral-200 pt-4">
          {task.checklist.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={(e) => handleChecklistToggle(item.id, e.target.checked)}
                className="h-4 w-4 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <span className={`text-sm ${item.completed ? 'text-neutral-400 line-through' : 'text-neutral-700'}`}>
                {item.text}
              </span>
              {item.completed && (
                <CheckCircleIcon className="h-4 w-4 text-deepgreen ml-auto" />
              )}
            </label>
          ))}
        </div>
      )}

      {/* Notes */}
      {task.notes && (
        <div className="mt-4 p-3 bg-beige/20 rounded-lg border border-beige/30">
          <p className="text-xs font-medium text-neutral-700 mb-1">Notes:</p>
          <p className="text-sm text-neutral-600">{task.notes}</p>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
