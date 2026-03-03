export default function ProgressBar({ progress }) {
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-track">
        <div className="progress-bar-fill" />
      </div>
      <p className="progress-label">{progress}</p>
    </div>
  );
}
