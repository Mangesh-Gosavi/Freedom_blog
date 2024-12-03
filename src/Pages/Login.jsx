import { Link } from "react-router-dom";
import Popup from './Popup';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const data = { "email": email, "password": password }
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const jsonData = JSON.stringify(data);

        const token = localStorage.getItem('token');
        console.log("Token retrieved:", token);
        const url = new URL("https://blog-server-7cur.onrender.com/Login");
        url.searchParams.append("data", jsonData);

        if (email.length != 0 && password.length != 0) {
            try {

                const response = await fetch(url, {
                    method: "GET",
                    headers:
                    {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    const error = await response.json()
                    console.error(error);
                    setShowPopup(true);
                    setPopupMessage(error.message)
                    return;
                }

                const data = await response.json();
                console.log(data);
                localStorage.setItem('token', data.token);
                navigate("/Home");
            } catch (error) {
                console.error("Error:", error);
            }
        }
        else {
            alert("Please Fill All The Details!")
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
    };



    return (
        <>
            <main className="flex flex-col justify-center items-center text-center w-screen h-screen">
                <h1 className="mb-5 text-3xl font-semibold">Login</h1>
                <form className="flex flex-col items-center w-full max-w-sm gap-6 p-7 rounded-xl shadow-2xl"  onSubmit={(e)=>{handleSubmit(e)}}>
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
                        <input
                            className="mt-1 border-2 border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 focus:outline-none"
                            type="password"
                            placeholder="Enter your password"
                            onChange={(e)=>setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Sign In
                    </button>
                    <label className="flex flex-col gap-4 w-full text-center text-gray-700 font-medium">
                        <h1 className="text-blue-500 hover:scale-105 transition 
                        duration-1000">Forgot Password</h1>
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
