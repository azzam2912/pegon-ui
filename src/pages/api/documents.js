// create CRUD API for documents

import { PrismaClient } from "@prisma/client";

// Fetch all posts (in /pages/api/posts.ts)
const prisma = new PrismaClient();

export default async function handle(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      handlePostRequest(req, res);
      break;
    case "GET":
      handleGetRequest(req, res);
      break;
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }

  await prisma.$disconnect();
}

async function handlePostRequest(req, res) {
  const { data } = req.body;
  // Process the data and perform any necessary actions
  const document1 = await prisma.document.create({
    data,
  });
  res.status(200).json({ message: "POST request successful" });
}

async function handleGetRequest(req, res) {
  // Fetch data or perform any necessary actions for GET request
  const documents = await prisma.document.findMany();
  res.status(200).json({ message: "GET request successful", data: documents });
}
