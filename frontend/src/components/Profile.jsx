import styles from "./Profile.module.css"

export default function Profile({ userName, role, setUser }) {
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "User"
  const initials = userName ? userName.charAt(0).toUpperCase() : roleLabel.charAt(0)

  return (
    <div className={`animate-fade-in ${styles.profileWrapper}`}>
      <div className={styles.profileHeader}>
        <h1 className={styles.pageTitle}>My Profile</h1>
        <p className={styles.pageSubtitle}>Manage your account information and settings</p>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarLarge}>{initials}</div>
          <div className={styles.avatarInfo}>
            <h2 className={styles.userName}>{userName || "User"}</h2>
            <span className={styles.userRoleBadge}>{roleLabel}</span>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>Full Name</span>
            <div className={styles.infoValue}>{userName || "User"}</div>
          </div>
          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>Account Role</span>
            <div className={styles.infoValue}>{roleLabel}</div>
          </div>
          {/* We can add email and other settings here in the future */}
        </div>
        
        <div className={styles.actionsSection}>
          <button className={`btn btn-danger ${styles.logoutBtn}`} onClick={() => setUser(null)}>
            Sign Out of Account
          </button>
        </div>
      </div>
    </div>
  )
}
