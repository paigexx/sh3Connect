// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const headers = {
      "content-type": "application/json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    };
    const requestBody = {
      query: `query githubUser($login: String!){
        user(login: $login) {
          id
          repositoriesContributedTo {
            totalCount
          }
          repositories {
            totalCount
          }
          twitterUsername
          pullRequests {
            totalCount
          }
        }
      }`,
      //hard coded for now
      variables: { login: "paigexx" },
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(requestBody),
    };
    const response = await axios(
      "https://api.github.com/graphql",
      options
    ).catch((err) => res.status(200).json({ err: err }));
    console.log(response);

    res.status(200).json({ isVerified: true });
  } else {
    res.status(400).json({ message: "Route doesn't exisit....yet " });
  }
}
