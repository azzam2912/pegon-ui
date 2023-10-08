import axios from "axios";
import { apiEndpoint } from "src/utils/jawiApi";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "POST") {
    return await handlePostRequest(req, res);
  } else {
    return res.status(400).json({ message: "Bad request" });
  }
}

async function handlePostRequest(req, res) {
  // Handle POST requests here without authorization
  // Perform any necessary operations with the data
  // For example, create a new document
  const mode = req.body.mode
  delete req.body.mode
  const resp = await axios.post(`${apiEndpoint + mode}`, req.body);

  // Respond with the data received from the POST request
  return res.status(201).json(resp.data); // 201 Created status code
}
