import { useState, useRef } from "react";
import { separateStems, fetchStemBlob, deleteJob } from "../api.js";
import { uploadStemToStorage } from "../firebase.js";
import FileUpload from "./FileUpload.jsx";
import Options from "./Options.jsx";
import Actions from "./Actions.jsx";
import ProgressBar from "./ProgressBar.jsx";
import Error from "./Error.jsx";
import StemPlayerGroup from "./StemPlayerGroup.jsx";
import "./styles.css";

const STEM_LABELS = {
  vocals: "Vocals",
  bass: "Bass",
  drums: "Full Drums",
  other: "Other / Melody",
  drums_kick: "Kick",
  drums_snare: "Snare",
  drums_hihat: "Hi-Hat",
  drums_toms: "Toms",
  drums_ride: "Ride / Crash",
};

const STEM_GROUPS = {
  "Main Stems": ["vocals", "bass", "other"],
  "Drums": ["drums"],
  "Drum Detail": ["drums_kick", "drums_snare", "drums_hihat", "drums_toms", "drums_ride"],
};

export default function App() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | uploading | processing | done | error
  const [progress, setProgress] = useState("");
  const [stems, setStems] = useState({});   // stemName -> object URL
  const [jobId, setJobId] = useState(null);
  const [error, setError] = useState("");
  const [drumsDetail, setDrumsDetail] = useState(true);
  const [uploadToFirebase, setUploadToFirebase] = useState(false);
  const fileInputRef = useRef();

  function handleFileChange(e) {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setStatus("idle");
      setStems({});
      setError("");
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setStatus("idle");
      setStems({});
      setError("");
    }
  }

  async function handleSeparate() {
    if (!file) return;
    setStatus("uploading");
    setProgress("Uploading audio...");
    setError("");
    setStems({});

    try {
      setStatus("processing");
      setProgress("Running Demucs separation — this may take a minute...");
      const result = await separateStems(file, drumsDetail);
      setJobId(result.job_id);

      setProgress("Fetching stems...");
      const stemBlobs = {};
      const stemObjectURLs = {};

      for (const [name, _url] of Object.entries(result.stems)) {
        const blob = await fetchStemBlob(result.job_id, name);
        stemBlobs[name] = blob;
        stemObjectURLs[name] = URL.createObjectURL(blob);
        setProgress(`Loaded: ${STEM_LABELS[name] || name}`);
      }

      if (uploadToFirebase) {
        setProgress("Uploading stems to Firebase Storage...");
        for (const [name, blob] of Object.entries(stemBlobs)) {
          await uploadStemToStorage(blob, result.job_id, name);
        }
      }

      setStems(stemObjectURLs);
      setStatus("done");
      setProgress("");
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  }

  async function handleReset() {
    if (jobId) await deleteJob(jobId).catch(() => {});
    Object.values(stems).forEach(URL.revokeObjectURL);
    setFile(null);
    setStems({});
    setJobId(null);
    setStatus("idle");
    setProgress("");
    setError("");
    fileInputRef.current.value = "";
  }

  const isProcessing = status === "uploading" || status === "processing";

  return (
    <div className="app">
      <header className="app-header">
        <h1>Audio Stem Separator</h1>
        <p className="subtitle">Powered by Demucs — Vocals · Bass · Drums · Melody · Drum Detail</p>
      </header>

      <main className="app-main">
        <FileUpload
          file={file}
          onFileChange={handleFileChange}
          onDrop={handleDrop}
          fileInputRef={fileInputRef}
          isProcessing={isProcessing}
        />

        <Options
          drumsDetail={drumsDetail}
          onDrumsDetailChange={(e) => setDrumsDetail(e.target.checked)}
          uploadToFirebase={uploadToFirebase}
          onUploadToFirebaseChange={(e) => setUploadToFirebase(e.target.checked)}
          isProcessing={isProcessing}
        />

        <Actions
          onSeparate={handleSeparate}
          onReset={handleReset}
          file={file}
          isProcessing={isProcessing}
          status={status}
        />

        {isProcessing && <ProgressBar progress={progress} />}

        {status === "error" && <Error error={error} />}

        {status === "done" && (
          <section className="stems-section">
            {Object.entries(STEM_GROUPS).map(([groupName, stemNames]) => (
              <StemPlayerGroup
                key={groupName}
                groupName={groupName}
                stemNames={stemNames}
                stems={stems}
                STEM_LABELS={STEM_LABELS}
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
