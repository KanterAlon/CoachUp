'use client'
import { useEffect, useState } from 'react'

interface Exercise {
  id: string
  name: string
  description: string | null
}

export default function Community() {
  const [allExercises, setAllExercises] = useState<Exercise[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    const load = async () => {
      const res = await fetch('/api/community')
      if (res.ok) {
        const data = await res.json()
        setAllExercises(data.exercises)
      }
    }
    load()
  }, [])

  const filtered = allExercises.filter((ex) =>
    ex.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Community Exercises</h1>
      <input
        className="w-full border p-2 mb-4"
        placeholder="Search exercises"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="space-y-2">
        {filtered.map((ex) => (
          <li key={ex.id} className="p-4 border rounded">
            <p className="font-semibold">{ex.name}</p>
            {ex.description && (
              <p className="text-sm text-gray-600">{ex.description}</p>
            )}
          </li>
        ))}
        {filtered.length === 0 && <p>No matching exercises.</p>}
      </ul>
    </div>
  )
}
