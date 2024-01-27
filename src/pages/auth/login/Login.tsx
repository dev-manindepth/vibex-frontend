import React, { useEffect, useState } from 'react';
import './Login.scss';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { FaArrowRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '@services/api/auth/auth.service';
import useLocalStorage from '@hooks/useLocalStorage';
import useSessionStorage from '@hooks/useSessionStorage';
import { useDispatch } from 'react-redux';
import { IUser } from '@interfaces/index';
import { Utils } from '@services/utils/utils.service';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<IUser | null>(null);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [setStoredUsername] = useLocalStorage('username', 'set');
  const [setLoggedIn] = useLocalStorage('keepLoggedIn', 'set');
  const [pageReload] = useSessionStorage('pageReload', 'set');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginUser = async (event: React.SyntheticEvent) => {
    setLoading(true);
    event.preventDefault();

    try {
      const result = await authService.signin({ username, password });
      setLoggedIn(keepLoggedIn);
      setHasError(false);
      setStoredUsername(username);
      setAlertType('success');
      setLoading(false);
      setResponseMessage(result.data.message);
      Utils.dispatchUser(result, pageReload, dispatch, setUser);
    } catch (err: any) {
      setLoading(false);
      setHasError(true);
      setAlertType('error');
      setResponseMessage(err.message);
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
      <div className={`alerts  alert-${alertType}`} role="alert">
        {responseMessage}
      </div>

      <form className="auth-form" onSubmit={loginUser}>
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
            id="password"
            name="password"
            type="password"
            value={password}
            labelText="Password"
            placeholder="Enter Password"
            style={{ border: `${hasError ? '1px solid #fa9b8a' : ''}` }}
            handleChange={(event) => setPassword(event.target.value)}
          />
          <label className="checkmark-container" htmlFor="checkbox">
            <Input id="checkbox" type="checkbox" name="checkbox" value={keepLoggedIn} handleChange={() => setKeepLoggedIn(!keepLoggedIn)} />
            Keep me signed in
          </label>
        </div>
        <Button
          className="auth-button button"
          label={`${loading ? 'SIGNIN IN PROGRESS...' : 'SIGN IN'}`}
          disabled={!username || !password}
        />
        <Link to={`/forgot-password`}>
          <span className="forgot-password">
            Forgot password? <FaArrowRight className="arrow-right" />
          </span>
        </Link>
      </form>
    </div>
  );
};

export default Login;
