

function Search() {
    return (
        <>
            <div className="flex w-full mt-20 p-5">
                <input
                    className="w-4/5 mx-4 border-2 border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 focus:outline-none"
                    type="text"
                    placeholder="Search Blogs here"
                    required
                />
                <button
                    type="submit"
                    className="w-2/6 p-6 bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                    Search
                </button>
            </div>
        </>
    );
}

export default Search;
