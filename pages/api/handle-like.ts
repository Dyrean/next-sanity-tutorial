// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sanityClient } from "../../lib/sanity";
import type { NextApiRequest, NextApiResponse } from "next";

sanityClient.config({
  token: process.env.SANITY_PROJECT_TOKEN,
});

type Data = {
  likes: number;
};

export const likeButtonHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id } = JSON.parse(req.body);
  const data: any = await sanityClient
    .patch(_id)
    .setIfMissing({ likes: 0 })
    .inc({ likes: 1 })
    .commit()
    .catch((error) => console.log(error));
  console.log(data);
  res.status(200).json({ likes: data.likes });
};

export default likeButtonHandler;
