import { Router } from "express";
import studentRouter from "./student.routes.js";

const router = Router()

router.use(studentRouter)

export default router