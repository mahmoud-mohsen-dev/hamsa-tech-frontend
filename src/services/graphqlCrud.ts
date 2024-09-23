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