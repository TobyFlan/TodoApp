import { useState } from 'react';
import axios from 'axios';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useAuth } from '@/components/AuthContext';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");
    const { isAuthenticated, login, logout } = useAuth();

    const handleLogin = async (e : React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
  
      try {
        const response = await axios.post("http://localhost:5182/auth/login", {
          username,
          password,
        });
        
        // Store the token in localStorage or sessionStorage
        login(response.data.token);
        alert("Login successful!");
      } catch {
        setError("Invalid username or password");
      }
    };

    const handleLogout = () => {
        logout();
        alert("Logged out");
    };

    const handleRegister = async (e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setError("");
    
        try {
          const response = await axios.post("http://localhost:5182/auth/register", {
            username,
            password,
          });
          
          // Store the token in localStorage or sessionStorage
          login(response.data.token);
          alert("Register successful!");
        } catch {
          setError("Not yet implemented");
        }
    };
    
      return (
        <div className="mb-6">
        {!isAuthenticated ? (
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
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                Login
              </Button>
              <Button type="button" onClick={handleRegister} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Register
              </Button>
            </div>
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