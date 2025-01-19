import axios from 'axios';

const BASE_URL = 'http://localhost:5182';

interface Todo {
    id: number;
    title: string;
    isDone: boolean;
}

// get all todos
const getTodos = async (token : string | null) => {
    try {
        const response = await axios.get(`${BASE_URL}/todos`, {
            headers: {
                Authorization: `bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};

// get todo by id
const getTodo = async (id: number, token: string | null) => {
    try {
        const response = await axios.get(`${BASE_URL}/todos/${id}`, {
            headers: {
                Authorization: `bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};

// create todo
const createTodo = async (todo: Todo, token : string | null) => {
    try {
        const response = await axios.post(`${BASE_URL}/todos`, todo, {
            headers: {
                Authorization: `bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};

// update todo
const updateTodo = async (id: number, todo: Todo, token : string | null) => {
    try {
        const response = await axios.put(`${BASE_URL}/todos/${id}`, todo, {
            headers: {
                Authorization: `bearer ${token}`,
            },
        });
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};

// delete todo
const deleteTodo = async (id: number, token : string | null) => {
    try {
        const response = await axios.delete(`${BASE_URL}/todos/${id}`, {
            headers: {
                Authorization: `bearer ${token}`,
            }
        });
        return response.data;
    }
    catch (error) {
        console.error('Error:', error);
    }
};

export type { Todo };
export { getTodos, getTodo, createTodo, updateTodo, deleteTodo };