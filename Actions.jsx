export default function Actions({ onSeparate, onReset, file, isProcessing, status }) {
  return (
    <section className="actions">
      <button
        className="btn-primary"
        onClick={onSeparate}
        disabled={!file || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Separate Stems'}
      </button>
      {(status === 'done' || status === 'error') && (
        <button className="btn-secondary" onClick={onReset}>
          Start Over
        </button>
      )}
    </section>
  );
}
