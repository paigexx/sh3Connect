import type { NextApiRequest, NextApiResponse } from "next";

const getUserData = async (username) => {
  const headers = {
    Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
  };

  const body = {
    query: `query {
      user(login: "${username}") {
        name
        bio
        twitterUsername
        avatarUrl
        email
        location
        url
        websiteUrl
      }
    }`,
  };

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
  });
  const data = await response.json();
  return data;
};

// This route will be used by the frontend to display data about a mentor
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    res.status(200).json(await getUserData(req.query?.username));
  } else {
    res.status(400).json({ message: "Route doesn't exisit....yet " });
  }
}
