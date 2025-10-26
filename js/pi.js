/* YKH • Pi SDK yardımcıları + ödeme (demo destekli) */

window.YKH = window.YKH || {};

YKH.isPiBrowser = function(){
  return !!window.Pi || /PiBrowser/i.test(navigator.userAgent);
};

YKH.initPi = async function(){
  if (!window.Pi) return { mode: "web" };
  try {
    Pi.init({ version: "2.0" });
    const scopes = ["username"];
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
  console.log("incomplete payment (demo):", payment);
};

YKH.unlockDemoPremium = function(){ localStorage.setItem("ykh:premium","1"); };
YKH.isPremium        = function(){ return localStorage.getItem("ykh:premium")==="1"; };

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
    alert("Demo (web): " + amountPi + " Pi ödendi varsayıldı ✅");
    localStorage.setItem("ykh:premium","1");
  }
};
