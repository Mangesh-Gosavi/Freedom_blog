import Header from "./Header";
import img from '../assets/react.svg';
import remove from '../assets/delete.svg';
import Popup from './Popup';
import Search from "./Search";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from 'react-router-dom'
import comments from '../assets/comment.svg';

function Archive() {
    const [postdata, setPostdata] = useState([]);
    const [email, setEmail] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("No token found");

                const decoded = jwtDecode(token);
                const userEmail = decoded.email;
                // console.log(userEmail)
                setEmail(userEmail);

                const response = await fetch("https://blog-server-7cur.onrender.com/allposts", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });

                const data = await response.json();
                // console.log("Fetched Posts:", data.data);

                const userPosts = data.data.filter(post => post.email === userEmail);
                //    console.log("Filtered User Posts:", userPosts);
                setPostdata(userPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        init();
    }, []);

    const handleremove = async (postId) => {
        console.log(`Removing post with ID: ${postId}`);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch("https://blog-server-7cur.onrender.com/removepost", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId }),
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
                                <div className="flex gap-2">
                                    <Link to={`/postpage/${data.postId}`}><img
                                        className="h-7 w-7 "
                                        src={comments}
                                        alt="User avatar"
                                    /></Link>
                                    <img
                                        className="h-7 w-7 bg-blend-color-burn cursor-pointer"
                                        src={remove}
                                        onClick={() => handleremove(data.postId)}
                                        alt="Saved icon"
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
