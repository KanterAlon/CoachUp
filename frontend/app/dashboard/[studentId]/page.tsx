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
  age: number | null
  description: string | null
  avatar_url: string | null
  schedule: string | null
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
    <div className="max-w-4xl mx-auto p-4">
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
            <div className="flex flex-col md:flex-row">
              <aside className="md:w-64 md:pr-4 mb-4 md:mb-0 text-center">
                {student.avatar_url && (
                  <img
                    src={student.avatar_url}
                    alt={student.full_name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-2"
                  />
                )}
                <h1 className="text-xl font-bold">{student.full_name}</h1>
                {student.age && (
                  <p className="text-sm text-gray-600">Age: {student.age}</p>
                )}
                {student.description && (
                  <p className="text-sm text-gray-600 mt-1">{student.description}</p>
                )}
                {student.schedule && (
                  <p className="text-sm text-gray-600 mt-1">Schedule: {student.schedule}</p>
                )}
                <nav className="mt-4 space-y-2">
                  <Link
                    href={`/dashboard/${studentId}/plans`}
                    className="block px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Plan de Entrenamiento
                  </Link>
                </nav>
              </aside>
              <div className="flex-grow"></div>
            </div>
          )
        )}
      </SignedIn>
    </div>
  )
}
