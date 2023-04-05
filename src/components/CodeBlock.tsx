import { Check, Clipboard } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

type CodeBlockProps = {
  code: string;
  language?: string;
  minHeight?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const CodeBlock = ({
  code,
  language = "javascript",
  minHeight = "448px",
}: CodeBlockProps) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between rounded-t-md bg-zinc-700 px-4 py-0.5">
        <span className="text-xs text-white sm:text-sm">{language}</span>
        <button
          aria-label="Copy to clipboard"
          className="flex h-auto w-fit items-center gap-2 py-1.5 text-xs active:scale-95 disabled:pointer-events-none disabled:opacity-70 sm:text-sm"
          onClick={() => {
            navigator.clipboard.writeText(code);
            toast.success("Copied to clipboard");
            setIsCopied(true);
            setTimeout(() => {
              setIsCopied(false);
            }, 3000);
          }}
          disabled={isCopied || !code.length}
        >
          {isCopied ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Copied!
            </>
          ) : (
            <>
              <Clipboard className="h-4 w-4" aria-hidden="true" />
              Copy code
            </>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        wrapLines={true}
        showLineNumbers={true}
        lineNumberStyle={{ color: "#fff" }}
        customStyle={{
          marginTop: "-1px",
          padding: "25px",
          borderRadius: "0 0 6px 6px",
          minHeight: minHeight,
        }}
        lineProps={{ style: { whiteSpace: "pre-wrap" } }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
