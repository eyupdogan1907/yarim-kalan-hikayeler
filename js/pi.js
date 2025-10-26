* YKH • Pi SDK yardımcıları (client-side demo) */
window.YKH = window.YKH || {};

YKH.isPiBrowser = function(){
  return !!window.Pi || /PiBrowser/i.test(navigator.userAgent);
};

YKH.initPi = async function(){
  if (!window.Pi) return { mode: "web" };          // Pi Browser değil
  try {
    Pi.init({ version: "2.0" });                   // Pi SDK başlat
    const scopes = ["username"];                   // demo için username yeterli
    const auth = await Pi.authenticate(scopes, YKH.onIncompletePaymentFound);
    const username = auth?.user?.username || "";
    if (username) localStorage.setItem("ykh:piUser", username);
    return { mode: "pi", user: auth.user };
  } catch (e) {
    console.error("Pi auth error:", e);
    return { mode: "pi-error", error: e };
  }
};

YKH.onIncompletePaymentFound = function(payment){
  // Bu demoda backend yok; sadece logluyoruz
  console.log("incomplete payment (demo):", payment);
};

/* (İsteğe bağlı) Demo 'premium' aç/kapat */
YKH.unlockDemoPremium = function(){
  localStorage.setItem("ykh:premium", "1");
};
YKH.isPremium = function(){
  return localStorage.getItem("ykh:premium") === "1";
};
