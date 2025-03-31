import { useState, useRef } from 'react';

const TodoItem = ({ todo, onToggleComplete, onDeleteTodo, onEditTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const formRef = useRef(null);

  const [editedDueDate, setEditedDueDate] = useState(
    todo.dueDate ? todo.dueDate.split('T')[0] : ''
  );
  
  const [editedDueTime, setEditedDueTime] = useState(
    todo.dueDate && todo.dueDate.includes('T') 
      ? todo.dueDate.split('T')[1].substring(0, 5) 
      : ''
  );

  const handleEditSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (editedTitle.trim()) {
      onEditTodo(todo.id, {
        title: editedTitle,
        dueDate: editedDueDate,
        dueTime: editedDueTime
      });
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedTitle(todo.title);
      setEditedDueDate(todo.dueDate ? todo.dueDate.split('T')[0] : '');
      setEditedDueTime(
        todo.dueDate && todo.dueDate.includes('T') 
          ? todo.dueDate.split('T')[1].substring(0, 5) 
          : ''
      );
    }
  };


  const formatDueDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (err) {
      return 'Invalid date format';
    }
  };
  

  const isPastDue = () => {
    if (!todo.dueDate) return false;
    return new Date(todo.dueDate) < new Date() && !todo.completed;
  };

  return (
    <li className="py-3 flex items-center justify-between group hover:bg-gray-50 rounded-lg px-2">
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggleComplete(todo.id)}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        
        {isEditing ? (
          <div className="ml-3 flex-1">
            <form ref={formRef} onSubmit={handleEditSubmit}>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="block w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                autoFocus
              />
              <div className="flex items-center mt-2 space-x-2">
                <input
                  type="date"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <input
                  type="time"
                  value={editedDueTime}
                  onChange={(e) => setEditedDueTime(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <button
                  type="submit"
                  className="ml-2 bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="ml-3 flex-1">
            <div 
              className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
              onClick={() => setIsEditing(true)}
            >
              {todo.title}
            </div>
            {todo.dueDate && (
              <div className={`text-sm mt-1 ${isPastDue() ? 'text-red-500' : 'text-gray-500'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {formatDueDate(todo.dueDate)}
                {isPastDue() && <span className="ml-2 font-medium">(Overdue)</span>}
              </div>
            )}
          </div>
        )}
      </div>
      
      {!isEditing && (
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDeleteTodo(todo.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </li>
  );
};

export default TodoItem;