export default function DoseHistory({ doseLogs }) {
  if (doseLogs.length === 0) {
    return <p>No doses logged yet.</p>;
  }

  return (
    <ul className="dose-history">
      {doseLogs.map((log) => (
        <li key={log._id}>
          <strong>{log.medication?.name || 'Unknown medication'}</strong> — {log.status} at{' '}
          {new Date(log.takenAt).toLocaleString()}
        </li>
      ))}
    </ul>
  );
}
