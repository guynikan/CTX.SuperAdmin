export const appendTenantId = (options: RequestInit) => {
  const headers = new Headers(options.headers);
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID || 'd23a5d2c-61d7-45de-80e6-a87b6c7faf8d';
  headers.append('x-tenant-id', tenantId);
  return headers;
};

