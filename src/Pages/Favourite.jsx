import Header from "./Header";
import img from '../assets/react.svg';
import save from '../assets/saved.svg';
import Search from "./Search";
import Popup from './Popup';
import { Link } from 'react-router-dom'
import comments from '../assets/comment.svg';


import { useEffect, useState } from "react";

function Favourite() {
    const [favoritePosts, setFavoritePosts] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch("https://blog-server-7cur.onrender.com/favorites", {
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
                } else {
                    console.log("No favorite posts found");
                }
            } catch (error) {
                console.error("Error fetching favorites:", error);
            }
        };

        fetchFavorites();
    }, []);

    // Handle removing a post from favorites
    const handleremove = async (postId, email) => {
        console.log(`Removing post with ID: ${postId}`);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch("https://blog-server-7cur.onrender.com/removefav", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId, email }),
            });

            const data = await response.json();
            if (data.success) {
                console.log("Post removed from favorites");
                setShowPopup(true);
                setPopupMessage("Post removed from favorites");
                setFavoritePosts(prevPosts => prevPosts.filter(post => post._id !== postId));
            } else {
                setShowPopup(true);
                setPopupMessage("Error removing from favorites:");
                console.error("Error removing from favorites:", data.message);
            }
        } catch (error) {
            console.error("Error removing from favorites:", error);
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
                <Search />
                <div className="flex flex-col p-5">
                    <h2 className="text-left font-semibold text-xl mb-5 md:text-2xl">Your Favourite Blogs</h2>
                    <div className="flex flex-col gap-y-5">
                        {favoritePosts.length > 0 ? (
                            favoritePosts.map(post => (
                                <div key={post._id} className="flex flex-col w-full h-80 shadow-2xl border rounded-lg overflow-hidden">
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
                                        <div className="flex gap-2">
                                            <Link to={`/postpage/${post.postId}`}><img
                                                className="h-7 w-7 "
                                                src={comments}
                                                alt="Comments"
                                            /></Link>
                                            <img
                                                className="h-7 w-7 bg-blend-color-burn cursor-pointer"
                                                src={save}
                                                onClick={() => handleremove(post.postId, post.email)}
                                                alt="Saved icon"
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
                                    <h4 className="p-5 text-blue-500 font-medium hover:underline cursor-pointer">
                                        View Blog
                                    </h4>
                                </div>
                            ))
                        ) : (
                            <p>No favorite posts found.</p>
                        )}
                    </div>
                </div>
                <div>{showPopup && <Popup message={popupMessage} onClose={closePopup} />}</div>
            </div>

        </>
    );
}

export default Favourite;
