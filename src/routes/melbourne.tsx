import { Table } from '../components'
import { useMelbComedy } from '../hooks'

export function Melbourne() {
  const { comedyData } = useMelbComedy()

  return (
    <main className="flex min-h-screen flex-col items-center p-10 bg-gradient-to-b from-green-950 to-black">
      <div className="flex flex-col gap-6 w-full max-w-7xl">
        <h1 className="text-3xl sm:text-5xl font-bold text-white" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
          Melbourne Comedy Shows
        </h1>
        <Table data={comedyData} />
      </div>
    </main>
  )
}