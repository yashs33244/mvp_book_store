import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

export { router as healthRoutes}; 