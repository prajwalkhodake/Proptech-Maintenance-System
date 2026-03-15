import { useState } from "react"
import { login } from "../api/api"
import styles from "./Login.module.css"
import { LogoSVG } from "../components/Logo"

export default function Login({ setUser, onNavigateToRegister }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setLoading(true)
    try {
      const data = await login(email, password)
      if (data.token) {
        localStorage.setItem("token", data.token)
        setUser({ token: data.token, role: data.role, name: data.name || email.split("@")[0] })
      } else {
        setError(data.error || "Login failed. Please check your credentials.")
      }
    } catch {
      setError("Unable to connect to server. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginContainer}>

      {/* LEFT PANEL (Hero Image Area) */}
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
              Elevate Your <br />
              Property <br />
              Management.
            </h1>
            <p className={styles.heroDescription}>
              An enterprise-grade platform uniting tenants, managers, and technicians. Experience seamless operations and unmatched efficiency.
            </p>

            {/* Bottom Statistics Section */}
            <div className={styles.heroStatsRow}>
              <div>
                <div className={styles.statNumber}>99.9%</div>
                <div className={styles.statLabel}>System Uptime</div>
              </div>
              <div>
                <div className={styles.statNumber}>24/7</div>
                <div className={styles.statLabel}>Support Ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL (Form Area) */}
      <div className={styles.formPanel}>

        <div className={styles.formContainer}>

          {/* Mobile logo (hidden on desktop screens) */}
          <div className={styles.mobileLogo}>
            <div className={styles.logoIcon}>
              <LogoSVG />
            </div>
            <span className={styles.mobileLogoText}>PropTech</span>
          </div>

          {/* The White Login Card */}
          <div className={styles.loginCard}>

            {/* Header / Title */}
            <div className={styles.loginHeader}>
              <h2 className={styles.loginTitle}>Sign In</h2>
              <p className={styles.loginSubtitle}>
                Secure access to your enterprise dashboard.
              </p>
            </div>

            {/* Error Message Box (only shows if there is an error) */}
            {error && (
              <div className={styles.errorBox}>
                <span>⚠️</span>
                <p className={styles.errorText}>{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin}>

              {/* Email Input Field */}
              <div className={styles.formGroup}>
                <div className={styles.inputLabelRow}>
                  <label className={styles.inputLabel}>Work Email</label>
                </div>
                <div className={styles.inputWrapper}>
                  {/* Mail Icon */}
                  <span className={styles.inputIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    className={styles.inputField}
                    placeholder="name@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              {/* Password Input Field */}
              <div className={styles.formGroup}>
                <div className={styles.inputLabelRow}>
                  <label className={styles.inputLabel}>Password</label>
                  <a href="#" className={styles.forgotPassword}>Forgot password?</a>
                </div>
                <div className={styles.inputWrapper}>
                  {/* Lock Icon */}
                  <span className={styles.inputIcon}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    type="password"
                    className={styles.inputField}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="login-submit"
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
              </button>
            </form>
          </div>

          {/* -----------------------------
              Demo Accounts Section
          ------------------------------ */}
          <div className={styles.demoSection}>
            <div className={styles.demoDivider}>
              <div className={styles.dividerLine}></div>
              <span className={styles.demoDividerText}>Demo Access</span>
              <div className={styles.dividerLine}></div>
            </div>

            {/* List of demo buttons */}
            <div className={styles.demoAccountsList}>
              {[
                { role: 'Tenant', email: 'tenant@test.com' },
                { role: 'Manager', email: 'manager@test.com' },
                { role: 'Technician', email: 'tech@test.com' },
              ].map(demoAccount => (
                <button
                  key={demoAccount.role}
                  type="button"
                  className={styles.demoButton}
                  onClick={() => { setEmail(demoAccount.email); setPassword("123456") }}
                >
                  <div className={styles.demoButtonLeft}>
                    {/* Tiny User Icon inside demo button */}
                    <div className={styles.demoIconBox}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className={styles.demoRoleText}>{demoAccount.role}</span>
                  </div>
                  <span className={styles.demoEmailTag}>{demoAccount.email}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Register Link below the demo accounts */}
          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
            Don't have an account?
            <button
              onClick={onNavigateToRegister}
              style={{ color: '#2563eb', fontWeight: 'bold', marginLeft: '4px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px' }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
              onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
            >
              Sign Up
            </button>
          </div>


          {/* Copyright text at the very bottom */}
          <p className={styles.footerText}>
            &copy; {new Date().getFullYear()} PropTech Systems. All rights reserved.
          </p>

        </div>
      </div>
    </div>
  )
}