import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <button className="back-to-main" onClick={() => navigate('/')}>
        ← 메인으로
      </button>
      <div className="auth-box">
        <h1>로그인</h1>
        <p className="subtitle">공장 관리 시스템</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>아이디</label>
            <input
              type="text"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              placeholder="USER ID"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="PASSWORD"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            계정이 없으신가요? <Link to="/register">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

