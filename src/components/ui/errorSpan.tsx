type ErrorSpanProps = {
  message: string;
};

export default function ErrorSpan({ message }: ErrorSpanProps) {
  return (
    <span className="text-red-500 text-sm font-medium mt-1 ml-1">
      ⚠️ {message}
    </span>
  );
}