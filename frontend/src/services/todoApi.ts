import axios from 'axios';

const BASE_URL = 'http://localhost:5182';

interface Todo {
    Id: number;
    Title: string;
    isDone: boolean;
}

// get all todos
const getTodos = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/todos`);
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};

// get todo by id
const getTodo = async (id: number) => {
    try {
        const response = await axios.get(`${BASE_URL}/todos/${id}`);
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};

// create todo
const createTodo = async (todo: Todo) => {
    try {
        const response = await axios.post(`${BASE_URL}/todos`, todo);
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};

// update todo
const updateTodo = async (id: number, todo: Todo) => {
    try {
        const response = await axios.put(`${BASE_URL}/todos/${id}`, todo);
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};

// delete todo
const deleteTodo = async (id: number) => {
    try {
        const response = await axios.delete(`${BASE_URL}/todos/${id}`);
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};

export type { Todo };
export { getTodos, getTodo, createTodo, updateTodo, deleteTodo };