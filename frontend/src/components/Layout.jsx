import { useState } from "react"
import styles from "./Layout.module.css"
import { LogoSVG } from "./Logo"
import Profile from "./Profile"

export default function Layout({ children, setUser, role, userName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("Dashboard")

  const handleNavClick = (label) => {
    setActiveTab(label)
    setMobileMenuOpen(false)
  }

  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"
  const initials = userName ? userName.charAt(0).toUpperCase() : roleLabel.charAt(0)

  const navItems = [
    { icon: "📊", label: "Dashboard", active: activeTab === "Dashboard" || activeTab === "Requests" },
    { icon: "📋", label: "Requests", active: activeTab === "Requests" },
    { icon: "👤", label: "Profile", active: activeTab === "Profile" },
  ]

  return (
    <div className={styles.layoutWrapper}>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <aside className={styles.sidebar}>
        {/* Logo */}
        <div>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <LogoSVG />
            </div>
            <span className={styles.logoText}>PropTech</span>
          </div>

          {/* Nav */}
          <nav className={styles.navMenu}>
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`${styles.navItem} ${item.active ? styles.navItemActive : ''}`}
                onClick={() => handleNavClick(item.label)}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom: User + Logout */}
        <div>
          {/* User info */}
          <div className={styles.userProfile}>
            <div className={styles.userAvatar}>
              {initials}
            </div>
            <div className={styles.userInfo}>
              <div className={styles.userName}>{userName || "User"}</div>
              <div className={styles.userRole}>{roleLabel}</div>
            </div>
          </div>

          {/* Logout */}
          <button
            className={`btn btn-danger ${styles.signOutBtn}`}
            onClick={() => setUser(null)}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ===== MOBILE HEADER ===== */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileHeaderTop} style={{ background: 'linear-gradient(to right, #0f172a, #1e3a8a)' }}>
          <div className={styles.mobileLogoArea}>
            <div className={styles.mobileLogoIcon}>
              <LogoSVG />
            </div>
            <span className={styles.mobileLogoText}>PropTech</span>
          </div>
          <div className={styles.mobileControls}>
            <div className={styles.mobileAvatar}>
              {initials}
            </div>
            <button
              className={styles.menuToggleBtn}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className={`glass-dark animate-fade-in ${styles.mobileDropdown}`}>
            {navItems.map(item => (
              <button
                key={item.label}
                className={`${styles.mobileNavItem} ${item.active ? styles.mobileNavItemActive : ''}`}
                onClick={() => handleNavClick(item.label)}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
            <hr className={styles.mobileDivider} />
            <button
              className={styles.mobileSignOutBtn}
              onClick={() => setUser(null)}
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className={styles.mainContent}>
        {/* Mobile top spacing */}
        <div className={styles.mobileTopSpacing} />

        <div className={`animate-fade-in ${styles.contentContainer}`}>
          {activeTab === "Profile" ? (
            <Profile userName={userName} role={role} setUser={setUser} />
          ) : (
            children
          )}
        </div>
      </main>

      {/* ===== MOBILE BOTTOM NAV ===== */}
      <div className={`glass ${styles.mobileBottomNav}`}>
        <div className={styles.bottomNavItems}>
          {navItems.map(item => (
            <button
              key={item.label}
              className={`${styles.bottomNavItem} ${item.active ? styles.bottomNavItemActive : ''}`}
              onClick={() => handleNavClick(item.label)}
            >
              <span className={styles.bottomNavIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile bottom spacing */}
      <div className={styles.mobileBottomSpacing} />
    </div>
  )
}