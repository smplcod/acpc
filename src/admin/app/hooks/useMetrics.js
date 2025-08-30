import { useEffect, useState } from 'react'
import loadMetrics from './metrics.js'

export default function useMetrics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    loadMetrics()
      .then(res => {
        if (mounted) setData(res)
      })
      .catch(err => {
        if (mounted) setError(err)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  return { data, loading, error }
}
