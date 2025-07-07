'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

interface Plan {
  id: string
  notes: string | null
  previous_plan_id: string | null
}

export default function PlansPage() {
  const params = useParams<{ studentId: string }>()
  const studentId = params.studentId
  const [plans, setPlans] = useState<Plan[]>([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/plans/${studentId}`)
      if (res.ok) {
        const data = await res.json()
        setPlans(data.plans)
      }
      setLoading(false)
    }
    if (studentId) load()
  }, [studentId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/plans/${studentId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes })
    })
    if (res.ok) {
      const data = await res.json()
      setPlans([...plans, data.plan])
      setNotes('')
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <SignedOut>
        <div className="text-center">
          <p className="mb-4">Please sign in to view plans.</p>
          <SignInButton />
        </div>
      </SignedOut>
      <SignedIn>
        <h1 className="text-2xl font-bold mb-4">Plans</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2 mb-6">
            {plans.map((p) => (
              <li key={p.id} className="p-4 border rounded">
                <p className="font-semibold">Plan {p.id.slice(0, 8)}</p>
                {p.notes && <p className="text-sm text-gray-600">{p.notes}</p>}
              </li>
            ))}
            {plans.length === 0 && <p>No plans yet.</p>}
          </ul>
        )}
        <form onSubmit={handleSubmit} className="space-y-2">
          <textarea
            className="w-full border p-2"
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Add Plan
          </button>
        </form>
      </SignedIn>
    </div>
  )
}
