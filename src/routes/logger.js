import express from "express";

const loggerRouter = express.Router();

loggerRouter.get("/", (req, res) => {
    req.logger.fatal("Fatal error!");
    req.logger.warn("Warning!");
    req.logger.info("Info!");
    req.logger.http("Trace!");
    req.logger.debug("Debug!");
    res.send({ message: "Test logger!" });
});

export default loggerRouter;