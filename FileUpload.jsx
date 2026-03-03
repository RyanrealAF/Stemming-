export default function FileUpload({ file, onFileChange, onDrop, fileInputRef, isProcessing }) {
  return (
    <section
      className={`drop-zone ${file ? 'has-file' : ''}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      onClick={() => !isProcessing && fileInputRef.current.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,.flac,.ogg,.m4a"
        style={{ display: 'none' }}
        onChange={onFileChange}
        disabled={isProcessing}
      />
      {file ? (
        <div className="file-info">
          <span className="file-name">{file.name}</span>
          <span className="file-size">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </span>
        </div>
      ) : (
        <div className="drop-prompt">
          <span className="drop-icon">🎵</span>
          <p>Drop audio file here or click to browse</p>
          <span className="formats">MP3 · WAV · FLAC · OGG · M4A — max 100MB</span>
        </div>
      )}
    </section>
  );
}