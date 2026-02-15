import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserGameStats } from '../backend';

export function useGetMyStats() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  const query = useQuery<UserGameStats | null>({
    queryKey: ['myStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMyStats();
    },
    enabled: !!actor && !actorFetching && !!identity,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
  };
}

export function useUpdateMyStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newStats: UserGameStats) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMyStats(newStats);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myStats'] });
    },
  });
}
