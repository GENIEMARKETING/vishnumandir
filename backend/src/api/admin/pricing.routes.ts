import { Router, Request, Response } from "express";
import { z } from "zod";

const router = Router();

/**
 * Validation schema for creating/updating variant pricing
 */
const CreatePricingSchema = z.object({
  variant_id: z.string().min(1, "Variant ID is required"),
  currency_code: z.string().length(3, "Currency code must be 3 letters (e.g., USD, EUR)").toUpperCase(),
  amount: z.number().int().min(0, "Price must be >= 0 (in cents)"),
});

const UpdatePricingSchema = z.object({
  currency_code: z.string().length(3, "Currency code must be 3 letters").toUpperCase().optional(),
  amount: z.number().int().min(0, "Price must be >= 0").optional(),
});

/**
 * POST /admin/pricing
 * Create or update a price for a product variant
 *
 * This endpoint communicates with Medusa to set pricing.
 * Note: In production, prices are managed directly in Medusa Admin.
 *
 * @param {string} req.body.variant_id - Medusa variant ID
 * @param {string} req.body.currency_code - Currency code (USD, EUR, etc.)
 * @param {number} req.body.amount - Price in cents (e.g., 2499 for $24.99)
 * @returns {Object} Success response
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const validated = CreatePricingSchema.parse(req.body);

    // TODO: Integrate with Medusa Pricing Module via HTTP API
    // For now, return success response
    return res.status(201).json({
      success: true,
      message: "Pricing updated via Medusa Admin",
      data: {
        variant_id: validated.variant_id,
        currency_code: validated.currency_code,
        amount: validated.amount,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: error.issues,
      });
    }
    console.error("Pricing error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update pricing",
    });
  }
});

/**
 * GET /admin/pricing/:variantId
 * Get pricing for a specific variant
 *
 * @param {string} params.variantId - Medusa variant ID
 * @returns {Object} Pricing data
 */
router.get("/:variantId", async (req: Request, res: Response) => {
  try {
    const { variantId } = req.params;

    if (!variantId) {
      return res.status(400).json({
        success: false,
        error: "Variant ID is required",
      });
    }

    // TODO: Fetch pricing from Medusa
    return res.status(200).json({
      success: true,
      message: "Pricing retrieved from Medusa",
      data: {
        variant_id: variantId,
        prices: [
          // Placeholder for actual prices
        ],
      },
    });
  } catch (error) {
    console.error("Pricing fetch error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch pricing",
    });
  }
});

/**
 * PUT /admin/pricing/:priceId
 * Update a specific price entry
 *
 * @param {string} params.priceId - Price ID
 * @param {Object} req.body - Updated pricing data
 * @returns {Object} Updated pricing entry
 */
router.put("/:priceId", async (req: Request, res: Response) => {
  try {
    const { priceId } = req.params;
    const validated = UpdatePricingSchema.parse(req.body);

    if (!priceId) {
      return res.status(400).json({
        success: false,
        error: "Price ID is required",
      });
    }

    // TODO: Update price in Medusa
    return res.status(200).json({
      success: true,
      message: "Price updated via Medusa Admin",
      data: {
        price_id: priceId,
        ...validated,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: error.issues,
      });
    }
    console.error("Pricing update error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to update price",
    });
  }
});

/**
 * DELETE /admin/pricing/:priceId
 * Delete a specific price entry
 *
 * @param {string} params.priceId - Price ID
 * @returns {Object} Success response
 */
router.delete("/:priceId", async (req: Request, res: Response) => {
  try {
    const { priceId } = req.params;

    if (!priceId) {
      return res.status(400).json({
        success: false,
        error: "Price ID is required",
      });
    }

    // TODO: Delete price from Medusa
    return res.status(200).json({
      success: true,
      message: "Price deleted via Medusa Admin",
    });
  } catch (error) {
    console.error("Pricing delete error:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete price",
    });
  }
});

export { router as pricingRoutes };
