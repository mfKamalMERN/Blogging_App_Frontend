import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { Login } from './Pages/Login';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Followers from './Pages/Followers';
import Followings from './Pages/Followings';

function App() {

  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/home", element: <Home /> },
    { path: "/profile/:userid", element: <Profile /> },
    { path: "/followers/:userid", element: <Followers /> },
    { path: "/followings/:userid", element: <Followings /> }
  ])

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
