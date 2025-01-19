import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Todo } from '@/services/todoApi';
import { deleteTodo, updateTodo } from '@/services/todoApi';

const TodoList = ({
    todos,
    token,
    onDeleteTodo,
    onUpdateTodo,
}: {
    todos: Todo[];
    token: string | null;
    onDeleteTodo: (id: number) => void;
    onUpdateTodo: (id: number, updatedTodo: Todo) => void;
}) => {


    return (
        <>
            {todos ? (
                <div className="container mx-auto p-4">
                    {todos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onDelete={onDeleteTodo}
                            onUpdate={onUpdateTodo}
                            token={token}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-[#cdd6f4]">No todos found</div>
            )}
        </>
    );
};

const TodoItem = ({
    todo,
    token,
    onDelete,
    onUpdate,
}: {
    todo: Todo;
    token: string | null;
    onDelete: (id: number) => void;
    onUpdate: (id: number, updatedTodo: Todo) => void;
}) => {
    const handleToggle = async () => {
        const newStatus = !todo.isDone;
        const updatedTodo = { ...todo, isDone: newStatus };
        await updateTodo(todo.id, updatedTodo, token);
        onUpdate(todo.id, updatedTodo);
    };

    const handleDelete = async () => {
        await deleteTodo(todo.id, token);
        onDelete(todo.id);
    };

    return (
        <Card className="mb-4 bg-[#1e1e2e] border-2 border-[#89b4fa]">
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#cdd6f4]">{todo.title}</h3>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              checked={todo.isDone}
              onCheckedChange={() => handleToggle()}
              className="data-[state=checked]:bg-[#a6e3a1]"
            />
            <span className="text-[#cdd6f4]">
              {todo.isDone ? 'Completed' : 'Pending'}
            </span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete()}
            className="bg-[#f38ba8] text-[#1e1e2e] hover:bg-[#eba0ac]"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </CardFooter>
      </Card>
    );
};

export default TodoList;
