import CodeBlock from "@/components/CodeBlock";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import Button from "@/components/ui/Button";
import type { NextPageWithLayout } from "@/pages/_app";
import { zodResolver } from "@hookform/resolvers/zod";
import Head from "next/head";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  css: z.string().min(1, { message: "Please enter your css" }),
});
type Inputs = z.infer<typeof schema>;

const Home: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedStyles, setGeneratedStyles] = useState("");

  // react-hook-form
  const { register, handleSubmit, formState, control, reset } = useForm<Inputs>(
    {
      resolver: zodResolver(schema),
    }
  );
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);
    setGeneratedStyles("");
    setIsLoading(true);
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const responseData = response.body;
    if (!responseData) {
      return;
    }

    const reader = responseData.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedStyles((prev) => prev + chunkValue);
    }

    // reset();
    setIsLoading(false);
  };

  console.log(generatedStyles);

  return (
    <>
      <Head>
        <title>CSS to React Native Stylesheet</title>
      </Head>
      <main className="w-full pb-16 pt-20">
        <div className="container grid max-w-6xl place-items-center gap-12 sm:gap-14">
          <div className="grid w-full max-w-4xl place-items-center gap-10">
            <h1 className="text-center text-3xl font-bold leading-tight text-gray-200 sm:text-5xl sm:leading-tight">
              Convert your <span className="text-violet-400">CSS</span> to react
              native
              <span className="text-violet-400"> stylesheet</span> in seconds
            </h1>
            <Button
              aria-label="Convert"
              className="w-fit"
              isLoading={isLoading}
              loadingVariant="dots"
              onClick={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              Convert
            </Button>
          </div>
          <div className="grid w-full items-start gap-5 md:grid-cols-2">
            <form
              aria-label="Generate pokemon form"
              className="grid w-full gap-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <fieldset className="grid w-full gap-2.5">
                <label
                  htmlFor="css"
                  className="text-base font-semibold text-gray-50 sm:text-lg"
                >
                  CSS
                </label>
                <textarea
                  id="css"
                  className="h-[480px] w-full rounded-md border-gray-400 bg-[#282c34] px-5 py-4 text-base text-gray-50 transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  placeholder="Enter your css here.."
                  {...register("css", { required: true })}
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
            </form>
            <div className="flex w-full flex-col gap-2.5">
              <h2 className="text-base font-semibold text-gray-50 sm:text-lg">
                RN Stylesheet
              </h2>
              <CodeBlock code={generatedStyles.replace(/`/g, "")} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

Home.getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>;
