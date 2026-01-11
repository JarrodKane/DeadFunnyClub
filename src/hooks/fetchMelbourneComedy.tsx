import { useQuery } from '@tanstack/react-query';
import { fetchMelbourneComedy } from '../data/fetchComedy';

export function useMelbourneComedy() {
  return useQuery({
    queryKey: ['melbourne-comedy'],
    queryFn: fetchMelbourneComedy,
  });
}