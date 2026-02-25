"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authLogin } from "@/lib/api";
import { setAccessToken } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main style={{ padding: 24, maxWidth: 520 }}>
      <h1 style={{ margin: 0, fontSize: 20 }}>Login</h1>
      <p style={{ marginTop: 8, color: "#444" }}>Login using your authority account.</p>

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 6 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 6 }}
          />
        </label>

        <button
          type="button"
          disabled={isLoading || !email || !password}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
          onClick={async () => {
            setIsLoading(true);
            setError(null);
            try {
              const resp = await authLogin(email, password);
              setAccessToken(resp.accessToken);
              router.push("/queue");
            } catch (e: any) {
              setError(e?.error ?? "login_failed");
            } finally {
              setIsLoading(false);
            }
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        {error ? (
          <div style={{ color: "#b00020" }}>
            {error}
          </div>
        ) : null}
      </div>
    </main>
  );
}
