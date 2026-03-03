export default function Options({ drumsDetail, onDrumsDetailChange, uploadToFirebase, onUploadToFirebaseChange, isProcessing }) {
  return (
    <section className="options">
      <label className="option-toggle">
        <input
          type="checkbox"
          checked={drumsDetail}
          onChange={onDrumsDetailChange}
          disabled={isProcessing}
        />
        Separate drum sub-stems (kick, snare, hi-hat)
      </label>
      <label className="option-toggle">
        <input
          type="checkbox"
          checked={uploadToFirebase}
          onChange={onUploadToFirebaseChange}
          disabled={isProcessing}
        />
        Upload stems to Firebase Storage
      </label>
    </section>
  );
}