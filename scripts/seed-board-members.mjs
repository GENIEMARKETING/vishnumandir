/**
 * Seed Board Members into Strapi
 *
 * Usage:
 *   STRAPI_EMAIL=your@email.com STRAPI_PASSWORD=yourpassword node scripts/seed-board-members.mjs
 *
 * Or set defaults below and just run:
 *   node scripts/seed-board-members.mjs
 */

const STRAPI_URL = "http://localhost:1337";
const STRAPI_EMAIL = process.env.STRAPI_EMAIL || "";
const STRAPI_PASSWORD = process.env.STRAPI_PASSWORD || "";

// Board members from vishnumandirtampa.com/about/board-of-trustees
const BOARD_MEMBERS = [
  // President
  { name: "Kishore Ramdhani",      role: "President",  tier: "President",  displayOrder: 1  },

  // Executive Committee
  { name: "Jonah Bajnath",         role: "Treasurer",  tier: "Executive",  displayOrder: 2  },
  { name: "Dr. Ram P. Ramcharran", role: "Secretary",  tier: "Executive",  displayOrder: 3  },

  // Board of Directors
  { name: "Shantia Singh",         role: "Director",   tier: "Director",   displayOrder: 10 },
  { name: "Tara Dindial",          role: "Director",   tier: "Director",   displayOrder: 11 },
  { name: "Ramesh Maharana",       role: "Director",   tier: "Director",   displayOrder: 12 },
  { name: "Narie Persad",          role: "Director",   tier: "Director",   displayOrder: 13 },
  { name: "Lettie Naraine",        role: "Director",   tier: "Director",   displayOrder: 14 },
  { name: "Jonah Bajnath",         role: "Director",   tier: "Director",   displayOrder: 15 },
  { name: "Dr. Ram Ramcharran",    role: "Director",   tier: "Director",   displayOrder: 16 },
  { name: "Mado Jaimangal",        role: "Director",   tier: "Director",   displayOrder: 17 },
  { name: "Ramesh Sayroo",         role: "Director",   tier: "Director",   displayOrder: 18 },
  { name: "Omardeo Ramdhani",      role: "Director",   tier: "Director",   displayOrder: 19 },
  { name: "Raj Samlall",           role: "Director",   tier: "Director",   displayOrder: 20 },
  { name: "Harry K. Lekhram",      role: "Director",   tier: "Director",   displayOrder: 21 },
];

async function login() {
  const res = await fetch(`${STRAPI_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: STRAPI_EMAIL, password: STRAPI_PASSWORD }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Login failed: ${res.status} ${err}`);
  }

  const { data } = await res.json();
  console.log(`✅ Logged in as ${data.user.email}`);
  return data.token;
}

async function createBoardMember(token, member) {
  // Step 1: Create (draft)
  const res = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::board-member.board-member`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(member),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create "${member.name}": ${res.status} ${err}`);
  }

  const created = await res.json();
  const docId = created.documentId || created.data?.documentId;

  // Step 2: Publish
  const pubRes = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::board-member.board-member/${docId}/actions/publish`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!pubRes.ok) {
    const err = await pubRes.text();
    console.warn(`  ⚠️  Created but failed to publish "${member.name}": ${pubRes.status} ${err}`);
  } else {
    console.log(`  ✅ Created & published: ${member.name} (${member.role})`);
  }
}

async function deleteExistingEntries(token) {
  const res = await fetch(
    `${STRAPI_URL}/content-manager/collection-types/api::board-member.board-member?pageSize=100`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) return;

  const { results } = await res.json();
  if (!results || results.length === 0) return;

  console.log(`\n🗑️  Deleting ${results.length} existing board member(s)...`);
  for (const entry of results) {
    const delRes = await fetch(
      `${STRAPI_URL}/content-manager/collection-types/api::board-member.board-member/${entry.documentId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (delRes.ok) {
      console.log(`  🗑️  Deleted: ${entry.name}`);
    }
  }
}

async function main() {
  if (!STRAPI_EMAIL || !STRAPI_PASSWORD) {
    console.error("❌ Missing credentials. Run with:");
    console.error("   STRAPI_EMAIL=your@email.com STRAPI_PASSWORD=yourpassword node scripts/seed-board-members.mjs");
    process.exit(1);
  }

  console.log("🚀 Starting board member seed...\n");

  const token = await login();

  await deleteExistingEntries(token);

  console.log(`\n📋 Creating ${BOARD_MEMBERS.length} board members...`);
  for (const member of BOARD_MEMBERS) {
    await createBoardMember(token, member);
  }

  console.log("\n🎉 Done! All board members seeded successfully.");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
