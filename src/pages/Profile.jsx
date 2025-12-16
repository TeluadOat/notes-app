import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    // fetch user Info
    useEffect(() => {
        const loadUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data.user) return navigate("/login");
            setUser(data.user);
            setEmail(data.user.email);
            setName(data.user.user_metadata?.name || "");
        };
        loadUser();
    }, []);

    // update email
    const updateEmail = async (e) => {
        setMessage("");
        // e.preventDefault();
        // if (!email.trim()) {
        //     setMessage("Email cannot be empty");
        //     return;
        // }
        const { error } = await supabase.auth.updateUser({ email });
        if (error) setMessage("Error updating email: " + error.message);
        else setMessage("Email updated successfully");

    };

    // update Profile Name
    const updateName = async () => {
        setMessage("");
        const { error } = await supabase.auth.updateUser({
            data: { name }
        });
        if (error) setMessage("Error updating name: " + error.message);
        else setMessage("Name updated successfully");
    }

    // update Password
    const updatePassword = async () => {
        setMessage("");
        // if (password.length < 6) {
        //     setMessage("Password must be at least 6 characters");
        //     return;
        // }
        const { error } = await supabase.auth.updateUser({ password });
        if (error) setMessage("Error updating password: " + error.message);
        else setMessage("Password updated successfully");
    }

    if (!user) return <p className="p-6 dark:bg-black dark:text-gray-200 w-lg mx-auto h-screen">Loading...</p>;

    return (
        <div className="dark:bg-black dark:text-gray-100 h-screen p-6 max-w-lg mx-auto">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>
            <ThemeToggle />
            {message && (
                <p className="mb-4 text-center text-green-600 font-semibold">{message}</p>
            )}

            {/* Email Update */}
            <div className="mb-6 bg-white dark:bg-black p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">Update Email</h2>
                <input
                    type="email"
                    value={email}
                    className="w-full p-2 border border-gray-400 dark:border-gray-500 rounded mb-3 focus:outline-none focus:ring-0"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button
                    onClick={updateEmail}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                    Save Email
                </button>
            </div>

            {/* Name Update */}
            <div className="mb-6 bg-white dark:bg-black p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">Display Name</h2>
                <input
                    type="text"
                    value={name}
                    className="w-full p-2 border border-gray-400 dark:border-gray-500 rounded mb-3 focus:outline-none"
                    onChange={(e) => setName(e.target.value)}
                />
                <button
                    onClick={updateName}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                >
                    Save Name
                </button>
            </div>

            {/* Password Update */}
            <div className="mb-6 bg-white dark:bg-black p-4 rounded shadow">
                <h2 className="text-lg font-semibold mb-2">Update Password</h2>
                <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full p-2 border border-gray-400 dark:border-gray-500 rounded mb-3 focus:outline-none"
                />
                <button
                    onClick={updatePassword}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                    Change Password
                </button>
            </div>

            <button
                onClick={() => navigate("/")}
                className="mt-6 block text-center text-blue-600 underline hover:text-blue-800"
            >
                Back
            </button>
        </div>
    )

}