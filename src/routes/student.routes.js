import { Router } from "express";
import { changeGrade, getClasses, getInfosByClass, getProjectsByClass, getStudentById, getStudentsByClass, getStudentsByClassAndProjects, registerStudent, submitProject } from "../controllers/student.controllers.js";
import { projectSubmissionValidation, registerValidation } from "../middlewares/students.middlewares.js";

const studentRouter = Router()

studentRouter.get('/classes', getClasses)
studentRouter.post('/register', registerValidation, registerStudent)
studentRouter.get('/students/:class', getStudentsByClass)
studentRouter.get('/student/:id', getStudentById)
studentRouter.get('/submit/:class', getInfosByClass)
studentRouter.post('/submit', projectSubmissionValidation, submitProject)
studentRouter.get('/projects/:class', getProjectsByClass)
studentRouter.get('/projects/:class/:project', getStudentsByClassAndProjects)
studentRouter.put('/grade', changeGrade)

export default studentRouter