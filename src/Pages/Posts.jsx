import img from '../assets/react.svg';
import unsave from '../assets/unsave.svg';
import save from '../assets/saved.svg';
import comments from '../assets/comment.svg';
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Popup from './Popup';
import { Link } from 'react-router-dom'

function Post() {
    const [postdata, setPostdata] = useState([]);
    const [saved, setSaved] = useState(false);
    const [email, setEmail] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem('token');
                const decoded = jwtDecode(token);
                const userEmail = decoded.email;
                setEmail(userEmail);

                const response = await fetch("https://blog-server-7cur.onrender.com/allposts", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json",
                        "Authorization": `Bearer ${token}`,
                    }
                });

                const data = await response.json();
                const userPosts = data.data.filter(post => post.email !== userEmail)
                    .map(post => ({ ...post, saved: post.saved || false }));
                setPostdata(userPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };
        init();
    }, []);

    const handleSave = async (postId, email) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://blog-server-7cur.onrender.com/posts/${postId}/save`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ saved: !saved, email }),
            });

            const data = await response.json();
            if (data.success) {
                setShowPopup(true);
                setPopupMessage("Post Saved");
                setPostdata(prevPostData =>
                    prevPostData.map(post =>
                        post._id === postId ? { ...post, saved: !saved } : post
                    )
                );
            } else {
                console.error("Error saving post:", data.message);
            }
        } catch (error) {
            console.error("Error saving post:", error);
        }
    };

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
                        <div className="flex gap-2">
                            <Link to={`/postpage/${data.postId}`}><img
                                className="h-7 w-7 "
                                src={comments}
                                alt="User avatar"
                            /></Link>
                            {!data.saved ? (
                                <img
                                    className="h-7 w-7 bg-blend-color-burn"
                                    src={save}
                                    onClick={() => handleSave(data.postId, data.email)}
                                    alt="Saved icon"
                                />
                            ) : (
                                <img
                                    className="h-7 w-7 bg-blend-color-burn"
                                    src={unsave}
                                    onClick={() => handleSave(data.postId, data.email)}
                                    alt="Unsave icon"
                                />
                            )}
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
                        more..
                    </h4></Link>
                </div>
            ))}
            <div>{showPopup && <Popup message={popupMessage} onClose={closePopup} />}</div>
        </div>
    );
}

export default Post;


