import { Router } from "express";
import {
  authentication,
  authorization,
  checkCompany,
  validation,
} from "../../middleware/index.js";
import { roleTypes } from "../../utilities/index.js";
import * as dashboardSchema from "./dashboard.validation.js";
import * as dashboardService from "./dashboard.service.js";

export const adminDashboardRouter = Router();

// 2. Ban or unbanned specific user
adminDashboardRouter.patch(
  "/toggleBanUser/:userId",
  validation(dashboardSchema.toggleBanUserSchema),
  authentication(),
  authorization([roleTypes.admin]),
  dashboardService.toggleBanUser
);

// 3. Ban or unbanned specific company
adminDashboardRouter.patch(
  "/toggleBanCompany/:companyId",
  validation(dashboardSchema.companyIdSchema),
  authentication(),
  authorization([roleTypes.admin]),
  dashboardService.toggleBanCompany
);

// 4. Approve company
adminDashboardRouter.patch(
  "/approveCompany/:companyId",
  validation(dashboardSchema.companyIdSchema),
  authentication(),
  authorization([roleTypes.admin]),
  checkCompany,
  dashboardService.approveCompany
);


