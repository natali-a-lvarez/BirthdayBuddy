import React, {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
  useEffect,
} from "react";
import jwtDecode from "jwt-decode";
import { useStorageState } from "./useStorageState";
import Auth0 from "react-native-auth0";
import { AUTH0_DOMAIN, AUTH0_CLIENT_ID } from "./auth0Config";

// Initialize Auth0
const auth0 = new Auth0({ domain: AUTH0_DOMAIN, clientId: AUTH0_CLIENT_ID });

type UserInfo = {
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: any;
};

type AuthContextType = {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  session: string | null;
  userInfo: UserInfo | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: async () => {},
  session: null,
  userInfo: null,
  isLoading: false,
});

// Hook to use the AuthContext
export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

// SessionProvider Component
export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    // Check if there is a stored session when the app loads
    if (session) {
      const decodedToken: UserInfo = jwtDecode(session);
      setUserInfo(decodedToken);

      // Optionally, fetch user info from the Auth0 /userinfo endpoint
      auth0.auth
        .userInfo({ token: session })
        .then((fetchedUserInfo) => setUserInfo(fetchedUserInfo))
        .catch(() => setUserInfo(null));
    }
  }, [session]);

  const signIn = async () => {
    try {
      const credentials = await auth0.webAuth.authorize({
        scope: "openid profile email",
        audience: `https://${AUTH0_DOMAIN}/userinfo`,
      });

      setSession(credentials.idToken); // Store the session

      // Decode the ID token to extract user information
      const decodedToken: UserInfo = jwtDecode(credentials.idToken);
      setUserInfo(decodedToken);

      // Optionally, fetch additional user info from Auth0's /userinfo endpoint
      const fetchedUserInfo = await auth0.auth.userInfo({
        token: credentials.accessToken,
      });
      setUserInfo(fetchedUserInfo);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const signOut = async () => {
    try {
      await auth0.webAuth.clearSession();
      setSession(null);
      setUserInfo(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ signIn, signOut, session, userInfo, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
