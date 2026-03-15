import styles from "./LandingPage.module.css"
import heroBg from "../assets/hero-bg.png"
import { LogoSVG } from "../components/Logo"

function LandingPage({ onNavigateToLogin, onNavigateToRegister }) {
  return (
    <div className={styles.landingContainer}>
      {/* Background Image */}
      <img src={heroBg} alt="Property background" className={styles.bgImage} />

      {/* Dark Gradient Overlay */}
      <div className={styles.overlay} />

      {/* Decorative Orbs */}
      <div className={styles.orbTopRight} />
      <div className={styles.orbBottomLeft} />
      <div className={styles.orbCenter} />

      {/* Main Content */}
      <div className={styles.content}>
        {/* Logo Badge */}
        <div className={styles.logoBadge}>
          <div className={styles.logoIcon}>
            <LogoSVG />
          </div>
          <span className={styles.logoBadgeText}>Property Management</span>
        </div>

        {/* Heading */}
        <h1 className={styles.heading}>
          <span className={styles.headingWrapper}>
            Smart Property<br />
            <span className={styles.headingAccent}>Management System</span>
          </span>
        </h1>

        {/* Tagline */}
        <p className={styles.tagline}>
          Streamline your property maintenance, manage tenants effortlessly,
          and keep everything running smoothly — all in one powerful platform.
        </p>

        {/* Action Buttons */}
        <div className={styles.buttonsRow}>
          <button className={styles.btnPrimary} onClick={onNavigateToLogin}>
            <span>Login</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <button className={styles.btnOutline} onClick={onNavigateToRegister}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
            <span>Register</span>
          </button>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Support</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>2K+</div>
            <div className={styles.statLabel}>Tenants</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>99%</div>
            <div className={styles.statLabel}>Uptime</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        {/* Left — Contact Email */}
        <div className={styles.footerLeft}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span>Contact us:&nbsp;</span>
          <a href="mailto:support@proptech.com" className={styles.footerEmail}>
            support@proptech.com
          </a>
        </div>

        {/* Right — Developer Credit & LinkedIn */}
        <div className={styles.footerRight}>
          <span>Designed & Developed by Prajwal Khodake</span>
          <a
            href="https://www.linkedin.com/in/prajwal-khodake-513026378"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkedinLink}
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.064 2.064 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
