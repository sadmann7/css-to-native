import Button from "@/components/ui/Button";
import type { NextPageWithLayout } from "@/pages/_app";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  css: z.string(),
});
type Inputs = z.infer<typeof schema>;

const Home: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);

  // react-hook-form
  const { register, handleSubmit, formState, control, reset } = useForm<Inputs>(
    {
      resolver: zodResolver(schema),
    }
  );
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
  };

  return (
    <>
      <Head>
        <title>CSS to Native Converter</title>
      </Head>
      <main className="w-full pt-40 pb-32 sm:pt-32">
        <div className="container grid max-w-5xl place-items-center gap-12 sm:gap-14">
          <h1 className="w-full max-w-4xl text-center text-4xl font-bold leading-tight text-gray-200 sm:text-6xl sm:leading-tight">
            Convert css to react native stylesheet object in seconds
          </h1>
          <form
            aria-label="Generate pokemon form"
            className="grid w-full max-w-lg place-items-center gap-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <fieldset className="grid w-full gap-5">
              <label htmlFor="image" className="sr-only">
                Upload your image
              </label>
              <textarea
                id="requirement"
                rows={2}
                className="w-full rounded-md border-gray-400 bg-transparent px-4 pt-2.5 text-base text-gray-50 transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:ring-offset-gray-800"
                placeholder="e.g. Time"
                {...register("css")}
                onKeyDown={(e) => {
                  if (!formState.isValid || isLoading) return;
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    handleSubmit(onSubmit)();
                  }
                }}
              />

              {formState.errors.css?.message ? (
                <p className="text-sm font-medium text-red-500">
                  {formState.errors.css.message}
                </p>
              ) : null}
            </fieldset>
            <Button
              aria-label="Generate pokemon"
              className="w-fit"
              isLoading={isLoading}
              loadingVariant="dots"
              disabled={isLoading}
            >
              Generate pokemon
            </Button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Home;
