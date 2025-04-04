import React, { useState, useEffect, useRef } from 'react';
import './Signup.css';

function Signup() {
    // Translations
    const translations = {
        en: {
            welcome: "Sign up to see agriculture products and services",
            name: "Full Name",
            namePlaceholder: "Enter your full name",
            mobile: "Mobile Number",
            mobilePlaceholder: "Enter 10-digit mobile number",
            password: "Password",
            passwordPlaceholder: "Enter password (min 6 characters)",
            location: "Location",
            locationPlaceholder: "Enter your village/city",
            accountType: "Account Type",
            buyer: "Buyer",
            seller: "Seller",
            bankName: "Bank Name",
            bankNamePlaceholder: "Enter your bank name",
            ifsc: "IFSC Code",
            ifscPlaceholder: "Enter bank IFSC code",
            sendOtp: "Send OTP",
            verifyOtp: "Verify OTP",
            otpPlaceholder: "Enter OTP",
            otpError: "Invalid OTP. Please try again.",
            bankNameError: "Bank name is required for sellers",
            ifscError: "IFSC code is required for sellers",
            signUp: "Sign Up",
            divider: "OR",
            loginPrompt: "Already have an account?",
            loginLink: "Log in",
            mobileValidationError: "Please enter a valid 10-digit mobile number",
            otpVerificationError: "Please verify your mobile number with OTP first",
            formSuccess: "Form submitted successfully!"
        },
        ta: {
            welcome: "விவசாய பொருட்கள் மற்றும் சேவைகளைப் பார்க்க பதிவு செய்க",
            name: "முழு பெயர்",
            namePlaceholder: "உங்கள் முழு பெயரை உள்ளிடவும்",
            mobile: "கைபேசி எண்",
            mobilePlaceholder: "10 இலக்க கைபேசி எண்ணை உள்ளிடவும்",
            password: "கடவுச்சொல்",
            passwordPlaceholder: "கடவுச்சொல்லை உள்ளிடவும் (குறைந்தது 6 எழுத்துகள்)",
            location: "இடம்",
            locationPlaceholder: "உங்கள் கிராமம்/நகரத்தை உள்ளிடவும்",
            accountType: "கணக்கு வகை",
            buyer: "வாங்குபவர்",
            seller: "விற்பனையாளர்",
            bankName: "வங்கி பெயர்",
            bankNamePlaceholder: "உங்கள் வங்கியின் பெயரை உள்ளிடவும்",
            ifsc: "IFSC குறியீடு",
            ifscPlaceholder: "வங்கி IFSC குறியீட்டை உள்ளிடவும்",
            sendOtp: "OTP அனுப்பு",
            verifyOtp: "OTP சரிபார்",
            otpPlaceholder: "OTP உள்ளிடவும்",
            otpError: "தவறான OTP. மீண்டும் முயற்சிக்கவும்.",
            bankNameError: "விற்பனையாளர்களுக்கு வங்கி பெயர் தேவை",
            ifscError: "விற்பனையாளர்களுக்கு IFSC குறியீடு தேவை",
            signUp: "பதிவு செய்க",
            divider: "அல்லது",
            loginPrompt: "ஏற்கனவே கணக்கு உள்ளதா?",
            loginLink: "உள்நுழைய",
            mobileValidationError: "சரியான 10 இலக்க கைபேசி எண்ணை உள்ளிடவும்",
            otpVerificationError: "முதலில் உங்கள் கைபேசி எண்ணை OTP மூலம் சரிபார்க்கவும்",
            formSuccess: "படிவம் வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!"
        }
    };

    // State variables
    const [currentLang, setCurrentLang] = useState('en');
    const [showLanguageOptions, setShowLanguageOptions] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        password: '',
        location: '',
        accountType: 'buyer',
        bankName: '',
        ifsc: ''
    });
    const [otpState, setOtpState] = useState({
        showOtpVerify: false,
        generatedOtp: '',
        enteredOtp: '',
        otpVerified: false,
        showOtpError: false,
        mobileDisabled: false
    });
    const [showBankDetails, setShowBankDetails] = useState(false);
    const [errors, setErrors] = useState({
        bankName: false,
        ifsc: false
    });

    // Refs
    const languageOptionsRef = useRef(null);
    const verifyOtpInputRef = useRef(null);

    // Get current translations
    const t = translations[currentLang];

    // Handle outside click for language dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (languageOptionsRef.current && !event.target.closest('.language-selector')) {
                setShowLanguageOptions(false);
            }
        }

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    // Handle language change
    const handleLanguageChange = (lang) => {
        setCurrentLang(lang);
        setShowLanguageOptions(false);
        document.documentElement.lang = lang;
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { id, value, type, checked } = e.target;
        
        if (type === 'radio') {
            setFormData({
                ...formData,
                [e.target.name]: value
            });
            
            // Show/hide bank details based on account type
            if (e.target.name === 'accountType') {
                setShowBankDetails(value === 'seller');
                
                // Reset bank errors when switching to buyer
                if (value === 'buyer') {
                    setErrors({
                        bankName: false,
                        ifsc: false
                    });
                }
            }
        } else {
            setFormData({
                ...formData,
                [id]: value
            });
        }
    };

    // Handle OTP sending
    const handleSendOtp = () => {
        const { mobile } = formData;
        if (mobile.length === 10 && /^\d+$/.test(mobile)) {
            // Generate random 6-digit OTP (in a real app, this would be sent via SMS)
            const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            console.log('Generated OTP:', generatedOtp); // For testing only
            
            // Update OTP state
            setOtpState({
                ...otpState,
                showOtpVerify: true,
                generatedOtp: generatedOtp,
                mobileDisabled: true
            });
            
            // Focus on OTP input field
            setTimeout(() => {
                if (verifyOtpInputRef.current) {
                    verifyOtpInputRef.current.focus();
                }
            }, 0);
        } else {
            alert(t.mobileValidationError);
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = () => {
        if (otpState.enteredOtp === otpState.generatedOtp) {
            // OTP verified
            setOtpState({
                ...otpState,
                showOtpVerify: false,
                otpVerified: true,
                showOtpError: false
            });
        } else {
            // Invalid OTP
            setOtpState({
                ...otpState,
                showOtpError: true
            });
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate seller bank details if account type is seller
        let isValid = true;
        const newErrors = {
            bankName: false,
            ifsc: false
        };
        
        if (formData.accountType === 'seller') {
            if (!formData.bankName.trim()) {
                newErrors.bankName = true;
                isValid = false;
            }
            
            if (!formData.ifsc.trim()) {
                newErrors.ifsc = true;
                isValid = false;
            }
        }
        
        setErrors(newErrors);
        
        // Check if OTP is verified
        if (!otpState.otpVerified) {
            alert(t.otpVerificationError);
            isValid = false;
        }
        
        if (isValid) {
            // Form is valid, proceed with submission
            alert(t.formSuccess);
            // In a real app, you would send the data to your server here
            // form.submit();
        }
    };

    // Handle key press for auto-focus next field
    const handleKeyPress = (e, nextInputId) => {
        if (e.key === 'Enter' && nextInputId) {
            e.preventDefault();
            document.getElementById(nextInputId)?.focus();
        }
    };

    return (
        <div className="signup-box">
            <div className="language-selector">
                <button 
                    className="language-btn" 
                    onClick={() => setShowLanguageOptions(!showLanguageOptions)}
                >
                    {currentLang === 'en' ? 'English' : 'தமிழ்'}
                </button>
                <div 
                    className={`language-options ${showLanguageOptions ? 'show' : ''}`}
                    ref={languageOptionsRef}
                >
                    <div 
                        className="language-option" 
                        onClick={() => handleLanguageChange('en')}
                    >
                        English
                    </div>
                    <div 
                        className="language-option" 
                        onClick={() => handleLanguageChange('ta')}
                    >
                        தமிழ் (Tamil)
                    </div>
                </div>
            </div>

            <img 
                src="/logo.png" 
                alt="Namma vivasayi Logo" 
                className="logo"
            />
            <h1>{t.welcome}</h1>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">{t.name}</label>
                    <input 
                        type="text" 
                        id="name" 
                        placeholder={t.namePlaceholder} 
                        required 
                        value={formData.name}
                        onChange={handleInputChange}
                        onKeyPress={(e) => handleKeyPress(e, 'mobile')}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="mobile">{t.mobile}</label>
                    <input 
                        type="tel" 
                        id="mobile" 
                        placeholder={t.mobilePlaceholder} 
                        required 
                        maxLength="10" 
                        value={formData.mobile}
                        onChange={handleInputChange}
                        onKeyPress={(e) => handleKeyPress(e, 'password')}
                        disabled={otpState.mobileDisabled}
                    />
                    {!otpState.showOtpVerify && !otpState.otpVerified && (
                        <div className="otp-container">
                            <input 
                                type="text" 
                                placeholder={t.otpPlaceholder} 
                                disabled 
                                value={otpState.otpVerified ? (currentLang === 'en' ? 'Verified' : 'சரிபார்க்கப்பட்டது') : ''}
                            />
                            <button type="button" onClick={handleSendOtp}>
                                {t.sendOtp}
                            </button>
                        </div>
                    )}
                    {otpState.showOtpVerify && (
                        <div className={`otp-verify-container active`}>
                            <input 
                                type="text" 
                                placeholder={t.otpPlaceholder}
                                value={otpState.enteredOtp}
                                onChange={(e) => setOtpState({...otpState, enteredOtp: e.target.value})}
                                ref={verifyOtpInputRef}
                            />
                            <button type="button" onClick={handleVerifyOtp}>
                                {t.verifyOtp}
                            </button>
                        </div>
                    )}
                    {otpState.showOtpError && (
                        <div className="error-message" style={{ display: 'block' }}>
                            {t.otpError}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password">{t.password}</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder={t.passwordPlaceholder} 
                        required 
                        minLength="6" 
                        value={formData.password}
                        onChange={handleInputChange}
                        onKeyPress={(e) => handleKeyPress(e, 'location')}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="location">{t.location}</label>
                    <input 
                        type="text" 
                        id="location" 
                        placeholder={t.locationPlaceholder} 
                        required 
                        value={formData.location}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>{t.accountType}</label>
                    <div className="account-type">
                        <label>
                            <input 
                                type="radio" 
                                name="accountType" 
                                value="buyer" 
                                checked={formData.accountType === 'buyer'}
                                onChange={handleInputChange}
                            />
                            <span>{t.buyer}</span>
                        </label>
                        <label>
                            <input 
                                type="radio" 
                                name="accountType" 
                                value="seller"
                                checked={formData.accountType === 'seller'}
                                onChange={handleInputChange}
                            />
                            <span>{t.seller}</span>
                        </label>
                    </div>
                </div>

                <div className={`form-group bank-details ${showBankDetails ? 'required' : ''}`}>
                    <label htmlFor="bankName">{t.bankName}</label>
                    <input 
                        type="text" 
                        id="bankName" 
                        placeholder={t.bankNamePlaceholder}
                        value={formData.bankName}
                        onChange={handleInputChange}
                    />
                    <div 
                        className="error-message" 
                        style={{ display: errors.bankName ? 'block' : 'none' }}
                    >
                        {t.bankNameError}
                    </div>

                    <label htmlFor="ifsc" style={{ marginTop: '10px' }}>{t.ifsc}</label>
                    <input 
                        type="text" 
                        id="ifsc" 
                        placeholder={t.ifscPlaceholder}
                        value={formData.ifsc}
                        onChange={handleInputChange}
                    />
                    <div 
                        className="error-message" 
                        style={{ display: errors.ifsc ? 'block' : 'none' }}
                    >
                        {t.ifscError}
                    </div>
                </div>

                <button type="submit">{t.signUp}</button>

                <div className="divider">{t.divider}</div>

                <p className="login-link">
                    {t.loginPrompt} <a href="login.html">{t.loginLink}</a>
                </p>
            </form>
        </div>
    );
}

export default Signup;