import Followers from "../Pages/Followers"
import Followings from "../Pages/Followings"
import Home from "../Pages/Home"
import LikesPage from "../Pages/Likes"
import { Login } from "../Pages/Login"
import NewBlog from "../Pages/NewBlog"
import Profile from "../Pages/Profile"

const routeConfig = [
    { path: "/", element: <Login /> },
    { path: "/home", element: <Home /> },
    { path: "/profile/:userid", element: <Profile /> },
    { path: "/followers/:userid", element: <Followers /> },
    { path: "/followings/:userid", element: <Followings /> },
    { path: "/newblog", element: <NewBlog /> },
    { path: "/likes/:blogid", element: <LikesPage /> },
]

export default routeConfig