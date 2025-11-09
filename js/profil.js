(async () => {
  // URL: profil.html?id=1 gibi
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  const id = idParam ? parseInt(idParam, 10) : NaN;

  try {
    if (!id || Number.isNaN(id)) {
      throw new Error("Geçersiz profil bağlantısı. (örnek: profil.html?id=1)");
    }

    const res = await fetch("data/users.json", { cache: "no-store" });
    if (!res.ok) throw new Error("users.json yüklenemedi (" + res.status + ")");

    const json = await res.json();
    const users = Array.isArray(json.users) ? json.users : [];
    const user = users.find(u => Number(u.id) === id);

    if (!user) throw new Error("Kullanıcı bulunamadı (id=" + id + ")");

    // Görseller
    const foto = (user.foto || "").trim();
    document.getElementById("foto").src = foto || "assets/placeholder.jpg";
    document.getElementById("foto").alt = (user.isim || "Kullanıcı") + " – Profil Fotoğrafı";

    // Metinler
    document.getElementById("isim").textContent = user.isim || "";
    document.getElementById("hat").textContent = user.hat || "Belirtilmemiş";

    const guz = Array.isArray(user.guzergah) ? user.guzergah : [];
    document.getElementById("guzergah").textContent = guz.length ? guz.join(" → ") : "";

    document.getElementById("saatAraligi").textContent = user.saatAraligi || "";
    document.getElementById("hakkinda").textContent = user.hakkinda || "";

  } catch (err) {
    console.error(err);
    document.body.innerHTML = `
      <div style="max-width:560px;margin:40px auto;font-family:system-ui,Arial;">
        <h2 style="color:#c00;">Hata</h2>
        <p>${err.message}</p>
        <p><a href="index.html">← Ana sayfaya dön</a></p>
      </div>
    `;
  }
})();