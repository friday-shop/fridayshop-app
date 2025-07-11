import { useState, createContext, type ReactNode, useEffect } from 'react';
import { axiosInstance } from '../hooks/useAxios';
import type { IUser } from '../types/user';

interface AuthContextType {
  data: IUser | null;
  saveToken: (token: string) => void;
  removeToken: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  data: null,
  saveToken: () => {},
  removeToken: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/users/self');
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    checkToken();
  }, []);

  const saveToken = async (token: string) => {
    setLoading(true);
    try {
      await localStorage.setItem(
        import.meta.env.VITE_ACCESS_TOKEN_NAME || 'access_token',
        token,
      );
      const response = await axiosInstance.get('/users/self');
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const removeToken = async () => {
    setLoading(true);
    try {
      await localStorage.removeItem(
        import.meta.env.VITE_ACCESS_TOKEN_NAME || 'access_token',
      );
      setData(null);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '2rem',
        }}
      >
        กำลังโหลด...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ data, saveToken, removeToken }}>
      {children}
    </AuthContext.Provider>
  );
}
