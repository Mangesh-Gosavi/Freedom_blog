import Header from "./Header";
import img from '../assets/react.svg';
import save from '../assets/saved.svg';
import Search from "./Search";
import Popup from './Popup';
import { Link } from 'react-router-dom'
import comments from '../assets/comment.svg';
import { useEffect, useState } from "react";
import IconButton from "../components/IconButton";
import { useKeyedLoading } from "../hooks/useLoading";
import { API_BASE_URL } from "../config/config";

function Favourite() {
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const { isLoading, withLoading } = useKeyedLoading();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/favorites`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error("Error fetching favorite posts");
                }

                const data = await response.json();
                if (data.success) {
                    setFavoritePosts(data.data);
                }
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };

        fetchFavorites();
    }, []);

    const handleremove = (postId, email) =>
        withLoading(postId, async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/removefav`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ postId, email }),
                });

                const data = await response.json();
                if (data.success) {
                    setShowPopup(true);
                    setPopupMessage("Post removed from favorites");
                    setFavoritePosts(prevPosts => prevPosts.filter(post => post.postId !== postId));
                } else {
                    setShowPopup(true);
                    setPopupMessage(data.message || "Error removing from favorites");
                }
            } catch (error) {
                console.error("Error removing from favorites:", error);
                setShowPopup(true);
                setPopupMessage("Error removing from favorites");
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
                <div className="flex flex-col p-5">
                    <h2 className="text-left font-semibold text-xl mb-5 md:text-2xl">Your Favourite Blogs</h2>
                    {favoritePosts.length > 0 ? (
                        favoritePosts.map(post => (
                            <div key={post._id} className="flex flex-col gap-5 w-full h-80 shadow-2xl border rounded-lg overflow-hidden">
                                <div className="flex justify-between w-full p-3 items-center gap-4 bg-slate-200">
                                    <div className="flex gap-2">
                                        <img
                                            className="h-7 w-7 rounded-full"
                                            src={img}
                                            alt="User avatar"
                                        />
                                        <h1 className="text-sm md:text-lg xl:text-2xl">
                                            <span className="font-normal">{post.email}</span>
                                        </h1>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Link to={`/postpage/${post.postId}`}><img
                                            className="h-7 w-7 "
                                            src={comments}
                                            alt="Comments"
                                        /></Link>
                                        <IconButton
                                            icon={save}
                                            alt="Remove from favorites"
                                            loading={isLoading(post.postId)}
                                            onClick={() => handleremove(post.postId, post.email)}
                                        />
                                    </div>
                                </div>
                                <h1 className="text-sm md:text-2xl">
                                    <span className="font-semibold">{post.title}</span>
                                </h1>
                                <div className="flex-1 p-5 overflow-hidden overflow-ellipsis">
                                    <article className="text-sm md:text-lg xl:text-2xl text-gray-700 h-full line-clamp-4">
                                        {post.content}
                                    </article>
                                </div>

                                <Link to={`/postpage/${post.postId}`}><h4 className="p-5 text-blue-500 font-medium hover:underline cursor-pointer">
                                    View Blog
                                </h4></Link>
                            </div>
                        ))
                    ) : (
                        <p>No favorite posts found.</p>
                    )}
                </div>
                <div>{showPopup && <Popup message={popupMessage} onClose={closePopup} />}</div>
            </div>
        </>
    );
}

export default Favourite;
