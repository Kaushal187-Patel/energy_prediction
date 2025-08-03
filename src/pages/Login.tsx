import { useNavigate } from 'react-router-dom';
import LoginModal from '@/components/LoginModal';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (user: any) => {
    navigate('/predict');
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <LoginModal 
        onClose={handleClose} 
        onLogin={handleLogin} 
      />
    </div>
  );
};

export default Login;