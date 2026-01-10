import { Table } from '../components'
import { useMelbourneComedy } from '../hooks/useMelbComedy';

export function Melbourne() {
  const { data, isLoading, error } = useMelbourneComedy();

  if (isLoading) return <div>Loading...</div>;
  if (error || !data) return <div>Error loading events</div>;


  return (
    <main className="flex min-h-screen flex-col items-center p-10 ">
      <div className="flex flex-col gap-6 w-full max-w-7xl">
        <h1 className="text-3xl sm:text-5xl font-bold" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
          Melbourne Comedy Shows
        </h1>
        <Table data={data} />
      </div>
    </main>
  )
}