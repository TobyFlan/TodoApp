import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
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
      <div className="space-y-4">
      {todos && todos.length > 0 ? (
        todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDeleteTodo}
            onUpdate={onUpdateTodo}
            token={token}
          />
        ))
      ) : (
        <div className="text-center text-white">No todos found</div>
      )}
    </div>
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
      <Card className={`mb-4 transition-all duration-300 ease-in-out ${
        todo.isDone 
          ? 'bg-green-100 bg-opacity-50 border-green-300' 
          : 'bg-white bg-opacity-50 border-gray-200'
      }`}>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Switch
              checked={todo.isDone}
              onCheckedChange={handleToggle}
              className="data-[state=checked]:bg-green-500"
            />
            <span className={`text-lg ${todo.isDone ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {todo.title}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <Trash2 className="w-5 h-5" />
          </Button>
        </div>
      </Card>
    );
};

export default TodoList;
