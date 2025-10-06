'use server';

export async function fetchGraphqlServerWebAuthenticated(
  query: string
) {
  const token = process.env.API_TOKEN;
  const response = await fetch(
    `${process.env.API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }) // Add token to headers if it exists
      },
      body: JSON.stringify({
        query: query
      })
    }
  );

  console.log('response', JSON.stringify(response));

  const data = await response.json();
  console.log('data', JSON.stringify(data));
  return {
    data: data?.data || null,
    error: data?.errors ? data?.errors[0].message || null : null
  };
}
