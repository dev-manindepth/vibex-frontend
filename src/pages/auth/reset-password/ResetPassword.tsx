import './ResetPassword.scss';
import backgroundImage from '../../../assets/images/backgroup.webp';

import React, { useState } from 'react';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { authService } from '@services/api/auth/auth.service';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();

  const resetPassword = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const token = searchParams.get('token');
    if (!token) {
      setLoading(false);
      setResponseMessage('Invalid link.Please go through the email');
      setAlertType('error');
      return;
    }
    try {
      const response = await authService.resetPassword(token, { password, confirmPassword });
      setLoading(false);
      setPassword('');
      setConfirmPassword('');
      setAlertType('success');
      setResponseMessage(response.data.message);
    } catch (err: any) {
      setAlertType('error');
      setLoading(false);
      setAlertType('error');
      setResponseMessage(err?.response?.data?.message || 'Something went wrong');
    }
  };
  return (
    <div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="container-wrapper-auth">
        <div className="tabs reset-password-tabs" style={{ height: `${responseMessage ? '400px' : ''}` }}>
          <div className="tabs-auth">
            <ul className="tab-group">
              <li className="tab">
                <div className="login reset-password">Reset Password</div>
              </li>
            </ul>
            <div className="tab-item">
              <div className="auth-inner">
                {responseMessage && (
                  <div className={`alerts alert-${alertType}`} role="alert">
                    {responseMessage}
                  </div>
                )}

                <form className="reset-password-form" onSubmit={resetPassword}>
                  <div className="form-input-container">
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      labelText="New Password"
                      placeholder="New Password"
                      handleChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                      id="cpassword"
                      name="cpassword"
                      type="password"
                      value={confirmPassword}
                      labelText="Confirm Password"
                      placeholder="Confirm Password"
                      handleChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button
                    label={`${loading ? 'RESET PASSWORD IN PROGRESS...' : 'RESET PASSWORD'}`}
                    className="auth-button button"
                    disabled={!password || !confirmPassword}
                  />

                  <Link to={'/'}>
                    <span className="login">
                      <FaArrowLeft className="arrow-left" /> Back to Login
                    </span>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
