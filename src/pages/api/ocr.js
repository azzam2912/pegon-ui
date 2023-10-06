import axios from "axios";
import { apiEndpoint } from "src/utils/ocrApi";
import FormData from "form-data";
import formidable from "formidable";

const fs = require("fs");

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(req, res) {
  const { method } = req;

  if (method === "POST") {
    return await handlePostRequest(req, res);
  } else {
    return res.status(400).json({ message: "Bad request" });
  }
}

async function handlePostRequest(req, res) {
  const form = new formidable.IncomingForm();
  const formData = new FormData();

  form.parse(req, async (err, fields, files) => {
    formData.append(
      "file",
      fs.createReadStream(files.file.filepath),
      files.file.originalFilename,
    );

    try {
      const response = await axios.post(`${apiEndpoint}/infer`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "API-Key": process.env.API_KEY,
        },
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.error("Error forwarding data to OCR backend:", error);
      res.status(500).json({ error: "Error forwarding data to OCR backend" });
    }
  });
}
