import joi from "joi";

export const editSchema = joi.object({
  name: joi.string().required(),
  cpf: joi.number().min(10000000000).max(99999999999).required(),
  photo: joi.string().uri().required(),
  email: joi.string().email().required(),
  classes: joi.string().allow(""),
});
