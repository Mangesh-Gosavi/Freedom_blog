import menu from '../assets/align-justify.svg';
import cross from '../assets/x.svg';
import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
    const [sidebar, setSidebarMenubar] = useState(false);

    const logout = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://blog-server-7cur.onrender.com/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                localStorage.removeItem('token');
                window.location.href = "/login";
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };
    

    return (
        <>
            <nav className="flex justify-between items-center border shadow-2xl w-full h-16 md:h-20 px-4 md:px-8 bg-white">
                <h1 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Freedom
                </h1>

                <ul className="hidden md:flex gap-6 list-none">
                    <Link to="/home">
                        <li className="p-2 hover:scale-110 transition duration-300 cursor-pointer">Home</li>
                    </Link>
                    <Link to="/favourite">
                        <li className="p-2 hover:scale-110 transition duration-300 cursor-pointer">Favourite</li>
                    </Link>
                    <Link to="/addblog">
                        <li className="p-2 hover:scale-110 transition duration-300 cursor-pointer">Add Blog</li>
                    </Link>
                    <Link to="/archive">
                        <li className="p-2 hover:scale-110 transition duration-300 cursor-pointer">Archive</li>
                    </Link>
                    <Link to="/">
                        <button type='submit' onClick={() => setSidebarMenubar(false)} className="bg-red-600 p-2 rounded-lg hover:scale-110 transition duration-300 cursor-pointer">Logout</button>
                    </Link>
                </ul>

                {!sidebar ? (
                    <img
                        className="block h-10 w-10 md:hidden bg-white p-2 rounded-md shadow-lg shadow-gray-500 cursor-pointer"
                        src={menu}
                        alt="menu icon"
                        onClick={() => setSidebarMenubar(true)}
                    />
                ) : (
                    <img
                        className="block h-10 w-10 md:hidden p-2 rounded-full cursor-pointer"
                        src={cross}
                        alt="close icon"
                        onClick={() => setSidebarMenubar(false)}
                    />
                )}
            </nav>

            {sidebar && (
                <div className="absolute top-16 left-0 bg-white text-black w-full p-5 shadow-lg shadow-gray-500 z-20 md:hidden">
                    <ul className="flex flex-col gap-4 list-none">
                        <Link to="/home" onClick={() => setSidebarMenubar(false)}>
                            <li className="cursor-pointer hover:font-semibold">Home</li>
                        </Link>
                        <Link to="/favourite" onClick={() => setSidebarMenubar(false)}>
                            <li className="cursor-pointer hover:font-semibold">Favourite</li>
                        </Link>
                        <Link to="/addblog" onClick={() => setSidebarMenubar(false)}>
                            <li className="cursor-pointer hover:font-semibold">Add Blog</li>
                        </Link>
                        <Link to="/archive" onClick={() => setSidebarMenubar(false)}>
                            <li className="cursor-pointer hover:font-semibold">Archive</li>
                        </Link>
                        <Link to="/">
                            <li
                                onClick={() => {
                                    setSidebarMenubar(false); 
                                    logout(); 
                                }}
                                className="cursor-pointer hover:font-semibold"
                            >
                                Logout
                            </li>
                        </Link>
                    </ul>
                </div>
            )}
        </>
    );
}

export default Header;
