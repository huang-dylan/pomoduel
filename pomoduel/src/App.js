import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import PomodoroTimerPage from './pages/PomodoroTimerPage';
import TreesList from './pages/TreesList';
import ChallengePage from './pages/ChallengePage';
import ProfilePage from './pages/ProfilePage';
import ArenaPage from './pages/ArenaPage';

function App() {
  return (
    // BrowserRouter tag enforces react-router for the whole page
    <BrowserRouter>
      <div className="App">
        <NavBar />
        <div id="page-body">
          <Routes>
            {/* Route: path is how it appears on webpage path, element is page itself*/}
            <Route path="/" element={<PomodoroTimerPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/create-account" element={<CreateAccountPage />} />
            <Route path="/trees" element={<TreesList />} />
            <Route path="/challenge" element={< ChallengePage />} />
            <Route path="/profile" element={< ProfilePage />} />
            <Route path="/arena" element={< ArenaPage />} />
            {/* Asterisk path means any page not previously listed, basically 404*/}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
    
  );
}

export default App;
