import Popup from './Popup';
import { useEffect, useState } from "react";
import Header from "./Header";
import { jwtDecode } from "jwt-decode";
import { useParams } from 'react-router-dom'

function Postpage() {
    const { postId } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await fetch(`https://blog-server-7cur.onrender.com/blog/${postId}`);
                const data = await response.json();
                setBlog(data.blog);
                setComments(data.comments || []);
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        };
    
        console.log(comments);  
        fetchBlog();
    }, []);
    

    // Handle adding a new comment
    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const decoded = jwtDecode(token);
            const userEmail = decoded.email;
            const response = await fetch("https://blog-server-7cur.onrender.com/addreviews", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ postId: blog.postId, email:userEmail, text: newComment }),
            });

            const data = await response.json();
            if (data.success) {
                setShowPopup(true);
                setPopupMessage(data.message);
            } else {
                console.error("Error adding comment:", data.message);
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const closePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
    };

    return (
        <>
            <div className="sticky top-0 w-full z-10 bg-white shadow-md">
                <Header />
            </div>

            <div className="flex flex-col w-screen h-screen items-center mt-20 p-5">
                {blog ? (
                    <div className="w-full max-w-4xl p-5 border rounded-lg shadow-md">
                        <h1 className="text-2xl md:text-4xl font-bold">{blog.title}</h1>
                        <p className="text-gray-600 text-sm md:text-md my-2">By {blog.email}</p>
                        <article className="text-lg text-gray-800 mt-4">{blog.content}</article>
                    </div>
                ) : (
                    <p>Loading blog...</p>
                )}

                {/* Comments Section */}
                <div className="w-full max-w-4xl mt-8 p-5 border rounded-lg shadow-md">
                    <h2 className="text-xl md:text-2xl font-semibold mb-4">Comments</h2>

                    {comments.length > 0 ? (
                        <ul className="space-y-4">
                            {comments.map(comment => (
                                <li key={comment.postId} className="p-3 border rounded-lg shadow-sm">
                                    <p className="text-sm md:text-md text-gray-700">
                                        <span className="font-semibold">{comment.email}: </span>
                                        {comment.text}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No comments yet. Be the first to comment!</p>
                    )}

                    {/* Add Comment */}
                    <div className="mt-6">
                        <textarea
                            className="w-full p-3 border rounded-lg shadow-sm text-gray-800"
                            rows="4"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <button
                            className="mt-3 px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600"
                            onClick={handleAddComment}
                        >
                            Add Comment
                        </button>
                    </div>
                    <div>{showPopup && <Popup message={popupMessage} onClose={closePopup} />}</div>
                </div>
            </div>
        </>
    );
}

export default Postpage;
