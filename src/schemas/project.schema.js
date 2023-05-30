import joi from "joi";

const projectSchema = joi.object({
  projectName: joi.string().required(),
  classId: joi.number().required(),
});

export default projectSchema;
