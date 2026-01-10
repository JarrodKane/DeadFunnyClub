import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface ComedyEvent {
  [key: string]: string;
}

interface TableProps {
  data: ComedyEvent[];
}

export function Table({ data }: TableProps) {
  if (data.length === 0) {
    return <p className="text-muted-foreground">No data available</p>;
  }

  console.log('First row:', data[0]);
  console.log('Available keys:', Object.keys(data[0]));

  const displayColumnTitle = Object.keys(data[0])


  return (
    <div className="w-full overflow-x-auto rounded-md border">
      <ShadTable>
        <TableHeader>
          <TableRow>
            {displayColumnTitle.map(header => (
              <TableHead key={header} className="min-w-[150px]">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={i}>
              {displayColumnTitle.map(header => (
                <TableCell key={header} className="max-w-[250px] whitespace-normal break-words">
                  {row[header] || '—'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </ShadTable>
    </div>
  );
}