import { httpService } from "@/services/http";
import { SegmentValue } from "@/types/segments";

export const getSegmentValues = async (): Promise<SegmentValue[] | undefined> => {
  return await httpService<SegmentValue[]>({
    path: "/api/SegmentValue",
    options: { method: "GET" },
  });
};

export const getSegmentValueById = async (id: string): Promise<SegmentValue | undefined> => {
  return await httpService<SegmentValue>({
    path: `/api/SegmentValue/${id}`,
    options: { method: "GET" },
  });
};

export const createSegmentValue = async (segmentValue: Omit<SegmentValue, "id">): Promise<SegmentValue | undefined> => {
  return await httpService<SegmentValue>({
    path: "/api/SegmentValue",
    options: {
      method: "POST",
      body: JSON.stringify(segmentValue),
    },
  });
};

export const updateSegmentValue = async (id: string, segmentValue: Partial<SegmentValue>): Promise<SegmentValue | undefined> => {
  return await httpService<SegmentValue>({
    path: `/api/SegmentValue/${id}`,
    options: {
      method: "PUT",
      body: JSON.stringify(segmentValue),
    },
  });
};

export const deleteSegmentValue = async (id: string): Promise<void> => {
  await httpService<void>({
    path: `/api/SegmentValue/${id}`,
    options: { method: "DELETE" },
  });
};

export const getSegmentValuesByType = async (segmentTypeId: string): Promise<SegmentValue[] | undefined> => {
  return await httpService<SegmentValue[]>({
    path: `/api/SegmentValue/byType/${segmentTypeId}`,
    options: { method: "GET" },
  });
};
