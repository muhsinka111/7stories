// Waitlist persistence helper.
// Returns true if the email was persisted (Supabase configured), false if
// storage is not yet configured (fallback: just log for now).

interface WaitlistRow {
  id: string;
  email: string;
  created_at: string;
}

export async function recordWaitlist(email: string): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Not configured yet — the waitlist UI still accepts the signup.
  if (!url || !key) {
    return false;
  }

  try {
    const res = await fetch(`${url}/rest/v1/waitlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ email } satisfies Partial<WaitlistRow>),
    });
    return res.ok;
  } catch {
    return false;
  }
}
