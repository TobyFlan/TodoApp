import { useState, useEffect } from 'react';
import TodoList from '@/components/TodoList';
import TodoForm from '@/components/TodoForm';
import LoginForm from '@/components/LoginForm';
import { getTodos, Todo } from '@/services/todoApi';

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
        <div className="bg-[#1e1e2e] min-h-screen text-[#cdd6f4]">
            <header>
                <LoginForm />
                <h1 className="text-3xl font-bold mb-4">Todo List</h1>
                <TodoForm onAddTodo={handleAddTodo} />
                <TodoList
                    todos={todos}
                    token={token}
                    onDeleteTodo={handleDeleteTodo}
                    onUpdateTodo={handleUpdateTodo}
                />
            </header>

        </div>
    );
}
