import React, { useEffect } from 'react';
import Auth from './components/Auth';
import MainApp from './MainApp';
import Onboarding from './components/Onboarding';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { User, UserProfile } from './types';

const isProfileComplete = (profile: UserProfile | undefined): boolean => {
  if (!profile) return false;
  return profile.age > 0 && profile.weight > 0 && profile.height > 0;
};

const App: React.FC = () => {
  useTheme(); // Initialize theme hook at the top level
  const [users, setUsers] = useLocalStorage<User[]>('nutriai_users', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>('nutriai_currentUser', null);
  
  const userKeySuffix = currentUser ? `_${currentUser.id}` : '';
  const [profile, setProfile] = useLocalStorage<UserProfile | undefined>(`userProfile${userKeySuffix}`, undefined);

  // This effect ensures that when the user logs out, the profile state is also cleared.
  // It also initializes a default profile for a newly logged-in user if one doesn't exist.
  useEffect(() => {
    if (!currentUser) {
      setProfile(undefined);
    } else if (profile === undefined) { // Specifically check for undefined to initialize
      setProfile({
        name: currentUser.name,
        age: 0,
        weight: 0,
        height: 0,
        goal: 'maintain_weight',
        allergies: '',
        restrictions: '',
      });
    }
  }, [currentUser, profile, setProfile]);


  const handleRegister = (name: string, email: string, password: string): boolean => {
    if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
      alert('Este e-mail já está em uso. Por favor, tente outro.');
      return false;
    }
    const newUser: User = {
      id: new Date().toISOString(),
      name,
      email,
      password, // Plain text password, not for production!
    };
    setUsers([...users, newUser]);
    // Set current user first, which changes userKeySuffix for useLocalStorage
    setCurrentUser(newUser);
    // Then explicitly set profile to undefined to trigger the initialization effect
    setProfile(undefined);
    return true;
  };

  const handleLogin = (email: string, password: string): boolean => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user && user.password === password) {
      setCurrentUser(user);
      return true;
    }
    alert('E-mail ou senha inválidos.');
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
  };

  if (!currentUser) {
    return <Auth onLogin={handleLogin} onRegister={handleRegister} />;
  }
  
  // While profile is being loaded/initialized, render nothing to prevent passing `undefined`
  if (profile === undefined) {
    return null;
  }

  if (!isProfileComplete(profile)) {
    return <Onboarding profile={profile} onSave={handleSaveProfile} />;
  }

  return <MainApp user={currentUser} onLogout={handleLogout} profile={profile} onSaveProfile={handleSaveProfile} />;
};

export default App;
