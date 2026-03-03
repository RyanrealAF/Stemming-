import StemPlayer from "./StemPlayer";

export default function StemPlayerGroup({ groupName, stemNames, stems, STEM_LABELS }) {
  const available = stemNames.filter(name => name in stems);
  if (!available.length) return null;

  return (
    <div className="stem-group">
      <h2 className="stem-group-title">{groupName}</h2>
      {available.map((name) => (
        <StemPlayer
          key={name}
          label={STEM_LABELS[name] || name}
          objectUrl={stems[name]}
          fileName={`${name}.wav`}
        />
      ))}
    </div>
  );
}
