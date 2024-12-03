import Header from "./Header";
import { useForm } from "react-hook-form";
import Popup from './Popup';
import { useState } from 'react';

function Addblog() {
    const { register, handleSubmit, reset, formState } = useForm();
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    // Handle form submission
    const onSubmitHandler = async (formData) => {
        console.log(formData);
        const token = localStorage.getItem('token');
        console.log("Token retrieved:", token);
        try {
            const response = await fetch("https://blog-server-7cur.onrender.com/addpost", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                setShowPopup(true);
                setPopupMessage(result.message || 'Something went wrong!');
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Reset the form fields
            reset(); 

            setShowPopup(true);
            setPopupMessage(result.message || 'Post added successfully');
        } catch (error) {
            console.error("Error during fetch:", error);
            setShowPopup(true);
            setPopupMessage('An error occurred while adding the post.');
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
    };

    return (
        <>
            <div className="sticky top-0 w-full"><Header /></div>
            <div className="flex flex-col text-center w-screen h-screen">
                <div className="flex flex-col p-5">
                    <h2 className="text-left text-xl mb-5 md:text-2xl">Upload Your Blog</h2>
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmitHandler)} >
                        <label>Email </label>
                        <input
                            {...register("email")}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="email"
                            placeholder="Enter Email"
                            required
                        />
                        <label>Topic </label>
                        <input
                            {...register("title")}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter Your Topic"
                            required
                        />
                        <label>Content </label>
                        <textarea
                            {...register("content")}
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Your Content"
                            required
                        />
                        <div className="flex justify-evenly w-full">
                            <button
                                type="submit"
                                className="w-4/5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
                            >
                                Upload
                            </button>
                        </div>
                    </form>
                    <div>{showPopup && <Popup message={popupMessage} onClose={closePopup} />}</div>
                </div>
            </div>
        </>
    );
}

export default Addblog;
