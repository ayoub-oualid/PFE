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
import HomeScreen from './screens/HomeScreen';
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/home' element={<InspectorDashboard />} />
        <Route path='/profile' element={<ProfileScreen />} />
        <Route path='/mycollaborators' element={<CollaboratorsByInspectorScreen />} />
        <Route path="/details/:type/:id" element={<ProfileWrapper />} />

        
      </Route>
      <Route path='' element={<AdminRoute />}>
        <Route path='/admin' element={<Dashboard />} />
        <Route path='/users' element={<UsersScreen />} />
        <Route path='/collaborators' element={<CollaboratorsScreen />} />
        <Route path='/lines' element={<LinesScreen />} />
        <Route path="/details/:type/:id" element={<ProfileWrapper />} />
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
