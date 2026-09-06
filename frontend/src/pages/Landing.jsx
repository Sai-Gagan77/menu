import { useState, useRef } from "react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function Landing({ shop, table, onLoggedIn }) {
  const { login } = useApp();
  const [step, setStep] = useState("phone"); // phone | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [sentPhone, setSentPhone] = useState("");
  const inputsRef = useRef([]);

  const startCooldown = () => {
    setCooldown(30);
    const t = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) { clearInterval(t); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  const handleSend = async () => {
    setErr("");
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) { setErr("Enter a valid 10-digit mobile number"); return; }
    const fullPhone = cleaned.length === 10 ? `+91${cleaned}` : `+${cleaned}`;
    setLoading(true);
    try {
      const res = await api.sendOtp(fullPhone);
      setDevOtp(res.devOtp || "");
      setSentPhone(fullPhone);
      setStep("otp");
      setOtp(["", "", "", ""]);
      startCooldown();
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
      setPhone(fullPhone);
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const handleVerify = async (overrideOtp) => {
    const code = overrideOtp || otp.join("");
    if (code.length < 4) { setErr("Enter 4-digit OTP"); return; }
    setErr(""); setLoading(true);
    try {
      const res = await api.verifyOtp(phone, code);
      login({ phone: res.phone, token: res.token, shopId: shop.id });
      onLoggedIn?.();
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    if (val.length > 1) {
      const chars = val.slice(0, 4).split("");
      const next = [...otp];
      chars.forEach((ch, idx) => { if (idx < 4) next[idx] = ch; });
      setOtp(next);
      const last = Math.min(chars.length - 1, 3);
      inputsRef.current[last]?.focus();
      if (chars.length === 4) handleVerify(chars.join(""));
      return;
    }
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 3) {
      inputsRef.current[i + 1].disabled = false;
      inputsRef.current[i + 1]?.focus();
    }
    if (next.join("").length === 4) {
      setTimeout(() => handleVerify(next.join("")), 200);
    }
  };
  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const logoUrl = shop?.logo?.startsWith("http") ? shop.logo : null;
  const shopName = shop?.name || "Brew & Bloom";

  // STEP: PHONE — matches Welcome HTML (Artisanal Brew)
  if (step === "phone") {
    return (
      <div className="bg-surface-bright text-on-surface min-h-screen flex flex-col justify-center items-center p-margin-mobile md:p-margin-desktop font-body-md antialiased">
        <main className="w-full max-w-md mx-auto bg-transparent flex flex-col min-h-[85vh] md:min-h-[700px] relative justify-between py-12">
          {/* Top Section: Logo & Branding */}
          <div className="flex flex-col items-center justify-center pt-16 flex-1 px-6">
            <div className="w-24 h-24 md:w-32 md:h-32 mb-12">
              {logoUrl ? (
                <img alt={`${shopName} Logo`} className="w-full h-full object-contain mix-blend-multiply opacity-90" src={logoUrl} />
              ) : (
                <div className="w-full h-full rounded-full bg-primary-container grid place-items-center text-4xl">{shop?.logo || "☕"}</div>
              )}
            </div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-primary text-center mb-6 tracking-wide font-normal" style={{ fontFamily: "Montserrat, sans-serif" }}>{shopName}</h1>
            <p className="font-body-md text-on-surface-variant text-center max-w-[280px] font-light tracking-wide opacity-80">{shop?.tagline || "Crafted with passion, served with love."}</p>
            {table && (
              <span className="mt-4 inline-block px-3 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-caption text-caption border border-outline-variant">Table {table} • Scan & Order</span>
            )}
          </div>

          {/* Bottom Section: Input & CTA */}
          <div className="w-full px-8 pb-8 flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <label className="font-label-md text-on-surface-variant uppercase tracking-widest text-xs text-center" htmlFor="phone">Phone Number</label>
              <div className="relative group mx-auto w-full max-w-[280px]">
                <div className="absolute inset-y-0 left-0 flex items-center pb-2 pointer-events-none">
                  <span className="material-symbols-outlined text-outline-variant group-focus-within:text-primary transition-colors text-[20px]">phone</span>
                </div>
                <input
                  className="w-full bg-transparent border-0 border-b border-outline-variant text-on-surface pl-10 pr-4 py-2 font-body-lg focus:ring-0 focus:border-primary transition-all outline-none placeholder:text-outline-variant/60 text-center"
                  id="phone"
                  name="phone"
                  placeholder="(555) 123-4567"
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
              </div>
              {err && <p className="text-center text-sm font-medium text-error bg-error-container border border-outline-variant px-3 py-2 rounded-xl">{err}</p>}
            </div>
            <div className="flex flex-col items-center gap-6">
              <button
                onClick={handleSend}
                disabled={loading}
                className="w-auto min-w-[200px] bg-primary text-on-primary font-label-md py-4 px-8 rounded-full hover:bg-primary/90 active:scale-[0.98] transition-all duration-300 flex justify-center items-center gap-3 tracking-widest uppercase text-xs disabled:opacity-60"
                type="button"
              >
                {loading ? "Sending..." : "Continue"}
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
              <p className="text-center font-caption text-xs text-outline-variant max-w-[250px]">
                By continuing, you agree to our Terms of Service.<br />
                <span className="text-on-surface-variant">Dev: use 1234 or 123456 as master OTP</span>
              </p>
              {devOtp && (
                <p className="text-center font-caption text-xs bg-secondary-fixed text-on-secondary-fixed px-3 py-1.5 rounded-full">
                  Last dev OTP: {devOtp.slice(-4)} (or 1234)
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  // STEP: OTP — matches OTP Verification HTML
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop antialiased relative">
      <div className="absolute top-margin-mobile left-margin-mobile md:top-margin-desktop md:left-margin-desktop">
        {logoUrl ? (
          <img alt={`${shopName} Logo`} className="w-12 h-12 rounded-[0.25rem] object-cover shadow-ambient-1 border border-outline-variant" src={logoUrl} />
        ) : (
          <div className="w-12 h-12 rounded-[0.25rem] bg-primary-container grid place-items-center text-xl border border-outline-variant shadow-ambient-1">{shop?.logo || "☕"}</div>
        )}
      </div>

      <main className="w-full max-w-md bg-surface-container-lowest rounded-[24px] p-8 md:p-10 shadow-ambient-1 border border-outline-variant/30 flex flex-col gap-8 relative z-10 mt-10">
        <header className="flex flex-col gap-2 text-center md:text-left">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary" style={{ fontFamily: "Montserrat, sans-serif" }}>Verify your number</h1>
          <div className="flex items-center justify-center md:justify-start gap-2 font-body-md text-body-md text-on-surface-variant">
            <span>{phone}</span>
            <button onClick={() => setStep("phone")} className="text-secondary hover:text-secondary-container transition-colors font-label-md text-label-md underline underline-offset-2" type="button">Edit</button>
          </div>
        </header>

        <form className="flex flex-col gap-6" id="otp-form" onSubmit={(e) => { e.preventDefault(); handleVerify(); }}>
          <div className="flex justify-between gap-4" id="otp-inputs">
            {otp.map((v, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                aria-label={`Digit ${i + 1}`}
                className="otp-input w-16 h-16 md:w-20 md:h-20 text-center font-headline-md text-headline-md bg-surface-container rounded-xl border border-transparent transition-all duration-200 text-on-surface"
                inputMode="numeric"
                maxLength={1}
                type="text"
                value={v}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={i !== 0 && !otp[i - 1] && !v}
              />
            ))}
          </div>

          {err && <p className="text-center text-sm font-medium text-error bg-error-container border border-error px-3 py-2 rounded-xl">{err}</p>}

          {devOtp && (
            <div className="bg-secondary-fixed/50 border border-outline-variant rounded-xl px-3 py-2 flex items-center justify-between gap-2">
              <div>
                <div className="font-caption text-caption text-on-secondary-fixed">DEV OTP 4-digit: {devOtp.slice(-4)}</div>
                <div className="font-caption text-caption text-on-secondary-fixed">Full: {devOtp}</div>
              </div>
              <button type="button" onClick={() => { const four = devOtp.slice(-4).split(""); setOtp(four); setTimeout(()=>handleVerify(four.join("")),100); }} className="text-xs font-bold bg-primary text-on-primary px-3 py-2 rounded-full">Autofill</button>
            </div>
          )}
          <div className="font-caption text-caption text-outline-variant text-xs text-center md:text-left">
            Or use <span className="font-bold bg-primary text-on-primary px-1.5 py-0.5 rounded">1234</span> or <span className="font-bold bg-primary text-on-primary px-1.5 py-0.5 rounded">123456</span> (master)
          </div>

          <div className="text-center md:text-left font-caption text-caption text-outline">
            {cooldown > 0 ? (
              <>Resend OTP in <span id="timer">00:{String(cooldown).padStart(2, "0")}</span></>
            ) : (
              <button type="button" onClick={async () => { setErr(""); try{ const r=await api.sendOtp(phone); setDevOtp(r.devOtp); startCooldown(); setOtp(["","","",""]); }catch(e){setErr(e.message)} }} className="text-secondary font-label-md text-label-md hover:underline">Resend OTP</button>
            )}
          </div>

          <button disabled={loading || otp.join("").length < 4} className="w-full bg-primary-container text-on-primary py-4 rounded-xl font-label-md text-label-md shadow-ambient-1 hover:opacity-90 active:scale-[0.98] transition-all duration-200 mt-2 disabled:opacity-40" type="submit">
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </main>
    </div>
  );
}
