import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Todo } from '@/services/todoApi';
import { deleteTodo, updateTodo } from '@/services/todoApi';
import { useAuth } from '@/components/AuthContext';

const TodoList = ({
    todos,
    onDeleteTodo,
    onUpdateTodo,
}: {
    todos: Todo[];
    onDeleteTodo: (id: number) => void;
    onUpdateTodo: (id: number, updatedTodo: Todo) => void;
}) => {

  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;


  return (
    <>
      {todos.length > 0 ? (
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
      ) : (
        <div className="text-center text-gray-600">No todos found</div>
      )}
    </>
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
