(async () => {
  const $ = (sel) => document.querySelector(sel);
  const hatsSection = $("#hatsSection");
  const usersSection = $("#usersSection");
  const backAll = $("#backAll");
  const search = $("#hatSearch");

  // URL parametreleri
  const params = new URLSearchParams(location.search);
  const selectedHat = (params.get("hat") || "").trim();

  // users.json'u çek
  let users = [];
  try {
    const res = await fetch("data/users.json", { cache: "no-store" });
    if (!res.ok) throw new Error("users.json yüklenemedi: " + res.status);
    const json = await res.json();
    users = Array.isArray(json.users) ? json.users : [];
  } catch (e) {
    document.body.innerHTML = <p style="padding:24px;color:#c00;">Hata: ${e.message}</p>;
    return;
  }

  // Tüm hatların set'i + sayıları
  const hatCounts = users.reduce((acc, u) => {
    const h = (u.hat || "").trim();
    if (!h) return acc;
    acc[h] = (acc[h] || 0) + 1;
    return acc;
  }, {});

  function renderHatList(filterText = "") {
    const q = filterText.toLowerCase();
    hatsSection.innerHTML = "";

    const entries = Object.entries(hatCounts)
      .filter(([hat]) => hat.toLowerCase().includes(q))
      .sort((a, b) => a[0].localeCompare(b[0], "tr"));

    if (!entries.length) {
      hatsSection.innerHTML = <p class="empty">Sonuç bulunamadı.</p>;
      return;
    }

    for (const [hat, count] of entries) {
      const a = document.createElement("a");
      a.className = "hat-badge";
      a.href = hatlar.html?hat=${encodeURIComponent(hat)};
      a.textContent = ${hat} • ${count};
      hatsSection.appendChild(a);
    }
  }

  function renderUsersForHat(hat) {
    usersSection.innerHTML = "";
    const list = users.filter(u => (u.hat || "").trim().toLowerCase() === hat.toLowerCase());

    const title = document.createElement("h2");
    title.className = "section-title";
    title.textContent = Hattı: ${hat};
    usersSection.appendChild(title);

    if (!list.length) {
      usersSection.innerHTML += <p class="empty">Bu hatta kullanıcı yok.</p>;
      return;
    }

    for (const u of list) {
      const card = document.createElement("a");
      card.className = "user-card";
      card.href = profil.html?id=${encodeURIComponent(u.id)};
      card.innerHTML = `
        <img class="avatar" src="${(u.foto || "").trim() || "assets/placeholder.jpg"}" alt="${u.isim || "Kullanıcı"}" loading="lazy">
        <div class="meta">
          <div class="name">${u.isim || ""}</div>
          <div class="sub">🗺️ ${(u.guzergah || []).join(" → ")}</div>
          <div class="sub">⏰ ${u.saatAraligi || ""}</div>
        </div>
      `;
      usersSection.appendChild(card);
    }
  }

  // EKRAN KARARI: parametre varsa kullanıcıları göster; yoksa hatları
  if (selectedHat) {
    hatsSection.hidden = true;
    usersSection.hidden = false;
    backAll.hidden = false;
    renderUsersForHat(selectedHat);
  } else {
    hatsSection.hidden = false;
    usersSection.hidden = true;
    backAll.hidden = true;
    renderHatList("");
  }

  // Arama
  search.addEventListener("input", (e) => {
    if (!selectedHat) renderHatList(e.target.value);
  });
})();
