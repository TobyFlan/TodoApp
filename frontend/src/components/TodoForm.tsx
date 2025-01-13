
import { useState } from 'react';

import { createTodo, Todo } from '@/services/todoApi';

import { PlusCircle, CheckCircle2 } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="mb-4 bg-[#1e1e2e] border-2 border-[#89b4fa]">
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 relative">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a new todo"
                                className="w-full px-4 py-2 text-[#cdd6f4] bg-[#313244] border-2 border-[#89b4fa] rounded-full focus:outline-none focus:border-[#f5c2e7] transition-all duration-300 placeholder-[#6c7086]"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <PlusCircle className="h-5 w-5 text-[#89b4fa]" />
                            </div>
                        </div>
                        <div className="flex items-center mb-4">
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={isDone}
                                        onChange={(e) => setIsDone(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-10 h-6 bg-[#45475a] rounded-full shadow-inner transition-all duration-300 ${
                                            isDone ? 'bg-[#a6e3a1]' : ''
                                        }`}
                                    ></div>
                                    <div
                                        className={`absolute w-4 h-4 bg-[#cdd6f4] rounded-full shadow inset-y-1 left-1 transition-all duration-300 ${
                                            isDone ? 'transform translate-x-full' : ''
                                        }`}
                                    ></div>
                                </div>
                                <span className="ml-3 text-[#cdd6f4] font-medium">Done</span>
                            </label>
                        </div>
                        <Button
                            type="submit"
                            disabled={title.trim() === ''}
                            className={`w-full font-bold py-2 px-4 rounded-full transition-all duration-300 flex items-center justify-center
                                ${
                                    title.trim() === ''
                                        ? 'bg-[#45475a] text-[#6c7086] cursor-not-allowed'
                                        : 'bg-[#89b4fa] text-[#1e1e2e] hover:bg-[#b4befe]'
                                }`}
                        >
                            <CheckCircle2 className="mr-2 h-5 w-5" />
                            Add Todo
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}