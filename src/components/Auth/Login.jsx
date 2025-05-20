// src/components/Auth/Login.js
import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebaseconfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [navigate]);

  // Only show content after auth state is checked
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-lg">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setShowDeleteConfirm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    if (!deletePassword) {
      setError('Please enter your password to confirm deletion');
      return;
    }

    setDeleteLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, deletePassword);
      
      // Reauthenticate user
      await reauthenticateWithCredential(user, credential);
      
      // Delete user account
      await deleteUser(user);
      
      setUser(null);
      setShowDeleteConfirm(false);
      setDeletePassword('');
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-lg">
        {user ? (
          <>
            <h2 className="text-2xl font-extrabold text-center text-blue-700 mb-4">
              Welcome, {user.email}
            </h2>
            
            {showDeleteConfirm ? (
              <div className="mb-6">
                <p className="text-center text-gray-600 mb-4">
                  Are you sure you want to delete your account? This action cannot be undone.
                </p>
                <div className="mb-4">
                  <label htmlFor="deletePassword" className="block text-gray-700 text-sm font-medium mb-1">
                    Enter your password to confirm
                  </label>
                  <input
                    id="deletePassword"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className={`flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                      deleteLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {deleteLoading ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-600 mb-6">
                You are logged in. Redirecting to your page...
              </p>
            )}

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleLogout}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold"
              >
                Sign Out
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold"
              >
                Delete Account
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
              {isLogin ? 'Login' : 'Create Account'}
            </h2>

            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded text-center">
              Please log in or sign up to access Admin, Faculty, or Student pages.
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="6"
                  placeholder="••••••••"
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition duration-200 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : isLogin ? 'Login' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 font-semibold hover:underline focus:outline-none"
                >
                  {isLogin ? 'Sign up here' : 'Login here'}
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;