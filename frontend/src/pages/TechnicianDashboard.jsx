import { useEffect, useState } from "react"
import { getRequests, updateRequestStatus } from "../api/api"
import Layout from "../components/Layout"
import styles from "./TechnicianDashboard.module.css"

const statusOrder = ["Open", "Assigned", "In Progress", "Done"]
const statusEmoji = { "Open": "⚪", "Assigned": "🔵", "In Progress": "🟡", "Done": "✅" }

const nextStatusMap = {
  "Assigned": { next: "In Progress", label: "Start Work", emoji: "" },
  "In Progress": { next: "Done", label: "Mark Complete", emoji: "✅" },
}

const priorityBadgeClass = (p) => {
  const map = { "Low": "badge-low", "Medium": "badge-medium", "High": "badge-high" }
  return `badge ${map[p] || "badge-medium"}`
}

const priorityIcon = (p) => {
  const map = { "Low": "🟢", "Medium": "🟡", "High": "🔴" }
  return map[p] || "🟡"
}

function StatusStepper({ currentStatus }) {
  const currentIdx = statusOrder.indexOf(currentStatus)

  return (
    <div className="stepper">
      {statusOrder.map((step, idx) => {
        const isCompleted = idx < currentIdx
        const isActive = idx === currentIdx
        return (
          <div key={step} className={styles.stepperContainer} style={{ flex: idx < statusOrder.length - 1 ? 1 : 'none' }}>
            <div className={styles.stepperStep}>
              <div className={`${styles.stepperDot} ${isCompleted ? styles.stepperDotCompleted : ''} ${isActive ? styles.stepperDotActive : ''}`}>
                {isCompleted ? '✓' : statusEmoji[step]}
              </div>
              <span className={styles.stepperLabel}>{step}</span>
            </div>
            {idx < statusOrder.length - 1 && (
              <div className={`${styles.stepperLine} ${isCompleted ? styles.stepperLineCompleted : ''}`} style={{ flex: 1 }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function TechnicianDashboard({ token, setUser, userName }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [filter, setFilter] = useState("All")
  const [toast, setToast] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

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

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await updateRequestStatus(token, id, newStatus)
      showToast(`Status updated to "${newStatus}"`)
      loadRequests()
    } catch {
      showToast("Failed to update status", "error")
    } finally {
      setUpdatingId(null)
    }
  }

  const assigned = requests.filter(r => r.status === "Assigned").length
  const inProgress = requests.filter(r => r.status === "In Progress").length
  const done = requests.filter(r => r.status === "Done").length

  const filtered = filter === "All" ? requests : requests.filter(r => r.status === filter)
  const filters = ["All", "Assigned", "In Progress", "Done"]

  const stats = [
    { label: "Assigned", value: assigned },
    { label: "In Progress", value: inProgress },
    { label: "Completed", value: done },
  ]

  return (
    <Layout setUser={setUser} role="technician" userName={userName}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h1 className={styles.greetingText}>
          My Tasks
        </h1>
        <p className={styles.subtitleText}>
          {userName ? `Welcome, ${userName}. ` : ''}Manage your assigned maintenance tasks
        </p>
      </div>

      {/* Stats */}
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

      {/* Filters */}
      <div className={styles.requestHeader}>
        <h2 className={styles.sectionTitle}>
          Assigned Tasks
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
          <div className={styles.emptyIcon}>🎉</div>
          <h3 className={styles.emptyTitle}>
            {filter === "All" ? "No tasks assigned" : `No ${filter} tasks`}
          </h3>
          <p className={styles.emptyDesc}>
            {filter === "All"
              ? "You're all caught up! New tasks will appear here when assigned"
              : "Try a different filter"}
          </p>
        </div>
      ) : (
        <div className={styles.requestsGrid}>
          {filtered.map(r => {
            const nextAction = nextStatusMap[r.status]
            return (
              <div className={styles.requestCard} key={r.id}>
                {/* Top */}
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

                {/* Priority badge */}
                <div className={styles.badgeGroup}>
                  <span className={priorityBadgeClass(r.priority)}>
                    {priorityIcon(r.priority)} {r.priority} Priority
                  </span>
                </div>

                {/* Status stepper */}
                <StatusStepper currentStatus={r.status} />

                {/* Image */}
                {r.image && (
                  <img
                    src={`http://127.0.0.1:5001/${r.image}`}
                    alt="Issue"
                    className={styles.reqImage}
                  />
                )}

                {/* Action Button */}
                {nextAction && (
                  <button
                    className={styles.actionBtn}
                    disabled={updatingId === r.id}
                    onClick={() => handleStatusUpdate(r.id, nextAction.next)}
                  >
                    {updatingId === r.id ? (
                      <>
                        <span className={styles.spinner} style={{ width: 14, height: 14, borderWidth: 2 }} />
                        Updating…
                      </>
                    ) : (
                      <>
                        <span className={styles.actionBtnIcon}>{nextAction.emoji}</span>
                        {nextAction.label}
                      </>
                    )}
                  </button>
                )}

                {r.status === "Done" && (
                  <div className={styles.completedBox}>
                    <span>✅</span>
                    <span className={styles.completedText}>
                      Task completed
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      )}
    </Layout>
  )
}