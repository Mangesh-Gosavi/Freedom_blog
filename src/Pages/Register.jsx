import { Link } from "react-router-dom";
import Popup from './Popup';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function Register() {
    const userId = randomid()
    const [name,setName] = useState('')
    const [email,setEmail] =useState('')
    const [password,setPassword] = useState('') 
    const [repassword,setRepassword] = useState('') 
    const [error, seterror] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const navigate = useNavigate();

    function randomid(){
        var characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        var lenString = 7;
        var randomstring = '';  
        for (var i=0; i<lenString; i++) {  
          var rnum = Math.floor(Math.random() * characters.length);  
          randomstring += characters.substring(rnum, rnum+1);  
        }  
        return randomstring
      }

      const handleSubmit = async (e) => {
        e.preventDefault();
        if(name.length != 0 &&  email.length != 0 &&  password.length != 0 && repassword.length != 0){
              if(password == repassword){
                const data = {"id":userId,"name":name,"email":email,"password":password}
                try {
                    const response = await fetch("https://blog-server-7cur.onrender.com/Signup", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });
                    
                  if (!response.ok) {
                    const error = await response.json()
                    seterror(error.message)
                    setShowPopup(true);
                    setPopupMessage(error.message)
                    return;
                  }
                  navigate("/Home");
                  
                } catch (error) {
                    console.error("Error:", error);
                }
              }
              else{
                seterror("Both Passwords don't match!")
                setShowPopup(true);
                setPopupMessage("Both Passwords don't match!");
                return;
              }
        }
        else{
          seterror("Please Fill All The Details!")
          setShowPopup(true);
          setPopupMessage("Please Fill All The Details!");
          return;
        }
      }

    return (
        <>
            <main className="flex flex-col justify-center items-center text-center w-screen min-h-screen ">
                <h1 className="mb-5 text-3xl font-semibold">Signup</h1>
                <form className="flex flex-col items-center w-full max-w-sm gap-6 p-7 bg-white rounded-xl shadow-2xl" onSubmit={handleSubmit}>
                    <label className="flex flex-col w-full text-left text-gray-700 font-medium">
                        Name:
                        <input
                            className="mt-1 border-2 border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 focus:outline-none"
                            type="text"
                            placeholder="Enter your Name"
                            onChange={(e)=>setName(e.target.value)}
                            required
                        />
                    </label>
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
                    <label className="flex flex-col w-full text-left text-gray-700 font-medium">
                        Re-password:
                        <input
                            className="mt-1 border-2 border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 focus:outline-none"
                            type="password"
                            placeholder="Enter your password"
                            onChange={(e)=>setRepassword(e.target.value)}
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Sign up
                    </button>
                    <label className="flex flex-col gap-4 w-full text-center text-gray-700 font-medium">
                        <div className="flex w-full justify-center gap-2">
                            <h1>Already have as account?</h1><Link className="text-blue-500 hover:scale-105 transition 
                        duration-1000" to='/'>Signin</Link>
                        </div>
                    </label>
                </form>
                <div>{showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}</div>
            </main>
        </>
    );
}

export default Register;
