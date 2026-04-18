export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="page-loader" role="status" aria-live="polite" aria-label={message}>
      <div className="page-loader__spinner" />
      <p className="page-loader__text">{message}</p>
    </div>
  );
}
