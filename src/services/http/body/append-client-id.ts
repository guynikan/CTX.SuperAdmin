export const appendClientId = (body: URLSearchParams) => {
  const newBody = new URLSearchParams(body);
  let clientId = process.env.CLIENT_ID;
  
  if (!clientId) {
    throw new Error('CLIENT_ID environment variable is not set');
  }
  
  // Remove quotes if present
  clientId = clientId.replace(/^["']|["']$/g, '');
  
  newBody.append('ClientId', clientId);
  return newBody;
};

