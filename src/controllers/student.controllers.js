import { db } from '../database/database.connection.js'

export async function getClasses(req, res){
    try{
        res.send((await db.query(`SELECT * FROM classes`)).rows)
    }catch(err){
        return res.status(500).send(err.message)
    } 
}

export async function registerStudent(req, res){
    const {name, cpf, photo, email, classes} = req.body

    try{
        await db.query(`INSERT INTO students (name, photo, cpf, email) VALUES ('${name}', '${photo}', ${cpf}, '${email}')`)

        const studentId = await db.query(`SELECT id FROM students WHERE cpf=${cpf}`)

        const classId = await db.query(`SELECT id FROM classes WHERE "className"='${classes}'`)

        await db.query(`INSERT INTO students_class ("studentId", "classId") VALUES (${studentId.rows[0].id}, ${classId.rows[0].id})`)

        res.sendStatus(201)
    }catch(err){
        return res.status(500).send(err.message)
    } 
}

export async function getStudentsByClass(req, res){
    const classroom = req.params.class

    try{
        const classId = await db.query(`SELECT id FROM classes WHERE "className"=$1`, [classroom])

        if(!classId.rows[0]) return res.sendStatus(404)

    const a = await db.query(`
        SELECT * FROM students_class
        JOIN students
            ON students_class."studentId" = students.id
        WHERE "classId"=${classId.rows[0].id} AND "leaveDate" IS NULL`)

        res.send(a.rows)
    }catch(err){
        return res.status(500).send(err.message)
    }
}

export async function getStudentById(req, res){
    const id = req.params.id

    try{
        const student = await db.query(`
        SELECT *, TO_CHAR("enrollmentDate", 'DD/MM/YYYY') AS "enrollmentDate", TO_CHAR("leaveDate", 'DD/MM/YYYY') AS "leaveDate" FROM students 
        JOIN students_class
            ON students."id" = students_class."studentId"
        JOIN classes
            ON students_class."classId" = classes."id"
        WHERE students."id"=$1
        `, [id])

        if(!student.rows[0]) return res.sendStatus(404)

        res.send(student.rows.reverse())
    }catch(err){
        return res.status(500).send(err.message)
    }
}

export async function getInfosByClass(req, res){
    const classId = req.params.class


    try{
        const students = await db.query(`
        SELECT students.name, students.id FROM students_class
        JOIN students 
            ON students.id = students_class."studentId"
        WHERE "classId"=${classId}
        `)

        const projects = await db.query(`SELECT * FROM projects WHERE "classId"=${classId}`)

        res.send({
            students: students.rows,
            projects: projects.rows
        })
    }catch(err){
        return res.status(500).send(err.message)
    }
}

export async function submitProject(req, res){
    const {studentId, projectId, projectLink, classId} = req.body
    
    try{
        const checkSubmission = await db.query(`
        SELECT * FROM project_student 
        WHERE "studentId"=${studentId} AND "projectId"=${projectId}`)

        if(checkSubmission.rowCount) return res.sendStatus(409)

        await db.query(`INSERT INTO project_student ("studentId", "projectId", "projectLink", "classId") VALUES (${studentId}, ${projectId}, '${projectLink}', ${classId})`)

        res.sendStatus(201)
    }catch(err){
        return res.status(500).send(err.message)
    }

}

export async function getProjectsByClass(req, res){
    const classroom = req.params.class
    
    try{
        const classId = await db.query(`SELECT * FROM classes WHERE "className"=$1`, [classroom])

        if(!classId.rowCount) return res.sendStatus(404)

        const projects = await db.query(`SELECT * FROM projects WHERE "classId"=${classId.rows[0].id}`)

       res.send(projects.rows)
    }catch(err){
        return res.status(500).send(err.message)
    }
}

export async function getStudentsByClassAndProjects(req, res){
    const classroom = req.params.class
    const projectName = req.params.project

    try{
        const classId = await db.query(`SELECT * FROM classes WHERE "className"=$1`, [classroom])

        if(!classId.rowCount) return res.sendStatus(404)

        const project = await db.query(`SELECT * FROM projects WHERE "projectName"='${projectName}' AND "classId"=${classId.rows[0].id}`)

        const students = await db.query(`
        SELECT * FROM project_student 
        JOIN students
            ON project_student."studentId" = students.id
        WHERE "projectId"=${project.rows[0].id} AND "classId"=${classId.rows[0].id}
        `)

       res.send(students.rows)
    }catch(err){
        return res.status(500).send(err.message)
    }
}

export async function changeGrade(req, res){
    const {grade, student} = req.body

    console.log(student)
    
    try{
        await db.query(`
        UPDATE project_student SET grade='${grade}' 
        WHERE "studentId"=${student.studentId} AND "projectId"=${student.projectId} AND "classId"=${student.classId}
        `)
        
       res.send()
    }catch(err){
        return res.status(500).send(err.message)
    }
}