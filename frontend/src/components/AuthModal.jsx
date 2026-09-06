import { useState, useRef, useEffect } from "react";
import { api } from "../lib/api";
import { useApp } from "../context/AppContext";

export default function AuthModal({ shop, table }) {
  const { isAuthModalOpen, closeAuthModal, login, session } = useApp();
  const [step, setStep] = useState("phone"); // phone | otp
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isAuthModalOpen) {
      setStep("phone");
      setErr("");
      setOtp(["", "", "", ""]);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const startCooldown = () => {
    setCooldown(30);
    const t = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(t);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleSend = async () => {
    setErr("");
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) {
      setErr("Please enter a valid 10-digit mobile number");
      return;
    }
    const fullPhone = cleaned.length === 10 ? `+91${cleaned}` : `+${cleaned}`;
    setLoading(true);
    try {
      const res = await api.sendOtp(fullPhone);
      setDevOtp(res.devOtp || "");
      setStep("otp");
      setOtp(["", "", "", ""]);
      startCooldown();
      setTimeout(() => inputsRef.current[0]?.focus(), 150);
      setPhone(fullPhone);
    } catch (e) {
      setErr(e.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (overrideOtp) => {
    const code = overrideOtp || otp.join("");
    if (code.length < 4) {
      setErr("Enter the 4-digit code");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const res = await api.verifyOtp(phone, code);
      login({ phone: res.phone, token: res.token, shopId: shop?.id || "brewhaus" });
    } catch (e) {
      setErr(e.message || "Invalid OTP code");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d*$/.test(val)) return;
    if (val.length > 1) {
      const chars = val.slice(0, 4).split("");
      const next = [...otp];
      chars.forEach((ch, idx) => {
        if (idx < 4) next[idx] = ch;
      });
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
      if (inputsRef.current[i + 1]) {
        inputsRef.current[i + 1].disabled = false;
        inputsRef.current[i + 1]?.focus();
      }
    }
    if (next.join("").length === 4) {
      setTimeout(() => handleVerify(next.join("")), 150);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const logoUrl = shop?.logo?.startsWith("http") ? shop.logo : null;
  const shopName = shop?.name || "Brew & Bloom";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 transition-all duration-300">
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-t-[28px] sm:rounded-[28px] p-6 sm:p-8 shadow-2xl border border-outline-variant/30 flex flex-col gap-5 relative max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Top Dismiss Bar / Close */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <span className="font-caption text-caption uppercase tracking-wider text-secondary font-semibold">
              {table ? `Table ${table} • Scan & Order` : "Digital Dine-in"}
            </span>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-variant flex items-center justify-center text-on-surface-variant transition-colors"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Branding header */}
        <div className="flex flex-col items-center text-center pt-2">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border border-tertiary-fixed-dim/60 mb-3 bg-primary-container grid place-items-center">
            {logoUrl ? (
              <img alt={`${shopName} Logo`} className="w-full h-full object-cover" src={logoUrl} />
            ) : (
              <span className="text-3xl">{shop?.logo || "☕"}</span>
            )}
          </div>
          <h2
            id="auth-modal-title"
            className="font-headline-md text-headline-md text-primary font-bold tracking-tight"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {step === "phone" ? `Welcome to ${shopName}` : "Verify your number"}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-[280px]">
            {step === "phone"
              ? "Enter your mobile number to view table orders and track your food live."
              : `Code sent to ${phone}`}
          </p>
        </div>

        {/* STEP 1: PHONE INPUT */}
        {step === "phone" && (
          <div className="flex flex-col gap-5 mt-2">
            <div className="flex flex-col gap-2">
              <label htmlFor="auth-phone" className="font-label-md text-label-md text-on-surface-variant text-xs uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative flex items-center bg-surface-container rounded-xl border border-outline-variant/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <span className="pl-4 pr-2 font-label-md text-on-surface-variant text-sm font-semibold select-none">
                  🇮🇳 +91
                </span>
                <span className="text-outline-variant/60">|</span>
                <input
                  id="auth-phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={phone.replace(/^\+91/, "")}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="w-full bg-transparent border-0 px-3 py-3.5 text-on-surface font-body-lg focus:ring-0 outline-none placeholder:text-outline-variant/70 text-base"
                  autoFocus
                />
              </div>
              {err && (
                <p className="text-xs text-error font-medium bg-error-container/40 border border-error/20 px-3 py-2 rounded-lg">
                  {err}
                </p>
              )}
            </div>

            <button
              onClick={handleSend}
              disabled={loading}
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-xl hover:bg-primary/90 active:scale-[0.99] transition shadow-level-1 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending code...</span>
                </>
              ) : (
                <>
                  <span>Send OTP</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>

            <div className="flex flex-col items-center gap-2 text-center pt-1">
              <button
                type="button"
                onClick={closeAuthModal}
                className="text-xs font-label-md text-on-surface-variant hover:text-primary underline underline-offset-4 py-1"
              >
                Browse menu first
              </button>
              <p className="font-caption text-caption text-outline-variant text-[11px]">
                Demo mode: Universal OTP <span className="font-bold text-on-surface">1234</span> or <span className="font-bold text-on-surface">123456</span>
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "otp" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="flex flex-col gap-5 mt-2"
          >
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="text-on-surface-variant font-caption">Enter 4-digit code</span>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-secondary font-label-md hover:underline font-semibold"
              >
                Change number
              </button>
            </div>

            {/* 4 Boxes */}
            <div className="flex justify-center gap-3 sm:gap-4 my-1">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  disabled={i !== 0 && !otp[i - 1] && !digit}
                  className="w-14 h-14 sm:w-16 sm:h-16 text-center font-headline-md text-headline-md font-bold bg-surface-container rounded-xl border border-outline-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/20 text-on-surface outline-none transition"
                  aria-label={`Digit ${i + 1}`}
                />
              ))}
            </div>

            {err && (
              <p className="text-xs text-error font-medium bg-error-container/40 border border-error/20 px-3 py-2 rounded-lg text-center">
                {err}
              </p>
            )}

            {/* Dev OTP Autofill Helper */}
            {devOtp && (
              <div className="bg-secondary-fixed/50 border border-secondary-fixed-dim rounded-xl px-3 py-2 flex items-center justify-between">
                <span className="text-xs text-on-secondary-fixed font-caption">
                  Dev code: <strong>{devOtp.slice(-4)}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const four = devOtp.slice(-4).split("");
                    setOtp(four);
                    setTimeout(() => handleVerify(four.join("")), 100);
                  }}
                  className="text-xs font-label-md bg-primary text-on-primary px-3 py-1 rounded-full hover:opacity-90 active:scale-95 transition"
                >
                  Autofill
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-xs font-caption text-on-surface-variant px-1">
              {cooldown > 0 ? (
                <span>Resend in 00:{String(cooldown).padStart(2, "0")}</span>
              ) : (
                <button
                  type="button"
                  onClick={async () => {
                    setErr("");
                    try {
                      const r = await api.sendOtp(phone);
                      setDevOtp(r.devOtp || "");
                      startCooldown();
                      setOtp(["", "", "", ""]);
                    } catch (e) {
                      setErr(e.message);
                    }
                  }}
                  className="text-secondary font-label-md hover:underline font-semibold"
                >
                  Resend OTP
                </button>
              )}
              <span className="text-outline-variant">Master: 1234</span>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join("").length < 4}
              className="w-full bg-primary text-on-primary font-label-md text-label-md py-4 rounded-xl hover:bg-primary/90 active:scale-[0.99] transition shadow-level-1 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
