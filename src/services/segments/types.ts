import { httpService } from "@/services/http";
import { CreateSegmentType, SegmentType } from "@/types/segments";

export const getSegmentTypes = async (): Promise<SegmentType[] | undefined> => {
  return await httpService<SegmentType[]>({
    path: "/api/SegmentType",
    options: { method: "GET" },
  });
};

export const getSegmentTypeById = async (id: string): Promise<SegmentType | undefined> => {
  return await httpService<SegmentType>({
    path: `/api/SegmentType/${id}`,
    options: { method: "GET" },
  });
};

export const createSegmentType = async (segmentType: CreateSegmentType): Promise<SegmentType | undefined> => {
  return await httpService<SegmentType>({
    path: "/api/SegmentType",
    options: {
      method: "POST",
      body: JSON.stringify(segmentType),
    },
  });
};

export const updateSegmentType = async (id: string, segmentType: Partial<SegmentType>): Promise<SegmentType | undefined> => {
  return await httpService<SegmentType>({
    path: `/api/SegmentType/${id}`,
    options: {
      method: "PUT",
      body: JSON.stringify(segmentType),
    },
  });
};

export const deleteSegmentType = async (id: string): Promise<void> => {
  await httpService<void>({
    path: `/api/SegmentType/${id}`,
    options: { method: "DELETE" },
  });
};
