import { getTypeAttributes } from '../../helper';
import { Badge } from '../ui/badge';

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  if (!type || type === '—') {
    return <>—</>;
  }

  const { badgeClass, abbreviation } = getTypeAttributes(type);

  return (
    <Badge variant="outline" className={badgeClass}>
      <span className="hidden sm:inline">{type}</span>
      <span className="sm:hidden">{abbreviation}</span>
    </Badge>
  );
}
