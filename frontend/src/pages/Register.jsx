import { useState } from "react"
import { register, login } from "../api/api"
import styles from "./Register.module.css"
import { LogoSVG } from "../components/Logo"

export default function Register({ setUser, onNavigateToLogin }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("tenant")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const handleRegister = async (e) => {
    e.preventDefault()
    setError("")
    setSuccessMsg("")

    if (!name || !email || !password) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const data = await register(name, email, password, role)
      
      if (data.message === "User registered successfully") {
        setSuccessMsg("Account created! Logging you in...")
        
        // Auto login after successful registration
        setTimeout(async () => {
          try {
            const loginData = await login(email, password)
            if (loginData.token) {
              localStorage.setItem("token", loginData.token)
              setUser({ token: loginData.token, role: loginData.role, name: loginData.name || name })
            } else {
              setError("Registration successful, but auto-login failed. Please sign in.")
            }
          } catch (err) {
            setError("Registration successful, but auto-login failed. Please sign in.")
          }
        }, 1500)
        
      } else {
        // Handle server errors (e.g. email already exists)
        setError(data.error || "Registration failed. Please try again.")
      }
    } catch {
      setError("Unable to connect to server. Please try again.")
    } finally {
      if (!successMsg) setLoading(false)
    }
  }

  return (
    <div className={styles.registerContainer}>
      
      {/* -----------------------------
          LEFT PANEL (Hero Image Area)
      ------------------------------ */}
      <div className={styles.heroPanel}>
        
        {/* Background Decorative Blur Orbs */}
        <div className={styles.heroOrbTop} />
        <div className={styles.heroOrbBottom} />
        
        {/* The Dark Overlay so text is readable */}
        <div className={styles.heroOverlay} />

        <div className={styles.heroContent}>
          {/* Logo Section */}
          <div className={styles.logoWrapper}>
            <div className={styles.logoIcon}>
              <LogoSVG />
            </div>
            <span className={styles.logoText}>PropTech</span>
          </div>

          {/* Heading and Description */}
          <div className={styles.heroTextSection}>
            <h1 className={styles.heroHeading}>
              Join The <br />
              Future Of <br />
              Property.
            </h1>
            <p className={styles.heroDescription}>
              Create your account to connect with property managers, submit requests easily, and experience seamless living.
            </p>
            
            {/* Bottom Statistics Section */}
            <div className={styles.heroStatsRow}>
              <div>
                <div className={styles.statNumber}>10k+</div>
                <div className={styles.statLabel}>Happy Tenants</div>
              </div>
              <div>
                <div className={styles.statNumber}>24/7</div>
                <div className={styles.statLabel}>Support Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -----------------------------
          RIGHT PANEL (Form Area)
      ------------------------------ */}
      <div className={styles.formPanel}>
        
        <div className={styles.formContainer}>
          
          {/* Mobile logo (hidden on desktop screens) */}
          <div className={styles.mobileLogo}>
            <div className={styles.logoIcon}>
              <LogoSVG />
            </div>
            <span className={styles.mobileLogoText}>PropTech</span>
          </div>

          {/* The White Register Card */}
          <div className={styles.registerCard}>
            
            {/* Header / Title */}
            <div className={styles.registerHeader}>
              <h2 className={styles.registerTitle}>Create Account</h2>
              <p className={styles.registerSubtitle}>
                Sign up to access your property dashboard.
              </p>
            </div>

            {/* Error Message Box */}
            {error && (
              <div className={styles.errorBox}>
                <span>⚠️</span>
                <p className={styles.messageText}>{error}</p>
              </div>
            )}
            
            {/* Success Message Box */}
            {successMsg && (
              <div className={styles.successBox}>
                <span>✅</span>
                <p className={styles.messageText}>{successMsg}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegister}>
              
              {/* Full Name Input Field */}
              <div className={styles.formGroup}>
                <div className={styles.inputLabelRow}>
                  <label className={styles.inputLabel}>Full Name</label>
                </div>
                <div className={styles.inputWrapper}>
                  {/* User Icon */}
                  <span className={styles.inputIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    id="register-name"
                    type="text"
                    className={styles.inputField}
                    placeholder="John Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              </div>

              {/* Email Input Field */}
              <div className={styles.formGroup}>
                <div className={styles.inputLabelRow}>
                  <label className={styles.inputLabel}>Email Address</label>
                </div>
                <div className={styles.inputWrapper}>
                  {/* Mail Icon */}
                  <span className={styles.inputIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    id="register-email"
                    type="email"
                    className={styles.inputField}
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Account Role Dropdown */}
              <div className={styles.formGroup}>
                <div className={styles.inputLabelRow}>
                  <label className={styles.inputLabel}>I am a...</label>
                </div>
                <div className={styles.inputWrapper}>
                  <select 
                    id="register-role"
                    className={styles.inputField} 
                    value={role} 
                    onChange={e => setRole(e.target.value)}
                  >
                    <option value="tenant">Tenant</option>
                    <option value="manager">Property Manager</option>
                    <option value="technician">Technician</option>
                  </select>
                </div>
              </div>

              {/* Password Input Field */}
              <div className={styles.formGroup}>
                <div className={styles.inputLabelRow}>
                  <label className={styles.inputLabel}>Password</label>
                </div>
                <div className={styles.inputWrapper}>
                  {/* Lock Icon */}
                  <span className={styles.inputIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="register-password"
                    type="password"
                    className={styles.inputField}
                    placeholder="Create a password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="register-submit"
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          </div>

          {/* Login Link below the card */}
          <div className={styles.loginRedirect}>
            Already have an account? 
            <button 
              onClick={onNavigateToLogin}
              className={styles.loginLink}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14 }}
            >
              Sign In
            </button>
          </div>

          <p className={styles.footerText}>
            &copy; {new Date().getFullYear()} PropTech Systems. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  )
}
