// Whop calls this URL after a purchase. It grants the buyer's Supabase
// account the matching app tier (pro/premium/life) so it shows up the
// next time they sign in.
//
// Security: this endpoint can grant paid access, so it must not trust an
// unauthenticated POST. It's protected by a shared secret baked into the
// webhook URL itself (see WHOP_WEBHOOK_SECRET below) rather than Whop's
// payload-signing scheme, which this code can't verify without live
// access to Whop's docs. Once the first real webhook arrives, check
// Whop's webhook delivery log for the actual payload shape and adjust
// the field lookups below if they don't match.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (req.query.secret !== process.env.WHOP_WEBHOOK_SECRET) {
    res.status(401).json({ error: "Invalid secret" });
    return;
  }

  const event = req.body || {};
  const data = event.data || event;
  const email = data.email || data.user?.email || data.member?.email;
  const planId = data.plan_id || data.plan?.id || data.product_id || data.product?.id;
  const status = data.status || event.action;

  if (!email || !planId) {
    res.status(400).json({ error: "Missing email or plan id in payload" });
    return;
  }

  // Only grant on an active purchase — ignore refunds/cancellations/etc.
  const inactiveStatuses = ["cancelled", "canceled", "expired", "refunded", "invalid"];
  if (typeof status === "string" && inactiveStatuses.some((s) => status.toLowerCase().includes(s))) {
    res.status(200).json({ ok: true, skipped: true, reason: "inactive status" });
    return;
  }

  const tier =
    planId === process.env.WHOP_PLAN_LIFETIME ? "life" :
    planId === process.env.WHOP_PLAN_PREMIUM ? "premium" :
    planId === process.env.WHOP_PLAN_PRO ? "pro" :
    null;

  if (!tier) {
    res.status(200).json({ ok: true, skipped: true, reason: "unrecognized plan id" });
    return;
  }

  try {
    await grantTier(email, tier);
    res.status(200).json({ ok: true, email, tier });
  } catch (err) {
    res.status(500).json({ error: err.message || "Failed to update user" });
  }
}

async function grantTier(email, tier) {
  const base = process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };

  let user = null;
  const direct = await fetch(`${base}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, { headers });
  if (direct.ok) {
    const found = await direct.json();
    const list = Array.isArray(found) ? found : found.users;
    user = (list || [])[0] || null;
  }

  if (!user) {
    for (let page = 1; page <= 10 && !user; page++) {
      const r = await fetch(`${base}/auth/v1/admin/users?page=${page}&per_page=200`, { headers });
      if (!r.ok) break;
      const d = await r.json();
      const list = d.users || d;
      user = (list || []).find((u) => (u.email || "").toLowerCase() === email.toLowerCase());
      if (!list || list.length < 200) break;
    }
  }

  if (!user) throw new Error(`No Skilxz account found for ${email}`);

  const merged = { ...(user.user_metadata || {}), tier };
  const upd = await fetch(`${base}/auth/v1/admin/users/${user.id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ user_metadata: merged }),
  });
  if (!upd.ok) throw new Error(`Failed to update user metadata: ${upd.status}`);
}
