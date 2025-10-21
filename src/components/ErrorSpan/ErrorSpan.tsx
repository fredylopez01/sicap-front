export function ErrorSpan({ message }: { message: string }) {
  return (
    <span
      style={{
        color: "red",
        fontSize: "0.85em",
        marginTop: "5px",
        display: "block",
      }}
    >
      {message}
    </span>
  );
}
