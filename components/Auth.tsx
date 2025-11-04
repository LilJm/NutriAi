import React, { useState } from 'react';
import Card from './ui/Card';
import { ChartIcon } from './icons/ChartIcon';
import { useTheme } from '../hooks/useTheme';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface AuthProps {
  onLogin: (email: string, password: string) => boolean;
  onRegister: (name: string, email: string, password: string) => boolean;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onRegister }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLoginMode && !name)) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    let success = false;
    if (isLoginMode) {
      success = onLogin(email, password);
    } else {
      success = onRegister(name, email, password);
    }

    if (!success && isLoginMode) {
        setError('E-mail ou senha inválidos.');
    } else if (!success && !isLoginMode) {
        setError('Este e-mail já está em uso.');
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="bg-background dark:bg-gray-900 min-h-screen flex items-center justify-center p-4 relative">
       <div className="absolute top-6 right-6">
            <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-text-light dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
       </div>
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
            <ChartIcon className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold ml-3 text-text dark:text-gray-50">NutriAI</h1>
        </div>
        <Card>
          <h2 className="text-2xl font-bold text-center text-text dark:text-gray-50 mb-6">
            {isLoginMode ? 'Acessar sua Conta' : 'Criar Nova Conta'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginMode && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-light dark:text-gray-400">Nome</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:placeholder-gray-400"
                  placeholder="Seu nome completo"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-light dark:text-gray-400">E-mail</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:placeholder-gray-400"
                placeholder="seuemail@exemplo.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-light dark:text-gray-400">Senha</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:placeholder-gray-400"
                placeholder="Sua senha"
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <div>
              <button type="submit" className="w-full px-6 py-3 bg-primary text-black font-bold rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                {isLoginMode ? 'Entrar' : 'Cadastrar'}
              </button>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button onClick={toggleMode} className="text-sm text-primary hover:text-primary-dark font-medium">
              {isLoginMode ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
