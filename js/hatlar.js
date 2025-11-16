// js/hatlar.js
(async () => {
  const $ = (sel) => document.querySelector(sel);

  const hatsSection = $("#hatsSection");
  const usersSection = $("#usersSection");
  const backAll = $("#backAll");
  const search = $("#hatSearch");

  let allUsers = [];
  let hatCounts = {};

  // 1) users.json'u çek
  try {
    const res = await fetch("data/users.json", { cache: "no-store" });
    if (!res.ok) throw new Error("users.json yüklenemedi: " + res.status);
    const json = await res.json();
    allUsers = Array.isArray(json.users) ? json.users : [];
  } catch (e) {
    document.body.innerHTML = `<p style="padding:24px;color:#c00;">
      Hata: ${e.message}
    </p>`;
    return;
  }

  // 2) Tüm hatları (line) sayılarıyla çıkart
  hatCounts = allUsers.reduce((acc, user) => {
    if (!Array.isArray(user.lines)) return acc;
    user.lines.forEach((line) => {
      if (!line) return;
      acc[line] = (acc[line] || 0) + 1;
    });
    return acc;
  }, {});

  // 3) Hat listesini ekrana bas
  function renderHatList(filterText = "") {
    hatsSection.innerHTML = "";
    usersSection.style.display = "none";
    backAll.style.display = "none";

    const entries = Object.entries(hatCounts).sort((a, b) =>
      a[0].localeCompare(b[0], "tr")
    );

    const filtered = entries.filter(([line]) =>
      line.toLowerCase().includes(filterText.toLowerCase())
    );

    if (!filtered.length) {
      hatsSection.innerHTML =
        <p>Bu aramaya uygun hat bulunamadı.</p>;
      return;
    }

    filtered.forEach(([line, count]) => {
      const btn = document.createElement("button");
      btn.className = "hat-item";
      btn.textContent = ${line} (${count});
      btn.addEventListener("click", () => openHat(line));
      hatsSection.appendChild(btn);
    });
  }

  // 4) Bir hatta tıklanınca kullanıcıları göster
  function openHat(line) {
    hatsSection.innerHTML = "";
    usersSection.innerHTML = "";
    usersSection.style.display = "grid";
    backAll.style.display = "inline-block";

    backAll.onclick = () => {
      renderHatList(search.value.trim());
    };

    const list = allUsers.filter(
      (u) => Array.isArray(u.lines) && u.lines.includes(line)
    );

    if (!list.length) {
      usersSection.innerHTML = <p>Bu hatta henüz kimse yok.</p>;
      return;
    }

    list.forEach((user) => {
      const card = document.createElement("article");
      card.className = "user-card";
      card.addEventListener("click", () => {
        // profil sayfasına id ile yönlendir
        location.href = profil.html?id=${encodeURIComponent(user.id)};
      });

      const premiumBadge = user.isPremium
        ? <span class="badge badge-premium">⭐ Premium</span>
        : "";

      card.innerHTML = `
        <div class="user-card-header">
          <div>
            <h2>${user.name}, ${user.age}</h2>
            <p>${line} • ${user.from || "?"} → ${user.to || "?"}</p>
          </div>
          ${premiumBadge}
        </div>
        <p class="user-story">${user.story || ""}</p>
        <p class="user-vibe">
          ${(user.vibe || [])
            .map((tag) => <span class="chip">${tag}</span>)
            .join(" ")}
        </p>
        <p class="user-last-seen">En son: ${user.lastSeen || "-"}</p>
      `;

      usersSection.appendChild(card);
    });
  }

  // 5) Arama kutusu
  if (search) {
    search.addEventListener("input", (e) => {
      const value = e.target.value.trim();
      renderHatList(value);
    });
  }

  // İlk yüklemede tüm hatları göster
  renderHatList();
})();
