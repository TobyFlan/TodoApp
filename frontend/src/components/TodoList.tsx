import { useEffect, useState } from 'react';
import { getTodos, deleteTodo, updateTodo, Todo } from '@/services/todoApi';
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react'


const TodoList = () => {

    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        const fetchTodos = async () => {
            const data = await getTodos();
            setTodos(data);
            console.log(data);
        };
        fetchTodos();
    }, []);

    // handler functions for CRUD operations
    const handleDelete =  (id: number) => {
        setTodos(todos.filter((todo: Todo) => todo.id !== id));        
    };

    const handleUpdate = (id: number, todo: Todo) => {
        setTodos(todos.map((item: Todo) => (item.id === id ? todo : item)));
    };

    return (

        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Todo List</h1>
            {todos.map((todo) => (
                <TodoItem 
                    key={todo.id} 
                    todo={todo} 
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                />
            ))}
        </div>

    )

};


const TodoItem = ({ todo, onDelete, onUpdate }: { todo: Todo, onDelete: (id: number) => void, onUpdate: (id: number, todo: Todo) => void }) => {

    const [isCompleted, setIsCompleted] = useState(todo.isDone);

    const handleToggle = async () => {
        const newStatus = !isCompleted;
        setIsCompleted(newStatus);
        console.log(todo);
        console.log(todo.id);
        await updateTodo(todo.id, { ...todo, isDone: newStatus });
        onUpdate(todo.id, { ...todo, isDone: newStatus });        
    };

    const handleDelete = async () => {
        await deleteTodo(todo.id);
        onDelete(todo.id);
    };

    return (
        <Card className="mb-4">
            <CardHeader>
            <CardTitle>{todo.title}</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex items-center space-x-2">
                <Switch
                checked={isCompleted}
                onCheckedChange={handleToggle}
                />
                <span>Completed</span>
            </div>
            </CardContent>
            <CardFooter>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
            </Button>
            </CardFooter>
        </Card>
      )

}















export default TodoList;