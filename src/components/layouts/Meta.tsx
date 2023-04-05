import Head from "next/head";

type MetaProps = {
  siteName?: string;
  title?: string;
  description?: string;
  image?: string;
  keywords?: string;
  url?: string;
};

const Meta = ({
  title = "Native CSS",
  description = "Convert your CSS to React Native Stylesheet",
  image = "https://nativecss.vercel.app/api/og?title=Native%20CSS&description=Convert%20your%20CSS%20to%20React%20Native%20Stylesheet",
  keywords = "css, react native, stylesheet, tailwind, tailwindcss, tailwindcss.com, tailwindcss.com/docs, tailwindcss.com/docs/utility-first",
}: MetaProps) => {
  return (
    <Head>
      <meta name="description" content={description} />
      <meta property="og:site_name" content={title} />
      <meta property="og:description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Meta;
