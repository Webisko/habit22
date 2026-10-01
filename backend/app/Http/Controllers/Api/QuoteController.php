<?php

namespace App\Http\Controllers\Api;

use App\Domain\Commerce\Checkout\CheckoutDataResolver;
use App\Domain\Commerce\Enums\CustomerSegment;
use App\Domain\Commerce\Pricing\PricingEngine;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class QuoteController extends Controller
{
    public function __construct(
        private readonly CheckoutDataResolver $checkoutDataResolver,
        private readonly PricingEngine $pricingEngine,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.slug' => ['required', 'string'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'customer_segment' => ['nullable', 'string', Rule::in(array_map(
                static fn (CustomerSegment $segment) => $segment->value,
                CustomerSegment::cases(),
            ))],
            'shipping_method_code' => ['nullable', 'string'],
            'coupon_code' => ['nullable', 'string'],
            'delivery_point' => ['nullable', 'array'],
            'delivery_point.id' => ['nullable', 'string'],
            'delivery_point.name' => ['nullable', 'string'],
            'delivery_point.address' => ['nullable', 'string'],
            'delivery_point.postal_code' => ['nullable', 'string'],
            'delivery_point.city' => ['nullable', 'string'],
            'shipping_address' => ['nullable', 'array'],
            'currency' => ['nullable', 'string'],
        ]);

        $quote = $this->checkoutDataResolver->resolve($validated)->quote;

        return response()->json([
            'data' => $this->pricingEngine->calculate($quote)->toArray(),
        ]);
    }
}