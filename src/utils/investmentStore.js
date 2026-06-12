import { debitWallet, creditWallet } from './walletStore';

const INVESTMENTS_KEY = 'itechInvestments_v2';

function read() {
  try {
    return JSON.parse(localStorage.getItem(INVESTMENTS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

function write(items) {
  localStorage.setItem(INVESTMENTS_KEY, JSON.stringify(items));
}

const PLANS = [
  { id: 'saver', label: 'Saver', roiPercent: 5, durationDays: 30, min: 100 },
  { id: 'growth', label: 'Growth', roiPercent: 8, durationDays: 90, min: 500 },
  { id: 'max', label: 'Max', roiPercent: 12, durationDays: 180, min: 1000 },
];

function findPlan(id) {
  return PLANS.find((p) => p.id === id) || PLANS[0];
}

function generateId() {
  return `inv-${Date.now()}-${Math.floor(Math.random() * 90000 + 10000)}`;
}

function calculateProjectedReturn(amount, roiPercent, durationDays) {
  // simple prorated return: amount * (roiPercent/100) * (durationDays/365)
  return Number((amount * (roiPercent / 100) * (durationDays / 365)).toFixed(2));
}

function getInvestments(userId) {
  const all = read();
  return userId ? all.filter((i) => i.user === userId).sort((a,b)=> new Date(b.createdAt)-new Date(a.createdAt)) : all;
}

function getInvestmentById(id) {
  return read().find((i) => i.id === id) || null;
}

function createInvestment(userId, planId, amount) {
  if (!userId) throw new Error('User required');
  const plan = findPlan(planId);
  if (!amount || Number(amount) < plan.min) throw new Error(`Minimum amount for ${plan.label} is ${plan.min}`);

  // attempt to debit wallet first
  const investmentId = generateId();
  try {
    debitWallet(userId, Number(amount), {
      category: 'investment',
      title: `Investment deposit (${plan.label})`,
      description: `Deposit for investment ${investmentId}`,
      metadata: { investmentId }
    });
  } catch (err) {
    throw err;
  }

  const now = new Date();
  const maturity = new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000).toISOString();
  const projectedReturn = calculateProjectedReturn(Number(amount), plan.roiPercent, plan.durationDays);

  const record = {
    id: investmentId,
    user: userId,
    planId: plan.id,
    planLabel: plan.label,
    amount: Number(amount),
    roiPercent: plan.roiPercent,
    durationDays: plan.durationDays,
    projectedReturn,
    maturityDate: maturity,
    status: 'active',
    createdAt: now.toISOString(),
  };

  const all = read();
  all.unshift(record);
  write(all);
  window.dispatchEvent(new Event('investments-updated'));
  return record;
}

function redeemInvestment(investmentId) {
  const all = read();
  const idx = all.findIndex((i) => i.id === investmentId);
  if (idx === -1) throw new Error('Investment not found');
  const inv = all[idx];
  if (inv.status !== 'active') throw new Error('Investment not active');
  const now = new Date();
  const matured = new Date(inv.maturityDate) <= now;
  if (!matured) throw new Error('Investment has not matured yet');

  const payout = Number((inv.amount + inv.projectedReturn).toFixed(2));
  // credit user wallet with payout
  creditWallet(inv.user, payout, {
    category: 'investment-payout',
    title: 'Investment payout',
    description: `Payout for investment ${investmentId}`,
    metadata: { investmentId }
  });

  inv.status = 'closed';
  inv.closedAt = now.toISOString();
  inv.payoutAmount = payout;

  all[idx] = inv;
  write(all);
  window.dispatchEvent(new Event('investments-updated'));
  return inv;
}

export { PLANS, getInvestments, getInvestmentById, createInvestment, redeemInvestment, findPlan };
