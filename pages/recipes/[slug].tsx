import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";

import { sanityClient, urlFor, usePreviewSubscription } from "../../lib/sanity";

const recipeQuery = groq`*[_type == "recipe" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    mainImage,
    ingredient[]{
      _key,
      unit,
      wholeNumber,
      fraction,
      ingredient->{
        name
      }
    },
    instructions,
    likes
  }`;

export const OneRecipe = ({ data, preview }: any) => {
  const router = useRouter();

  const { data: recipe } = usePreviewSubscription(recipeQuery, {
    params: { slug: data.recipe?.slug.current },
    initialData: data,
    enabled: preview,
  });
  const [likes, setLikes] = useState<Number>(data?.recipe?.likes);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const addLike = async () => {
    const res: any = await fetch("/api/handle-like", {
      method: "POST",
      body: JSON.stringify({ _id: recipe._id }),
    }).catch((error) => console.log(error));
    setLikes(res.likes);
  };

  return (
    <article className="recipe">
      <h1>{recipe?.name}</h1>
      <button className="like-button" onClick={addLike}>
        {data?.recipe?.likes} 💗
      </button>
      <main className="content">
        <div className="recipe-detail-img">
          {recipe?.mainImage && (
            <Image
              height={300}
              width={300}
              placeholder="blur"
              layout="responsive"
              objectFit="cover"
              src={urlFor(recipe?.mainImage).url()}
              blurDataURL={urlFor(recipe?.mainImage).width(300).url()}
              alt={recipe?.name}
            />
          )}
        </div>
        <div className="breakdown">
          <ul className="ingredients">
            {recipe?.ingredient?.map((ingredient: any) => (
              <li key={recipe?._key} className="ingredient">
                {ingredient?.wholeNumber} {ingredient?.fraction}{" "}
                {ingredient?.unit}
                <br />
                {ingredient?.ingredient?.name}
              </li>
            ))}
          </ul>
          <div className="instructions">
            <PortableText value={recipe?.instructions} />
          </div>
        </div>
      </main>
    </article>
  );
};

export const getStaticPaths = async () => {
  const paths = await sanityClient.fetch(
    `*[_type == "recipe" && defined(slug.current)]{
      "params": {
        "slug": slug.current
      }
    }`
  );

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params }: any) => {
  const { slug = "" } = params;
  let recipe;
  recipe = await sanityClient.fetch(recipeQuery, { slug });
  return { props: { data: { recipe }, preview: true } };
};

export default OneRecipe;
