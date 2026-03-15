const API_BASE = "http://127.0.0.1:5001"

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  return res.json()
}

export async function register(name, email, password, role) {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role })
  })
  return res.json()
}

export async function getRequests(token) {
  const res = await fetch(`${API_BASE}/requests`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function createRequest(token, formData) {
  const res = await fetch(`${API_BASE}/requests`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  })
  return res.json()
}

export async function getTechnicians(token) {
  const res = await fetch(`${API_BASE}/technicians`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return res.json()
}

export async function assignTechnician(token, requestId, technicianId) {
  const res = await fetch(`${API_BASE}/requests/${requestId}/assign`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ technician_id: technicianId })
  })
  return res.json()
}

export async function updateRequestStatus(token, requestId, status) {
  const res = await fetch(`${API_BASE}/requests/${requestId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  })
  return res.json()
}