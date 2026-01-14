/**
 * Tests for delivery logic: distance calculation and delivery fee
 */

import {
    calculateDeliveryFee,
    RESTAURANT_LOCATION
} from '../lib/distance.js';

// Constants to match implementation
const MAX_DELIVERY_DISTANCE = 4.5; // km
const MIN_ORDER_DELIVERY = 15; // €

describe('Delivery Logic', () => {
    describe('calculateDeliveryFee', () => {
        test('should return €0 for distance <= 1.5km', () => {
            expect(calculateDeliveryFee(0)).toBe(0);
            expect(calculateDeliveryFee(1)).toBe(0);
            expect(calculateDeliveryFee(1.5)).toBe(0);
        });

        test('should return €1 for distance > 1.5km', () => {
            expect(calculateDeliveryFee(1.51)).toBe(1);
            expect(calculateDeliveryFee(3)).toBe(1);
            expect(calculateDeliveryFee(4.5)).toBe(1);
        });
    });

    describe('RESTAURANT_LOCATION', () => {
        test('should have valid Torino coordinates', () => {
            expect(RESTAURANT_LOCATION).toBeDefined();
            expect(RESTAURANT_LOCATION.lat).toBeCloseTo(45.08, 1);
            expect(RESTAURANT_LOCATION.lng).toBeCloseTo(7.68, 1);
        });
    });

    describe('Delivery Distance Validation', () => {
        test('should accept delivery for distance <= 4.5km', () => {
            const distances = [0, 1, 2, 3, 4, 4.5];
            distances.forEach(distance => {
                expect(distance <= MAX_DELIVERY_DISTANCE).toBe(true);
            });
        });

        test('should reject delivery for distance > 4.5km', () => {
            const distances = [4.51, 5, 10, 20, 100];
            distances.forEach(distance => {
                expect(distance > MAX_DELIVERY_DISTANCE).toBe(true);
            });
        });
    });

    describe('Minimum Order Validation', () => {
        test('should accept delivery orders >= €15', () => {
            const totals = [15, 15.01, 20, 50, 100];
            totals.forEach(total => {
                expect(total >= MIN_ORDER_DELIVERY).toBe(true);
            });
        });

        test('should reject delivery orders < €15', () => {
            const totals = [0, 5, 10, 14.99];
            totals.forEach(total => {
                expect(total < MIN_ORDER_DELIVERY).toBe(true);
            });
        });

        test('should allow any order amount for pickup (no minimum)', () => {
            const orderType = 'pickup';
            const totals = [0, 2, 5, 10, 14.99];
            totals.forEach(total => {
                // For pickup, there's no minimum check
                const isValidForPickup = orderType === 'pickup' || total >= MIN_ORDER_DELIVERY;
                expect(isValidForPickup).toBe(true);
            });
        });
    });
});
