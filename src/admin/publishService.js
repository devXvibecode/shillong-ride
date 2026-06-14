const GITHUB_OWNER = 'devXvibecode'
const GITHUB_REPO = 'shillong-ride'
const GITHUB_BRANCH = 'main'
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN
const API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`

export function getLastPublishTime() {
  try { return localStorage.getItem('sr_last_publish') || null }
  catch { return null }
}

export function getDataVersion() {
  try { return localStorage.getItem('sr_data_version') || null }
  catch { return null }
}

function b64(s) {
  return btoa(unescape(encodeURIComponent(s)))
}

async function getLatestCommitSha() {
  const res = await fetch(`${API}/git/refs/heads/${GITHUB_BRANCH}`, {
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
  })
  if (!res.ok) throw new Error(`Failed to get ref: ${res.status}`)
  const data = await res.json()
  return data.object.sha
}

async function resolveTreeSha(commitSha) {
  const res = await fetch(`${API}/git/commits/${commitSha}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  if (!res.ok) throw new Error(`Failed to get commit: ${res.status}`)
  const data = await res.json()
  return data.tree.sha
}

async function createBlob(content) {
  const res = await fetch(`${API}/git/blobs`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: b64(content), encoding: 'base64' }),
  })
  if (!res.ok) throw new Error(`Blob error: ${res.status}`)
  const data = await res.json()
  return data.sha
}

async function createTree(baseTreeSha, blobs) {
  const tree = blobs.map(b => ({ path: b.path, mode: '100644', type: 'blob', sha: b.sha }))
  const res = await fetch(`${API}/git/trees`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ base_tree: baseTreeSha, tree }),
  })
  if (!res.ok) throw new Error(`Tree error: ${res.status}`)
  const data = await res.json()
  return data.sha
}

async function createCommit(treeSha, parentSha, message) {
  const res = await fetch(`${API}/git/commits`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, tree: treeSha, parents: [parentSha] }),
  })
  if (!res.ok) throw new Error(`Commit error: ${res.status}`)
  const data = await res.json()
  return data.sha
}

async function updateRef(commitSha) {
  const res = await fetch(`${API}/git/refs/heads/${GITHUB_BRANCH}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sha: commitSha, force: false }),
  })
  if (!res.ok) throw new Error(`Ref update error: ${res.status}`)
  return true
}

export async function publish(dataMap, message) {
  if (!TOKEN) return { success: false, error: 'VITE_GITHUB_TOKEN not set' }
  if (!dataMap || Object.keys(dataMap).length === 0) return { success: false, error: 'No data to publish' }

  try {
    const parentSha = await getLatestCommitSha()
    const baseTreeSha = await resolveTreeSha(parentSha)

    const blobs = await Promise.all(
      Object.entries(dataMap).map(async ([path, content]) => {
        const sha = await createBlob(typeof content === 'string' ? content : JSON.stringify(content, null, 2))
        return { path, sha }
      })
    )

    const treeSha = await createTree(baseTreeSha, blobs)
    const commitSha = await createCommit(treeSha, parentSha, message)
    await updateRef(commitSha)

    const ts = new Date().toISOString()
    try {
      localStorage.setItem('sr_data_version', Date.now().toString())
      localStorage.setItem('sr_last_publish', ts)
    } catch {}

    return { success: true, timestamp: ts }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
