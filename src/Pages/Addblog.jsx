import Header from "./Header";
import { useForm } from "react-hook-form";
import Popup from './Popup';
import { useState } from 'react';
import LoadingButton from "../components/LoadingButton";
import { useLoading } from "../hooks/useLoading";
import { API_BASE_URL } from "../config/config";

function Addblog() {
    const userEmail = localStorage.getItem('email') || '';
    const { register, handleSubmit, reset } = useForm({
        defaultValues: { email: userEmail, title: '', content: '' },
    });
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const { loading, withLoading } = useLoading();

    const onSubmitHandler = async (formData) => {
        await withLoading(async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`${API_BASE_URL}/addpost`, {
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
                    return;
                }

                reset({ email: userEmail, title: '', content: '' });
                setShowPopup(true);
                setPopupMessage(result.message || 'Post added successfully');
            } catch (error) {
                console.error("Error during fetch:", error);
                setShowPopup(true);
                setPopupMessage('An error occurred while adding the post.');
            }
        });
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
                            className="p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
                            type="email"
                            placeholder="Enter Email"
                            readOnly
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
                            <LoadingButton
                                type="submit"
                                loading={loading}
                                loadingText="Uploading..."
                                className="w-4/5 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
                            >
                                Upload
                            </LoadingButton>
                        </div>
                    </form>
                    <div>{showPopup && <Popup message={popupMessage} onClose={closePopup} />}</div>
                </div>
            </div>
        </>
    );
}

export default Addblog;
