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
  
  const [newTodoDueDate, setNewTodoDueDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  
  const [newTodoDueTime, setNewTodoDueTime] = useState('');


  const addTodo = async (e) => {
    e.preventDefault();
    
    if (!newTodoTitle.trim()) return;
    

    let dueDate;
    
    if (newTodoDueDate) {
      if (newTodoDueTime) {
   
        dueDate = `${newTodoDueDate}T${newTodoDueTime}:00`;
      } else {
 
        dueDate = `${newTodoDueDate}T00:00:00`;
      }
    } else {
      dueDate = new Date().toISOString();
    }
    
    const newTodo = {
      title: newTodoTitle,
      completed: false,
      dueDate: dueDate,
      createdAt: new Date().toISOString()
    };
    
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTodo)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add todo');
      }
      
      const addedTodo = await response.json();
      setTodos([...todos, addedTodo]);
      setNewTodoTitle('');
      
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
  <div className="border-4 border-indigo-500 rounded-lg p-2">
    <form onSubmit={addTodo} className="flex flex-col space-y-3">
      <input
        type="text"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
        placeholder="Add a new todo..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
        autoFocus
      />
      <div className="flex items-center">
        <label className="text-sm text-gray-600 mr-2">Due Date:</label>
        <input
          type="date"
          value={newTodoDueDate}
          onChange={(e) => setNewTodoDueDate(e.target.value)}
          className="px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
       <input
  type="time"
  value={newTodoDueTime}
  onChange={(e) => setNewTodoDueTime(e.target.value)}
  className="ml-2 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
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