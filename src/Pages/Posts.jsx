import img from '../assets/react.svg';
import unsave from '../assets/unsave.svg';
import save from '../assets/saved.svg';
import comments from '../assets/comment.svg';
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Popup from './Popup';
import { Link } from 'react-router-dom'
import IconButton from "../components/IconButton";
import { useKeyedLoading } from "../hooks/useLoading";
import { API_BASE_URL } from "../config/config";

function Post() {
    const [postdata, setPostdata] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const { isLoading, withLoading } = useKeyedLoading();

    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem('token');
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
                const userPosts = data.data
                    .filter(post => post.email !== userEmail)
                    .map(post => ({ ...post, saved: post.saved || false }));
                setPostdata(userPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        init();
    }, []);

    const handleSave = (post) =>
        withLoading(post.postId, async () => {
            const nextSaved = !post.saved;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/posts/${post.postId}/save`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ saved: nextSaved, email: post.email }),
                });

                const data = await response.json();
                if (data.success) {
                    setShowPopup(true);
                    setPopupMessage(nextSaved ? "Post Saved" : "Post Unsaved");
                    setPostdata(prev =>
                        prev.map(p =>
                            p.postId === post.postId ? { ...p, saved: nextSaved } : p
                        )
                    );
                } else {
                    setShowPopup(true);
                    setPopupMessage(data.message || "Error saving post");
                }
            } catch (error) {
                console.error("Error saving post:", error);
                setShowPopup(true);
                setPopupMessage("Error saving post");
            }
        });

    const closePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
    };

    return (
        <div className="flex flex-col gap-6">
            {postdata.map((data) => (
                <div key={data._id} className="flex flex-col w-full h-80 shadow-2xl border rounded-lg overflow-hidden">
                    <div className="flex justify-between w-full p-3 items-center gap-4 bg-slate-200">
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
                                icon={data.saved ? unsave : save}
                                alt={data.saved ? "Unsave post" : "Save post"}
                                loading={isLoading(data.postId)}
                                onClick={() => handleSave(data)}
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
            <div>{showPopup && <Popup message={popupMessage} onClose={closePopup} />}</div>
        </div>
    );
}

export default Post;
