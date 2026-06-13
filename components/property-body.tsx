import ReactMarkdown from "react-markdown";

export function PropertyBody({ content }: { content: string }) {
  return (
    <div className="prose-property">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
