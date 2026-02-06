import React, { useState } from 'react';
import { useUplas } from '../contexts/UplasContext';
import { useNavigate } from 'react-router-dom';

const AuthSection = () => {
  const { login, register, t } = useUplas();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('signup'); // 'signup' or 'login'
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState({ message: '', type: '' });
  
  // Login State
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Signup State
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    organization: '',
    industry: '',
    otherIndustry: '',
    profession: '',
    countryCode: '+254',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: false
  });

  const handleInputChange = (e, formType) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    if (formType === 'login') {
      setLoginData(prev => ({ ...prev, [name]: val }));
    } else {
      setSignupData(prev => ({ ...prev, [name]: val }));
    }
  };

  // --- Validation Logic (mimicking uhome.js) ---
  const validateStep = (step) => {
    if (step === 1) {
      if (!signupData.fullName || signupData.fullName.length < 2) return false;
    }
    if (step === 2) {
      if (!signupData.email || !/\S+@\S+\.\S+/.test(signupData.email)) return false;
    }
    if (step === 3) {
      if (!signupData.industry) return false;
      if (signupData.industry === 'Other' && !signupData.otherIndustry) return false;
    }
    if (step === 4) {
      if (!signupData.profession) return false;
      if (!signupData.phone || !/^[0-9]{7,15}$/.test(signupData.phone)) return false;
    }
    if (step === 5) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\\|,.<>\/?]).{8,}$/;
      if (!passwordRegex.test(signupData.password)) {
          setStatus({message: t('form_hint_password'), type: 'error'});
          return false;
      }
      if (signupData.password !== signupData.confirmPassword) {
          setStatus({message: t('error_passwords_do_not_match'), type: 'error'});
          return false;
      }
      if (!signupData.terms) {
          setStatus({message: t('error_terms_required'), type: 'error'});
          return false;
      }
    }
    setStatus({message: '', type: ''});
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setStatus({ message: t('signup_status_processing', 'Processing...'), type: 'loading' });

    try {
      const payload = {
        full_name: signupData.fullName,
        email: signupData.email,
        organization: signupData.organization,
        industry: signupData.industry === 'Other' ? signupData.otherIndustry : signupData.industry,
        profession: signupData.profession,
        whatsapp_number: `${signupData.countryCode}${signupData.phone}`,
        password: signupData.password,
        password2: signupData.confirmPassword // Backend expects password2 usually
      };

      await register(payload);
      setStatus({ message: t('signup_status_success_verify_whatsapp'), type: 'success' });
      
      // Auto switch to login
      setTimeout(() => {
        setActiveTab('login');
        setLoginData(prev => ({ ...prev, email: signupData.email }));
      }, 2000);

    } catch (err) {
      setStatus({ message: err.response?.data?.detail || t('signup_status_error_generic'), type: 'error' });
    }
  };

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setStatus({ message: t('login_status_attempting'), type: 'loading' });

    try {
      await login(loginData.email, loginData.password);
      setStatus({ message: t('login_status_success_redirect'), type: 'success' });
      navigate('/dashboard');
    } catch (err) {
      setStatus({ message: t('login_status_error_invalid_credentials'), type: 'error' });
    }
  };

  return (
    <section className="auth-section" id="auth-section">
      <div className="container auth-section__container">
        <div className="auth-toggle-buttons">
          <button 
            className={`auth-toggle-button ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            {t('signup_tab', 'Sign Up')}
          </button>
          <button 
            className={`auth-toggle-button ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            {t('login_tab', 'Login')}
          </button>
        </div>

        <div className="form-wrapper">
          {/* --- SIGN UP FORM --- */}
          {activeTab === 'signup' && (
            <form id="signup-form" className="form form--active" onSubmit={onSignupSubmit} noValidate>
              <h3 className="form__title">{t('signup_form_title', 'Create Your Uplas Account')}</h3>

              {/* Step 1 */}
              <div className={`form-step ${currentStep === 1 ? 'form-step--active' : ''}`} data-step="1">
                <p className="form__step-indicator">{t('signup_step1_indicator', 'Step 1 of 5')}</p>
                <div className="form__group">
                  <label htmlFor="signup-full-name" className="form__label">{t('form_label_fullname')}</label>
                  <input type="text" name="fullName" className="form__input" value={signupData.fullName} onChange={(e) => handleInputChange(e, 'signup')} placeholder={t('form_placeholder_fullname')} required />
                </div>
                <button type="button" className="button button--primary form__button form__button--next" onClick={handleNext}>
                  {t('form_button_next')} <i className="fas fa-arrow-right"></i>
                </button>
              </div>

              {/* Step 2 */}
              <div className={`form-step ${currentStep === 2 ? 'form-step--active' : ''}`} data-step="2">
                <p className="form__step-indicator">{t('signup_step2_indicator', 'Step 2 of 5')}</p>
                <div className="form__group">
                  <label htmlFor="signup-email" className="form__label">{t('form_label_email')}</label>
                  <input type="email" name="email" className="form__input" value={signupData.email} onChange={(e) => handleInputChange(e, 'signup')} placeholder={t('form_placeholder_email')} required />
                </div>
                <div className="form__button-group">
                  <button type="button" className="button button--secondary form__button form__button--prev" onClick={handlePrev}><i className="fas fa-arrow-left"></i> {t('form_button_prev')}</button>
                  <button type="button" className="button button--primary form__button form__button--next" onClick={handleNext}>{t('form_button_next')} <i className="fas fa-arrow-right"></i></button>
                </div>
              </div>

              {/* Step 3 */}
              <div className={`form-step ${currentStep === 3 ? 'form-step--active' : ''}`} data-step="3">
                <p className="form__step-indicator">{t('signup_step3_indicator')}</p>
                <div className="form__group">
                    <label className="form__label">{t('form_label_organization')}</label>
                    <input type="text" name="organization" className="form__input" value={signupData.organization} onChange={(e) => handleInputChange(e, 'signup')} placeholder={t('form_placeholder_organization')} />
                </div>
                <div className="form__group">
                    <label className="form__label">{t('form_label_industry')}</label>
                    <select name="industry" className="form__select" value={signupData.industry} onChange={(e) => handleInputChange(e, 'signup')}>
                        <option value="" disabled>{t('form_select_industry_placeholder')}</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                {signupData.industry === 'Other' && (
                    <div className="form__group">
                        <label className="form__label">{t('form_label_specify_industry')}</label>
                        <input type="text" name="otherIndustry" className="form__input" value={signupData.otherIndustry} onChange={(e) => handleInputChange(e, 'signup')} />
                    </div>
                )}
                 <div className="form__button-group">
                  <button type="button" className="button button--secondary form__button form__button--prev" onClick={handlePrev}><i className="fas fa-arrow-left"></i> {t('form_button_prev')}</button>
                  <button type="button" className="button button--primary form__button form__button--next" onClick={handleNext}>{t('form_button_next')} <i className="fas fa-arrow-right"></i></button>
                </div>
              </div>

               {/* Step 4 */}
               <div className={`form-step ${currentStep === 4 ? 'form-step--active' : ''}`} data-step="4">
                 <p className="form__step-indicator">{t('signup_step4_indicator')}</p>
                 <div className="form__group">
                    <label className="form__label">{t('form_label_profession')}</label>
                    <input type="text" name="profession" className="form__input" value={signupData.profession} onChange={(e) => handleInputChange(e, 'signup')} placeholder={t('form_placeholder_profession')} />
                 </div>
                 <div className="form__group">
                    <label className="form__label">{t('form_label_phone_whatsapp')}</label>
                    <div className="phone-input-container">
                        <select name="countryCode" className="form__select form__select--country-code" value={signupData.countryCode} onChange={(e) => handleInputChange(e, 'signup')}>
                             <option value="+254">🇰🇪 +254</option>
                             <option value="+1">🇺🇸 +1</option>
                             <option value="+44">🇬🇧 +44</option>
                        </select>
                        <input type="tel" name="phone" className="form__input form__input--phone" value={signupData.phone} onChange={(e) => handleInputChange(e, 'signup')} placeholder={t('form_placeholder_phone')} />
                    </div>
                 </div>
                 <div className="form__button-group">
                  <button type="button" className="button button--secondary form__button form__button--prev" onClick={handlePrev}><i className="fas fa-arrow-left"></i> {t('form_button_prev')}</button>
                  <button type="button" className="button button--primary form__button form__button--next" onClick={handleNext}>{t('form_button_next')} <i className="fas fa-arrow-right"></i></button>
                </div>
               </div>

               {/* Step 5 */}
               <div className={`form-step ${currentStep === 5 ? 'form-step--active' : ''}`} data-step="5">
                    <p className="form__step-indicator">{t('signup_step5_indicator')}</p>
                    <div className="form__group">
                        <label className="form__label">{t('form_label_create_password')}</label>
                        <input type="password" name="password" className="form__input" value={signupData.password} onChange={(e) => handleInputChange(e, 'signup')} placeholder={t('form_placeholder_create_password')} />
                        <small className="form__hint">{t('form_hint_password')}</small>
                    </div>
                    <div className="form__group">
                        <label className="form__label">{t('form_label_confirm_password')}</label>
                        <input type="password" name="confirmPassword" className="form__input" value={signupData.confirmPassword} onChange={(e) => handleInputChange(e, 'signup')} placeholder={t('form_placeholder_confirm_password')} />
                    </div>
                    <div className="form__group form__group--checkbox">
                        <input type="checkbox" id="signup-terms" name="terms" checked={signupData.terms} onChange={(e) => handleInputChange(e, 'signup')} required />
                        <label htmlFor="signup-terms" className="form__label--checkbox">
                            <span dangerouslySetInnerHTML={{__html: t('form_label_terms_agree') + " <a href='/terms'>" + t('form_label_terms_link') + "</a> " + t('form_label_terms_and') + " <a href='/privacy'>" + t('form_label_privacy_link') + "</a>"}} />
                        </label>
                    </div>
                    <div className="form__button-group">
                      <button type="button" className="button button--secondary form__button form__button--prev" onClick={handlePrev}><i className="fas fa-arrow-left"></i> {t('form_button_prev')}</button>
                      <button type="submit" className="button button--primary form__button form__button--submit">{t('form_button_create_account', 'Create Account')}</button>
                    </div>
               </div>
               
               {/* Status Display */}
               {status.message && <div className={`form__status form__status--${status.type}`} style={{display: 'block'}}>{status.message}</div>}
            </form>
          )}

          {/* --- LOGIN FORM --- */}
          {activeTab === 'login' && (
            <form id="login-form" className="form form--active" onSubmit={onLoginSubmit} noValidate>
               <h3 className="form__title">{t('login_form_title', 'Welcome Back to Uplas!')}</h3>
               <div className="form__group">
                   <label htmlFor="login-email" className="form__label">{t('form_label_email')}</label>
                   <input type="email" name="email" className="form__input" value={loginData.email} onChange={(e) => handleInputChange(e, 'login')} placeholder={t('form_placeholder_email')} required />
               </div>
               <div className="form__group">
                   <label htmlFor="login-password" className="form__label">{t('form_label_password')}</label>
                   <input type="password" name="password" className="form__input" value={loginData.password} onChange={(e) => handleInputChange(e, 'login')} placeholder={t('form_placeholder_password')} required />
               </div>
               <div className="form__group form__group--subtle-text">
                   <Link to="/forgot-password" className="form__link">{t('form_link_forgot_password', 'Forgot password?')}</Link>
               </div>
               <button type="submit" className="button button--primary form__button form__button--submit">{t('form_button_login', 'Login')}</button>
               
               {status.message && <div className={`form__status form__status--${status.type}`} style={{display: 'block'}}>{status.message}</div>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default AuthSection;
