import React, { useEffect, useMemo, useState } from "react";
import { useNotifications } from "../context/NotificationsContext";
import {
  ensureWallet,
  getWalletSummary,
  getWalletTransactions,
  getFundingRequests,
  createFundingRequest,
  updateFundingRequest,
} from "../utils/walletStore";
import { initializeWalletFunding } from "../utils/api";

const BANK_DETAILS = {
  bankName: "Zenith Bank",
  accountName: "ITECH STORE",
  accountNumber: "1234567890",
};

export default function Wallet({ onNavigate, profileData }) {
  const userId = profileData?.id;
  const [section, setSection] = useState("overview");
  const [amount, setAmount] = useState(0);
  const [senderName, setSenderName] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [amountPaid, setAmountPaid] = useState(0);
  const [proofName, setProofName] = useState("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [activeRequestId, setActiveRequestId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [fundingLoading, setFundingLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (userId) {
      ensureWallet(userId);
    }
  }, [userId]);

  const wallet = useMemo(() => getWalletSummary(userId), [userId, refreshTrigger]);
  const fundingRequests = useMemo(() => getFundingRequests(userId), [userId, refreshTrigger]);
  const transactions = useMemo(() => getWalletTransactions(userId), [userId, refreshTrigger]);

  const pendingRequests = fundingRequests.filter((req) => req.status === "pending");
  const approvedRequests = fundingRequests.filter((req) => req.status === "approved");

  const formatMoney = (value) => {
    if (!showBalance) return 'xxxx';
    return `${wallet.currency} ${Number(value || 0).toLocaleString()}`;
  };

  const toggleBalanceVisibility = () => setShowBalance((current) => !current);

  const handleCreateRequest = (event) => {
    event.preventDefault();
    if (!amount || amount <= 0) {
      setStatusMessage("Enter a valid funding amount.");
      return;
    }
    try {
      const request = createFundingRequest(userId, amount, BANK_DETAILS, {
        senderName: senderName.trim(),
        amountPaid: amountPaid > 0 ? amountPaid : null,
        reference: paymentReference.trim() || undefined,
        proofUrl: proofName || undefined,
        notes: paymentNotes.trim(),
      });
      setStatusMessage(`Funding request ${request.reference} created.`);
      setAmount(0);
      setSenderName("");
      setPaymentReference("");
      setAmountPaid(0);
      setProofName("");
      setPaymentNotes("");
      setRefreshTrigger((current) => current + 1);
      addNotification({
        title: "Wallet funding request created",
        message: `Your wallet funding request ${request.reference} is now pending approval.`,
        type: "info",
      });
    } catch (err) {
      setStatusMessage(err.message || "Failed to create funding request.");
    }
  };

  const handleStartOnlineFunding = async () => {
    if (!amount || amount <= 0) {
      setStatusMessage('Enter a valid amount to fund your wallet.');
      return;
    }

    const email = profileData?.email || profileData?.user?.email;
    if (!email) {
      setStatusMessage('Email address is required to fund wallet online.');
      return;
    }

    setFundingLoading(true);
    setStatusMessage('Initializing online wallet funding...');

    try {
      const result = await initializeWalletFunding({ userId, email, amount });
      if (result && result.authorizationUrl) {
        setStatusMessage('Redirecting to payment gateway...');
        window.location.href = result.authorizationUrl;
      } else {
        throw new Error(result?.message || 'Failed to initialize wallet funding');
      }
    } catch (error) {
      setStatusMessage(error.message || 'Online funding initialization failed.');
    } finally {
      setFundingLoading(false);
    }
  };

  const handlePaymentDetailsSubmit = async (event) => {
    event.preventDefault();
    if (!activeRequestId) return;

    if (!paymentReference.trim() || !senderName.trim() || !amountPaid || amountPaid <= 0) {
      setStatusMessage("Please provide reference, sender name, and amount paid.");
      return;
    }

    try {
      const request = updateFundingRequest(activeRequestId, {
        senderName: senderName.trim(),
        amountPaid: Number(amountPaid),
        reference: paymentReference.trim(),
        proofUrl: proofName,
        notes: paymentNotes.trim(),
        paymentSubmitted: true,
      });
      setStatusMessage(`Payment details submitted for ${request.reference}. Await admin review.`);
      setActiveRequestId(null);
      setPaymentReference("");
      setSenderName("");
      setAmountPaid(0);
      setProofName("");
      setPaymentNotes("");
      setRefreshTrigger((current) => current + 1);
      addNotification({
        title: "Funding details received",
        message: `Your payment details for ${request.reference} have been submitted.`,
        type: "success",
      });
    } catch (err) {
      setStatusMessage(err.message || "Unable to submit payment details.");
    }
  };

  const startPaymentUpdate = (requestId) => {
    const request = fundingRequests.find((req) => req.id === requestId);
    if (!request) return;
    setActiveRequestId(requestId);
    setAmountPaid(request.amountPaid || request.amount || 0);
    setSenderName(request.senderName || "");
    setPaymentReference(request.reference || "");
    setProofName(request.proofUrl || "");
    setPaymentNotes(request.notes || "");
    setSection("funding");
  };

  if (!userId) {
    return (
      <div className="app-shell">
        <div className="content-wrapper" style={{ textAlign: "center", padding: 24 }}>
          <h2 style={{ color: "var(--text)" }}>Wallet</h2>
          <p style={{ color: "var(--muted)" }}>Please log in to view your wallet.</p>
          <button className="btn-primary" onClick={() => onNavigate("login")}>
            Sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="content-wrapper">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
          <button type="button" onClick={() => onNavigate("profile")} style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", fontSize: 18 }}>←</button>
          <div>
            <div style={{ color: "#94A3B8", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.16em" }}>Wallet Account</div>
            <div style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>My Wallet</div>
          </div>
          <button type="button" className="btn-primary" onClick={() => setSection("overview")}>Overview</button>
        </div>

        <div style={{ display: "grid", gap: 14, marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14 }}>
            <div style={{ padding: 20, borderRadius: 20, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>Current Balance</div>
                <button
                  type="button"
                  onClick={toggleBalanceVisibility}
                  style={{ border: 'none', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: 18, padding: 0 }}
                  aria-label={showBalance ? 'Hide balance' : 'Show balance'}
                >
                  {showBalance ? '👁️' : '🙈'}
                </button>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)" }}>{formatMoney(wallet.balance)}</div>
            </div>
            <div style={{ padding: 20, borderRadius: 20, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>Total Credits</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#10B981" }}>+{formatMoney(wallet.totalCredits)}</div>
            </div>
            <div style={{ padding: 20, borderRadius: 20, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>Total Debits</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#EF4444" }}>-{formatMoney(wallet.totalDebits)}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              className={section === "overview" ? "btn-primary" : "btn-secondary"}
              style={{ minWidth: 140 }}
              onClick={() => setSection("overview")}
            >Overview</button>
            <button
              type="button"
              className={section === "funding" ? "btn-primary" : "btn-secondary"}
              style={{ minWidth: 140 }}
              onClick={() => setSection("funding")}
            >Funding</button>
            <button
              type="button"
              className={section === "transactions" ? "btn-primary" : "btn-secondary"}
              style={{ minWidth: 140 }}
              onClick={() => setSection("transactions")}
            >Transactions</button>
          </div>
        </div>

        {statusMessage && (
          <div style={{ padding: 16, borderRadius: 16, background: "var(--glass-bg)", border: "1px solid rgba(59,130,246,0.16)", color: "var(--text)", marginBottom: 18 }}>
            {statusMessage}
          </div>
        )}

        {section === "overview" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ padding: 24, borderRadius: 20, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Quick actions</div>
                  <div style={{ fontSize: 12, color: "#94A3B8" }}>Fund your wallet, buy airtime, pay bills, or invest from one place</div>
                </div>
                <button type="button" className="btn-primary" onClick={() => setSection("funding")}>Fund Wallet</button>
              </div>
              <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}>
                <div style={{ padding: 18, borderRadius: 18, background: "var(--glass-bg)" }}>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 10 }}>Pending requests</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>{pendingRequests.length}</div>
                </div>
                <div style={{ padding: 18, borderRadius: 18, background: "var(--glass-bg)" }}>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginBottom: 10 }}>Latest transaction</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)" }}>{transactions[0]?.title || "No activity yet"}</div>
                </div>
              </div>
              <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', marginTop: 16 }}>
                <button type="button" className="btn-secondary" onClick={() => onNavigate('airtime')}>Buy Airtime</button>
                <button type="button" className="btn-secondary" onClick={() => onNavigate('bills')}>Pay Bills</button>
                <button type="button" className="btn-secondary" onClick={() => onNavigate('invest')}>Invest</button>
              </div>
            </div>

            <div style={{ display: "grid", gap: 14 }}>
              <div style={{ fontWeight: 700, color: "var(--text)" }}>Recent Funding Requests</div>
              {fundingRequests.length === 0 ? (
                <div style={{ padding: 18, borderRadius: 18, background: "var(--glass-bg)", border: "1px solid var(--border)", color: "#94A3B8" }}>
                  No funding requests yet. Create one to receive bank transfer details.
                </div>
              ) : fundingRequests.slice(0, 3).map((request) => (
                <div key={request.id} style={{ padding: 18, borderRadius: 18, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text)" }}>{request.reference}</div>
                      <div style={{ fontSize: 12, color: "#94A3B8" }}>{new Date(request.requestedAt).toLocaleString()}</div>
                    </div>
                    <div style={{ color: request.status === "approved" ? "#10B981" : request.status === "rejected" ? "#F97316" : "#60A5FA", fontWeight: 700, textTransform: "uppercase", fontSize: 11 }}>
                      {request.status}
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: 8, color: "#CBD5E1" }}>
                    <div>Amount requested: {wallet.currency} {request.amount.toLocaleString()}</div>
                    <div>Paid amount: {wallet.currency} {request.amountPaid ? request.amountPaid.toLocaleString() : "—"}</div>
                    <div>Sender name: {request.senderName || "Not submitted"}</div>
                    <div>Proof attached: {request.proofUrl ? request.proofUrl : "No"}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === "funding" && (
          <div style={{ display: "grid", gap: 20 }}>
            <div style={{ display: "grid", gap: 16 }}>
              <div style={{ fontWeight: 700, color: "var(--text)" }}>Fund Wallet</div>
              <div style={{ padding: 24, borderRadius: 20, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
                <div style={{ display: "grid", gap: 16 }}>
                  <div>
                    <div style={{ marginBottom: 6, fontSize: 13, color: "#94A3B8" }}>Bank transfer details</div>
                    <div style={{ display: "grid", gap: 6 }}>
                      <div style={{ color: "var(--text)" }}><strong>Bank:</strong> {BANK_DETAILS.bankName}</div>
                      <div style={{ color: "var(--text)" }}><strong>Account name:</strong> {BANK_DETAILS.accountName}</div>
                      <div style={{ color: "var(--text)" }}><strong>Account number:</strong> {BANK_DETAILS.accountNumber}</div>
                    </div>
                  </div>
                  <div style={{ padding: 18, borderRadius: 18, background: "var(--glass-bg)" }}>
                    <div style={{ fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>Pay online instantly</div>
                    <div style={{ fontSize: 13, color: "#CBD5E1", marginBottom: 12 }}>
                      Use Paystack to fund your wallet immediately and see the balance update after successful payment.
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <input
                          className="login-input"
                          type="number"
                          min="100"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          placeholder="Amount to fund"
                          style={{ flex: 1, minWidth: 180 }}
                        />
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ minWidth: 180 }}
                          onClick={handleStartOnlineFunding}
                          disabled={fundingLoading || !amount}
                        >
                          {fundingLoading ? 'Initializing...' : 'Pay Online'}
                        </button>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleCreateRequest} style={{ display: "grid", gap: 12 }}>
                    <label className="login-label">Enter amount to fund</label>
                    <input
                      className="login-input"
                      type="number"
                      min="100"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                    />
                    <label className="login-label">Optional payment details</label>
                    <input
                      className="login-input"
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Sender name"
                    />
                    <input
                      className="login-input"
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="Payment reference"
                    />
                    <input
                      className="login-input"
                      type="number"
                      min="0"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(Number(e.target.value))}
                      placeholder="Amount paid"
                    />
                    <input
                      className="login-input"
                      type="text"
                      value={proofName}
                      onChange={(e) => setProofName(e.target.value)}
                      placeholder="Proof label or filename"
                    />
                    <textarea
                      className="login-input"
                      rows={3}
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                      placeholder="Notes or bank teller details"
                    />
                    <button type="submit" className="btn-primary" style={{ width: 180 }}>
                      Create Funding Request
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ fontWeight: 700, color: "var(--text)" }}>Pending funding requests</div>
              {pendingRequests.length === 0 ? (
                <div style={{ padding: 18, borderRadius: 18, background: "var(--glass-bg)", border: "1px solid var(--border)", color: "#94A3B8" }}>
                  You have no pending funding requests right now.
                </div>
              ) : pendingRequests.map((request) => (
                <div key={request.id} style={{ padding: 18, borderRadius: 18, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: "var(--text)" }}>{request.reference}</div>
                      <div style={{ color: "#94A3B8", fontSize: 12 }}>{new Date(request.requestedAt).toLocaleString()}</div>
                    </div>
                    <button type="button" className="btn-secondary" style={{ minWidth: 140 }} onClick={() => startPaymentUpdate(request.id)}>
                      I Have Made Payment
                    </button>
                  </div>
                  <div style={{ display: "grid", gap: 8, color: "#CBD5E1" }}>
                    <div>Requested amount: {wallet.currency} {request.amount.toLocaleString()}</div>
                    <div>Submitted amount: {request.amountPaid ? `${wallet.currency} ${request.amountPaid.toLocaleString()}` : 'Not submitted'}</div>
                    <div>Status: {request.status}</div>
                    <div>Sender: {request.senderName || 'Not provided'}</div>
                  </div>
                </div>
              ))}
            </div>

            {activeRequestId && (
              <div style={{ padding: 20, borderRadius: 20, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
                <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--text)" }}>Submit payment details</div>
                <form onSubmit={handlePaymentDetailsSubmit} style={{ display: "grid", gap: 12 }}>
                  <input
                    className="login-input"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Sender name"
                  />
                  <input
                    className="login-input"
                    type="text"
                    value={paymentReference}
                    onChange={(e) => setPaymentReference(e.target.value)}
                    placeholder="Transaction reference"
                  />
                  <input
                    className="login-input"
                    type="number"
                    min="0"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    placeholder="Amount paid"
                  />
                  <input
                    className="login-input"
                    type="text"
                    value={proofName}
                    onChange={(e) => setProofName(e.target.value)}
                    placeholder="Proof label or filename"
                  />
                  <textarea
                    className="login-input"
                    rows={3}
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="Notes for admin"
                  />
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button type="submit" className="btn-primary">Submit Payment Details</button>
                    <button type="button" className="btn-secondary" onClick={() => setActiveRequestId(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {section === "transactions" && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ fontWeight: 700, color: "var(--text)" }}>Transaction history</div>
            {transactions.length === 0 ? (
              <div style={{ padding: 18, borderRadius: 18, background: "var(--glass-bg)", border: "1px solid var(--border)", color: "#94A3B8" }}>
                Your wallet activity will appear here.
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {transactions.map((tx) => (
                  <div key={tx.id} style={{ display: "grid", gap: 10, padding: 18, borderRadius: 18, background: "var(--glass-bg)", border: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text)" }}>{tx.title}</div>
                        <div style={{ fontSize: 12, color: "#94A3B8" }}>{new Date(tx.createdAt).toLocaleString()}</div>
                      </div>
                      <div style={{ color: tx.type === 'credit' ? '#10B981' : '#F97316', fontWeight: 700 }}>
                        {tx.type === 'credit' ? '+' : '-'}{wallet.currency} {tx.amount.toLocaleString()}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: '#CBD5E1' }}>{tx.description || tx.category}</div>
                    <div style={{ fontSize: 12, color: '#94A3B8' }}>Ref: {tx.reference}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

