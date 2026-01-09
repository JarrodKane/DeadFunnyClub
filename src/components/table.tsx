interface ComedyEvent {
  [key: string]: string;
}

interface TableProps {
  data: ComedyEvent[];
}

export function Table({ data }: TableProps) {
  if (data.length === 0) {
    return <p className="text-white">No data available</p>;
  }

  const headers = Object.keys(data[0]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-white border-collapse">
        <thead>
          <tr className="bg-green-900">
            {headers.map(header => (
              <th key={header} className="p-2 text-left border border-green-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-green-800 hover:bg-green-950">
              {headers.map(header => (
                <td key={header} className="p-2 border border-green-800">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}