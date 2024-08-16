import { Router } from "express";

const router = Router();
import bookRouter from "./book/index";
import brochureRouter from "./brochure/index";
import catalogRouter from "./catalog/index";
import flagRouter from "./flag/index";
import mugRouter from "./mug/index";
import noteBookRouter from "./noteBook/index";
import cardRouter from "./card/index";
import officeSetRouter from "./officeSet/index";
import packageRouter from "./package/index";
import stampRouter from "./stamp/index";
import tShirtRouter from "./tShirt/index";
import bannerRouter from "./banner/index";
import photoChassisRouter from "./photoChassis/index";
import foamBoardRouter from "./foamBoard/index";
import boxRouter from "./box/index";
import labelRouter from "./label/index";
import StandXRouter from "./standX/index";
import popUpStandRouter from "./popUpStand/index";
import { checkLogin } from "../../middleware/checkLogin";
import{ orderController} from "./controller";
//@ts-ignore
router.post("/pay-cart",checkLogin,orderController.createOrderAndPayment)
//@ts-ignore
router.get("/payment-cb" ,orderController.payCallBack)
//@ts-ignore
router.post("/addToCart",checkLogin,orderController.addToCart)
//@ts-ignore
router.post("/modify-cart",checkLogin,orderController.modifyCart)
router.use("/book", bookRouter);
router.use("/brochure", brochureRouter);
router.use("/catalog", catalogRouter);
router.use("/flag", flagRouter);
router.use("/mug", mugRouter);
router.use("/note-book", noteBookRouter);
router.use("/office-set", officeSetRouter);
router.use("/package", packageRouter);
router.use("/stamp", stampRouter);
router.use("/t-shirt", tShirtRouter);
router.use("/banner", bannerRouter);
router.use("/photo-chassis",photoChassisRouter);
router.use("/pop-up-stand",popUpStandRouter);
router.use("/card", cardRouter);
router.use('/box',boxRouter);
router.use("/label", labelRouter);
router.use ("/foam-board",foamBoardRouter)
router.use("/standx",StandXRouter)


//@ts-ignore
router.get("/cart",checkLogin,orderController.seeCart)
//@ts-ignore
router.get("/post-price",orderController.getPostPrice)
export default router;
