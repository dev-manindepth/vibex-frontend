import '@pages/auth/auth-tabs/AuthTabs.scss';
import backgroundImage from '../../../assets/images/backgroup.webp';
import { useEffect, useState } from 'react';
import { Register, Login } from '@pages/auth';
import useLocalStorage from '@hooks/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { Utils } from '@services/utils/utils.service';

const AuthTabs = () => {
  const [type, setType] = useState('Sign In');
  const keepLoggedIn = useLocalStorage('keepLoggedIn', 'get');
  const [environment, setEnvironment] = useState<string | undefined>('');
  const navigate = useNavigate();

  useEffect(() => {
    const env = Utils.appEnvironment();
    setEnvironment(env);
    if (keepLoggedIn) navigate('/app/social/vibes');
  }, [keepLoggedIn, navigate]);
  return (
    <div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})`, height: '100%' }}>
      <div className="environment">DEV</div>
      <div className="container-wrapper-auth">
        <div className="tabs">
          <div className="tabs-auth">
            <ul className="tab-group">
              <li className={`tab ${type === 'Sign In' ? 'active' : ''}`} onClick={() => setType('Sign In')}>
                <button className="login">Sign In</button>
              </li>
              <li className={`tab ${type === 'Sign Up' ? 'active' : ''}`} onClick={() => setType('Sign Up')}>
                <button className="signup">Sign Up</button>
              </li>
            </ul>
            {type === 'Sign In' && (
              <div className="tab-item">
                <Login />
              </div>
            )}
            {type === 'Sign Up' && (
              <div className="tab-item">
                <Register />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthTabs;
