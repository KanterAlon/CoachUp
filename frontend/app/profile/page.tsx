'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', age: '', city: '' });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await fetch('/api/profile').then(r => r.json());
      if (data?.profile) {
        setForm({
          full_name: data.profile.full_name || '',
          age: data.profile.age ? String(data.profile.age) : '',
          city: data.profile.city || '',
        });
      }
      setLoaded(true);
    };
    load();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    router.push('/');
  };

  if (!user || !loaded) return null;

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-semibold mb-4">Personal information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          name="age"
          placeholder="Age"
          type="number"
          value={form.age}
          onChange={handleChange}
        />
        <input
          className="w-full border p-2"
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
        />
        <div className="flex space-x-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="px-4 py-2 border border-gray-400 rounded"
          >
            Skip
          </button>
        </div>
      </form>
    </div>
  );
}
