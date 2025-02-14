export type SegmentType = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  description: string;
  priority: number;
  isActive: boolean;
  segmentValues?: SegmentValueType[];
};

export type SegmentValueType = {
  id: string;
  createdAt: string;
  updatedAt: string;
  segmentTypeId: string;
  value: string;
  displayName: string;
  description: string;
  isActive: boolean;
  segmentType: string;
};

export type CreateSegmentType = Pick<SegmentType, "name" | "description" | "priority">;
