import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { Login } from './Pages/Login';
import Home from './Pages/Home';

function App() {

  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/home", element: <Home /> },
  ])

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
