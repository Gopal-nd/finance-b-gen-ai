'use client'

import { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { authClient } from '@/lib/auth-client'

interface Rec {
  id: string
  product: string
  rationale: string
}

export default function RecommendPage() {
  const { data: session } = authClient.useSession()
  const router = useRouter()
  const [recs, setRecs] = useState<Rec[]>([])
  const [loading, setLoading] = useState(false)
  const [manual, setManual] = useState({ product: '', rationale: '' })

  const fetchRecs = async () => {
    setLoading(true)
    const res = await fetch('/api/recommend')
    setRecs(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    if (session) fetchRecs()
  }, [session])

  const handleAutoGenerate = async () => {
    setLoading(true)
    await fetch('/api/recommend', { method: 'POST' })
    await fetchRecs()
    setLoading(false)
  }

  const handleAddManual = async () => {
    if (!manual.product || !manual.rationale) return
    setLoading(true)
    await fetch('/api/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(manual),
    })
    setManual({ product: '', rationale: '' })
    await fetchRecs()
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    setLoading(true)
    await fetch(`/api/recommend?id=${id}`, { method: 'DELETE' })
    await fetchRecs()
    setLoading(false)
  }

  if (!session) return <p>Please log in to see recommendations.</p>
  if (loading) return <p>Loading…</p>

  return (
    <div className="space-y-6 p-4">
      <div className="flex gap-2">
        <Button onClick={handleAutoGenerate}>Generate Recommendations</Button>
      </div>

      <div className="space-y-4">
        {recs.map((r) => (
          <Card key={r.id}>
            <CardContent>
              <h3 className="text-lg font-semibold">{r.product}</h3>
              <p>{r.rationale}</p>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)}>
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="border-t pt-4 space-y-2">
        <h2 className="text-xl font-medium">Add Manual Recommendation</h2>
        <Input
          placeholder="Product name"
          value={manual.product}
          onChange={(e) => setManual((m) => ({ ...m, product: e.target.value }))}
        />
        <Textarea
          placeholder="Rationale"
          value={manual.rationale}
          onChange={(e) => setManual((m) => ({ ...m, rationale: e.target.value }))}
        />
        <Button onClick={handleAddManual}>Add Recommendation</Button>
      </div>
    </div>
  )
}
