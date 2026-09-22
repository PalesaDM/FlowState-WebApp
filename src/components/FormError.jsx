export default function FormError({ message }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="form-error"
      style={{
        background: "#fdecea",
        border: "1px solid #d64545",
        color: "#8a1f1f",
        padding: "10px 14px",
        borderRadius: "10px",
        marginBottom: "14px",
        fontSize: "0.9rem",
      }}
    >
      {message}
    </div>
  );
}