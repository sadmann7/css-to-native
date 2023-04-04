import Button from "@/components/ui/Button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { github } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const CodeBlock = ({
  code,
  language = "jsx",
}: {
  code: string;
  language?: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between rounded-t-md bg-gray-700 px-4 py-2">
        <span className="text-sm font-medium uppercase text-white">
          {language}
        </span>
        <Button
          aria-label="Copy to clipboard"
          variant="gray"
          className="h-auto w-fit gap-2 text-sm active:scale-95"
          onClick={() => {
            navigator.clipboard.writeText(code);
            toast.success("Copied to clipboard");
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 2000);
          }}
          disabled={isCopied}
        >
          {isCopied ? (
            <Check className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          {isCopied ? "Copied" : "Copy"}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={github}
        wrapLines={true}
        showLineNumbers={true}
        lineNumberStyle={{ color: "#fff" }}
        customStyle={{
          maxHeight: "none",
          height: "auto",
          overflow: "visible",
          wordWrap: "break-word",
          color: "inherit",
          backgroundColor: "#1D1D1D",
          flex: 1,
          borderRadius: "0.5rem",
        }}
        lineProps={{ style: { whiteSpace: "pre-wrap" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
