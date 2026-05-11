import Header from "./Header";
import img from '../assets/react.svg';
import remove from '../assets/delete.svg';
import Popup from './Popup';
import Search from "./Search";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom'
import comments from '../assets/comment.svg';
import IconButton from "../components/IconButton";
import { useKeyedLoading } from "../hooks/useLoading";
import { API_BASE_URL } from "../config/config";

function Archive() {
    const [postdata, setPostdata] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const { isLoading, withLoading } = useKeyedLoading();

    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("No token found");

                const decoded = jwtDecode(token);
                const userEmail = decoded.email;

                const response = await fetch(`${API_BASE_URL}/allposts`, {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });

                const data = await response.json();
                const userPosts = data.data.filter(post => post.email === userEmail);
                setPostdata(userPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        init();
    }, []);

    const handleremove = (postId) =>
        withLoading(postId, async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/removepost`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ postId }),
                });

                const data = await response.json();
                if (data.success) {
                    setShowPopup(true);
                    setPopupMessage("Post removed");
                    setPostdata(prevPosts => prevPosts.filter(post => post.postId !== postId));
                } else {
                    setShowPopup(true);
                    setPopupMessage(data.message || "Error removing post");
                }
            } catch (error) {
                console.error("Error removing post:", error);
                setShowPopup(true);
                setPopupMessage("Error removing post");
            }
        });

    const closePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
    };

    return (
        <>
            <div className="sticky top-0 w-full"><Header /></div>
            <div className="flex flex-col text-center w-screen h-screen">
                <Search />
                <div className="flex flex-col gap-5 p-5">
                    <h2 className="text-left font-semibold text-xl mb-5 md:text-2xl">Your Blogs</h2>
                    {postdata.map((data) => (
                        <div key={data._id} className="flex flex-col w-full h-80 shadow-2xl border rounded-lg overflow-hidden">
                            <div className="flex justify-between w-full p-3 items-center bg-slate-200">
                                <div className="flex gap-2">
                                    <img
                                        className="h-7 w-7 rounded-full"
                                        src={img}
                                        alt="User avatar"
                                    />
                                    <h1 className="text-sm md:text-lg xl:text-2xl">
                                        <span className="font-normal">{data.email}</span>
                                    </h1>
                                </div>
                                <div className="flex gap-2 items-center">
                                    <Link to={`/postpage/${data.postId}`}><img
                                        className="h-7 w-7 "
                                        src={comments}
                                        alt="Comments"
                                    /></Link>
                                    <IconButton
                                        icon={remove}
                                        alt="Remove post"
                                        loading={isLoading(data.postId)}
                                        onClick={() => handleremove(data.postId)}
                                    />
                                </div>
                            </div>
                            <h1 className="text-sm md:text-2xl font-semibold">
                                <span className="font-normal">{data.title}</span>
                            </h1>
                            <div className="flex-1 p-5 overflow-hidden overflow-ellipsis">
                                <article className="text-sm md:text-lg xl:text-2xl text-gray-700 h-full line-clamp-4">
                                    {data.content}
                                </article>
                            </div>
                            <Link to={`/postpage/${data.postId}`}><h4 className="p-5 text-blue-500 font-medium hover:underline cursor-pointer">
                                View Blog
                            </h4></Link>
                        </div>
                    ))}
                </div>
                <div>{showPopup && <Popup message={popupMessage} onClose={closePopup} />}</div>
            </div>
        </>
    );
}

export default Archive;
