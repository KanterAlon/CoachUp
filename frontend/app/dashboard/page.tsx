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
          <ul className="space-y-2">
            {students.map((s) => (
              <li key={s.id} className="p-4 border rounded">
                <h3 className="font-semibold">{s.full_name}</h3>
                <p className="text-sm text-gray-600">{s.email}</p>
              </li>
            ))}
            {students.length === 0 && <p>No students yet.</p>}
          </ul>
        )}
      </SignedIn>
    </div>
  )
}
