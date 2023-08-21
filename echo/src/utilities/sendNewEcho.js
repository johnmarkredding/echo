export default sendNewEcho = async (newEcho) => {
  console.log("sendNewEcho called");
  try {
    fetch(process.env.GRAPHQL_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json" },
    // body: JSON.stringify({ query: ------include newEcho------ }) // gotta write the query once the backend exists.
  });
  } catch (error) {
    console.error(error);
  }
}
