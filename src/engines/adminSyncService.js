const GITHUB_OWNER = 'devXvibecode';
const GITHUB_REPO = 'shillong-ride';
const GITHUB_BRANCH = 'main';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`;
const RAW = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}`;

function b64(s) {
  return btoa(unescape(encodeURIComponent(s)));
}

function deb64(s) {
  try { return JSON.parse(decodeURIComponent(escape(atob(s)))); }
  catch { return JSON.parse(atob(s)); }
}

export async function fetchFileFromGitHub(filePath) {
  try {
    const res = await fetch(`${RAW}/${filePath}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return null;
  }
}

async function getLatestCommitSha() {
  const res = await fetch(`${API}/git/refs/heads/${GITHUB_BRANCH}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to get ref: ${res.status}`);
  const data = await res.json();
  return data.object.sha;
}

async function resolveTreeSha(commitSha) {
  const res = await fetch(`${API}/git/commits/${commitSha}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!res.ok) throw new Error(`Failed to get commit: ${res.status}`);
  const data = await res.json();
  return data.tree.sha;
}

async function createBlob(content) {
  const res = await fetch(`${API}/git/blobs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: b64(content), encoding: 'base64' }),
  });
  if (!res.ok) throw new Error(`Blob create error: ${res.status}`);
  const data = await res.json();
  return data.sha;
}

async function createTree(baseTreeSha, blobs) {
  const tree = blobs.map(b => ({
    path: b.path,
    mode: '100644',
    type: 'blob',
    sha: b.sha,
  }));
  const res = await fetch(`${API}/git/trees`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  });
  if (!res.ok) throw new Error(`Tree create error: ${res.status}`);
  const data = await res.json();
  return data.sha;
}

async function createCommit(treeSha, parentSha, message) {
  const res = await fetch(`${API}/git/commits`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, tree: treeSha, parents: [parentSha] }),
  });
  if (!res.ok) throw new Error(`Commit create error: ${res.status}`);
  const data = await res.json();
  return data.sha;
}

async function updateRef(commitSha) {
  const res = await fetch(`${API}/git/refs/heads/${GITHUB_BRANCH}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sha: commitSha, force: false }),
  });
  if (!res.ok) throw new Error(`Ref update error: ${res.status}`);
  return true;
}

export async function saveCircuitData(placesData, circuitsData, message) {
  if (!TOKEN) return { success: false, error: 'VITE_GITHUB_TOKEN not set' };

  try {
    const parentSha = await getLatestCommitSha();
    const baseTreeSha = await resolveTreeSha(parentSha);
    const placesSha = await createBlob(JSON.stringify(placesData, null, 2));
    const circuitsSha = await createBlob(JSON.stringify(circuitsData, null, 2));
    const treeSha = await createTree(baseTreeSha, [
      { path: 'data/places.json', sha: placesSha },
      { path: 'data/circuits.json', sha: circuitsSha },
    ]);
    const commitSha = await createCommit(treeSha, parentSha, message);
    await updateRef(commitSha);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
