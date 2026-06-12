const fs = require('fs');
const path = require('path');

const walletsPath = path.join(__dirname, 'wallets.json');
const walletFundingsPath = path.join(__dirname, 'walletFundings.json');

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) return [];
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Failed to load JSON file:', filePath, err);
    return [];
  }
}

function saveJson(filePath, value) {
  fs.writeFileSync(filePath, JSON.stringify(value, null, 2), 'utf8');
}

function getWallets() {
  return loadJson(walletsPath);
}

function saveWallets(wallets) {
  saveJson(walletsPath, wallets);
}

function getWalletByUserId(userId) {
  if (!userId) return null;
  return getWallets().find((wallet) => wallet.userId === userId) || null;
}

function createWallet(userId) {
  if (!userId) return null;
  const existing = getWalletByUserId(userId);
  if (existing) return existing;

  const now = new Date().toISOString();
  const wallet = {
    id: `wallet-${Date.now()}-${Math.floor(Math.random() * 90000 + 10000)}`,
    userId,
    currency: 'NGN',
    balance: 0,
    totalCredits: 0,
    totalDebits: 0,
    createdAt: now,
    updatedAt: now,
  };

  saveWallets([wallet, ...getWallets()]);
  return wallet;
}

function creditWallet(userId, amount, options = {}) {
  if (!userId || !amount || amount <= 0) {
    throw new Error('Invalid wallet credit payload');
  }

  const wallets = getWallets();
  let wallet = getWalletByUserId(userId);
  if (!wallet) {
    wallet = createWallet(userId);
  }

  const next = wallets.map((item) => {
    if (item.userId !== userId) return item;
    return {
      ...item,
      balance: (item.balance || 0) + Number(amount),
      totalCredits: (item.totalCredits || 0) + Number(amount),
      updatedAt: new Date().toISOString(),
      lastFundingReference: options.reference || item.lastFundingReference || null,
    };
  });

  saveWallets(next);
  return getWalletByUserId(userId);
}

function debitWallet(userId, amount, options = {}) {
  if (!userId || !amount || amount <= 0) {
    throw new Error('Invalid wallet debit payload');
  }

  const wallets = getWallets();
  const wallet = getWalletByUserId(userId);
  if (!wallet) {
    throw new Error('Wallet not found');
  }
  if ((wallet.balance || 0) < amount) {
    throw new Error('Insufficient wallet balance');
  }

  const next = wallets.map((item) => {
    if (item.userId !== userId) return item;
    return {
      ...item,
      balance: (item.balance || 0) - Number(amount),
      totalDebits: (item.totalDebits || 0) + Number(amount),
      updatedAt: new Date().toISOString(),
    };
  });

  saveWallets(next);
  return getWalletByUserId(userId);
}

function getWalletSummary(userId) {
  if (!userId) return null;
  let wallet = getWalletByUserId(userId);
  if (!wallet) wallet = createWallet(userId);
  return wallet;
}

function getWalletFundings() {
  return loadJson(walletFundingsPath);
}

function saveWalletFundings(fundings) {
  saveJson(walletFundingsPath, fundings);
}

function createWalletFunding(userId, amount, reference, metadata = {}) {
  const now = new Date().toISOString();
  const funding = {
    id: `wallet-fund-${Date.now()}-${Math.floor(Math.random() * 90000 + 10000)}`,
    userId,
    amount: Number(amount),
    reference,
    status: 'pending',
    metadata,
    createdAt: now,
    updatedAt: now,
    events: [
      { step: 'initialized', date: now, status: 'pending' }
    ]
  };
  saveWalletFundings([funding, ...getWalletFundings()]);
  return funding;
}

function getWalletFundingByReference(reference) {
  if (!reference) return null;
  return getWalletFundings().find((item) => item.reference === reference) || null;
}

function updateWalletFunding(reference, updates = {}) {
  const fundings = getWalletFundings();
  let nextFunding = null;
  const next = fundings.map((item) => {
    if (item.reference !== reference) return item;
    nextFunding = {
      ...item,
      ...updates,
      updatedAt: new Date().toISOString(),
      events: [
        ...(item.events || []),
        ...(updates.event ? [updates.event] : [])
      ]
    };
    delete nextFunding.event;
    return nextFunding;
  });
  if (nextFunding) {
    saveWalletFundings(next);
  }
  return nextFunding;
}

module.exports = {
  getWallets,
  getWalletByUserId,
  createWallet,
  creditWallet,
  debitWallet,
  getWalletSummary,
  createWalletFunding,
  getWalletFundingByReference,
  updateWalletFunding,
};
