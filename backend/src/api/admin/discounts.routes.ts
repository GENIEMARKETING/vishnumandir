import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { DiscountService } from "../../services/discount.service";
import { DiscountType, DiscountScope } from "@prisma/client";

const router = Router();
const discountService = new DiscountService(prisma);

/**
 * Validation schemas for discount management
 */
const CreateDiscountSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(20, "Code must not exceed 20 characters")
    .regex(/^[A-Z0-9_-]+$/, "Code must contain only uppercase letters, numbers, hyphens, and underscores"),
  type: z.enum(["FIXED", "PERCENTAGE"]),
  value: z.number().int().positive("Value must be positive"),
  scope: z.enum(["PRODUCT", "ORDER", "GLOBAL"]),
  product_ids: z.array(z.string()).optional().default([]),
  min_order_amount: z.number().int().min(0).optional(),
  max_uses: z.number().int().positive().optional(),
  starts_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().optional(),
});

const UpdateDiscountSchema = z.object({
  type: z.enum(["FIXED", "PERCENTAGE"]).optional(),
  value: z.number().int().positive().optional(),
  scope: z.enum(["PRODUCT", "ORDER", "GLOBAL"]).optional(),
  product_ids: z.array(z.string()).optional(),
  min_order_amount: z.number().int().min(0).optional(),
  max_uses: z.number().int().positive().optional(),
  starts_at: z.string().datetime().optional(),
  expires_at: z.string().datetime().optional(),
  active: z.boolean().optional(),
});

/**
 * POST /admin/discounts
 * Create a new discount code
 *
 * @param {Object} req.body - Discount data
 * @returns {Object} Created discount
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const validated = CreateDiscountSchema.parse(req.body);

    // Check if code already exists
    const existingCode = await discountService.getDiscountByCode(validated.code);
    if (existingCode) {
      return res.status(409).json({
        success: false,
        error: "Discount code already exists",
      });
    }

    // Create discount
    const discount = await discountService.createDiscount({
      code: validated.code,
      type: validated.type as DiscountType,
      value: validated.value,
      scope: validated.scope as DiscountScope,
      productIds: validated.product_ids,
      minOrderAmount: validated.min_order_amount,
      maxUses: validated.max_uses,
      startsAt: validated.starts_at ? new Date(validated.starts_at) : undefined,
      expiresAt: validated.expires_at ? new Date(validated.expires_at) : undefined,
    });

    res.status(201).json({
      success: true,
      data: {
        id: discount.id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
        scope: discount.scope,
        display_value: discount.type === "FIXED" ? `$${(discount.value / 100).toFixed(2)}` : `${discount.value}%`,
        product_ids: discount.productIds,
        min_order_amount: discount.minOrderAmount,
        max_uses: discount.maxUses,
        used_count: discount.usedCount,
        active: discount.active,
        starts_at: discount.startsAt?.toISOString(),
        expires_at: discount.expiresAt?.toISOString(),
        created_at: discount.createdAt.toISOString(),
      },
      message: "Discount created successfully",
    });
  } catch (error) {
    console.error("Discount creation error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        issues: error.issues,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to create discount",
    });
  }
});

/**
 * GET /admin/discounts
 * List all discounts with optional filters
 *
 * @param {string} req.query.active - Filter by active status
 * @param {string} req.query.scope - Filter by scope (PRODUCT, ORDER, GLOBAL)
 * @param {number} req.query.limit - Pagination limit
 * @param {number} req.query.offset - Pagination offset
 * @returns {Array} List of discounts
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const active = req.query.active === "true" ? true : req.query.active === "false" ? false : undefined;
    const scope = (req.query.scope as DiscountScope) || undefined;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = parseInt(req.query.offset as string) || 0;

    const discounts = await discountService.listDiscounts({
      active,
      scope,
    });

    // Apply pagination
    const paginatedDiscounts = discounts.slice(offset, offset + limit);

    res.status(200).json({
      success: true,
      data: paginatedDiscounts.map((d) => ({
        id: d.id,
        code: d.code,
        type: d.type,
        value: d.value,
        display_value: d.type === "FIXED" ? `$${(d.value / 100).toFixed(2)}` : `${d.value}%`,
        scope: d.scope,
        product_ids: d.productIds,
        min_order_amount: d.minOrderAmount,
        max_uses: d.maxUses,
        used_count: d.usedCount,
        active: d.active,
        starts_at: d.startsAt?.toISOString(),
        expires_at: d.expiresAt?.toISOString(),
        created_at: d.createdAt.toISOString(),
      })),
      pagination: {
        total: discounts.length,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Discounts list error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve discounts",
    });
  }
});

/**
 * GET /admin/discounts/:code
 * Get discount details by code
 *
 * @param {string} req.params.code - Discount code
 * @returns {Object} Discount details
 */
router.get("/:code", async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    const discount = await discountService.getDiscountByCode(code);

    if (!discount) {
      return res.status(404).json({
        success: false,
        error: "Discount not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: discount.id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
        display_value: discount.type === "FIXED" ? `$${(discount.value / 100).toFixed(2)}` : `${discount.value}%`,
        scope: discount.scope,
        product_ids: discount.productIds,
        min_order_amount: discount.minOrderAmount,
        max_uses: discount.maxUses,
        used_count: discount.usedCount,
        active: discount.active,
        starts_at: discount.startsAt?.toISOString(),
        expires_at: discount.expiresAt?.toISOString(),
        created_at: discount.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Discount retrieval error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve discount",
    });
  }
});

/**
 * PUT /admin/discounts/:discountId
 * Update a discount
 *
 * @param {string} req.params.discountId - Discount ID
 * @param {Object} req.body - Fields to update
 * @returns {Object} Updated discount
 */
router.put("/:discountId", async (req: Request, res: Response) => {
  try {
    const { discountId } = req.params;
    const validated = UpdateDiscountSchema.parse(req.body);

    const discount = await discountService.updateDiscount(discountId, {
      active: validated.active,
      value: validated.value,
      maxUses: validated.max_uses,
      startsAt: validated.starts_at ? new Date(validated.starts_at) : undefined,
      expiresAt: validated.expires_at ? new Date(validated.expires_at) : undefined,
    });

    res.status(200).json({
      success: true,
      data: {
        id: discount.id,
        code: discount.code,
        type: discount.type,
        value: discount.value,
        display_value: discount.type === "FIXED" ? `$${(discount.value / 100).toFixed(2)}` : `${discount.value}%`,
        scope: discount.scope,
        product_ids: discount.productIds,
        min_order_amount: discount.minOrderAmount,
        max_uses: discount.maxUses,
        used_count: discount.usedCount,
        active: discount.active,
        starts_at: discount.startsAt?.toISOString(),
        expires_at: discount.expiresAt?.toISOString(),
        created_at: discount.createdAt.toISOString(),
      },
      message: "Discount updated successfully",
    });
  } catch (error) {
    console.error("Discount update error:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        issues: error.issues,
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to update discount",
    });
  }
});

/**
 * PATCH /admin/discounts/:discountId/status
 * Toggle discount active/inactive status
 *
 * @param {string} req.params.discountId - Discount ID
 * @param {boolean} req.body.active - Active status
 * @returns {Object} Updated discount
 */
router.patch("/:discountId/status", async (req: Request, res: Response) => {
  try {
    const { discountId } = req.params;
    const { active } = req.body;

    if (typeof active !== "boolean") {
      return res.status(400).json({
        success: false,
        error: "Active must be a boolean value",
      });
    }

    const discount = await discountService.updateDiscount(discountId, { active });

    res.status(200).json({
      success: true,
      data: {
        id: discount.id,
        code: discount.code,
        active: discount.active,
      },
      message: `Discount ${active ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("Discount status update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update discount status",
    });
  }
});

/**
 * DELETE /admin/discounts/:discountId
 * Deactivate a discount (soft delete)
 *
 * @param {string} req.params.discountId - Discount ID
 * @returns {Object} Success message
 */
router.delete("/:discountId", async (req: Request, res: Response) => {
  try {
    const { discountId } = req.params;

    await discountService.deactivateDiscount(discountId);

    res.status(200).json({
      success: true,
      message: "Discount deactivated successfully",
    });
  } catch (error) {
    console.error("Discount deletion error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to deactivate discount",
    });
  }
});

export { router as discountRoutes };
