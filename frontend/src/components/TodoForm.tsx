
import { useState } from 'react';

import { createTodo, Todo } from '@/services/todoApi';


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
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a new todo"
                className="border border-gray-300 rounded p-2 mb-2"
            />
            <label>
                <input
                    type="checkbox"
                    checked={isDone}
                    onChange={(e) => setIsDone(e.target.checked)}
                    className="mr-2"
                />
                Done
            </label>
            <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            >
                Add Todo
            </button>
        </form>
    );
}