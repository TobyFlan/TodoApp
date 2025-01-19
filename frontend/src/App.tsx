import { useState, useEffect } from 'react';
import TodoList from '@/components/TodoList';
import TodoForm from '@/components/TodoForm';
import LoginForm from '@/components/LoginForm';
import { getTodos, Todo } from '@/services/todoApi';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function App() {
    const [todos, setTodos] = useState<Todo[]>([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchTodos = async () => {
            const data = await getTodos(token);
            setTodos(data);
        };
        fetchTodos();
    }, [token]);

    const handleAddTodo = (newTodo: Todo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
    };

    const handleDeleteTodo = (id: number) => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    };

    const handleUpdateTodo = (id: number, updatedTodo: Todo) => {
        setTodos((prevTodos) =>
            prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo))
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg overflow-hidden">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">Todo App</CardTitle>
          </CardHeader>
          <CardContent>
            {!token ? (
              <div className="text-center">
                <CardDescription className="text-lg text-gray-300 mb-6">
                  Welcome to the Todo App! This application helps you manage your tasks efficiently. 
                  Please log in to start creating and managing your todos.
                </CardDescription>
                <LoginForm />
              </div>
            ) : (
              <>
                <LoginForm />
                <TodoForm onAddTodo={handleAddTodo} />
                <TodoList
                  todos={todos}
                  token={token}
                  onDeleteTodo={handleDeleteTodo}
                  onUpdateTodo={handleUpdateTodo}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
}
