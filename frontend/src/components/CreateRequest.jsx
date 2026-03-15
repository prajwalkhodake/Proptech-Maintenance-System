import { useState } from "react"

export default function CreateRequest({ token, refresh }) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("Medium")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})

  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const validate = () => {
    const errs = {}
    if (!title.trim()) errs.title = "Title is required"
    if (!description.trim()) errs.description = "Description is required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("priority", priority)
      if (image) formData.append("image", image)

      await fetch("http://127.0.0.1:5001/requests", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      showToast("Request submitted successfully!")
      setTitle("")
      setDescription("")
      setPriority("Medium")
      setImage(null)
      setImagePreview(null)
      setErrors({})
      setIsOpen(false)
      refresh()
    } catch {
      showToast("Failed to submit request", "error")
    } finally {
      setLoading(false)
    }
  }

  const priorities = [
    { value: "Low", emoji: "🟢", color: "var(--priority-low-bg)", textColor: "var(--priority-low-text)" },
    { value: "Medium", emoji: "🟡", color: "var(--priority-medium-bg)", textColor: "var(--priority-medium-text)" },
    { value: "High", emoji: "🔴", color: "var(--priority-high-bg)", textColor: "var(--priority-high-text)" },
  ]

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          className="btn btn-primary w-full"
          style={{ height: 48, fontSize: 16, background: 'linear-gradient(to right, #2563eb, #1d4ed8)', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)', borderRadius: '12px', border: 'none', color: 'white' }}
          onClick={() => setIsOpen(true)}
        >
          <span style={{ fontSize: 20 }}>＋</span>
          New Maintenance Request
        </button>
      )}

      {/* Expandable Form */}
      {isOpen && (
        <div className="card animate-fade-in-up" style={{ border: '2px solid var(--primary-100)' }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              New Maintenance Request
            </h3>
            <button
              className="btn-icon btn-secondary"
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', cursor: 'pointer', fontSize: 16,
                background: 'var(--surface-hover)', border: '1px solid var(--surface-border)',
                fontFamily: 'Inter, sans-serif',
              }}
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Title */}
            <div>
              <label className="form-label">Issue Title</label>
              <input
                className="input"
                placeholder="e.g., Leaking faucet in bathroom"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={errors.title ? { borderColor: '#ef4444' } : {}}
              />
              {errors.title && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="form-label">Description</label>
              <textarea
                className="textarea"
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                style={errors.description ? { borderColor: '#ef4444' } : {}}
              />
              {errors.description && (
                <p className="text-xs mt-1" style={{ color: '#ef4444' }}>{errors.description}</p>
              )}
            </div>

            {/* Priority Pills */}
            <div>
              <label className="form-label">Priority Level</label>
              <div className="flex gap-3">
                {priorities.map(p => (
                  <button
                    key={p.value}
                    type="button"
                    className="flex items-center gap-2 flex-1 justify-center cursor-pointer"
                    style={{
                      padding: '10px 16px',
                      borderRadius: 'var(--radius-sm)',
                      border: priority === p.value ? `2px solid ${p.textColor}` : '2px solid var(--surface-border)',
                      background: priority === p.value ? p.color : 'var(--surface)',
                      color: priority === p.value ? p.textColor : 'var(--text-secondary)',
                      fontWeight: priority === p.value ? 600 : 400,
                      fontSize: 14,
                      fontFamily: 'Inter, sans-serif',
                      transition: 'var(--transition-fast)',
                    }}
                    onClick={() => setPriority(p.value)}
                  >
                    {p.emoji} {p.value}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="form-label">Attach Photo (optional)</label>
              <label
                className="flex flex-col items-center justify-center cursor-pointer"
                style={{
                  border: '2px dashed var(--surface-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: imagePreview ? 0 : '28px 20px',
                  transition: 'var(--transition-fast)',
                  background: 'var(--surface-hover)',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-light)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--surface-border)'}
              >
                {imagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: '100%',
                        maxHeight: 200,
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    <button
                      type="button"
                      className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs cursor-pointer border-none"
                      style={{ background: 'rgba(0,0,0,0.6)' }}
                      onClick={(e) => {
                        e.preventDefault()
                        setImage(null)
                        setImagePreview(null)
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      Click to upload or drag & drop
                    </span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)', marginTop: 4 }}>
                      JPG, JPEG, PNG (max 5MB)
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  className="hidden"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                className="btn btn-secondary flex-1"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                style={{ background: 'linear-gradient(to right, #2563eb, #1d4ed8)', border: 'none', color: 'white', borderRadius: '12px', height: '48px', fontWeight: 'bold' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.message}
        </div>
      )}
    </>
  )
}