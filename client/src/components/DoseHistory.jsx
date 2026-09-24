export default function DoseHistory({ doseLogs }) {
  if (doseLogs.length === 0) {
    return <p>No doses logged yet.</p>;
  }

  return (
    <ul className="dose-history">
      {doseLogs.map((log) => (
        <li key={log._id}>
          <span>
            <strong>{log.medication?.name || 'Unknown medication'}</strong>
            {' — '}
            {new Date(log.takenAt).toLocaleString()}
          </span>
          <span className={`dose-status ${log.status}`}>{log.status}</span>
        </li>
      ))}
    </ul>
  );
}
