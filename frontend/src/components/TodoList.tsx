import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Todo } from '@/services/todoApi';
import { deleteTodo, updateTodo } from '@/services/todoApi';

const TodoList = ({
    todos,
    onDeleteTodo,
    onUpdateTodo,
}: {
    todos: Todo[];
    onDeleteTodo: (id: number) => void;
    onUpdateTodo: (id: number, updatedTodo: Todo) => void;
}) => {
    return (
        <div className="container mx-auto p-4">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onDelete={onDeleteTodo}
                    onUpdate={onUpdateTodo}
                />
            ))}
        </div>
    );
};

const TodoItem = ({
    todo,
    onDelete,
    onUpdate,
}: {
    todo: Todo;
    onDelete: (id: number) => void;
    onUpdate: (id: number, updatedTodo: Todo) => void;
}) => {
    const handleToggle = async () => {
        const newStatus = !todo.isDone;
        const updatedTodo = { ...todo, isDone: newStatus };
        await updateTodo(todo.id, updatedTodo);
        onUpdate(todo.id, updatedTodo);
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
                    <Switch checked={todo.isDone} onCheckedChange={handleToggle} />
                    <span>{todo.isDone ? 'Completed' : 'Pending'}</span>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
};

export default TodoList;
