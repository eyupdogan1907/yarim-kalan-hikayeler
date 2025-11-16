// js/hatlar.js
(function () {
  var $ = function (sel) {
    return document.querySelector(sel);
  };

  var hatsSection = $("#hatsSection");
  var usersSection = $("#usersSection");
  var backAll = $("#backAll");
  var search = $("#hatSearch");

  var allUsers = [];
  var hatCounts = {};

  // 1) users.json'u çek
  fetch("data/users.json", { cache: "no-store" })
    .then(function (res) {
      if (!res.ok) {
        throw new Error("users.json yüklenemedi: " + res.status);
      }
      return res.json();
    })
    .then(function (json) {
      if (json && Array.isArray(json.users)) {
        allUsers = json.users;
      } else {
        allUsers = [];
      }
      hazirla();
    })
    .catch(function (e) {
      document.body.innerHTML =
        '<p style="padding:24px;color:#c00;">Hata: ' +
        e.message +
        "</p>";
    });

  function hazirla() {
    // 2) Tüm hatları (line) sayılarıyla çıkart
    hatCounts = allUsers.reduce(function (acc, user) {
      if (!user || !Array.isArray(user.lines)) return acc;
      user.lines.forEach(function (line) {
        if (!line) return;
        if (!acc[line]) acc[line] = 0;
        acc[line] += 1;
      });
      return acc;
    }, {});

    // 3) İlk yüklemede tüm hatları göster
    renderHatList("");

    // 5) Arama kutusu
    if (search) {
      search.addEventListener("input", function (e) {
        var value = (e.target.value || "").trim();
        renderHatList(value);
      });
    }
  }

  // 3) Hat listesini ekrana bas
  function renderHatList(filterText) {
    if (!filterText) filterText = "";

    hatsSection.innerHTML = "";
    usersSection.style.display = "none";
    backAll.style.display = "none";

    var entries = Object.keys(hatCounts)
      .sort(function (a, b) {
        return a.localeCompare(b, "tr");
      })
      .map(function (key) {
        return [key, hatCounts[key]];
      });

    var filtered = entries.filter(function (pair) {
      var line = pair[0];
      return line.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
    });

    if (!filtered.length) {
      hatsSection.innerHTML =
        '<p>Bu aramaya uygun hat bulunamadı.</p>';
      return;
    }

    filtered.forEach(function (pair) {
      var line = pair[0];
      var count = pair[1];

      var btn = document.createElement("button");
      btn.className = "hat-item";
      btn.textContent = line + " (" + count + ")";
      btn.addEventListener("click", function () {
        openHat(line);
      });
      hatsSection.appendChild(btn);
    });
  }

  // 4) Bir hatta tıklanınca kullanıcıları göster
  function openHat(line) {
    hatsSection.innerHTML = "";
    usersSection.innerHTML = "";
    usersSection.style.display = "grid";
    backAll.style.display = "inline-block";

    backAll.onclick = function () {
      renderHatList((search.value || "").trim());
    };

    var list = allUsers.filter(function (u) {
      return u && Array.isArray(u.lines) && u.lines.indexOf(line) !== -1;
    });

    if (!list.length) {
      usersSection.innerHTML =
        '<p>Bu hatta henüz kimse yok.</p>';
      return;
    }

    list.forEach(function (user) {
      var card = document.createElement("article");
      card.className = "user-card";
      card.addEventListener("click", function () {
        // profil sayfasına id ile yönlendir
        location.href =
          "profil.html?id=" + encodeURIComponent(user.id);
      });

      var premiumBadge = "";
      if (user.isPremium) {
        premiumBadge =
          '<span class="badge badge-premium">⭐ Premium</span>';
      }

      var vibeHtml = "";
      if (user.vibe && user.vibe.length) {
        vibeHtml = user.vibe
          .map(function (tag) {
            return '<span class="chip">' + tag + "</span>";
          })
          .join(" ");
      }

      var fromText = user.from || "?";
      var toText = user.to || "?";
      var lastSeen = user.lastSeen || "-";
      var story = user.story || "";
      var ageText = user.age != null ? user.age : "";

      card.innerHTML =
        '<div class="user-card-header">' +
        '<div>' +
        "<h2>" +
        user.name +
        (ageText ? ", " + ageText : "") +
        "</h2>" +
        "<p>" +
        line +
        " • " +
        fromText +
        " → " +
        toText +
        "</p>" +
        "</div>" +
        premiumBadge +
        "</div>" +
        '<p class="user-story">' +
        story +
        "</p>" +
        '<p class="user-vibe">' +
        vibeHtml +
        "</p>" +
        '<p class="user-last-seen">En son: ' +
        lastSeen +
        "</p>";

      usersSection.appendChild(card);
    });
  }
})();
