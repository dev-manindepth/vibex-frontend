import React, { useEffect, useState } from 'react';
import './Register.scss';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { Utils } from '@services/utils/utils.service';
import { authService } from '@services/api/auth/auth.service';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useSessionStorage from '@hooks/useSessionStorage';
import useLocalStorage from '@hooks/useLocalStorage';
import { IUser } from '@interfaces/index';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [hasError, setHasError] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [user, setUser] = useState<IUser | null>(null);
  const [setStoredUsername] = useLocalStorage('username', 'set');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [pageReload] = useSessionStorage('pageReload', 'set');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const registerUser = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const avatarColor = Utils.avatarColor();
      const avatarImage = Utils.generateAvatar(username.charAt(0).toUpperCase(), avatarColor);
      const response = await authService.signup({ username, email, password, avatarColor, avatarImage });
      setLoggedIn(true);
      setStoredUsername(username);
      setAlertType('success');
      Utils.dispatchUser(response, pageReload, dispatch, setUser);
    } catch (err: any) {
      setLoading(false);
      setHasError(true);
      setAlertType('error');
      setResponseMessage('An error occured');
    }
  };

  useEffect(() => {
    if (loading && !user) return;
    if (user) {
      navigate('/app/social/vibes');
    }
  }, [loading, user, navigate]);
  return (
    <div className="auth-inner">
      <div className={`alerts alert-${alertType}`} role="alert">
        {responseMessage}
      </div>

      <form className="auth-form" onSubmit={registerUser}>
        <div className="form-input-container">
          <Input
            id="username"
            name="username"
            type="text"
            value={username}
            labelText="Username"
            placeholder="Enter Username"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(event) => setUsername(event.target.value)}
          />
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            labelText="Email"
            placeholder="Enter Email"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(event) => setEmail(event.target.value)}
          />
          <Input
            id="password"
            name="password"
            type="password"
            value={password}
            labelText="Password"
            placeholder="Enter Password"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <Button
          className="auth-button button"
          label={`${loading ? 'SIGNUP IN PROGRESS...' : 'SIGN UP'}`}
          disabled={!username || !email || !password}
        />
      </form>
    </div>
  );
};

export default Register;
