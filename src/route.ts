import { redirectUrl, shorten_url } from "./urlcontroller";
import express, { Request, Response, NextFunction } from 'express';

const appRouter = express.Router();

// Generate tiny url
appRouter.post("/get-shortened-url", (req: Request, res: Response, next: NextFunction) => {
    shorten_url(req, res).catch(next);
});

// Redirect Back to the original url
appRouter.get("/:shortId", (req: Request, res: Response, next: NextFunction) => {
    redirectUrl(req, res).catch(next);
});

// Error handling middleware
appRouter.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        status: false,
        message: "Internal server error"
    });
});

export default appRouter;
