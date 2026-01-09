import { useEffect, useState } from 'react'
import { fetchMelbourneComedy } from '../data'

export function useMelbComedy() {
  const [comedyData, setComedyData] = useState<any[]>([])

  useEffect(() => {
    fetchMelbourneComedy().then(data => {
      setComedyData(data)
    })
  }, [])


  return { comedyData }
}
