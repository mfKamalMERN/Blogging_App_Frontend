import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import routeConfig from './RouteConfig/routeConfig';

function App() {

  const router = createBrowserRouter(routeConfig)

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;