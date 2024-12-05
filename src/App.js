import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import routeConfig from './RouteConfig/routeConfig';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const router = createBrowserRouter(routeConfig)

  return (
    <div className="App">
      <RouterProvider router={router} />
      <ToastContainer />
    </div>
  );
}

export default App;