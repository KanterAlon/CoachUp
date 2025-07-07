'use client'

import { useEffect, useState } from 'react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

interface Student {
  id: string
  full_name: string
  email: string
  type: string | null
  age: number | null
  description: string | null
  avatar_url: string | null
  schedule: string | null
}

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    type: '',
    age: '',
    description: '',
    avatar_url: '',
    schedule: '',
  })
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
      setForm({
        full_name: '',
        email: '',
        type: '',
        age: '',
        description: '',
        avatar_url: '',
        schedule: '',
      })
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
          <>
            <ul className="grid gap-4 mb-6 sm:grid-cols-2">
              {students.map((s) => (
                <li
                  key={s.id}
                  className="p-4 border rounded flex flex-col items-center text-center"
                >
                  {s.avatar_url && (
                    <img
                      src={s.avatar_url}
                      alt={s.full_name}
                      className="w-24 h-24 rounded-full object-cover mb-2"
                    />
                  )}
                  <h3 className="font-semibold text-lg">
                    <a href={`/dashboard/${s.id}`}>{s.full_name}</a>
                  </h3>
                  <p className="text-sm text-gray-600">{s.email}</p>
                  {s.description && (
                    <p className="text-sm mt-1 text-gray-500">{s.description}</p>
                  )}
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
            <input
              className="w-full border p-2"
              name="age"
              type="number"
              placeholder="Age"
              value={form.age}
              onChange={handleChange}
            />
            <textarea
              className="w-full border p-2"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
            />
            <input
              className="w-full border p-2"
              name="avatar_url"
              placeholder="Photo URL"
              value={form.avatar_url}
              onChange={handleChange}
            />
            <input
              className="w-full border p-2"
              name="schedule"
              placeholder="Schedule (e.g. Mon 10:00, Wed 14:00)"
              value={form.schedule}
              onChange={handleChange}
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Add Student
            </button>
            </form>
          </>
        )}
      </SignedIn>
    </div>
  )
}
