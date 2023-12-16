import React, {  useState } from 'react';
import './ForgotPassword.scss';
import Input from '@components/input/Input';
import Button from '@components/button/Button';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import backgroundImage from '../../../assets/images/backgroup.webp';
import { authService } from '@services/api/auth/auth.service';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [loading, setLoading] = useState(false);

  const forgotPassword = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await authService.forgotPassword({ email });
      setLoading(false);
      setEmail('');
      setAlertType('success');
      setResponseMessage(response.data.message);
    } catch (err) {
      setLoading(false);
      setAlertType('error');
      setResponseMessage('Something went wrong ! Error in sending email');
    }
  };
  return (
    <div className="container-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="environment">DEV</div>
      <div className="container-wrapper-auth">
        <div className="tabs forgot-password-tabs" style={{ height: `${responseMessage ? '300px' : ''}` }}>
          <div className="tabs-auth">
            <ul className="tab-group">
              <li className="tab">
                <div className="login forgot-password">Forgot Password</div>
              </li>
            </ul>
            <div className="tab-item">
              <div className="auth-inner">
                {responseMessage && (
                  <div className={`alerts alert-${alertType}`} role="alert">
                    {responseMessage}
                  </div>
                )}
                <form className="forgot-password-form" onSubmit={forgotPassword}>
                  <div className="form-input-container">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      labelText="Email"
                      placeholder="Email"
                      handleChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button
                    label={`${loading ? 'Sending Password Reset Link...' : 'FORGOT PASSWORD'}`}
                    className="auth-button button"
                    disabled={!email}
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

export default ForgotPassword;
