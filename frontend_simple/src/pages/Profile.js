import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, updateUser } from '../api';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
      alert('사용자 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다';
    }

    // 비밀번호 변경 시에만 검증
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = '현재 비밀번호를 입력해주세요';
      }

      if (formData.newPassword.length < 6) {
        newErrors.newPassword = '비밀번호는 최소 6자 이상이어야 합니다';
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email
      };

      // 비밀번호 변경이 있는 경우에만 추가
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const updatedUser = await updateUser(updateData);
      setUser(updatedUser);
      setEditing(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      alert('정보가 성공적으로 업데이트되었습니다.');
    } catch (error) {
      console.error('정보 업데이트 실패:', error);
      const errorMessage = error.response?.data?.message || error.message || '정보 업데이트에 실패했습니다.';
      alert(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>개인정보</h1>
        <p className="profile-subtitle">회원 정보를 확인하고 수정할 수 있습니다</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <div className="section-header">
            <h2>기본 정보</h2>
            {!editing && (
              <button onClick={() => setEditing(true)} className="edit-button">
                수정
              </button>
            )}
          </div>

          <div className="profile-info">
            {editing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>아이디</label>
                  <input
                    type="text"
                    value={user.user_id}
                    disabled
                    className="form-input disabled"
                  />
                  <span className="form-hint">아이디는 변경할 수 없습니다</span>
                </div>

                <div className="form-group">
                  <label>이름 *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="이름을 입력하세요"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>이메일 *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="이메일을 입력하세요"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>역할</label>
                  <input
                    type="text"
                    value={user.role}
                    disabled
                    className="form-input disabled"
                  />
                  <span className="form-hint">역할은 변경할 수 없습니다</span>
                </div>

                <div className="form-actions">
                  <button onClick={handleSave} className="save-button" disabled={saving}>
                    {saving ? '저장 중...' : '저장'}
                  </button>
                  <button onClick={handleCancel} className="cancel-button" disabled={saving}>
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <div className="info-display">
                <div className="info-row">
                  <span className="info-label">아이디</span>
                  <span className="info-value">{user.user_id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">이름</span>
                  <span className="info-value">{user.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">이메일</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">역할</span>
                  <span className={`badge badge-${user.role}`}>{user.role}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {editing && (
          <div className="profile-section">
            <div className="section-header">
              <h2>비밀번호 변경</h2>
              <span className="section-hint">비밀번호를 변경하지 않으려면 비워두세요</span>
            </div>

            <div className="profile-info">
              <div className="edit-form">
                <div className="form-group">
                  <label>현재 비밀번호</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.currentPassword ? 'error' : ''}`}
                    placeholder="현재 비밀번호를 입력하세요"
                  />
                  {errors.currentPassword && (
                    <span className="error-message">{errors.currentPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>새 비밀번호</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.newPassword ? 'error' : ''}`}
                    placeholder="새 비밀번호를 입력하세요 (최소 6자)"
                  />
                  {errors.newPassword && (
                    <span className="error-message">{errors.newPassword}</span>
                  )}
                </div>

                <div className="form-group">
                  <label>비밀번호 확인</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="새 비밀번호를 다시 입력하세요"
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">{errors.confirmPassword}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;

