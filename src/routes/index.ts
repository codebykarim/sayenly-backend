import { Router } from "express";
import userRouter from "./userRouter";
import projectRouter from "./projectRouter";
import serviceRouter from "./serviceRouter";
import areaRouter from "./areaRouter";
import faqRouter from "./faqRouter";
import companyRouter from "./companyRouter";
import bookingRouter from "./bookingRouter";
import orderRouter from "./orderRouter";
import notificationRouter from "./notificationRouter";
import reviewRouter from "./reviewRouter";

const routes = Router();

routes.use(userRouter);
routes.use(projectRouter);
routes.use(serviceRouter);
routes.use(areaRouter);
routes.use(faqRouter);
routes.use(companyRouter);
routes.use(bookingRouter);
routes.use(orderRouter);
routes.use(notificationRouter);
routes.use(reviewRouter);

export default routes;
