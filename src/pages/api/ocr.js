import axios from "axios";
import { apiEndpoint } from "src/utils/ocrApi";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '25mb' // Set desired value here
        }
    }
}

export default async function handle(req, res) {
  const { method } = req;

  if (method === "POST") {
    return await handlePostRequest(req, res);
  } else {
    return res.status(400).json({ message: "Bad request" });
  }
}

async function handlePostRequest(req, res) {
  const resp = await axios.post(`${apiEndpoint + '/infer'}`, req.body, {
        headers: {
          "Content-Type": "multipart/form-data", 
        },
      })
  return res.status(201).json(resp.data); // 201 Created status code
}
