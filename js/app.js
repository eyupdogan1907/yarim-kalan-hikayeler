// js/app.js
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
    if (!res.ok) throw new Error('users.json yüklenemedi: ' + res.status);
    const json = await res.json();
    return Array.isArray(json.users) ? json.users : [];
  }

  function el(tag, props = {}, children = []) {
    const e = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') e.className = v;
      else if (k === 'text') e.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') e[k] = v;
      else e.setAttribute(k, v);
    }
    children.forEach(c => e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c));
    return e;
  }

  function chip(text, outline=false) {
    return el('span', { class: 'chip' + (outline ? ' outline' : '') }, [text]);
  }

  function routeBadge(r) {
    const wrap = el('div', { class: 'route' });
    wrap.appendChild(chip(${r.from} → ${r.to}));
    wrap.appendChild(chip(r.line, true));
    return wrap;
  }

  function renderUserGrid(users, container) {
    container.innerHTML = '';
    users.forEach(u => {
      const a = el('a', { class: 'card linkcard', href: profil.html?id=${encodeURIComponent(u.id)} });

      const img = el('img', { class: 'avatar', src: u.avatar || '', alt: u.name || '' });
      img.onerror = function(){ this.onerror=null; this.src = SVG_PLACEHOLDER; };
      a.appendChild(img);

      const body = el('div', { class: 'card-body' });

      const h3 = el('h3');
      h3.appendChild(document.createTextNode(u.name || ''));
      h3.appendChild(document.createTextNode(' '));
      h3.appendChild(el('small', { class: 'muted' }, [• ${u.age ?? ''}]));
      body.appendChild(h3);

      body.appendChild(el('p', { class: 'muted', text: u.bio || '' }));

      const chipsWrap = el('div', { class: 'chips' });
      (u.interests || []).slice(0,3).forEach(i => chipsWrap.appendChild(chip(i)));
      body.appendChild(chipsWrap);

      a.appendChild(body);
      container.appendChild(a);
    });
  }

  function renderProfile(u, container) {
    container.innerHTML = '';

    const wrap = el('div', { class: 'profile' });

    const img = el('img', { class: 'avatar lg', src: u.avatar || '', alt: u.name || '' });
    img.onerror = function(){ this.onerror=null; this.src = SVG_PLACEHOLDER; };
    wrap.appendChild(img);

    const right = el('div');

    const h2 = el('h2');
    h2.appendChild(document.createTextNode(u.name || ''));
    h2.appendChild(document.createTextNode(' '));
    h2.appendChild(el('small', { class: 'muted' }, [• ${u.age ?? ''}]));
    right.appendChild(h2);

    right.appendChild(el('p', { text: u.bio || '' }));

    const chipsWrap = el('div', { class: 'chips' });
    (u.interests || []).forEach(i => chipsWrap.appendChild(chip(i)));
    right.appendChild(chipsWrap);

    const routesWrap = el('div', { class: 'routes' });
    (u.routes || []).forEach(r => routesWrap.appendChild(routeBadge(r)));
    right.appendChild(routesWrap);

    right.appendChild(el('p', { class: 'muted clock', text: Saatler: ${u.times || '-'} }));

    wrap.appendChild(right);
    container.appendChild(wrap);
  }

  return { loadUsers, renderUserGrid, renderProfile };
})();

// Ana sayfa grid'i
window.addEventListener('DOMContentLoaded', async () => {
  const grid = document.getElementById…
