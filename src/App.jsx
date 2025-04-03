import { useState, useEffect } from 'react';
import './App.css';
import TodoList from './components/TodoList';

function App() {
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  
  const API_URL = 'http://localhost:3001/todos';
  

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        const data = await response.json();
        setTodos(data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    
    fetchTodos();
  }, []);
  
  const [newTodoDueDate, setNewTodoDueDate] = useState('');

  const [newTodoDueTime, setNewTodoDueTime] = useState('');


  const addTodo = async (e) => {
    e.preventDefault();
    
    if (!newTodoTitle.trim()) return;
    
    const newTodo = {
      title: newTodoTitle,
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: newTodoDueDate
        ? newTodoDueTime
          ? `${newTodoDueDate}T${newTodoDueTime}:00`
          : `${newTodoDueDate}T00:00:00`
        : undefined,
    };
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      
      const addedTodo = await response.json();
      setTodos((prevTodos) => [...prevTodos, addedTodo]);
      setNewTodoTitle('');
      setNewTodoDueDate('');
      setNewTodoDueTime('');
  
    } catch (err) {
      setError(err.message);
    }
  };
  
  
  

  const toggleComplete = async (id) => {
    const todoToUpdate = todos.find(todo => todo.id === id);
    
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          completed: !todoToUpdate.completed
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      setTodos(
        todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };
  

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
      
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };
  
  const editTodo = async (id, updates) => {
    try {
      
      let updatedData = { ...updates };
    
      if (updates.dueDate && updates.dueTime) {
        updatedData.dueDate = `${updates.dueDate}T${updates.dueTime}:00`;
        delete updatedData.dueTime; 
      }
      
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
      
      setTodos(
        todos.map(todo => 
          todo.id === id ? { ...todo, ...updatedData } : todo
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Todo App</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            Error: {error}
          </div>
        )}
        
        <div className="mb-8 p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Todo</h2>
  <div className="rounded-lg p-2">
    <form onSubmit={addTodo} className="flex flex-col space-y-3">
      <input
        type="text"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        placeholder="Add a new todo..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
        autoFocus
      />
      <div className="flex justify-center">
  <div className="flex flex-wrap items-center justify-center gap-2 max-w-full">
    <label className="text-sm text-gray-600">Due:</label>
    <div className="flex gap-2 justify-center max-w-full">
      <input
        type="date"
        value={newTodoDueDate}
        onChange={(e) => setNewTodoDueDate(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-[140px] xs:w-[160px] truncate text-sm"
      />
      <input
        type="time"
        value={newTodoDueTime}
        onChange={(e) => setNewTodoDueTime(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-[100px] xs:w-[120px] truncate text-sm"
      />
    </div>
  </div>
</div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Add Todo
      </button>
    </form>
  </div>
</div>
        
        {isLoading ? (
          <div className="text-center">
            <p className="text-gray-500">Loading todos...</p>
          </div>
        ) : (
          <TodoList
            todos={todos}
            onToggleComplete={toggleComplete}
            onDeleteTodo={deleteTodo}
            onEditTodo={editTodo}
          />
        )}
      </div>
    </div>
  );
}

export default App;