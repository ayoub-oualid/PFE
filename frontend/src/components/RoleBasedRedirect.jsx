import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const userInf = localStorage.getItem('userInfo');
  const userRole = userInf ? JSON.parse(userInf).role : null;

  useEffect(() => {
    if (userRole === 'inspector') {
      navigate('/home');
    } else if (userRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/welcome'); // Redirect to login if no role is found
    }
  }, [userRole, navigate]);

  return null; // This component doesn't render anything
};

export default RoleBasedRedirect;