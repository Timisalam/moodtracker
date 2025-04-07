import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import Navbar from './Components/Navbar';
import ScreenTimeGraphs from './pages/ScreenTimeGraphs/ScreenTimeGraphs';
import { useAuthContext } from './hooks/useAuthContext';
import { useThemeContext } from './hooks/useThemeContext';
import ThemeSelector from './Components/ThemeSelector';
import Insights from './pages/Insights/Insights';

function App() {
  const { authIsReady, user } = useAuthContext();
  const { mode } = useThemeContext();

  return (
    <div className={`App ${mode}`}>
      {authIsReady && (
        <BrowserRouter>
          <Navbar />
          <ThemeSelector />
          <Routes>
            <Route
              path="/Home"
              element={user ? <Home /> : <Navigate to="/Login" />}
            />
            <Route
              path="/Login"
              element={user ? <Navigate to="/Home" /> : <Login />}
            />
            <Route
              path="/Signup"
              element={user ? <Navigate to="/Home" /> : <Signup />}
            />
            <Route
              path="/ScreenTimeGraphs"
              element={user ? <ScreenTimeGraphs /> : <Navigate to="/Login" />}
            />
            <Route
              path="/Insights"
              element={user ? <Insights /> : <Navigate to="/Login" />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
