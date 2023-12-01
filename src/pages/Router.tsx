import { AuthProvider } from '@/contexts/AuthContext';
import { Route, Routes } from 'react-router-dom';
import Board from './Board';
import BurnDownPage from './Board/BurnDownPage';
import BasicTable from './Board/components/BasicTable';
import BurnDownChart from './Board/components/BurnDownChart';
import BurnDownChart2 from './Board/components/BurnDownChart2';
import Home from './HomePage/Home';
import Login from './loginSignup/Login';
import Register from './loginSignup/Register';
import PrivateRoute from './PrivateRoute';
import Settings from './settingsPage';
import Advanced from './settingsPage/advanced';
import Cards from './settingsPage/cards';
import Profile from './settingsPage/profile';

const Router = () => {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/board" element={<Board />} />
            <Route path="/burndown" element={<BurnDownChart2 />} />
            <Route path="/board/:boardId" element={<Board />} />
            <Route path="/board/:boardId/burndown" element={<BurnDownPage />} />
            <Route path="/settings" element={<Settings />}>
              <Route index element={<Profile />} />
              <Route path="profile" element={<Profile />} />
              <Route path="cards" element={<Cards />} />
              <Route path="advanced" element={<Advanced />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default Router;
