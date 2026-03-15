import { useEffect, useState } from "react"
import { getRequests } from "../api/api"
import CreateRequest from "../components/CreateRequest"
import Layout from "../components/Layout"
import styles from "./TenantDashboard.module.css"

const statusBadgeClass = (status) => {
  const map = {
    "Open": "badge-open",
    "Assigned": "badge-assigned",
    "In Progress": "badge-in-progress",
    "Done": "badge-done",
  }
  return `badge ${map[status] || "badge-open"}`
}

const priorityBadgeClass = (p) => {
  const map = { "Low": "badge-low", "Medium": "badge-medium", "High": "badge-high" }
  return `badge ${map[p] || "badge-medium"}`
}

const priorityIcon = (p) => {
  const map = { "Low": "🟢", "Medium": "🟡", "High": "🔴" }
  return map[p] || "🟡"
}

export default function TenantDashboard({ token, setUser, userName }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [previewImage, setPreviewImage] = useState(null)
  const [filter, setFilter] = useState("All")

  const loadRequests = async () => {
    setLoading(true)
    try {
      const data = await getRequests(token)
      setRequests(data.requests || [])
    } catch {
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadRequests() }, [])

  const total = requests.length
  const open = requests.filter(r => r.status === "Open").length
  const inProgress = requests.filter(r => r.status === "In Progress").length
  const done = requests.filter(r => r.status === "Done").length

  const filtered = filter === "All" ? requests : requests.filter(r => r.status === filter)

  const stats = [
    { label: "Total", value: total, color: "var(--primary)" },
    { label: "Open", value: open, color: "var(--status-open-dot)" },
    { label: "In Progress", value: inProgress, color: "var(--status-progress-dot)" },
    { label: "Resolved", value: done, color: "var(--status-done-dot)" },
  ]

  const filters = ["All", "Open", "Assigned", "In Progress", "Done"]

  return (
    <Layout setUser={setUser} role="tenant" userName={userName}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h1 className={styles.greetingText}>
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}{userName ? `, ${userName}` : ''}
        </h1>
        <p className={styles.subtitleText}>
          Here's an overview of your maintenance requests
        </p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div className={styles.statCard} key={s.label}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={styles.statLabel}>
                {s.label}
              </span>
            </div>
            <div className={styles.statValue}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Create Request */}
      <div style={{ marginBottom: '2rem' }}>
        <CreateRequest token={token} refresh={loadRequests} />
      </div>

      {/* Filter + Requests Header */}
      <div className={styles.requestHeader}>
        <h2 className={styles.sectionTitle}>
          Your Requests
        </h2>
        <div className={styles.filterGroup}>
          {filters.map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : styles.filterBtnInactive}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <h3 className={styles.emptyTitle}>
            {filter === "All" ? "No requests yet" : `No ${filter} requests`}
          </h3>
          <p className={styles.emptyDesc}>
            {filter === "All"
              ? "Create your first maintenance request above"
              : "Try a different filter to see requests"}
          </p>
        </div>
      ) : (
        <div className={styles.requestsGrid}>
          {filtered.map(r => (
            <div className={styles.requestCard} key={r.id}>
              <div className={styles.reqCardHeader}>
                <h3 className={styles.reqTitle}>
                  {r.title}
                </h3>
                <span className={styles.reqId}>
                  #{r.id}
                </span>
              </div>

              <p className={styles.reqDesc}>
                {r.description}
              </p>

              <div className={styles.badgeGroup}>
                <span className={statusBadgeClass(r.status)}>{r.status}</span>
                <span className={priorityBadgeClass(r.priority)}>
                  {priorityIcon(r.priority)} {r.priority}
                </span>
              </div>

              {r.image && (
                <img
                  src={`http://127.0.0.1:5001/${r.image}`}
                  alt="Issue"
                  className={styles.reqImage}
                  onClick={() => setPreviewImage(`http://127.0.0.1:5001/${r.image}`)}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Overlay */}
      {previewImage && (
        <div className={styles.previewOverlay} onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Preview" className={styles.previewImage} />
        </div>
      )}
    </Layout>
  )
}