<script>
/* YKH • Pi SDK yardımcıları + ödeme (demo destekli) */

// Namespace
window.YKH = window.YKH || {};

// Pi Browser algılama
YKH.isPiBrowser = function(){
  return !!window.Pi || /PiBrowser/i.test(navigator.userAgent);
};

// Pi init + authenticate (username yeterli)
YKH.initPi = async function(){
  if (!window.Pi) return { mode: "web" };   // Pi Browser değil
  try {
    Pi.init({ version: "2.0" });
    const scopes = ["username"];            // Demo için yeterli
    const auth = await Pi.authenticate(scopes, YKH.onIncompletePaymentFound);
    const username = auth?.user?.username || "";
    if (username) localStorage.setItem("ykh:piUser", username);
    return { mode: "pi", user: auth.user };
  } catch (e) {
    console.error("Pi auth error:", e);
    return { mode: "pi-error", error: e };
  }
};

// Tam akışta kullanılacak callback (demoda sadece log)
YKH.onIncompletePaymentFound = function(payment){
  console.log("incomplete payment (demo):", payment);
};

// Demo premium flag
YKH.unlockDemoPremium = function(){ localStorage.setItem("ykh:premium","1"); };
YKH.isPremium        = function(){ return localStorage.getItem("ykh:premium")==="1"; };

// ---- YKH: Pi ödeme başlat (demo destekli) ----
window.startPayment = function(amountPi){
  if (window.Pi && Pi.openPayment){
    Pi.openPayment(
      {
        amount: amountPi,
        memo: "YKH aylık abonelik",
        metadata: { plan: "monthly", app: "YKH", v: 1 }
      },
      {
        onReadyForServerApproval: (paymentId) => console.log("onReadyForServerApproval:", paymentId),
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("onReadyForServerCompletion:", paymentId, txid);
          alert("Ödeme tamamlandı ✅");
          localStorage.setItem("ykh:premium","1");
        },
        onCancel: () => alert("Ödeme iptal edildi"),
        onError: (e) => alert("Hata: " + (e?.message || e))
      }
    );
  } else {
    // Web/dış tarayıcı: demo
    alert("Demo (web): " + amountPi + " Pi ödendi varsayıldı ✅");
    localStorage.setItem("ykh:premium","1");
  }
};
</script>
