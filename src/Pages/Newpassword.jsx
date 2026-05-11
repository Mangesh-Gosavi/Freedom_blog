import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Popup from "./Popup";
import LoadingButton from "../components/LoadingButton";
import { useLoading } from "../hooks/useLoading";
import { API_BASE_URL } from "../config/config";

function Newpassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [allowed, setAllowed] = useState(false);
    const navigate = useNavigate();
    const { loading, withLoading } = useLoading();

    useEffect(() => {
        if (sessionStorage.getItem("passwordResetAllowed") !== "true") {
            navigate("/forgot", { replace: true });
            return;
        }
        setAllowed(true);
        const stored = localStorage.getItem("userEmail");
        if (stored && stored !== "null") setEmail(stored);
    }, [navigate]);

    const savePassword = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setShowPopup(true);
            setPopupMessage("Passwords do not match");
            return;
        }
        return withLoading(async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/newpassword`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, newpassword: password }),
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    setShowPopup(true);
                    setPopupMessage(error.message || "Could not update password");
                    return;
                }
                sessionStorage.removeItem("passwordResetAllowed");
                setShowPopup(true);
                setPopupMessage("Password changed successfully");
                setTimeout(() => navigate("/"), 1500);
            } catch (error) {
                console.error(error);
                setShowPopup(true);
                setPopupMessage("Something went wrong. Please try again.");
            }
        });
    };

    if (!allowed) return null;

    return (
        <div className="flex justify-center items-center w-full min-h-screen bg-gray-100 px-4 py-6">
            <form
                onSubmit={savePassword}
                className="flex flex-col items-center bg-white w-full max-w-md p-6 sm:p-8 rounded-xl shadow-2xl gap-3"
            >
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-slate-900 mb-1">
                    <ShieldCheck size={28} />
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">New Password</h1>
                <p className="text-xs sm:text-sm text-gray-500 text-center mb-2 px-2">
                    Set a strong new password for your account
                </p>

                <div className="w-full h-px bg-gray-200 my-1" />

                <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none">
                        <Mail size={17} />
                    </span>
                    <input
                        className="h-11 w-full rounded-lg border-2 border-gray-200 bg-gray-100 pl-10 pr-10 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        readOnly
                        required
                    />
                </div>

                <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none">
                        <Lock size={17} />
                    </span>
                    <input
                        className="h-11 w-full rounded-lg border-2 border-gray-200 bg-gray-50 pl-10 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 focus:bg-white transition"
                        type={showPassword ? "text" : "password"}
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-slate-900 transition bg-transparent border-0 cursor-pointer p-0"
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="relative w-full">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none">
                        <Lock size={17} />
                    </span>
                    <input
                        className="h-11 w-full rounded-lg border-2 border-gray-200 bg-gray-50 pl-10 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 focus:bg-white transition"
                        type={showConfirm ? "text" : "password"}
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-slate-900 transition bg-transparent border-0 cursor-pointer p-0"
                    >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <LoadingButton
                    type="submit"
                    loading={loading}
                    loadingText="Saving..."
                    className="h-11 w-full rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-700 transition mt-2"
                >
                    Save New Password
                </LoadingButton>

                <Link to="/" className="text-sm text-blue-600 hover:underline mt-2">
                    ← Back to Login
                </Link>
            </form>

            {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
        </div>
    );
}

export default Newpassword;
