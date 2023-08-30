export default async () => {
  const response = await fetch(process.env.GRAPHQL_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    // body: JSON.stringify({ query: ---------- }) // gotta write the query once the backend exists.
  });
  return await response.json();
}
