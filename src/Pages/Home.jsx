import Header from "./Header";
import Post from "./Posts";
import Search from "./Search";

function Home() {
    return (
        <>
            <div className="sticky top-0 w-full"><Header /></div>
            <div className="flex flex-col text-center w-screen h-screen">
                <Search/>
                <div className="flex flex-col p-5">
                    <h2 className="text-left font-semibold text-xl mb-5 md:text-2xl">Posts</h2>
                    <Post/>
                </div>
            </div>
        </>
    );
}

export default Home;
