'use client';
import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react';
import { getIdFromToken } from '@/utils/cookieUtils';

const UserContext = createContext<null | {
  userId: string | null;
  setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}>(null);

export const UserProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [userId, setUserId] = useState<null | string>(null);

  useEffect(() => {
    const id = getIdFromToken();
    setUserId(id);
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useMyContext must be used within a MyProvider');
  }

  return context;
};
