import axios from "axios";

export default async function handle(req, res) {
  const { method } = req;

  if (method === "GET") {
    return await handleGetRequest(req, res);
  }
  return res.status(400).json({ message: "Bad request" });
}

async function handleGetRequest(req, res) {
  // Check header for token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_HOST}/users/me`,
    {
      headers: {
        Authorization: token,
        "ngrok-skip-browser-warning": "any",
      },
    }
  );

  return await handleGet(req, res, data);
}

async function handleGet(req, res, data) {
  const resp = await axios.put(
    `${process.env.NEXT_PUBLIC_API_HOST}/documents/${req.query.id}`,
    {
      data: {
        viewedBy: {
          connect: [data.id],
        },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.MASTER_TOKEN}`,
      },
    }
  );

  return res.status(200).json(resp.data);
}
