import { AuthContext, useAuthProvider } from '../hooks/useAuth';

export default function AuthProvider({ children }) {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
