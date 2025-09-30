interface ErrorSpanProps {
  message: string;
}

export default function ErrorSpan({ message }: ErrorSpanProps) {
  return (
    <span className="text-red-600 text-sm mt-1 ml-1 block">
      {message}
    </span>
  );
}
