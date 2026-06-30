function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div style={{ background: "#fff", color: "#000", padding: "30px", borderRadius: "8px", textAlign: "center" }}>
        <p>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button onClick={onConfirm}>Evet</button>
          <button onClick={onCancel}>Hayır</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;