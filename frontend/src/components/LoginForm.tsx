import { useState } from 'react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");

    const handleLogin = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
    
        try {
          const response = await axios.post("http://localhost:5182/auth/login", {
            username,
            password,
          });
          
          // Store the token in localStorage or sessionStorage
          localStorage.setItem("token", response.data.token);
          alert("Login successful!");
        } catch {
          setError("Invalid username or password");
        }
      };

    const handleLogout = () => {
        localStorage.removeItem("token");
        alert("Logged out");
    };
    
      return (
        <div className="mb-6">
        {!localStorage.getItem("token") ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white bg-opacity-20 border-none focus:ring-2 focus:ring-purple-400 text-gray-800 placeholder-gray-300"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white bg-opacity-20 border-none focus:ring-2 focus:ring-purple-400 text-gray-800 placeholder-gray-300"
            />
            <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              Login
            </Button>
            {error.length != 0 && (
              <Alert variant="destructive" className="bg-red-500 text-white">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        ) : (
          <Button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white">
            Logout
          </Button>
        )}
      </div>
      );
    };
    
    export default LoginForm;