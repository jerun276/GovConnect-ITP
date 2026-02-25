"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchQueue, type ComplaintDto } from "@/lib/api";
import { getAccessToken, clearAccessToken } from "@/lib/auth";

export default function QueuePage() {
  const router = useRouter();
  const [items, setItems] = useState<ComplaintDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/login");
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        const res = await fetchQueue();
        if (!isMounted) return;
        setItems(res);
      } catch (e: any) {
        if (!isMounted) return;
        setError(e?.error ?? "queue_fetch_failed");
      } finally {
        if (!isMounted) return;
        setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [router]);

  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Complaint Queue</h1>
        <button
          type="button"
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          onClick={() => {
            clearAccessToken();
            router.push("/login");
          }}
        >
          Logout
        </button>
      </div>

      {isLoading ? <p>Loading...</p> : null}
      {error ? <p style={{ color: "#b00020" }}>{error}</p> : null}

      {!isLoading && !error ? (
        <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
          {items.map((c) => (
            <div key={c.id} style={{ border: "1px solid #e5e5e5", borderRadius: 8, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{c.complaintCode} — {c.categoryCode}</div>
                  <div style={{ color: "#444", marginTop: 4 }}>{c.descriptionText}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, color: "#444" }}>{c.status}</div>
                  <div style={{ marginTop: 8 }}>
                    <Link href={`/complaints/${c.id}`}>Open</Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 ? <p>No complaints found.</p> : null}
        </div>
      ) : null}
    </main>
  );
}
