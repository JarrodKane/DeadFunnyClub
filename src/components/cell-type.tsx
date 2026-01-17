import { getTypeAttributes } from '../helper';
import { Badge } from './ui/badge';

interface CellTypeProps {
  type: string;
}

export function CellType({ type }: CellTypeProps) {
  if (!type || type === '—') {
    return <>—</>;
  }

  const { badgeClass } = getTypeAttributes(type);

  return (
    <Badge variant="outline" className={badgeClass}>
      {type}
    </Badge>
  );
}
