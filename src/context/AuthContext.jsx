import { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // check if user already an active session
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) setUser(data.user);
            setLoading(false);
        };
        checkSession();

        // listen to login/logout events live
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        //clean on unmount
        return () => listener.subscription.unsubscribe();
    }, []);

    const value = {
        user,
        loading,
        logout: () => supabase.auth.signOut()
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )

}