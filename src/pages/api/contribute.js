import formidable from "formidable";
import axios from "axios";
import FormData from "form-data";
import { apiEndpoint } from "src/utils/api";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle(req, res) {
  const { method } = req;

  if (method === "POST") {
    return await handlePostRequest(req, res);
  }
  return res.status(400).json({ message: "Bad request" });
}

async function handlePostRequest(req, res) {
  // Check header for token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const form = new formidable.IncomingForm();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    const fieldData = JSON.parse(fields.data);

    const { data } = await axios.get(`${apiEndpoint}/users/me`, {
      headers: {
        Authorization: token,
        "ngrok-skip-browser-warning": "any",
      },
    });

    const finalData = {
      ...fieldData,
      author: fieldData.author ? fieldData.author : "Anonymous",
      collector: fieldData.collector ? fieldData.collector : "Not Specified",
      contributor: data?.id,
      publishedAt: null,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(finalData));

    const fs = require("fs");

    for (const key in files) {
      formData.append(
        key,
        fs.createReadStream(files[key].filepath),
        files[key].originalFilename,
      );
    }

    // check if title, documentType, language, file, and thumbnail is empty if yes then give appropriate error
    if (
      !finalData.title ||
      !finalData.documentType ||
      !finalData.language ||
      !files["files.file"] ||
      !files["files.thumbnail"]
    ) {
      return res
        .status(400)
        .json({ message: "Please fill all the required fields" });
    }

    try {
      const resp = await axios.post(`${apiEndpoint}/documents`, formData, {
        headers: {
          Authorization: `Bearer ${process.env.MASTER_TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
      });
      
      return res.status(200).json(resp.data);
    } catch (error) {
      if (error.response?.status === 413) {
        return res.status(413);
      } else {
        throw error;
      }
    }
  });
}
