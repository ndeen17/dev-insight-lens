/**
 * PaymentMethods Page
 * Employer-facing page for managing saved Stripe payment methods.
 * Features: list saved cards, add new card (via Stripe Elements),
 * visual feedback for card brands.
 */

import { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StripeProvider from '@/components/StripeProvider';
import AddCardForm from '@/components/AddCardForm';
import { createSetupIntent, listPaymentMethods } from '@/services/paymentService';
import type { PaymentMethod } from '@/types/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  Plus,
  Loader2,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

/* ── Brand logos (text-based fallback) ──────── */
const brandColors: Record<string, string> = {
  visa: 'bg-blue-100 text-blue-800',
  mastercard: 'bg-orange-100 text-orange-800',
  amex: 'bg-indigo-100 text-indigo-800',
  discover: 'bg-yellow-100 text-yellow-800',
  default: 'bg-gray-100 text-gray-800',
};

const brandLabel = (brand: string) => brand.charAt(0).toUpperCase() + brand.slice(1);

/* ── Component ──────────────────────────────── */
export default function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add-card flow
  const [showAddCard, setShowAddCard] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [creatingSetup, setCreatingSetup] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /* ── Fetch methods ────────────────────────── */
  const fetchMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listPaymentMethods();
      setMethods(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load payment methods');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  // Check for redirect-back from Stripe after 3DS
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('setup') === 'success') {
      setSuccessMessage('Card saved successfully!');
      // Clean the URL
      window.history.replaceState({}, '', window.location.pathname);
      fetchMethods();
    }
  }, [fetchMethods]);

  /* ── Start add-card flow ──────────────────── */
  const handleAddCard = async () => {
    try {
      setCreatingSetup(true);
      setError(null);
      const { clientSecret: cs } = await createSetupIntent();
      setClientSecret(cs);
      setShowAddCard(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initialise card setup');
    } finally {
      setCreatingSetup(false);
    }
  };

  const handleCardSaved = () => {
    setShowAddCard(false);
    setClientSecret(null);
    setSuccessMessage('Card saved successfully!');
    fetchMethods();
    // Auto-dismiss success
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleCancelAdd = () => {
    setShowAddCard(false);
    setClientSecret(null);
  };

  /* ── Render ───────────────────────────────── */
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your saved cards for milestone payments</p>
          </div>
          {!showAddCard && (
            <Button onClick={handleAddCard} disabled={creatingSetup}>
              {creatingSetup ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add Card
            </Button>
          )}
        </div>

        {/* Success message */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
          </Alert>
        )}

        {/* Error */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Add Card Form (Stripe Elements) */}
        {showAddCard && clientSecret && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add a new card</CardTitle>
              <CardDescription>Your card information is securely handled by Stripe</CardDescription>
            </CardHeader>
            <CardContent>
              <StripeProvider clientSecret={clientSecret}>
                <AddCardForm onSuccess={handleCardSaved} onCancel={handleCancelAdd} />
              </StripeProvider>
            </CardContent>
          </Card>
        )}

        {/* Card List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : methods.length === 0 && !showAddCard ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <CreditCard className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No payment methods</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                Add a credit or debit card to pay your freelancers instantly when you approve milestones.
              </p>
              <Button onClick={handleAddCard} disabled={creatingSetup}>
                {creatingSetup ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Your First Card
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {methods.map((method) => {
              const color = brandColors[method.brand] || brandColors.default;
              return (
                <Card key={method.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex items-center justify-center w-12 h-8 rounded ${color} text-xs font-bold uppercase`}>
                        {method.brand === 'visa' ? 'VISA' :
                         method.brand === 'mastercard' ? 'MC' :
                         method.brand === 'amex' ? 'AMEX' :
                         method.brand.slice(0, 4).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {brandLabel(method.brand)} ending in {method.last4}
                        </p>
                        <p className="text-xs text-gray-500">
                          Expires {String(method.expMonth).padStart(2, '0')}/{method.expYear}
                        </p>
                      </div>
                    </div>
                    {methods.indexOf(method) === 0 && (
                      <Badge variant="secondary" className="text-xs">Default</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Security note */}
        <div className="flex items-start gap-2 text-xs text-gray-400 pt-4">
          <ShieldCheck className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>
            Your payment information is encrypted and securely stored by Stripe.
            We never have access to your full card number.
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}
