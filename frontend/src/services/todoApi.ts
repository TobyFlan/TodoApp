import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5182";

interface Todo {
  id: number;
  title: string;
  isDone: boolean;
}


  const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
  };

  const getTodos = async () => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    try {
      const response = await axios.get(`${BASE_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  };

  const getTodo = async (id: number) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    try {
      const response = await axios.get(`${BASE_URL}/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching todo:", error);
      throw error;
    }
  };

  const createTodo = async (todo: Todo) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    try {
      const response = await axios.post(`${BASE_URL}/todos`, todo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  };

  const updateTodo = async (id: number, todo: Todo) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    try {
      const response = await axios.put(`${BASE_URL}/todos/${id}`, todo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  };

  const deleteTodo = async (id: number) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error("No authentication token found. Please log in.");
    }

    try {
      const response = await axios.delete(`${BASE_URL}/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  };


  export {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
  };


export type { Todo };

