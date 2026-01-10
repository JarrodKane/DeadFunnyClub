import { useQuery } from '@tanstack/react-query';
import { fetchMelbourneComedy } from '../data/melbourne-comedy';

export function useMelbourneComedy() {
  return useQuery({
    queryKey: ['melbourne-comedy'],
    queryFn: fetchMelbourneComedy,
  });
}