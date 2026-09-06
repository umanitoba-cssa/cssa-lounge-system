// this file contains all of the provider-specific methods
import { randomBytes } from "crypto";
import type { Pool } from "pg";

export function makeState(): string {
  return randomBytes(16).toString("hex");
}

// = discord =
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET!;
const DISCORD_REDIRECT_URI = process.env.DISCORD_REDIRECT_URI!;

export function discordAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: DISCORD_REDIRECT_URI,
    response_type: "code",
    scope: "identify email",
    state,
  });
  return `https://discord.com/oauth2/authorize?${params}`;
}

export async function exchangeDiscordCode(code: string) {
  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: DISCORD_CLIENT_ID,
      client_secret: DISCORD_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: DISCORD_REDIRECT_URI,
    }),
  });
  if (!tokenRes.ok) throw new Error(`Discord token exchange failed: ${await tokenRes.text()}`);
  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!userRes.ok) throw new Error(`Discord user fetch failed: ${await userRes.text()}`);
  const profile = (await userRes.json()) as { id: string; username: string; email: string | null };

  return { discordId: profile.id, name: profile.username, email: profile.email };
}

// = michaelsoft =
const MS_CLIENT_ID = process.env.MS_CLIENT_ID!;
const MS_CLIENT_SECRET = process.env.MS_CLIENT_SECRET!;
const MS_REDIRECT_URI = process.env.MS_REDIRECT_URI!;
const MS_TENANT = process.env.MS_TENANT ?? "common";

export function microsoftAuthorizeUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: MS_CLIENT_ID,
    redirect_uri: MS_REDIRECT_URI,
    response_type: "code",
    response_mode: "query",
    scope: "openid profile email User.Read",
    state,
  });
  return `https://login.microsoftonline.com/${MS_TENANT}/oauth2/v2.0/authorize?${params}`;
}

export async function exchangeMicrosoftCode(code: string) {
  const tokenRes = await fetch(`https://login.microsoftonline.com/${MS_TENANT}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: MS_CLIENT_ID,
      client_secret: MS_CLIENT_SECRET,
      grant_type: "authorization_code",
      code,
      redirect_uri: MS_REDIRECT_URI,
    }),
  });
  if (!tokenRes.ok) throw new Error(`Microsoft token exchange failed: ${await tokenRes.text()}`);
  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const profileRes = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!profileRes.ok) throw new Error(`Microsoft profile fetch failed: ${await profileRes.text()}`);
  const profile = (await profileRes.json()) as {
    id: string;
    displayName: string;
    mail: string | null;
    userPrincipalName: string;
  };

  return { microsoftId: profile.id, name: profile.displayName, email: profile.mail ?? profile.userPrincipalName };
}

// = find or creeate tab =
export async function findOrCreateByDiscord(
  pool: Pool,
  { discordId, name, email }: { discordId: string; name: string; email: string | null },
) {
  const result = await pool.query(
    `insert into tabs (name, email, discord_id, tab_amount)
       values ($1, $2, $3, 0)
       on conflict (discord_id)
       do update set name = $1, email = coalesce($2, tabs.email)
       returning id, name, email, discord_id, microsoft_id, role`,
    [name, email, discordId],
  );
  return result.rows[0];
}

export async function findOrCreateByMicrosoft(
  pool: Pool,
  { microsoftId, name, email }: { microsoftId: string; name: string; email: string },
) {
  const result = await pool.query(
    `insert into tabs (name, email, microsoft_id, tab_amount)
       values ($1, $2, $3, 0)
       on conflict (microsoft_id)
       do update set name = $1, email = coalesce($2, tabs.email)
       returning id, name, email, discord_id, microsoft_id, role`,
    [name, email, microsoftId],
  );
  return result.rows[0];
}
