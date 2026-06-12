import React, { useState, useEffect } from "react";
import Splash from "./components/Splash";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import Categories from "./components/Categories";
import Cart from "./components/Cart";
import Profile from "./components/Profile";
import ProfileOrders from "./components/ProfileOrders";
import ProfilePayment from "./components/ProfilePayment";
import ProfileAddresses from "./components/ProfileAddresses";
import ProfileSettings from "./components/ProfileSettings";
import ProfileEdit from "./components/ProfileEdit";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentPage from "./components/PaymentPage";
import InvoiceHistory from "./components/InvoiceHistory";
import Notifications from "./components/Notifications";
import Wallet from "./components/Wallet";
import Courses from "./components/Courses";
import BuyAirtime from "./components/BuyAirtime";
import Invest from "./components/Invest";
import PayBills from "./components/PayBills";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import TermsAndConditions from "./components/TermsAndConditions";
import Contact from "./components/Contact";
import About from "./components/About";
import ChatOptions from "./components/ChatOptions";
import ChatbotPage from "./components/ChatbotPage";
import Login from "./components/Login";
import Videos from "./components/Videos";
import VideoDetail from "./components/VideoDetail";
import UploadProduct from "./components/UploadProduct";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import SellerDashboard from "./components/SellerDashboard";
import SellerOrders from "./components/SellerOrders";
import SellerEarnings from "./components/SellerEarnings";
import SellerAnalytics from "./components/SellerAnalytics";
import SellerSettings from "./components/SellerSettings";
import OrderTracking from "./components/OrderTracking";
import NotFound from "./components/NotFound";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingSpinner from "./components/common/LoadingSpinner";
import { ToastContainer, useToast } from "./components/common/Toast";
import { addOrUpdateUser } from "./utils/userStore";
import { loginApi, setToken } from "./utils/api";
import { NotificationsProvider } from "./context/NotificationsContext";
import { ensureWallet } from "./utils/walletStore";

const STORAGE_KEY = "itechUserAccount";

export default function App() {
  const [page, setPage] = useState("landing");
  const [chatOptionsOpen, setChatOptionsOpen] = useState(false);
  const [initialCategory, setInitialCategory] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [pagePayload, setPagePayload] = useState(null);
  const [storedAccount, setStoredAccount] = useState(null);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [sellerTab, setSellerTab] = useState("overview");
  const [theme, setTheme] = useState(() => {
    const saved = window.localStorage.getItem("itechTheme");
    return saved === "light" || saved === "dark" ? saved : "dark";
  });
  const [history, setHistory] = useState([]);
  const { toasts, addToast, removeToast } = useToast();

  const openChatOptions = () => setChatOptionsOpen(true);
  const closeChatOptions = () => setChatOptionsOpen(false);

  const openLiveChat = () => {
    closeChatOptions();
    const whatsappUrl = "https://api.whatsapp.com/send?phone=09162249670&text=Hello%2C%20I%20need%20help%20with%20my%20order.";
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const openChatbotPage = () => {
    closeChatOptions();
    setPage('chatbot');
  };

  // Attach a persistent scroll indicator inside the `.app-shell` to ensure
  // users on desktops always see a scrollbar-like UI even when native
  // scrollbars are hidden by the OS or browser settings.
  useEffect(() => {
    const shell = document.querySelector('.app-shell');
    if (!shell) return;

    // create indicator if missing
    let indicator = shell.querySelector('.scroll-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'scroll-indicator';
      indicator.innerHTML = '<div class="track"></div><div class="thumb"></div>';
      shell.appendChild(indicator);
    }

    const thumb = indicator.querySelector('.thumb');

    const update = () => {
      const scrollHeight = shell.scrollHeight - shell.clientHeight;
      if (scrollHeight <= 0) {
        thumb.style.display = 'none';
        return;
      }
      thumb.style.display = 'block';
      const ratio = shell.clientHeight / shell.scrollHeight;
      const thumbHeight = Math.max(32, Math.floor(shell.clientHeight * ratio));
      const thumbTop = Math.floor((shell.scrollTop / scrollHeight) * (shell.clientHeight - thumbHeight));
      thumb.style.height = thumbHeight + 'px';
      thumb.style.top = (12 + thumbTop) + 'px';
    };

    update();
    shell.addEventListener('scroll', update);
    window.addEventListener('resize', update);

    return () => {
      shell.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (indicator && indicator.parentNode === shell) {
        shell.removeChild(indicator);
      }
    };
  }, [page]);

  // Check for reset token or hash/page route in URL on page load
  useEffect(() => {
    const parseHashRoute = () => {
      const hash = window.location.hash || '';
      const match = hash.match(/^#\/([^?]+)(\?.*)?$/);
      if (!match) return { page: null, query: null };
      return {
        page: match[1],
        query: match[2] ? match[2].substring(1) : ''
      };
    };

    const permittedStartupPages = new Set([
      'landing', 'splash', 'login', 'forgot-password', 'reset-password', 'terms-and-conditions',
      'home', 'about', 'contact', 'categories', 'videos', 'video', 'cart',
      'payment-page', 'payment-success'
    ]);

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const pageParam = params.get('page');
    const hashRoute = parseHashRoute();
    const hashPage = hashRoute.page;
    const hashParams = new URLSearchParams(hashRoute.query || '');
    const path = window.location.pathname || '';
    const pathRoute = path.replace(/\/$/, '').split('/').pop();

    const loadSavedAccount = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;
      try {
        const parsed = JSON.parse(saved);
        setStoredAccount(parsed);
        setProfileData(parsed);
        ensureWallet(parsed.id);
        return parsed;
      } catch (error) {
        console.warn("Failed to parse saved account", error);
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
    };

    const savedAccount = loadSavedAccount();

    if (token) {
      setPagePayload(token);
      setPage('reset-password');
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (pathRoute === 'payment-success' || pathRoute === 'payment-page') {
      setPage(pathRoute);
      const payload = {};
      const reference = params.get('reference');
      const orderId = params.get('orderId');
      const offline = params.get('offline');
      if (reference) payload.reference = reference;
      if (orderId) payload.orderId = orderId;
      if (offline) payload.offline = offline;
      if (Object.keys(payload).length) {
        setPagePayload(payload);
      }
      return;
    }

    if (hashPage === 'payment-success' || hashPage === 'payment-page') {
      setPage(hashPage);
      const payload = {};
      const reference = hashParams.get('reference');
      const orderId = hashParams.get('orderId');
      if (reference) payload.reference = reference;
      if (orderId) payload.orderId = orderId;
      if (Object.keys(payload).length) {
        setPagePayload(payload);
      }
      return;
    }

    if (pageParam && permittedStartupPages.has(pageParam)) {
      setPage(pageParam);
      return;
    }

    if (hashPage && permittedStartupPages.has(hashPage)) {
      setPage(hashPage);
      return;
    }

    // Default: keep landing page (initial state) unless overridden above
  }, []);

  const handleNavigate = (targetPage, payload) => {
    if (targetPage === 'back') {
      setHistory((h) => {
        if (!h || h.length === 0) return [];
        const prev = h[h.length - 1];
        const next = h.slice(0, h.length - 1);
        setPage(prev || 'home');
        return next;
      });
      return;
    }
    // push current page onto history for back support
    setHistory((h) => {
      try {
        if (page && page !== targetPage) return [...h, page];
      } catch (e) {}
      return h || [];
    });
    // Protect routes: require login for all pages except login, splash, and public pages
    if (!storedAccount && targetPage !== "login" && targetPage !== "splash" && targetPage !== "terms-and-conditions" && targetPage !== "forgot-password" && targetPage !== "reset-password" && targetPage !== "home" && targetPage !== "about" && targetPage !== "contact" && targetPage !== "categories" && targetPage !== "videos" && targetPage !== "video" && targetPage !== "cart" && targetPage !== "payment-page" && targetPage !== "payment-success") {
      setPage("login");
      return;
    }
    // store payload to pass to pages that need it
    setPagePayload(payload || null);
    // navigation handler
    if (targetPage === "categories") {
      setInitialCategory(payload || null);
      setPage("categories");
      return;
    }

    if (targetPage === "video") {
      setInitialCategory(payload || null);
      setPage("video");
      return;
    }

    if (targetPage === "videos") {
      setPage("videos");
      return;
    }

    if (targetPage === "profile") {
      if (!profileData) {
        setPage("login");
        return;
      }
      setPage("profile");
      return;
    }

    if (targetPage === "profile-orders") {
      if (!profileData) {
        setPage("login");
        return;
      }
      setPage("profile-orders");
      return;
    }

    if (targetPage === "profile-payment") {
      if (!profileData) {
        setPage("login");
        return;
      }
      setPage("profile-payment");
      return;
    }

    if (targetPage === "wallet") {
      if (!profileData) {
        setPage("login");
        return;
      }
      ensureWallet(profileData.id);
      setPage("wallet");
      return;
    }

    if (targetPage === "airtime") {
      if (!profileData) {
        setPage("login");
        return;
      }
      setPage("airtime");
      return;
    }

    if (targetPage === "invest") {
      if (!profileData) {
        setPage("login");
        return;
      }
      setPage("invest");
      return;
    }

    if (targetPage === "bills") {
      if (!profileData) {
        setPage("login");
        return;
      }
      setPage("bills");
      return;
    }

    if (targetPage === "courses") {
      if (!profileData) {
        setPage("login");
        return;
      }
      setPage("courses");
      return;
    }

    if (targetPage === "profile-addresses") {
      if (!profileData) {
        setPage("login");
        return;
      }
      setPage("profile-addresses");
      return;
    }

    if (targetPage === "profile-settings") {
      if (!profileData) {
        setPage("login");
        return;
      }
      setPage("profile-settings");
      return;
    }

    if (targetPage === "profile-edit") {
      if (!profileData) {
        setPage("login");
        return;
      }
      setPage("profile-edit");
      return;
    }

    if (targetPage === "login") {
      setPage("login");
      return;
    }

    if (targetPage === "terms-and-conditions") {
      setPage("terms-and-conditions");
      return;
    }

    if (targetPage === "landing") {
      setPage("landing");
      return;
    }

    if (targetPage === "forgot-password") {
      setPage("forgot-password");
      return;
    }

    if (targetPage === "reset-password") {
      setPage("reset-password");
      return;
    }

    if (targetPage === "home") {
      setInitialCategory(null);
      setPage("home");
      return;
    }

    if (targetPage === "about") {
      setPage("about");
      return;
    }

    if (targetPage === "contact") {
      setPage("contact");
      return;
    }

    if (targetPage === "cart") {
      setPage("cart");
      return;
    }

    if (targetPage === "admin-login") {
      setPage("admin-login");
      return;
    }

    if (targetPage === "admin") {
      if (adminAuthenticated) {
        setPage("admin");
      } else {
        setPage("admin-login");
      }
      return;
    }

    if (targetPage === "seller-dashboard") {
      if (storedAccount?.role === "seller") {
        setSellerTab(payload || "overview");
        setPage("seller-dashboard");
      } else {
        setPage("login");
      }
      return;
    }

    if (targetPage === "seller-orders") {
      if (storedAccount?.role === "seller") {
        setPage("seller-orders");
      } else {
        setPage("login");
      }
      return;
    }

    if (targetPage === "seller-earnings") {
      if (storedAccount?.role === "seller") {
        setPage("seller-earnings");
      } else {
        setPage("login");
      }
      return;
    }

    if (targetPage === "seller-analytics") {
      if (storedAccount?.role === "seller") {
        setPage("seller-analytics");
      } else {
        setPage("login");
      }
      return;
    }

    if (targetPage === "seller-settings") {
      if (storedAccount?.role === "seller") {
        setPage("seller-settings");
      } else {
        setPage("login");
      }
      return;
    }

    if (targetPage === "order-tracking") {
      setPage("order-tracking");
      return;
    }

    if (targetPage === "payment-success") {
      setPagePayload(payload || null);
      setPage("payment-success");
      return;
    }

    if (targetPage === "payment-page") {
      setPagePayload(payload || null);
      setPage("payment-page");
      return;
    }

    if (targetPage === "invoice-history" || targetPage === "history") {
      if (!profileData) {
        setPage("login");
        return;
      }
      setPage("history");
      return;
    }

    if (targetPage === "notifications") {
      if (!profileData) {
        setPage("login");
        return;
      }
      setPage("notifications");
      return;
    }

    if (targetPage === "forgot-password") {
      setPage("forgot-password");
      return;
    }

    if (targetPage === "reset-password") {
      setPage("reset-password");
      setPagePayload(payload || null);
      return;
    }

    if (targetPage === "terms-and-conditions") {
      setPage("terms-and-conditions");
      return;
    }

    if (targetPage === "landing") {
      setPage("landing");
      return;
    }

    if (targetPage === "splash") {
      setPage("splash");
      return;
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStoredAccount(parsed);
        setProfileData(parsed);
        ensureWallet(parsed.id);
        setPage((currentPage) => {
          // If no explicit route is set, default signed-in users to home only from login or splash
          if (currentPage === "splash" || currentPage === "login") {
            return "home";
          }
          return currentPage;
        });
      } catch (error) {
        console.warn("Failed to parse saved account", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    const savedTheme = localStorage.getItem("itechTheme");
    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("itechTheme", theme);
  }, [theme]);

  const handleLogin = (profile, password) => {
    // Attempt to log in via backend auth; fall back to local storage if API fails
    (async () => {
      try {
        const resp = await loginApi(profile.email, password, profile);
        if (resp && resp.token) {
          setToken(resp.token);
          const user = resp.user || profile;
          const accountToStore = { ...user, id: user.id || `user-${Date.now()}` };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(accountToStore));
          addOrUpdateUser(accountToStore);
          setStoredAccount(accountToStore);
          setProfileData(accountToStore);
          if (accountToStore.role === "seller") {
            setSellerTab("overview");
            setPage("seller-dashboard");
          } else if (accountToStore.role === "admin") {
            setPage("admin");
          } else {
            setPage("home");
          }
          return;
        }
      } catch (err) {
        console.warn('Auth API failed, falling back to local login', err.message || err);
      }

      // Fallback local behavior
      const id = profile.id || `user-${Date.now()}`;
      const role = profile.role || "buyer";
      const accountToStore = { ...profile, id, password, role };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(accountToStore));
      addOrUpdateUser(accountToStore);
      setStoredAccount(accountToStore);
      setProfileData(profile);
      ensureWallet(accountToStore.id);
      if (role === "seller") {
        setSellerTab("overview");
        setPage("seller-dashboard");
      } else if (role === "admin") {
        setPage("admin");
      } else {
        setPage("home");
      }
    })();
  };

  const handleUpdateProfile = (profile) => {
    setProfileData(profile);
    if (storedAccount) {
      const updated = { ...storedAccount, ...profile };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setStoredAccount(updated);
    }
  };

  const handleLogout = () => {
    setProfileData(null);
    setStoredAccount(null);
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setPage("login");
  };

  const handleAdminAuthenticated = () => {
    setAdminAuthenticated(true);
    setPage("admin");
  };

  const handleAdminLogout = () => {
    setAdminAuthenticated(false);
    setPage("profile");
  };

  return (
    <ErrorBoundary>
      <NotificationsProvider currentUserId={storedAccount?.id}>
        <ToastContainer toasts={toasts} onRemove={removeToast} />
        <>
          {history.length > 0 && (
            <div style={{ position: 'fixed', left: 16, top: 16, zIndex: 60 }}>
              <button className="btn-primary" style={{ background: '#0B1220', color: '#94A3B8', padding: '8px 12px' }} onClick={() => handleNavigate('back')}>
                ← Back
              </button>
            </div>
          )}
          {page === "landing" && <LandingPage onGoShop={() => handleNavigate("splash")} onNavigate={handleNavigate} />}
          {page === "splash" && <Splash onStart={() => handleNavigate("login")} />}
          {page === "login" && <Login storedAccount={storedAccount} onLogin={handleLogin} onNavigate={handleNavigate} />}
          {page === "forgot-password" && <ForgotPassword onNavigate={handleNavigate} />}
          {page === "reset-password" && <ResetPassword onNavigate={handleNavigate} token={pagePayload} />}
          {page === "terms-and-conditions" && <TermsAndConditions onNavigate={handleNavigate} onAccept={() => handleNavigate("login")} />}
          {page === "home" && <Home activePage="home" onNavigate={handleNavigate} onToggleChat={openChatOptions} />}
          {page === "about" && <About onNavigate={handleNavigate} />}
          {page === "contact" && <Contact onNavigate={handleNavigate} />}
          {page === "categories" && <Categories activePage="categories" onNavigate={handleNavigate} onToggleChat={openChatOptions} initialCategory={initialCategory} />}
          {page === "videos" && <Videos activePage="videos" onNavigate={handleNavigate} />}
          {page === "video" && <VideoDetail activePage="videos" onNavigate={handleNavigate} productId={initialCategory} />}
          {page === "cart" && <Cart activePage="cart" onNavigate={handleNavigate} onToggleChat={openChatOptions} storedAccount={storedAccount} />}
          {page === "upload" && (storedAccount?.role === "seller" ? <UploadProduct onNavigate={handleNavigate} storedAccount={storedAccount} /> : <Login storedAccount={storedAccount} onLogin={handleLogin} onNavigate={handleNavigate} />)}
          {page === "admin-login" && <AdminLogin onAuthSuccess={handleAdminAuthenticated} onNavigate={handleNavigate} />}
          {page === "admin" && (storedAccount?.role === "admin" || adminAuthenticated ? <AdminPanel onNavigate={handleNavigate} onLogout={handleAdminLogout} /> : <AdminLogin onAuthSuccess={handleAdminAuthenticated} onNavigate={handleNavigate} />)}
          {page === "seller-dashboard" && (storedAccount?.role === "seller" ? <SellerDashboard onNavigate={handleNavigate} storedAccount={storedAccount} selectedTab={sellerTab} /> : <Login storedAccount={storedAccount} onLogin={handleLogin} onNavigate={handleNavigate} />)}
          {page === "seller-orders" && (storedAccount?.role === "seller" ? <SellerOrders onNavigate={handleNavigate} storedAccount={storedAccount} /> : <Login storedAccount={storedAccount} onLogin={handleLogin} onNavigate={handleNavigate} />)}
        {page === "seller-earnings" && (storedAccount?.role === "seller" ? <SellerEarnings onNavigate={handleNavigate} storedAccount={storedAccount} /> : <Login storedAccount={storedAccount} onLogin={handleLogin} onNavigate={handleNavigate} />)}
        {page === "seller-analytics" && (storedAccount?.role === "seller" ? <SellerAnalytics onNavigate={handleNavigate} storedAccount={storedAccount} /> : <Login storedAccount={storedAccount} onLogin={handleLogin} onNavigate={handleNavigate} />)}
        {page === "seller-settings" && (storedAccount?.role === "seller" ? <SellerSettings onNavigate={handleNavigate} storedAccount={storedAccount} /> : <Login storedAccount={storedAccount} onLogin={handleLogin} onNavigate={handleNavigate} />)}
        {page === "profile" && <Profile activePage="profile" onNavigate={handleNavigate} onToggleChat={openChatOptions} profileData={profileData} onUpdateProfile={handleUpdateProfile} onLogout={handleLogout} theme={theme} onThemeChange={setTheme} />}
        {page === "profile-orders" && <ProfileOrders onNavigate={handleNavigate} profileData={profileData} />}
        {page === "profile-payment" && <ProfilePayment onNavigate={handleNavigate} profileData={profileData} paymentMethods={profileData?.paymentMethods || []} onUpdatePayments={(methods) => handleUpdateProfile({ paymentMethods: methods })} />}
        {page === "profile-addresses" && <ProfileAddresses onNavigate={handleNavigate} address={profileData?.address || ""} onUpdateAddress={(addr) => handleUpdateProfile({ address: addr })} />}
        {page === "profile-settings" && <ProfileSettings onNavigate={handleNavigate} theme={theme} onThemeChange={setTheme} />}
        {page === "profile-edit" && <ProfileEdit onNavigate={handleNavigate} profileData={profileData} onSave={handleUpdateProfile} />}
        {page === "wallet" && <Wallet onNavigate={handleNavigate} profileData={profileData} />}
        {page === "airtime" && <BuyAirtime onNavigate={handleNavigate} profileData={profileData} />}
        {page === "bills" && <PayBills onNavigate={handleNavigate} profileData={profileData} />}
        {page === "invest" && <Invest onNavigate={handleNavigate} profileData={profileData} />}
        {page === "courses" && <Courses onNavigate={handleNavigate} profileData={profileData} />}
        {page === "payment-success" && <PaymentSuccess onNavigate={handleNavigate} orderData={pagePayload} />}
        {page === "payment-page" && <PaymentPage orderData={pagePayload} onNavigate={handleNavigate} />}
        {page === "history" && <InvoiceHistory onNavigate={handleNavigate} profileData={profileData} />}
        {page === "notifications" && <Notifications onNavigate={handleNavigate} profileData={profileData} />}
        {page === "order-tracking" && <OrderTracking onNavigate={handleNavigate} />}
        {page === "chatbot" && <ChatbotPage onNavigate={handleNavigate} />}
        {page !== "splash" && page !== "login" && (
          <ChatOptions
            open={chatOptionsOpen}
            onClose={closeChatOptions}
            onLiveChat={openLiveChat}
            onChatbot={openChatbotPage}
          />
        )}
        
        {/* Fallback for unknown pages */}
        {![
          "landing", "splash", "login", "forgot-password", "reset-password", "terms-and-conditions",
          "home", "about", "contact", "categories", "videos", "video", "cart", "upload",
          "admin-login", "admin", "seller-dashboard", "seller-orders", "seller-earnings",
          "seller-analytics", "seller-settings", "profile", "profile-orders", "profile-payment",
          "wallet", "courses", "profile-addresses", "profile-settings", "profile-edit", "payment-success", "payment-page",
          "history", "notifications", "order-tracking", "airtime", "bills", "invest", "chatbot"
        ].includes(page) && <NotFound />}
      </>
    </NotificationsProvider>
    </ErrorBoundary>
  );
}
