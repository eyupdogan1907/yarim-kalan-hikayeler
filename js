// BUILD v301
(function(){
  const lsKey = 'ykh_current_user';

  // JS çalıştığını kanıtla
  const jsBadge = document.getElementById('js-status');
  if (jsBadge) jsBadge.textContent = 'JS ÇALIŞIYOR';

  function getQueryId(){
    const p = new URLSearchParams(location.search);
    const id = p.get('id');
    return id && id.trim() ? id.trim() : null;
  }
  function setLocalCurrent(id){ try{ localStorage.setItem(lsKey, id); }catch(_){} }
  function getLocalCurrent(){ try{ return localStorage.getItem(lsKey) }catch(_){ return null } }

  // Fallback veri
  const FALLBACK_USERS = [
    { id:'ayse', name:'Ayşe Y.', age:27,
      bio:'Kitap kurdu, toplu taşımada romantik tesadüflerin peşinde.',
      photo:'assets/ayse.jpg' }
  ];

  // 3 sn sonra veri gelmezse fallback
  let watchdog = setTimeout(()=>{
    const u = FALLBACK_USERS.find(x=>x.id==='ayse');
    renderUser(u);
    const box = document.getElementById('profile');
    if (box) box.insertAdjacentHTML('beforeend',
      `<div class="row muted" style="margin-top:12px">
         Not: Uzak veriyi alamadık, <strong>yerleşik (fallback)</strong> gösterildi.
       </div>`);
  }, 3000);

  async function getUsers(){
    const url = 'https://eyupdogan1907.github.io/yarim-kalan-hikayeler/data/users.json?v=' + Date.now();
    try{
      const res = await fetch(url, { cache: 'no-store' });
      clearTimeout(watchdog);
      if(!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      return Array.isArray(data.users) ? data.users : [];
    }catch(err){
      console.error('fetch hata:', err);
      clearTimeout(watchdog);
      return FALLBACK_USERS;
    }
  }

  function renderUser(u){
    const el = document.getElementById('profile');
    if(!el) return;
    if(!u){
      el.innerHTML = <div class="muted">Kullanıcı bulunamadı. <a href="login.html">Giriş ekranına dön</a>.</div>;
      return;
    }
    el.innerHTML = `
      <div class="profile">
        <img class="ph" alt="${u.name || 'Kullanıcı'}" src="${u.photo || 'assets/placeholder.jpg'}">
        <div>
          <div class="row"><strong>${u.name || u.id}</strong></div>
          ${u.age ? <div class="row muted">${u.age} yaşında</div> : ``}
          <div class="row">${u.bio ? u.bio : ''}</div>
          <div class="row muted">ID: ${u.id}</div>
        </div>
      </div>
    `;
  }

  const clearBtn = document.getElementById('clear');
  if (clearBtn) clearBtn.onclick = ()=>{
    try{ localStorage.removeItem(lsKey); }catch(_){}
    location.href = 'login.html';
  };

  (async ()=>{
    const queryId = getQueryId();
    const localId = getLocalCurrent();
    const chosenId = queryId || localId;
    if(!chosenId){ location.href = 'login.html'; return; }
    if(queryId) setLocalCurrent(queryId);

    const users = await getUsers();
    const u = users.find(x => (x.id || '').toLowerCase() === chosenId.toLowerCase());
    if(!u){ location.href = 'login.html'; return; }
    renderUser(u);
  })();
})();
