import Followers from "../Pages/Followers"
import Followings from "../Pages/Followings"
import Home from "../Pages/Home"
import LikesPage from "../Pages/Likes"
import { Login } from "../Pages/Login"
import NewBlog from "../Pages/NewBlog"
import NewFriendsPage from "../Pages/NewFriendsPage"
import Profile from "../Pages/Profile"
import FollowRequests from "../Pages/RequestedUsers"

const routeConfig = [
    { path: "/", element: <Login /> },
    { path: "/home", element: <Home /> },
    { path: "/home/:userid", element: <Home /> },
    { path: "/profile/:userid", element: <Profile /> },
    { path: "/followers/:userid", element: <Followers /> },
    { path: "/followings/:userid", element: <Followings /> },
    { path: "/newblog", element: <NewBlog /> },
    { path: "/likes/:blogid", element: <LikesPage /> },
    { path: "/newfriends", element: <NewFriendsPage /> },
    { path: "/requests/:loggeduserid", element: <FollowRequests /> }
]

export default routeConfig