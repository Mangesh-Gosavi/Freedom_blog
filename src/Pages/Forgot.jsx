import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ShieldCheck, Send } from "lucide-react";
import Popup from "./Popup";
import LoadingButton from "../components/LoadingButton";
import { useLoading } from "../hooks/useLoading";
import { API_BASE_URL } from "../config/config";

function Forgot() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const navigate = useNavigate();
    const { loading: sending, withLoading: withSending } = useLoading();
    const { loading: verifying, withLoading: withVerifying } = useLoading();

    const sendOtp = (e) => {
        e.preventDefault();
        if (!email) return;
        return withSending(async () => {
            localStorage.setItem("userEmail", email);
            try {
                const response = await fetch(`${API_BASE_URL}/sendotp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });
                if (!response.ok) {
                    setShowPopup(true);
                    setPopupMessage("Could not send OTP. Please try again.");
                    return;
                }
                setOtpSent(true);
                setShowPopup(true);
                setPopupMessage("OTP sent to your email");
            } catch (error) {
                console.error(error);
                setShowPopup(true);
                setPopupMessage("Something went wrong. Please try again.");
            }
        });
    };

    const verifyOtp = (e) => {
        e.preventDefault();
        if (!otp) return;
        return withVerifying(async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/verifyotp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, otp: parseInt(otp, 10) }),
                });
                if (!response.ok) {
                    const error = await response.json().catch(() => ({}));
                    setShowPopup(true);
                    setPopupMessage(error.message || "Invalid OTP");
                    return;
                }
                sessionStorage.setItem("passwordResetAllowed", "true");
                setShowPopup(true);
                setPopupMessage("OTP Verified");
                navigate("/newpassword");
            } catch (error) {
                console.error(error);
                setShowPopup(true);
                setPopupMessage("Something went wrong. Please try again.");
            }
        });
    };

    return (
        <div className="flex justify-center items-center w-full min-h-screen bg-gray-100 px-4 py-6">
            <div className="flex flex-col items-center bg-white w-full max-w-md p-6 sm:p-8 rounded-xl shadow-2xl gap-2">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-indigo-100 text-slate-900 mb-1">
                    {otpSent ? <ShieldCheck size={28} /> : <Mail size={28} />}
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Forgot Password</h1>
                <p className="text-xs sm:text-sm text-gray-500 text-center px-2">
                    {otpSent
                        ? "Enter the OTP sent to your email"
                        : "We'll send an OTP to reset your password"}
                </p>

                <div className="flex items-center gap-1.5 mt-2">
                    <span className={`w-2.5 h-2.5 rounded-full transition-colors ${!otpSent ? "bg-slate-900" : "bg-gray-300"}`} />
                    <span className={`w-10 h-0.5 transition-colors ${otpSent ? "bg-slate-900" : "bg-gray-300"}`} />
                    <span className={`w-2.5 h-2.5 rounded-full transition-colors ${otpSent ? "bg-slate-900" : "bg-gray-300"}`} />
                </div>
                <p className="text-xs text-gray-400 mb-3">Step {otpSent ? "2" : "1"} of 2</p>

                {!otpSent ? (
                    <form className="flex flex-col gap-3 w-full" onSubmit={sendOtp}>
                        <div className="relative w-full">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none">
                                <Mail size={17} />
                            </span>
                            <input
                                className="h-11 w-full rounded-lg border-2 border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 focus:bg-white transition"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <LoadingButton
                            type="submit"
                            loading={sending}
                            loadingText="Sending..."
                            disabled={!email}
                            className="h-11 w-full rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-700 transition disabled:bg-gray-400"
                        >
                            <span className="inline-flex items-center gap-2">
                                <Send size={15} /> Send OTP
                            </span>
                        </LoadingButton>
                    </form>
                ) : (
                    <form className="flex flex-col gap-3 w-full" onSubmit={verifyOtp}>
                        <div className="relative w-full">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none">
                                <Mail size={17} />
                            </span>
                            <input
                                className="h-11 w-full rounded-lg border-2 border-gray-200 bg-gray-100 pl-10 pr-3 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                                type="email"
                                value={email}
                                readOnly
                            />
                        </div>
                        <div className="relative w-full">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none">
                                <ShieldCheck size={17} />
                            </span>
                            <input
                                className="h-11 w-full rounded-lg border-2 border-gray-200 bg-gray-50 pl-10 pr-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-900 focus:bg-white transition"
                                type="number"
                                inputMode="numeric"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                        </div>
                        <LoadingButton
                            type="submit"
                            loading={verifying}
                            loadingText="Verifying..."
                            className="h-11 w-full rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-700 transition"
                        >
                            Verify OTP
                        </LoadingButton>
                        <button
                            type="button"
                            onClick={() => setOtpSent(false)}
                            className="text-sm text-blue-600 hover:underline mt-1 self-center bg-transparent border-0 cursor-pointer"
                        >
                            Change email
                        </button>
                    </form>
                )}

                <Link to="/" className="text-sm text-blue-600 hover:underline mt-2">
                    ← Back to Login
                </Link>
            </div>

            {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
        </div>
    );
}

export default Forgot;
