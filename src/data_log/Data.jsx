import "./Data.css";

/* ============================================================
   CHECKPOINT CARD
   ============================================================ */
function CheckpointCard({ number, data, type }) {
  return (
    <div className="checkpoint-card">
      <span className="checkpoint-title">CHECKPOINT {number}</span>
      <div className="checkpoint-grid">
        {type === "ball" && (
          <>
            <div className="checkpoint-cell checkpoint-cell--green">
              GREEN BALL: {data.greenBall ?? "—"}
            </div>
            <div className="checkpoint-cell checkpoint-cell--red">
              RED BALL: {data.redBall ?? "—"}
            </div>
          </>
        )}
        {type === "green-box" && (
          <div className="checkpoint-cell checkpoint-cell--green checkpoint-cell--full">
            GREEN BOX: {data.greenBox ?? "—"}
          </div>
        )}
        {type === "blue-box" && (
          <div className="checkpoint-cell checkpoint-cell--blue checkpoint-cell--full">
            BLUE BOX: {data.blueBox ?? "—"}
          </div>
        )}
        <div className="checkpoint-cell">SOG: {data.sog ?? "—"}</div>
        <div className="checkpoint-cell">COG: {data.cog ?? "—"}</div>
        <div className="checkpoint-cell">TIME: {data.time ?? "—"}</div>
        <div className="checkpoint-cell">COORD: {data.coordinate ?? "—"}</div>
      </div>
    </div>
  );
}

/* ============================================================
   CHECKPOINT STRUCTURE — no data, just shape
   Replace data fields with API values later
   ============================================================ */
const checkpoints = [
  { type: "ball" },
  { type: "ball" },
  { type: "ball" },
  { type: "ball" },
  { type: "ball" },
  { type: "ball" },
  { type: "ball" },
  { type: "ball" },
  { type: "ball" },
  { type: "ball" },
  { type: "green-box" },
  { type: "blue-box" },
];

/* ============================================================
   DATA LOG PAGE
   ============================================================ */
function DataLog() {
  return (
    <main className="page-body">
      <div className="tracker-grid">
        {/* Left: checkpoint logger */}
        <div className="panel tracker-main">
          <span className="panel__label">Tracker Monitor</span>
          <div className="checkpoint-scroll">
            {checkpoints.map((cp, i) => (
              <CheckpointCard key={i} number={i + 1} type={cp.type} data={cp} />
            ))}
          </div>
        </div>

        {/* Right: capture feeds */}
        <div className="capture-stack">
          <div className="panel capture-panel">
            <span className="panel__label">Top Capture</span>
          </div>
          <div className="panel capture-panel">
            <span className="panel__label">Underwater Capture</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DataLog;
