// src/components/Auth/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { auth } from '../config/firebaseconfig';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  return children;
};

export default ProtectedRoute;