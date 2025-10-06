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

  const data = await response.json();
  // console.log(data.errors[0].message);
  return {
    data: data?.data || null,
    error: data?.errors ? data?.errors[0].message || null : null
  };
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
  };
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
  };
}

export async function fetchGraphqlServerAuthenticated(query: string) {
  const token = `${process.env.API_TOKEN}`;
  // console.log(token);
  // console.log(`${process.env.API_BASE_URL}/graphql`);
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

  console.log('response', response);
  const data = await response.json();
  console.log('data', data);
  // console.log(data?.errors ?? null);
  // console.log(data?.error ?? null);
  // console.log(data.errors[0].message);
  return {
    data: data?.data || null,
    error: data?.errors ? data?.errors[0].message || null : null
  };
}

export async function fetchGraphqlByArgsToken(
  query: string,
  token?: string | null
) {
  if (!token) return { data: null, error: 'Token was not provided' };
  // const token = process.env.API_TOKEN;
  const response = await fetch(
    `${process.env.API_BASE_URL}/graphql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Add token to headers if it exists
      },
      body: JSON.stringify({
        query: query
      })
    }
  );

  const data = await response.json();
  // console.log(JSON.stringify(data));
  // console.log(data.errors[0].message);
  return {
    data: data?.data || null,
    error: data?.errors ? data?.errors[0].message || null : null
  };
}

export async function postRestAPI({
  pathname,
  body
}: {
  pathname: string;
  body: { [key: string]: any };
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/${pathname}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    }
  );

  const data = await response.json();
  return {
    data: data?.data || null,
    error:
      data?.errors && data?.errors.length > 0 ?
        data?.errors[0]?.message
      : (data?.error?.message ?? null)
  };
}
