import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Register";
import Home from "./Pages/Home";
import Favourite from "./Pages/Favourite";
import Addblog from "./Pages/Addblog";
import Archive from "./Pages/Archive";
import Postpage from "./Pages/Postpage";
import Forgot from "./Pages/Forgot";
import Newpassword from "./Pages/Newpassword";

function App() {
  return (
    <>
      <BrowserRouter>
      
        {/* Full-height container with a centered child */}
        <div className="h-screen flex flex-col justify-center items-center">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/postpage/:postId" element={<Postpage />} />
            <Route path="/favourite" element={<Favourite />} />
            <Route path="/addblog" element={<Addblog />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/newpassword" element={<Newpassword />} />

          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
