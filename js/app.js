// Basic helpers for YKH
function fetchJSON(path) {
  return fetch(path, {cache: 'no-store'}).then(r => {
    if (!r.ok) throw new Error('Yükleme hatası: ' + path);
    return r.json();
  });
}

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function setCurrentUserId(id) {
  try { localStorage.setItem('ykh_current_user_id', id); } catch (e) {}
}

function getCurrentUserId() {
  try { return localStorage.getItem('ykh_current_user_id'); } catch (e) { return null; }
}
