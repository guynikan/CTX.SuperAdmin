import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSegmentValues,
  getSegmentValueById,
  getSegmentValuesByType,
  createSegmentValue,
  updateSegmentValue,
  deleteSegmentValue,
} from "@/services/segment-values";
import { SegmentValue } from "@/types/segments";

export function useSegmentValues() {
  return useQuery({
    queryKey: ["segment-values"],
    queryFn: getSegmentValues,
    staleTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });
}

export function useSegmentValueById(id: string) {
  return useQuery({
    queryKey: ["segment-value", id],
    queryFn: () => getSegmentValueById(id),
    enabled: !!id,
  });
}

export function useSegmentValuesByType(segmentTypeId: string) {
  return useQuery({
    queryKey: ["segment-values-by-type", segmentTypeId],
    queryFn: () => getSegmentValuesByType(segmentTypeId),
    enabled: !!segmentTypeId,
  });
}

export function useCreateSegmentValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSegmentValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segment-values"] });
    },
  });
}

export function useUpdateSegmentValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SegmentValue> }) => updateSegmentValue(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["segment-value", id] });
      queryClient.invalidateQueries({ queryKey: ["segment-values"] });
    },
  });
}

export function useDeleteSegmentValue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSegmentValue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["segment-values"] });
    },
  });
}
