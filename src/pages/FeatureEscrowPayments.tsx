/**
 * EscrowPayments Feature Page
 * Public page showcasing the Escrow Payment Protection system.
 * Features: visual escrow flow, trust messaging, payment dashboard mockup.
 */

import { Link } from 'react-router-dom';
import FeaturePageLayout from '@/components/FeaturePageLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Lock,
  ArrowRight,
  ShieldCheck,
  Clock,
  HandCoins,
  FileCheck2,
  FileText,
  Send,
  BadgeCheck,
  Wallet,
  Shield,
  CheckCircle,
  DollarSign,
  CreditCard,
  Banknote,
} from 'lucide-react';

export default function FeatureEscrowPayments() {
  const { isAuthenticated } = useAuth();

  return (
    <FeaturePageLayout>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-lime-50/30 via-white to-white" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — text */}
            <div>
              <h1 className="text-display sm:text-[2.75rem] lg:text-[3.25rem] font-bold text-gray-900 tracking-tight leading-[1.15]">
                Get paid on time.<br />Every time. <span className="text-lime-600">Guaranteed.</span>
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-gray-500 leading-relaxed max-w-xl">
                Your funds are held safely in escrow until work is delivered. No more chasing invoices, no more payment uncertainty, no more broken promises.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: ShieldCheck, text: 'Funds locked in escrow before work begins' },
                  { icon: Clock, text: 'Automatic payment release on milestone approval' },
                  { icon: HandCoins, text: 'Instant withdrawals to your bank account' },
                  { icon: FileCheck2, text: 'Dispute resolution built into every contract' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-lime-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-lime-600" />
                    </div>
                    <span className="text-body text-gray-700">{text}</span>
                  </div>
                ))}
              </div>

              {!isAuthenticated && (
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-12 px-8 shadow-lg shadow-lime-200/40">
                    <Link to="/auth/signup">
                      Start Free Today <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            {/* Right — Visual escrow flow */}
            <div className="bg-gradient-to-br from-lime-50 via-white to-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              <div className="space-y-4">
                {[
                  { step: 1, icon: FileText, label: 'Contract Created', desc: 'Terms agreed by both parties', color: 'bg-gray-900' },
                  { step: 2, icon: Lock, label: 'Funds Locked in Escrow', desc: 'Client deposits payment securely', color: 'bg-lime-500' },
                  { step: 3, icon: Send, label: 'Work Delivered', desc: 'Freelancer submits milestone', color: 'bg-gray-900' },
                  { step: 4, icon: BadgeCheck, label: 'Client Approves', desc: 'Work reviewed and accepted', color: 'bg-gray-900' },
                  { step: 5, icon: Wallet, label: 'Payment Released', desc: 'Instant payout to freelancer', color: 'bg-lime-500' },
                ].map(({ step, icon: Icon, label, desc, color }, idx) => (
                  <div key={step} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 ${color} text-white rounded-xl flex items-center justify-center shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      {idx < 4 && <div className="w-px h-6 bg-gray-200 mt-1" />}
                    </div>
                    <div className="pt-1.5">
                      <p className="text-subheading text-gray-900">{label}</p>
                      <p className="text-caption text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Escrow Dashboard Mockup ─── */}
      <section className="py-16 sm:py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Mockup */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-heading-sm text-gray-900">Escrow Dashboard</h3>
                <span className="inline-flex items-center gap-1 text-caption text-lime-700 font-medium bg-lime-50 px-2.5 py-1 rounded-full">
                  <Shield className="w-3 h-3" /> Protected
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-caption text-gray-500 mb-1">Total in Escrow</p>
                  <p className="text-display-sm font-bold text-gray-900">£4,250</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-caption text-gray-500 mb-1">Released This Month</p>
                  <p className="text-display-sm font-bold text-lime-700">£2,800</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'React Dashboard Build', amount: '£1,500', status: 'In Escrow', statusColor: 'bg-lime-50 text-lime-700' },
                  { name: 'API Integration', amount: '£2,750', status: 'In Escrow', statusColor: 'bg-lime-50 text-lime-700' },
                  { name: 'Mobile App v2', amount: '£2,800', status: 'Released', statusColor: 'bg-lime-50 text-lime-700' },
                ].map(({ name, amount, status, statusColor }) => (
                  <div key={name} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-body-sm font-medium text-gray-900">{name}</p>
                      <p className="text-caption text-gray-500">{amount}</p>
                    </div>
                    <span className={`text-caption font-medium px-2.5 py-1 rounded-full ${statusColor}`}>{status}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full mt-6 bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-11">
                Release Payment
              </Button>
            </div>

            {/* Right — text */}
            <div>
              <h2 className="text-display-sm sm:text-display text-gray-900 tracking-tight leading-tight">
                Securely. On time.<br /><span className="text-lime-600">Every time.</span>
              </h2>
              <p className="mt-4 text-body sm:text-lg text-gray-500 leading-relaxed">
                Our escrow system ensures both parties are protected. Clients know their money is safe until work is approved. Freelancers know payment is guaranteed the moment work is accepted.
              </p>

              <div className="mt-8 space-y-5">
                {[
                  { icon: CreditCard, title: 'Multiple Payment Methods', desc: 'Pay with credit card, debit card, or bank transfer. We support GBP, USD, and EUR.' },
                  { icon: Banknote, title: 'Instant Withdrawals', desc: 'Once payment is released from escrow, freelancers can withdraw to their bank account instantly.' },
                  { icon: Shield, title: 'Buyer & Seller Protection', desc: 'Dispute resolution is built into every contract. If there\'s an issue, we help mediate fairly.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-lime-50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-lime-600" />
                    </div>
                    <div>
                      <h4 className="text-subheading text-gray-900">{title}</h4>
                      <p className="text-body-sm text-gray-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Trust Signals ─── */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { value: '£2M+', label: 'Processed through escrow', icon: DollarSign },
              { value: '100%', label: 'Dispute resolution rate', icon: ShieldCheck },
              { value: '<24h', label: 'Average withdrawal time', icon: Clock },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label}>
                <div className="w-12 h-12 bg-lime-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-lime-600" />
                </div>
                <p className="text-display-sm font-bold text-gray-900">{value}</p>
                <p className="text-body-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      {!isAuthenticated && (
        <section className="py-16 sm:py-20 bg-gray-900">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-display-sm sm:text-display text-white tracking-tight">
              Stop worrying about payments. <span className="underline decoration-lime-400 underline-offset-4">Start building.</span>
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
              Every contract on Artemis is escrow-protected by default. Both parties are safe from day one.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto bg-lime-400 hover:bg-lime-300 text-gray-900 font-semibold h-12 px-8 shadow-lg">
                <Link to="/auth/signup">
                  Start Free Today <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto bg-transparent text-white border-gray-700 hover:bg-gray-800 h-12 px-8 font-medium">
                <Link to="/leaderboard">
                  Explore Leaderboard
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </FeaturePageLayout>
  );
}
