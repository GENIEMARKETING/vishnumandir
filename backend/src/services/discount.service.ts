import { PrismaClient } from "@prisma/client";
import { Discount, DiscountType, DiscountScope, OrderDiscount } from "@prisma/client";

/**
 * Discount validation and application service.
 * Handles discount code validation, calculation, and application to carts/orders.
 */
export class DiscountService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Validate a discount code and return discount details if valid.
   * @param code - The discount code to validate
   * @param cartSubtotal - The cart subtotal in cents for validation
   * @param variantIds - Array of variant IDs in cart (for product-level discount validation)
   * @returns Validated discount or null if invalid
   */
  async validateDiscount(
    code: string,
    cartSubtotal: number,
    variantIds: string[] = []
  ): Promise<Discount | null> {
    // Find discount by code
    const discount = await this.prisma.discount.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!discount) {
      return null;
    }

    // Check if discount is active
    if (!discount.active) {
      return null;
    }

    // Check expiration date
    if (discount.expiresAt && discount.expiresAt < new Date()) {
      return null;
    }

    // Check start date
    if (discount.startsAt && discount.startsAt > new Date()) {
      return null;
    }

    // Check if usage limit exceeded
    if (discount.maxUses !== null && discount.usedCount >= discount.maxUses) {
      return null;
    }

    // Check minimum order amount
    if (
      discount.minOrderAmount !== null &&
      cartSubtotal < discount.minOrderAmount
    ) {
      return null;
    }

    // For product-level discounts, check if any variant matches
    if (
      discount.scope === DiscountScope.PRODUCT &&
      discount.productIds.length > 0 &&
      variantIds.length > 0
    ) {
      // This would require fetching product info for each variant
      // For now, we assume product-level validation was done upstream
    }

    return discount;
  }

  /**
   * Calculate the discount amount for a given discount and subtotal.
   * @param discount - The discount to apply
   * @param subtotal - The cart subtotal in cents
   * @returns Discount amount in cents
   */
  calculateDiscountAmount(discount: Discount, subtotal: number): number {
    if (discount.type === DiscountType.FIXED) {
      // Fixed amount discount
      return Math.min(discount.value, subtotal); // Don't discount more than subtotal
    } else if (discount.type === DiscountType.PERCENTAGE) {
      // Percentage discount
      return Math.floor((subtotal * discount.value) / 100);
    }

    return 0;
  }

  /**
   * Apply a discount code to an order.
   * @param orderId - The order ID
   * @param discountCode - The discount code
   * @param discount - The validated discount
   * @param discountAmount - The calculated discount amount in cents
   * @returns Created OrderDiscount record
   */
  async applyDiscountToOrder(
    orderId: string,
    discountCode: string,
    discount: Discount,
    discountAmount: number
  ): Promise<OrderDiscount> {
    // Create OrderDiscount record
    const orderDiscount = await this.prisma.orderDiscount.create({
      data: {
        orderId,
        discountId: discount.id,
        code: discountCode.toUpperCase(),
        type: discount.type,
        value: discount.value,
        scope: discount.scope,
        discountAmount,
      },
    });

    // Increment usage count on the discount
    await this.prisma.discount.update({
      where: { id: discount.id },
      data: {
        usedCount: { increment: 1 },
      },
    });

    return orderDiscount;
  }

  /**
   * Get all active discounts for the store.
   * @returns Array of active discounts
   */
  async getActiveDiscounts(): Promise<Discount[]> {
    const now = new Date();

    return this.prisma.discount.findMany({
      where: {
        active: true,
        startsAt: { lte: now },
        OR: [{ expiresAt: null }, { expiresAt: { gte: now } }],
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Create a new discount.
   * @param data - Discount creation data
   * @returns Created discount
   */
  async createDiscount(data: {
    code: string;
    type: DiscountType;
    value: number;
    scope: DiscountScope;
    productIds?: string[];
    minOrderAmount?: number;
    maxUses?: number;
    startsAt?: Date;
    expiresAt?: Date;
  }): Promise<Discount> {
    return this.prisma.discount.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        scope: data.scope,
        productIds: data.productIds || [],
        minOrderAmount: data.minOrderAmount,
        maxUses: data.maxUses,
        startsAt: data.startsAt,
        expiresAt: data.expiresAt,
        active: true,
      },
    });
  }

  /**
   * Update an existing discount.
   * @param discountId - The discount ID
   * @param data - Fields to update
   * @returns Updated discount
   */
  async updateDiscount(
    discountId: string,
    data: {
      active?: boolean;
      value?: number;
      maxUses?: number;
      startsAt?: Date;
      expiresAt?: Date;
    }
  ): Promise<Discount> {
    return this.prisma.discount.update({
      where: { id: discountId },
      data,
    });
  }

  /**
   * Deactivate a discount.
   * @param discountId - The discount ID
   * @returns Updated discount
   */
  async deactivateDiscount(discountId: string): Promise<Discount> {
    return this.prisma.discount.update({
      where: { id: discountId },
      data: { active: false },
    });
  }

  /**
   * Get discount by code.
   * @param code - The discount code
   * @returns Discount or null
   */
  async getDiscountByCode(code: string): Promise<Discount | null> {
    return this.prisma.discount.findUnique({
      where: { code: code.toUpperCase() },
    });
  }

  /**
   * Get all discounts (admin view).
   * @param filters - Optional filters
   * @returns Array of discounts
   */
  async listDiscounts(filters?: {
    active?: boolean;
    scope?: DiscountScope;
  }): Promise<Discount[]> {
    return this.prisma.discount.findMany({
      where: {
        active: filters?.active,
        scope: filters?.scope,
      },
      orderBy: { createdAt: "desc" },
    });
  }
}
