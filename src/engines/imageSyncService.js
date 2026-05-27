const GITHUB_OWNER = 'devXvibecode';
const GITHUB_REPO = 'shillong-ride';
const GITHUB_BRANCH = 'main';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

export async function uploadImage(circuit, spotId, file) {
  if (!TOKEN) return { success: false, error: 'VITE_GITHUB_TOKEN not set' };

  const ext = file.name.split('.').pop().replace(/[^a-zA-Z0-9]/, '');
  const filename = `${spotId}.${ext}`;
  const imagePath = `public/images/places/${circuit}/${filename}`;
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${imagePath}`;

  try {
    const base64 = await fileToBase64(file);
    const content = base64.split(',')[1];

    let sha = null;
    const existing = await fetch(apiUrl, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }

    const body = { message: `Upload image: ${filename}`, content, branch: GITHUB_BRANCH };
    if (sha) body.sha = sha;

    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: `GitHub upload error: ${res.status} — ${err.message || ''}` };
    }

    return { success: true, path: imagePath };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function updateManifest(spotId, imageUrl) {
  if (!TOKEN) return { success: false, error: 'VITE_GITHUB_TOKEN not set' };

  const manifestPath = 'src/data/images-manifest.json';
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${manifestPath}`;

  try {
    let manifest = {};
    let sha = null;

    const existing = await fetch(apiUrl, { headers: { Authorization: `Bearer ${TOKEN}` } });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
      manifest = JSON.parse(atob(data.content));
    }

    if (!manifest[spotId]) manifest[spotId] = [];
    if (!manifest[spotId].includes(imageUrl)) manifest[spotId].push(imageUrl);

    const content = btoa(unescape(encodeURIComponent(JSON.stringify(manifest, null, 2))));
    const body = { message: `Update manifest for ${spotId}`, content, branch: GITHUB_BRANCH };
    if (sha) body.sha = sha;

    const res = await fetch(apiUrl, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: `Manifest update error: ${res.status} — ${err.message || ''}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
