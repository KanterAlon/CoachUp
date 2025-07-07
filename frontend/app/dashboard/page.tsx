'use client'

import { useEffect, useState } from 'react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface Student {
  id: string
  full_name: string
  email: string
  type: string | null
}

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ full_name: '', email: '', type: '' })
  const router = useRouter()

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/students')
      if (res.status === 401) {
        router.push('/sign-in')
        return
      }
      const data = await res.json()
      setStudents(data.students)
      setLoading(false)
    }
    load()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const data = await res.json()
      setStudents([...students, data.student])
      setForm({ full_name: '', email: '', type: '' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <SignedOut>
        <div className="text-center">
          <p className="mb-4">Please sign in to view your dashboard.</p>
          <SignInButton />
        </div>
      </SignedOut>
      <SignedIn>
        <h1 className="text-2xl font-bold mb-4">Your Students</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2 mb-6">
            {students.map((s) => (
              <li key={s.id} className="p-4 border rounded">
                <h3 className="font-semibold">
                  <a href={`/dashboard/${s.id}`}>{s.full_name}</a>
                </h3>
                <p className="text-sm text-gray-600">{s.email}</p>
              </li>
            ))}
            {students.length === 0 && <p>No students yet.</p>}
          </ul>
          <form onSubmit={handleSubmit} className="space-y-2">
            <input
              className="w-full border p-2"
              name="full_name"
              placeholder="Full name"
              value={form.full_name}
              onChange={handleChange}
              required
            />
            <input
              className="w-full border p-2"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              className="w-full border p-2"
              name="type"
              placeholder="Type"
              value={form.type}
              onChange={handleChange}
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Add Student
            </button>
          </form>
        )}
      </SignedIn>
    </div>
  )
}
