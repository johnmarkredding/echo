export default async (echo) => {
    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_SERVER_URL + "/echo", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          accept: "application/json"
        },
        body: JSON.stringify({ data: echo }) // gotta write the query once the backend exists.
      });
      return await response.json();
    } catch (err) {
      console.error("Error posting echo", err);
      return null;
    }
};