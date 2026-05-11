import { Link } from "react-router-dom";
import Popup from './Popup';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import LoadingButton from "../components/LoadingButton";
import { useLoading } from "../hooks/useLoading";
import { API_BASE_URL } from "../config/config";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const { loading, withLoading } = useLoading();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email.length === 0 || password.length === 0) {
            setShowPopup(true);
            setPopupMessage("Please Fill All The Details!");
            return;
        }

        await withLoading(async () => {
            const jsonData = JSON.stringify({ email, password });
            const token = localStorage.getItem('token');
            const url = new URL(`${API_BASE_URL}/Login`);
            url.searchParams.append("data", jsonData);

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const error = await response.json();
                    setShowPopup(true);
                    setPopupMessage(error.message);
                    return;
                }

                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', email);
                navigate("/Home");
            } catch (error) {
                console.error("Error:", error);
                setShowPopup(true);
                setPopupMessage("Something went wrong. Please try again.");
            }
        });
    };

    return (
        <>
            <main className="flex flex-col justify-center items-center text-center w-screen h-screen">
                <h1 className="mb-5 text-3xl font-semibold">Login</h1>
                <form className="flex flex-col items-center w-full max-w-sm gap-6 p-7 rounded-xl shadow-2xl"  onSubmit={handleSubmit}>
                    <label className="flex flex-col w-full text-left text-gray-700 font-medium">
                        Email:
                        <input
                            className="mt-1 border-2 border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 focus:outline-none"
                            type="email"
                            placeholder="Enter your email"
                            onChange={(e)=>setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label className="flex flex-col w-full text-left text-gray-700 font-medium">
                        Password:
                        <div className="relative mt-1">
                            <input
                                className="w-full border-2 border-gray-300 rounded-lg p-2 pr-10 focus:ring focus:ring-blue-200 focus:outline-none"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                onChange={(e)=>setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer p-0"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </label>
                    <LoadingButton
                        type="submit"
                        loading={loading}
                        loadingText="Signing in..."
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Sign In
                    </LoadingButton>
                    <label className="flex flex-col gap-4 w-full text-center text-gray-700 font-medium">
                        <Link to="/forgot" className="text-blue-500 hover:scale-105 transition duration-1000">Forgot Password</Link>
                        <div className="flex w-full justify-center gap-2">
                            <h1>Don't have a account?</h1><Link className="text-blue-500 hover:scale-105 transition
                        duration-1000" to='/Signup'>Signup</Link>
                        </div>
                    </label>
                </form>
                <div>{showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}</div>
            </main>
        </>
    );
}

export default Login;
