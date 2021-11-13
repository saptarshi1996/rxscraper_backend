import { Request, ResponseToolkit } from "@hapi/hapi";

import { IAllDrugCouponPayload, IDrugScraperResponse } from "../interfaces";
import { ResponseHelper } from "../helpers";
import { 
  SingleCareService,
  AmericaPharmacyService,
  PerksOptumService,
  BuzzRxService,
} from "../services";

export class ScraperController { 

  private readonly responseHelper: ResponseHelper;

  private readonly singleCareService: SingleCareService;
  private readonly americasPharmacyService: AmericaPharmacyService;
  private readonly perksOptumService: PerksOptumService;
  private readonly buzzRxService: BuzzRxService;

  constructor() { 
    this.responseHelper = new ResponseHelper();

    this.singleCareService = new SingleCareService();
    this.americasPharmacyService = new AmericaPharmacyService();
    this.perksOptumService = new PerksOptumService();
    this.buzzRxService = new BuzzRxService();

  }

  public allPricesAndCouponsController = async (req: Request, h: ResponseToolkit) => {
    try {

      const allDrugCoupon = req.payload as IAllDrugCouponPayload;
      const siteName = req.query.site_name as string;

      let result: Array<IDrugScraperResponse>;
      switch (siteName) {
        case "single_care":
          result = await this.singleCareService.scrapeSingleCare(allDrugCoupon);
          break;
        case "good_rx":
          break;
        case "americas_pharmacy":
          result = await this.americasPharmacyService.scrapeAmericasPharmacy(allDrugCoupon);
          break;
        case "buzz_rx":
          result = await this.buzzRxService.scrapeBuzzRx(allDrugCoupon);
          break;
        case "perks_optum":
          result = await this.perksOptumService.scrapePerksOptum(allDrugCoupon);
          break;
        case "well_rx":
          break;
      }

      return this.responseHelper.success(h, "SCRAPER200", {
        "result": result,
        "site_name": siteName,
      });

    } catch (ex) {
      return this.responseHelper.error(h, "SERVER500", ex);
    }
  }

}
