import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ background: "var(--primary-dark)" }}>
      {children}
    </div>
  )
}
