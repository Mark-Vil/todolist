import { useState } from 'react';
import TodoItem from './TodoItem';

const TodoList = ({ todos, onToggleComplete, onDeleteTodo, onEditTodo }) => {
  const [filter, setFilter] = useState('all');
  
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
  
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  if (todos.length === 0) {
    return (
      <div className="mt-8 text-center text-gray-500">
        <p className="text-lg">No todos yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            My Todos <span className="text-sm text-gray-500">({activeTodosCount} active)</span>
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-2 py-1 text-sm rounded ${
                filter === 'all' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-2 py-1 text-sm rounded ${
                filter === 'active' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-2 py-1 text-sm rounded ${
                filter === 'completed' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {filteredTodos.length > 0 ? (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggleComplete={onToggleComplete}
                onDeleteTodo={onDeleteTodo}
                onEditTodo={onEditTodo}
              />
            ))
          ) : (
            <li className="py-4 text-center text-gray-500">
              No {filter} todos found
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;