import { Router } from "express";
import {
  authentication,
  checkCompany,
  companyAuthorization,
  multerCloud,
  validation,
} from "../../middleware/index.js";
import { mimeExtensionTypes, roleTypes } from "../../utilities/index.js";
import * as compService from "./companies.service.js";
import * as compValidation from "./companies.validation.js";
import { companyJobsRouter } from "../index.js";

const companyRouter = Router();

// Merge params
companyRouter.use("/:companyId/jobs", companyJobsRouter);

// 1. Add company
companyRouter.post(
  "/addCompany",
  multerCloud([...mimeExtensionTypes.file, ...mimeExtensionTypes.image]).single(
    "legalAttachment"
  ),
  validation(compValidation.addCompanySchema),
  authentication(),
  compService.addCompany
);

// 2. Update company data
companyRouter.patch(
  "/updateCompany/:companyId",
  validation(compValidation.updateCompanySchema),
  authentication(),
  checkCompany,
  companyAuthorization({ owner: true }),
  compService.updateCompany
);

// 3. Soft delete company
companyRouter.delete(
  "/deleteCompany/:companyId",
  validation(compValidation.companyIdSchema),
  authentication(),
  checkCompany,
  companyAuthorization({ roles: [roleTypes.admin], owner: true }),
  compService.deleteCompany
);

// 4. Get specific company with related jobs
companyRouter.get(
  "/:companyId/getCompanyJobs",
  validation(compValidation.companyIdSchema),
  authentication(),
  checkCompany,
  compService.getCompanyJobs
);

// 5. Search for a company with a name
companyRouter.get(
  "/searchCompany",
  validation(compValidation.searchCompanySchema),
  authentication(),
  compService.searchCompany
);

// 6. Upload company logo
companyRouter.patch(
  "/uploadLogo/:companyId",
  multerCloud(mimeExtensionTypes.image).single("image"),
  validation(compValidation.uploadPicSchema),
  authentication(),
  checkCompany,
  companyAuthorization({ owner: true, hr: true }),
  compService.uploadLogo
);

// 7. Upload company Cover Pic
companyRouter.patch(
  "/uploadCompCoverPic/:companyId",
  multerCloud(mimeExtensionTypes.image).single("image"),
  validation(compValidation.uploadPicSchema),
  authentication(),
  checkCompany,
  companyAuthorization({ owner: true, hr: true }),
  compService.uploadCompCoverPic
);

// 8. Delete company logo
companyRouter.patch(
  "/deleteLogo/:companyId",
  validation(compValidation.companyIdSchema),
  authentication(),
  checkCompany,
  companyAuthorization({ owner: true, hr: true }),
  compService.deleteLogo
);

// 9. Delete company Cover Pic
companyRouter.patch(
  "/deleteCompCoverPic/:companyId",
  validation(compValidation.companyIdSchema),
  authentication(),
  checkCompany,
  companyAuthorization({ owner: true, hr: true }),
  compService.deleteCompCoverPic
);

// Bonus Api
companyRouter.get(
  "/collectApplications/:companyId",
  validation(compValidation.companyIdSchema),
  authentication(),
  checkCompany,
  compService.collectApplications
);

export default companyRouter;
