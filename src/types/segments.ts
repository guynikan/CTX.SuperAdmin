export type SegmentType = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  description?: string;
  priority: number;
  isActive: boolean;
  segmentValues?: SegmentValue[];
};

export type SegmentValue = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  segmentTypeId: string;
  value: string;
  displayName: string;
  description?: string;
  isActive: boolean;
};

export type CreateSegmentValue = Pick<SegmentValue, "segmentTypeId" | "value" | "displayName" | "description">;

export type CreateSegmentType = Pick<SegmentType, "name" | "description" | "priority">;
