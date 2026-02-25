import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ margin: 0, fontSize: 24 }}>GovConnect Authority</h1>
      <p style={{ marginTop: 12 }}>
        Start here:
      </p>
      <ul>
        <li>
          <Link href="/login">Login</Link>
        </li>
        <li>
          <Link href="/queue">Complaint Queue</Link>
        </li>
      </ul>
    </main>
  );
}
