// Basit yardımcılar
const App = (() => {
  const DATA_URL = 'data/users.json';
  const SVG_PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
        <rect width="100%" height="100%" fill="#eee"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="24" font-family="Arial">
          Fotoğraf hazır değil
        </text>
      </svg>
    `);

  async function loadUsers() {
    const res = await fetch(DATA_URL, { cache: 'no-store' });
    if (!res.ok) throw new Error('users.json yüklenemedi');
    const json = await res.json();
    return json.users || [];
  }

  function getParam(key) {
    const u = new URL(location.href);
    return u.searchParams.get(key);
  }

  function routeBadge(r) {
    return `
      <div class="route">
        <span class="chip">${r.from} → ${r.to}</span>
        <span class="chip outline">${r.line}</span>
      </div>`;
  }

  function renderUserGrid(users, el) {
    el.innerHTML = users.map(u => `
      <a class="card linkcard" href="profil.html?id=${encodeURIComponent(u.id)}">
        <img class="avatar"
             src="${u.avatar}"
             alt="${u.name}"
             onerror="this.onerror=null;this.src='${SVG_PLACEHOLDER}'">
        <div class="card-body">
          <h3>${u.name} <small class="muted">• ${u.age}</small></h3>
          <p class="muted">${u.bio || ''}</p>
          <div class="chips">
            ${(u.interests||[]).slice(0,3).map(i => <span class="chip">${i}</span>).join('')}
          </div>
        </div>
      </a>
    `).join('');
  }

  function renderProfile(u, el) {
    el.innerHTML = `
      <div class="profile">
        <img class="avatar lg"
             src="${u.avatar}"
             alt="${u.name}"
             onerror="this.onerror=null;this.src='${SVG_PLACEHOLDER}'">
        <div>
          <h2>${u.name} <small class="muted">• ${u.age}</small></h2>
          <p>${u.bio || ''}</p>
          <div class="chips">
            ${(u.interests||[]).map(i => <span class="chip">${i}</span>).join('')}
          </div>
          <div class="routes">
            ${(u.routes||[]).map(routeBadge).join('')}
          </div>
          <p class="muted clock">Saatler: ${u.times || '-'}</p>
        </div>
      </div>
    `;
  }

  return { loadUsers, getParam, renderUserGrid, renderProfile };
})();
