<?php

namespace App\Http\Controllers\Api;

use App\Domain\Operations\IntegrationLogService;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\PaymentTransaction;
use App\Domain\Commerce\Payments\StripeApiClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class StripePaymentCallbackController extends Controller
{
    public function __construct(
        private readonly StripeApiClient $stripeApiClient,
        private readonly IntegrationLogService $integrationLogService,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('STRIPE_SIGNATURE');
        $webhookSecret = config('services.stripe.webhook_secret');

        if (blank($webhookSecret)) {
            abort(500, 'Stripe webhook secret is not configured.');
        }

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $webhookSecret);
        } catch (\UnexpectedValueException $e) {
            abort(400, 'Invalid payload');
        } catch (SignatureVerificationException $e) {
            $this->integrationLogService->record(
                integration: 'stripe',
                event: 'stripe_webhook_signature_invalid',
                status: 'warning',
                direction: 'incoming',
                externalReference: 'unknown',
                requestPayload: ['raw_encoded' => true],
                errorMessage: 'Odrzucono webhook Stripe z niepoprawnym podpisem.',
            );
            abort(400, 'Invalid signature');
        }

        $this->integrationLogService->record(
            integration: 'stripe',
            event: 'stripe_webhook_received',
            status: 'success',
            direction: 'incoming',
            externalReference: $event->id,
            requestPayload: ['event_type' => $event->type],
        );

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $orderNumber = data_get($session->metadata, 'order_number');
            $stripeSessionId = $session->id;

            $transaction = PaymentTransaction::query()
                ->with('order')
                ->where('provider', 'stripe')
                ->where(function ($query) use ($stripeSessionId, $orderNumber) {
                    $query->where('response_payload->registration->id', $stripeSessionId)
                        ->orWhere('external_session_id', $stripeSessionId)
                        ->orWhere('metadata->stripe_session_id', $stripeSessionId);
                })
                ->first();

            if ($transaction === null && filled($orderNumber)) {
                $transaction = PaymentTransaction::query()
                    ->with('order')
                    ->where('provider', 'stripe')
                    ->whereHas('order', function ($query) use ($orderNumber) {
                        $query->where('number', $orderNumber);
                    })
                    ->first();
            }

            if ($transaction === null || $transaction->order === null) {
                abort(404, 'Nie znaleziono transakcji dla tego webhooka Stripe.');
            }

            $order = $transaction->order;

            if ($session->payment_status === 'paid') {
                $replayed = false;
                DB::transaction(function () use ($transaction, $order, $session, &$replayed) {
                    $lockedOrder = Order::query()->lockForUpdate()->find($order->id);
                    $lockedTx = PaymentTransaction::query()->lockForUpdate()->find($transaction->id);

                    if ($lockedOrder && $lockedOrder->payment_status === 'paid' && $lockedTx && $lockedTx->status === 'confirmed') {
                        $replayed = true;
                        return;
                    }

                    $responsePayload = $lockedTx?->response_payload ?? [];
                    $responsePayload['callback'] = [
                        'session_id' => $session->id,
                        'payment_status' => $session->payment_status,
                        'received_at' => now()->toIso8601String(),
                    ];

                    $lockedTx?->forceFill([
                        'status' => 'confirmed',
                        'response_payload' => $responsePayload,
                        'confirmed_at' => $lockedTx->confirmed_at ?? now(),
                    ])->save();

                    $lockedOrder?->forceFill([
                        'payment_status' => 'paid',
                    ])->save();
                });

                if ($replayed) {
                    $this->integrationLogService->record(
                        integration: 'stripe',
                        event: 'payment_callback_replayed',
                        status: 'success',
                        order: $order,
                        direction: 'incoming',
                        externalReference: $session->id,
                        requestPayload: ['session_id' => $session->id, 'payment_status' => $session->payment_status],
                        responsePayload: ['status' => 'replayed'],
                    );

                    return response()->json(['received' => true, 'replayed' => true]);
                }

                $this->integrationLogService->record(
                    integration: 'stripe',
                    event: 'payment_callback_confirmed',
                    status: 'success',
                    order: $order,
                    direction: 'incoming',
                    externalReference: $session->id,
                    requestPayload: ['session_id' => $session->id, 'payment_status' => $session->payment_status],
                    responsePayload: ['status' => 'confirmed'],
                );
            } else {
                DB::transaction(function () use ($transaction, $order, $session) {
                    $lockedOrder = Order::query()->lockForUpdate()->find($order->id);
                    $lockedTx = PaymentTransaction::query()->lockForUpdate()->find($transaction->id);

                    if ($lockedOrder && $lockedOrder->payment_status === 'paid') {
                        return;
                    }

                    $responsePayload = $lockedTx?->response_payload ?? [];
                    $responsePayload['callback'] = [
                        'session_id' => $session->id,
                        'payment_status' => $session->payment_status,
                        'received_at' => now()->toIso8601String(),
                    ];

                    $lockedTx?->forceFill([
                        'status' => 'failed',
                        'response_payload' => $responsePayload,
                        'failed_at' => now(),
                        'error_message' => 'Stripe session payment_status was ' . $session->payment_status,
                    ])->save();
                });

                $this->integrationLogService->record(
                    integration: 'stripe',
                    event: 'payment_callback_failed',
                    status: 'warning',
                    order: $order,
                    direction: 'incoming',
                    externalReference: $session->id,
                    requestPayload: ['session_id' => $session->id, 'payment_status' => $session->payment_status],
                    errorMessage: 'Stripe payment status was: ' . $session->payment_status,
                );
            }
        }

        return response()->json(['received' => true]);
    }
}
