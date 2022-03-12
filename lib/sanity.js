import {
  createPreviewSubscriptionHook,
  createCurrentUserHook,
  createClient,
} from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2021-10-21",
  useCdn: process.env.NODE_ENV === "production",
};

export const sanityClient = createClient(config);

export const useCurrentUser = createCurrentUserHook(config);

export const usePreviewSubscription = createPreviewSubscriptionHook(config);

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source) => builder.image(source);
