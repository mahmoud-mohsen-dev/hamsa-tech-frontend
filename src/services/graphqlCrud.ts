import { getCookie } from '@/utils/cookieUtils';

export async function fetchGraphql(query: string) {
  const response = await fetch(
    `${process.env.API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query
      })
    }
  );
  // console.log(await response.json());
  // if (!response.ok) {
  //   throw new Error('Error fetching data. Please try again later.');
  // }

  const data = await response.json();
  // console.log(data.errors[0].message);
  return {
    data: data?.data || null,
    error: data?.errors ? data?.errors[0].message || null : null
  }; // Adjust according to your API's response structure
}

export async function fetchGraphqlClient(query: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: query
      })
    }
  );

  const data = await response.json();
  return {
    data: data?.data || null,
    error: data?.errors ? data?.errors[0].message || null : null
  }; // Adjust according to your API's response structure
}
export async function fetchGraphqlClientAuthenticated(query: string) {
  const token = getCookie('token'); // Get the token from the cookie
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/graphql`,
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

  const data = await response.json();
  return {
    data: data?.data || null,
    error: data?.errors ? data?.errors[0].message || null : null
  }; // Adjust according to your API's response structure
}
