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
    case "PUT":
        handlePutRequest(req, res);
        break;
    case "DELETE":
        handleDeleteRequest(req, res);
        break;
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).json({ message: `Method ${method} Not Allowed` });
      break;
  }

  await prisma.$disconnect();
}

async function handlePostRequest(req, res) {
    //TODO create new user if no jwt is provided
}

async function handleGetRequest(req, res) {
    //TODO get user from id
    //jangan liatin password syg
    //if params.id is not provided, return current user with jwt
}

async function handlePutRequest(req, res) {
    //TODO update user
    //Admins can update any user
    //Users can only update password
}

async function handleDeleteRequest(req, res) {
    //TODO delete user
    //Admins can delete any user
}

