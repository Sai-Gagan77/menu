import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { api } from "./lib/api";
import { loadSession } from "./lib/session";
import TopBar from "./components/TopBar";
import MenuPage from "./pages/MenuPage";
import AuthModal from "./components/AuthModal";

function ShopRoute() {
  const { shopId } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const { session, setShopId, setTable, openAuthModal } = useApp();
  const table = search.get("table");

  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    setShopId(shopId);
    setTable(table);
  }, [shopId, table, setShopId, setTable]);

  useEffect(() => {
    setLoading(true);
    setErr("");
    api.getShop(shopId)
      .then(setShop)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [shopId]);

  const isAuthed = (() => {
    if (session && session.shopId === shopId) return true;
    const s = loadSession();
    return Boolean(s && s.shopId === shopId);
  })();

  // Initially pop up mobile number login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthed) {
      openAuthModal();
    }
  }, [loading, isAuthed, openAuthModal]);

  if (loading) {
    return (
      <div className="min-h-dvh grid place-items-center bg-background p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-surface-variant border-t-primary rounded-full animate-spin mx-auto" />
          <p className="mt-4 font-body-md text-body-md text-on-surface-variant">Loading {shopId}…</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="min-h-dvh grid place-items-center bg-background p-6">
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 max-w-sm text-center shadow-ambient-1">
          <div className="text-2xl">⚠️</div>
          <h2 className="font-headline-md text-headline-md text-primary mt-2" style={{ fontFamily: "Montserrat, sans-serif" }}>Shop not found</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">{err}</p>
          <button onClick={() => navigate("/menu/brewhaus")} className="mt-4 px-6 py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md">Go to demo shop</button>
        </div>
      </div>
    );
  }

  // Home screen (TopBar + Menu) with initial mobile login modal popup
  return (
    <div className="min-h-dvh bg-background">
      <TopBar shop={shop} table={table} />
      <MenuPage shop={shop} table={table} />
      <AuthModal shop={shop} table={table} />
    </div>
  );
}

function HomeRedirect() {
  return <Navigate to="/menu/brewhaus?table=5" replace />;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/menu/:shopId" element={<ShopRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
