
import { useState } from 'react';

import { createTodo, Todo } from '@/services/todoApi';

import { PlusCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';


export default function TodoForm({ onAddTodo }: { onAddTodo: (todo: Todo) => void }) {

    const [title, setTitle] = useState('');
    const [isDone, setIsDone] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newTodo: Todo = {
            id: -1,
            title: title,
            isDone: isDone
        };
        const createdTodo = await createTodo(newTodo);
        onAddTodo(createdTodo);
        setTitle('');
        setIsDone(false);
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a new todo"
            className="flex-grow bg-white bg-opacity-50 border-none focus:ring-2 focus:ring-purple-400 text-gray-800"
          />
          <Button type="submit" disabled={title.trim() === ''} className="bg-purple-500 hover:bg-purple-600">
            <PlusCircle className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            checked={isDone}
            onCheckedChange={setIsDone}
            className="data-[state=checked]:bg-green-500"
          />
          <span className="text-sm text-gray-300">Mark as done</span>
        </div>
      </form>
    );
}