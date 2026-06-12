const WALLETS_KEY = 'itechWallets';
const WALLET_TRANSACTIONS_KEY = 'itechWalletTransactions';
const FUNDING_REQUESTS_KEY = 'itechWalletFundingRequests';

function loadJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch (err) {
    return [];
  }
}

function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId(prefix = 'wallet') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 90000 + 10000)}`;
}

function makeReference(prefix = 'REF') {
  return `${prefix}-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function getWallets() {
  return loadJson(WALLETS_KEY);
}

function saveWallets(wallets) {
  saveJson(WALLETS_KEY, wallets);
}

function getWalletByUserId(userId) {
  if (!userId) return null;
  const wallets = getWallets();
  return wallets.find((wallet) => wallet.userId === userId) || null;
}

function createWallet(userId) {
  if (!userId) return null;
  const existing = getWalletByUserId(userId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const wallet = {
    id: generateId('wallet'),
    userId,
    currency: 'NGN',
    balance: 0,
    totalCredits: 0,
    totalDebits: 0,
    pendingAmount: 0,
    createdAt: now,
    lastUpdated: now,
  };
  saveWallets([wallet, ...getWallets()]);
  return wallet;
}

function loadTransactions() {
  return loadJson(WALLET_TRANSACTIONS_KEY);
}

function saveTransactions(transactions) {
  saveJson(WALLET_TRANSACTIONS_KEY, transactions);
  window.dispatchEvent(new Event('wallet-transactions-updated'));
}

function loadFundingRequests() {
  return loadJson(FUNDING_REQUESTS_KEY);
}

function saveFundingRequests(requests) {
  saveJson(FUNDING_REQUESTS_KEY, requests);
  window.dispatchEvent(new Event('wallet-funding-updated'));
}

function getWalletTransactions(userId) {
  if (!userId) return [];
  return loadTransactions()
    .filter((tx) => tx.userId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getAllWalletTransactions() {
  return loadTransactions().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getFundingRequests(userId) {
  const requests = loadFundingRequests();
  return userId ? requests.filter((req) => req.userId === userId) : requests;
}

function getFundingRequestById(requestId) {
  if (!requestId) return null;
  return loadFundingRequests().find((req) => req.id === requestId) || null;
}

function recalculateWallet(userId) {
  const wallet = getWalletByUserId(userId);
  if (!wallet) return null;

  const transactions = getWalletTransactions(userId);
  const totalCredits = transactions.filter((tx) => tx.type === 'credit').reduce((sum, tx) => sum + tx.amount, 0);
  const totalDebits = transactions.filter((tx) => tx.type === 'debit').reduce((sum, tx) => sum + tx.amount, 0);
  const balance = totalCredits - totalDebits;

  const wallets = getWallets();
  const next = wallets.map((item) => {
    if (item.userId !== userId) return item;
    return {
      ...item,
      balance,
      totalCredits,
      totalDebits,
      lastUpdated: new Date().toISOString(),
    };
  });
  saveWallets(next);
  return next.find((item) => item.userId === userId);
}

function ensureWallet(userId) {
  if (!userId) return null;
  const wallet = getWalletByUserId(userId);
  if (wallet) {
    return recalculateWallet(userId) || wallet;
  }
  return createWallet(userId);
}

function createWalletTransaction(userId, amount, options = {}) {
  if (!userId || !amount || amount <= 0) {
    throw new Error('Invalid wallet transaction payload');
  }

  if (!options.type || !['credit', 'debit'].includes(options.type)) {
    throw new Error('Transaction type must be credit or debit');
  }

  const now = new Date().toISOString();
  const tx = {
    id: generateId('wtx'),
    userId,
    amount: Number(amount),
    type: options.type,
    category: options.category || 'wallet',
    title: options.title || (options.type === 'credit' ? 'Wallet credit' : 'Wallet debit'),
    description: options.description || '',
    status: options.status || 'completed',
    reference: options.reference || makeReference('WALLET'),
    relatedOrderId: options.relatedOrderId || null,
    metadata: options.metadata || {},
    createdAt: now,
  };

  saveTransactions([tx, ...loadTransactions()]);
  ensureWallet(userId);
  recalculateWallet(userId);
  return tx;
}

function creditWallet(userId, amount, options = {}) {
  ensureWallet(userId);
  return createWalletTransaction(userId, amount, { ...options, type: 'credit' });
}

function debitWallet(userId, amount, options = {}) {
  ensureWallet(userId);
  const wallet = getWalletByUserId(userId);
  if (!wallet) {
    throw new Error('Wallet not found');
  }
  if (wallet.balance < amount) {
    throw new Error('Insufficient wallet balance');
  }
  return createWalletTransaction(userId, amount, { ...options, type: 'debit' });
}

function getWalletSummary(userId) {
  const wallet = ensureWallet(userId);
  return wallet || {
    userId,
    balance: 0,
    totalCredits: 0,
    totalDebits: 0,
    currency: 'NGN',
    pendingAmount: 0,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };
}

function createFundingRequest(userId, amount, bankDetails = {}, paymentDetails = {}) {
  if (!userId || !amount || amount <= 0) {
    throw new Error('Funding amount must be greater than zero');
  }

  const now = new Date().toISOString();
  const request = {
    id: generateId('fund'),
    userId,
    amount: Number(amount),
    amountPaid: paymentDetails.amountPaid || null,
    senderName: paymentDetails.senderName || '',
    reference: makeReference('FUND'),
    bankName: bankDetails.bankName || 'Zenith Bank',
    accountName: bankDetails.accountName || 'ITECH STORE',
    accountNumber: bankDetails.accountNumber || '1234567890',
    proofUrl: paymentDetails.proofUrl || '',
    notes: paymentDetails.notes || '',
    status: 'pending',
    requestedAt: now,
    updatedAt: now,
    reviewedAt: null,
    adminComment: '',
    paymentSubmitted: Boolean(paymentDetails.senderName || paymentDetails.reference || paymentDetails.amountPaid || paymentDetails.proofUrl),
  };

  saveFundingRequests([request, ...loadFundingRequests()]);
  return request;
}

function updateFundingRequest(requestId, updates = {}) {
  const requests = loadFundingRequests();
  const next = requests.map((request) => {
    if (request.id !== requestId) return request;
    return {
      ...request,
      ...updates,
      updatedAt: new Date().toISOString(),
      paymentSubmitted: request.paymentSubmitted || Boolean(updates.senderName || updates.reference || updates.amountPaid || updates.proofUrl)
    };
  });
  saveFundingRequests(next);
  return next.find((req) => req.id === requestId) || null;
}

function approveFundingRequest(requestId, options = {}) {
  const request = getFundingRequestById(requestId);
  if (!request) {
    throw new Error('Funding request not found');
  }
  if (request.status === 'approved') {
    return request;
  }

  const amountToCredit = Number(request.amountPaid || request.amount);
  const approvedRequest = updateFundingRequest(requestId, {
    status: 'approved',
    reviewedAt: new Date().toISOString(),
    adminComment: options.adminComment || 'Approved by administrator',
  });

  creditWallet(request.userId, amountToCredit, {
    category: 'funding',
    title: 'Wallet funding approved',
    description: `Funding request ${request.reference} approved and wallet credited.`,
    relatedOrderId: null,
    metadata: {
      fundingRequestId: requestId,
      approvedBy: options.adminId || 'admin'
    }
  });

  return approvedRequest;
}

function rejectFundingRequest(requestId, reason = '') {
  const request = getFundingRequestById(requestId);
  if (!request) {
    throw new Error('Funding request not found');
  }
  if (request.status === 'rejected') {
    return request;
  }
  return updateFundingRequest(requestId, {
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    adminComment: reason || 'Rejected by administrator'
  });
}

function getTotalWalletStats() {
  const wallets = getWallets();
  const totalBalance = wallets.reduce((sum, wallet) => sum + (wallet.balance || 0), 0);
  const totalCredits = wallets.reduce((sum, wallet) => sum + (wallet.totalCredits || 0), 0);
  const totalDebits = wallets.reduce((sum, wallet) => sum + (wallet.totalDebits || 0), 0);
  const pendingRequests = getFundingRequests().filter((r) => r.status === 'pending').length;
  return { totalBalance, totalCredits, totalDebits, pendingRequests, totalUsers: wallets.length };
}

export {
  getWalletByUserId,
  getWalletSummary,
  ensureWallet,
  creditWallet,
  debitWallet,
  getWalletTransactions,
  getAllWalletTransactions,
  createFundingRequest,
  getFundingRequests,
  getFundingRequestById,
  getFundingRequests as getAllFundingRequests,
  updateFundingRequest,
  approveFundingRequest,
  rejectFundingRequest,
  getTotalWalletStats,
};
