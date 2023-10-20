export default async (echo) => {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_SERVER_URL + '/echo', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        accept: 'application/json'
      },
      body: JSON.stringify({data: echo})
    });
    return await response.json();
  } catch (err) {
    console.error('Error sending echo', err);
    return null;
  }
};