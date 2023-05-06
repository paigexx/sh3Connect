import type { NextApiRequest, NextApiResponse } from "next";

const isMentor = async (username): boolean => {
  const headers = {
    Authorization: `bearer ${process.env.GITHUB_TOKEN}`,
  };

  const body = {
    query: `query {
      user(login: "${username}") {
        id
        name
        repositoriesContributedTo {
          totalCount
        }
        repositories {
          totalCount
        }
        pullRequests {
          totalCount
        }
      }
    }`,
  };

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    body: JSON.stringify(body),
    headers: headers,
  });
  const { data } = await response.json();

  // TODO tweak values
  if (
    data?.user?.repositoriesContributedTo.totalCount > 1 &&
    data?.user?.repositories.totalCount > 1 &&
    data?.user?.pullRequests.totalCount > 1
  ) {
    return true;
  }
  return false;
};

// This route will be used by the contract to verify that a mentor
// has enough contributions
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    res.status(200).json(await isMentor(req.query?.username));
  } else {
    res.status(400).json({ message: "Route doesn't exisit....yet " });
  }
}
