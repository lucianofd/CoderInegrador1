import { Router } from "express";
import { getMockProducts } from "./mockController.js";

const mockingRouter = Router();

mockingRouter.get("/", getMockProducts);

export default mockingRouter;