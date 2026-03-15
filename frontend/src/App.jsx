import { useState } from "react"
import LandingPage from "./pages/LandingPage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import TenantDashboard from "./pages/TenantDashboard"
import ManagerDashboard from "./pages/ManagerDashboard"
import TechnicianDashboard from "./pages/TechnicianDashboard"

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("proptech_user")
    return saved ? JSON.parse(saved) : null
  })
  
  // State to track which page to show: "landing", "login", or "register"
  const [currentPage, setCurrentPage] = useState("landing")

  const handleSetUser = (userData) => {
    if (userData) {
      localStorage.setItem("proptech_user", JSON.stringify(userData))
    } else {
      localStorage.removeItem("proptech_user")
      localStorage.removeItem("token")
      setCurrentPage("landing")
    }
    setUser(userData)
  }

  // If there's no user, show Landing → Login → Register flow
  if (!user) {
    if (currentPage === "register") {
      return (
        <Register 
          setUser={handleSetUser} 
          onNavigateToLogin={() => setCurrentPage("login")} 
        />
      )
    }
    if (currentPage === "login") {
      return (
        <Login 
          setUser={handleSetUser} 
          onNavigateToRegister={() => setCurrentPage("register")} 
        />
      )
    }
    // Default: show landing page
    return (
      <LandingPage
        onNavigateToLogin={() => setCurrentPage("login")}
        onNavigateToRegister={() => setCurrentPage("register")}
      />
    )
  }

  const dashboardProps = { token: user.token, setUser: handleSetUser, userName: user.name }

  switch (user.role) {
    case "tenant":
      return <TenantDashboard {...dashboardProps} />
    case "manager":
      return <ManagerDashboard {...dashboardProps} />
    case "technician":
      return <TechnicianDashboard {...dashboardProps} />
    default:
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="card text-center p-8">
            <h2 className="text-xl font-semibold mb-2">Unknown Role</h2>
            <p className="text-[var(--text-secondary)] mb-4">Your account role "{user.role}" is not recognized.</p>
            <button className="btn btn-primary" onClick={() => handleSetUser(null)}>
              Back to Login
            </button>
          </div>
        </div>
      )
  }
}

export default App