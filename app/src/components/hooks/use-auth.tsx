import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import { LocalStorage } from '../../types/localstorage';

export interface Auth {
  isAuthenticated: boolean;
  login?: () => void;
  logout?: () => void;
  alertUser: () => void;
}

export const useAuth = (): Auth => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(LocalStorage.ACCESS_TOKEN);

    async function verifyToken(token: string | null) {
      try {
        if (token) {
          const response = await axios.get(API_BASE_URL.concat('authentication'), {
            headers: {
              Authorization: token,
            },
          });

          if (response.status<400) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    }

    verifyToken(token);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const alertUser = () => {
    alert('Authorization Failed');
    window.location.replace('/');
  };

  return { isAuthenticated, login, logout, alertUser };
};
