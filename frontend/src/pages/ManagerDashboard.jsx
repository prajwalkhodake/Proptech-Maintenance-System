import { useEffect, useState } from "react"
import { getRequests, getTechnicians, assignTechnician } from "../api/api"
import Layout from "../components/Layout"
import styles from "./ManagerDashboard.module.css"

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

export default function ManagerDashboard({ token, setUser, userName }) {
  const [requests, setRequests] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [loading, setLoading] = useState(true)
  const [assigningId, setAssigningId] = useState(null)
  const [selectedTech, setSelectedTech] = useState({})
  const [filter, setFilter] = useState("All")
  const [toast, setToast] = useState(null)

  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [reqData, techData] = await Promise.all([
        getRequests(token),
        getTechnicians(token),
      ])
      setRequests(reqData.requests || [])
      setTechnicians(techData.technicians || [])
    } catch {
      setRequests([])
      setTechnicians([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleAssign = async (requestId) => {
    const techId = selectedTech[requestId]
    if (!techId) {
      showToast("Please select a technician first", "error")
      return
    }
    setAssigningId(requestId)
    try {
      await assignTechnician(token, requestId, techId)
      showToast("Technician assigned successfully!")
      loadData()
    } catch {
      showToast("Failed to assign technician", "error")
    } finally {
      setAssigningId(null)
    }
  }

  const total = requests.length
  const open = requests.filter(r => r.status === "Open").length
  const assigned = requests.filter(r => r.status === "Assigned").length
  const inProgress = requests.filter(r => r.status === "In Progress").length
  const done = requests.filter(r => r.status === "Done").length

  const filtered = filter === "All" ? requests : requests.filter(r => r.status === filter)
  const filters = ["All", "Open", "Assigned", "In Progress", "Done"]

  const stats = [
    { label: "Total Tickets", value: total, icon: "" },
    { label: "Open", value: open, icon: "" },
    { label: "Assigned", value: assigned, icon: "" },
    { label: "In Progress", value: inProgress, icon: "" },
    { label: "Closed", value: done, icon: "" },
  ]

  return (
    <Layout setUser={setUser} role="manager" userName={userName}>
      {/* Header */}
      <div className={styles.dashboardHeader}>
        <h1 className={styles.greetingText}>
          Manager Dashboard
        </h1>
        <p className={styles.subtitleText}>
          Overview and management of all maintenance tickets
        </p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        {stats.map(s => (
          <div className={styles.statCard} key={s.label}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>{s.icon}</span>
            </div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={styles.requestHeader}>
        <h2 className={styles.sectionTitle}>
          All Tickets
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
            {filter === "All" ? "No tickets found" : `No ${filter} tickets`}
          </h3>
          <p className={styles.emptyDesc}>
            Tickets submitted by tenants will appear here
          </p>
        </div>
      ) : (
        <div className={styles.requestsGrid}>
          {filtered.map(r => {
            const techName = technicians.find(t => t.id === r.technician_id)?.name
            return (
              <div className={styles.requestCard} key={r.id}>
                {/* Header */}
                <div className={styles.reqCardHeader}>
                  <div style={{ flex: 1 }}>
                    <h3 className={styles.reqTitle}>
                      {r.title}
                    </h3>
                    <p className={styles.reqMeta}>
                      Tenant #{r.tenant_id} · Ticket #{r.id}
                    </p>
                  </div>
                </div>

                <p className={styles.reqDesc}>
                  {r.description}
                </p>

                {/* Badges */}
                <div className={styles.badgeGroup}>
                  <span className={statusBadgeClass(r.status)}>{r.status}</span>
                  <span className={priorityBadgeClass(r.priority)}>
                    {priorityIcon(r.priority)} {r.priority}
                  </span>
                </div>

                {/* Assigned Technician */}
                {techName && (
                  <div className={styles.assignedTechBox}>
                    <div className={styles.techAvatar}>
                      {techName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className={styles.techName}>
                        {techName}
                      </div>
                      <div className={styles.techRole}>Assigned Technician</div>
                    </div>
                  </div>
                )}

                {/* Assign Technician (only if Open or re-assign) */}
                {r.status === "Open" && (
                  <div className={styles.assignTechArea}>
                    <label className={styles.assignLabel}>Assign Technician</label>
                    <div className={styles.assignControls}>
                      <select
                        className={styles.techSelect}
                        value={selectedTech[r.id] || ""}
                        onChange={e => setSelectedTech({ ...selectedTech, [r.id]: e.target.value })}
                      >
                        <option value="">Select technician...</option>
                        {technicians.map(t => (
                          <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                        ))}
                      </select>
                      <button
                        className={styles.assignBtn}
                        disabled={assigningId === r.id}
                        onClick={() => handleAssign(r.id)}
                      >
                        {assigningId === r.id ? (
                          <span className={styles.spinner} style={{ width: 14, height: 14, borderWidth: 2 }} />
                        ) : "Assign"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Image */}
                {r.image && (
                  <img
                    src={`http://127.0.0.1:5001/${r.image}`}
                    alt="Issue"
                    className={styles.reqImage}
                  />
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