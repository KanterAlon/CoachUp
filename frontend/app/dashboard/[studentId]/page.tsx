'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

interface Student {
  id: string
  full_name: string
  email: string
  type: string | null
}

export default function StudentPage() {
  const params = useParams<{ studentId: string }>()
  const studentId = params.studentId
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/students')
      if (res.ok) {
        const data = await res.json()
        const s = data.students.find((st: Student) => st.id === studentId)
        setStudent(s)
      }
      setLoading(false)
    }
    if (studentId) load()
  }, [studentId])

  return (
    <div className="max-w-xl mx-auto p-4">
      <SignedOut>
        <div className="text-center">
          <p className="mb-4">Please sign in to view student.</p>
          <SignInButton />
        </div>
      </SignedOut>
      <SignedIn>
        {loading ? (
          <p>Loading...</p>
        ) : (
          student && (
            <div className="space-y-4">
              <h1 className="text-2xl font-bold">{student.full_name}</h1>
              <p className="text-gray-600">{student.email}</p>
              <p className="text-gray-600">{student.type}</p>
              <Link
                href={`/dashboard/${studentId}/plans`}
                className="px-4 py-2 bg-blue-600 text-white rounded inline-block"
              >
                View Plans
              </Link>
            </div>
          )
        )}
      </SignedIn>
    </div>
  )
}
