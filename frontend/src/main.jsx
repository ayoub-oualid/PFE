import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import { Provider } from 'react-redux';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Dashboard from './screens/Dashboard.jsx';
import UsersScreen from './screens/UsersScreen.jsx';
import CollaboratorsScreen from './screens/CollaboratorsScreen.jsx';
import InspectorDashboard from './screens/InspectorDashboard.jsx';
import CollaboratorsByInspectorScreen from './screens/CollaboratorsByInspectorScreen.jsx';
import LinesScreen from './screens/LinesScreen.jsx';
import ProfileWrapper from './screens/ProfileWrapper.jsx';
import ReportsScreen from './screens/reportsScreen.jsx';
import MyReportsScreen from './screens/myReportsScreen.jsx';
import RoleBasedRedirect from './components/RoleBasedRedirect.jsx';
import HomeScreen from './screens/HomeScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<RoleBasedRedirect />} />
      <Route path='/welcome' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/home' element={<InspectorDashboard />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/mycollaborators' element={<CollaboratorsByInspectorScreen />} />
        <Route path="/details/:type/:id" element={<ProfileWrapper />} />
        <Route path='/myreports' element={<MyReportsScreen />} />

        
      </Route>
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin' element={<Dashboard />} />
        <Route path='/users' element={<UsersScreen />} />
        <Route path='/collaborators' element={<CollaboratorsScreen />} />
        <Route path='/lines' element={<LinesScreen />} />
        <Route path="/details/:type/:id" element={<ProfileWrapper />} />
        <Route path='/reports' element={<ReportsScreen />} />
      </Route>
      
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);
