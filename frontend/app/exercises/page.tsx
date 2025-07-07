'use client'
import { useEffect, useState } from 'react'
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'

interface Exercise {
  id: string
  name: string
  description: string | null
  icon: string | null
}

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [form, setForm] = useState({ name: '', description: '', icon: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/exercises')
      if (res.ok) {
        const data = await res.json()
        setExercises(data.exercises)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const data = await res.json()
      setExercises([...exercises, data.exercise])
      setForm({ name: '', description: '', icon: '' })
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <SignedOut>
        <div className="text-center">
          <p className="mb-4">Please sign in to manage your exercises.</p>
          <SignInButton />
        </div>
      </SignedOut>
      <SignedIn>
        <h1 className="text-2xl font-bold mb-4">Your Exercises</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul className="space-y-2 mb-6">
            {exercises.map((ex) => (
              <li key={ex.id} className="p-4 border rounded">
                <p className="font-semibold">{ex.name}</p>
                {ex.description && <p className="text-sm text-gray-600">{ex.description}</p>}
              </li>
            ))}
            {exercises.length === 0 && <p>No exercises yet.</p>}
          </ul>
        )}
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            className="w-full border p-2"
            name="name"
            placeholder="Exercise name"
            value={form.name}
            onChange={handleChange}
            required
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
            name="icon"
            placeholder="Icon URL"
            value={form.icon}
            onChange={handleChange}
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Add Exercise
          </button>
        </form>
      </SignedIn>
    </div>
  )
}
