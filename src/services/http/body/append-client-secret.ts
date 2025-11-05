export const appendClientSecret = (body: URLSearchParams) => {
  const newBody = new URLSearchParams(body);
  let clientSecret = process.env.CLIENT_SECRET;
  
  if (!clientSecret) {
    throw new Error('CLIENT_SECRET environment variable is not set');
  }
  
  // Remove quotes if present
  clientSecret = clientSecret.replace(/^["']|["']$/g, '');
  
  newBody.append('ClientSecret', clientSecret);
  return newBody;
};

