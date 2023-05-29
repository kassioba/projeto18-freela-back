import joi from 'joi'

const projectSubmissionSchema = joi.object({
    studentId: joi.number().required(),
    projectId: joi.number().required(),
    projectLink: joi.string().uri().required(),
    classId: joi.number().required()
})

export default projectSubmissionSchema