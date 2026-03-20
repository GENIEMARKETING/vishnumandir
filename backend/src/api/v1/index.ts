import { Router } from "express";
import { requireApiKey } from "../../middleware/apiKey.middleware";
import { formsRoutes } from "./forms.routes";
import { paymentsRoutes } from "./payments.routes";
import { ordersRoutes } from "./orders.routes";
import { pricingRoutes } from "../admin/pricing.routes";
import { discountRoutes } from "../admin/discounts.routes";

const router = Router();

router.use(requireApiKey);
router.use("/forms", formsRoutes);
router.use("/payments", paymentsRoutes);
router.use("/orders", ordersRoutes);
router.use("/admin/pricing", pricingRoutes);
router.use("/admin/discounts", discountRoutes);

export { router as v1Routes };

