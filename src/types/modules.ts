
export type Module = {
  id: string,
  createdAt?: Date,
  updatedAt?: Date,
  parentId?: string,
  parent?: string,
  name: string,
  description?: string,
  level: number,
  isActive?: boolean,
  children?: string[],
  configurations?: string[]
}

export type CreateModule = Pick<Module, "name">;