import { editSchema } from "../schemas/edit.schema.js";
import projectSubmissionSchema from "../schemas/projectSubmission.schema.js";
import { registerSchema } from "../schemas/register.schema.js";

export async function registerValidation(req, res, next) {
  const validation = registerSchema.validate(req.body);

  if (validation.error) return res.sendStatus(422);

  next();
}

export async function projectSubmissionValidation(req, res, next) {
  const validation = projectSubmissionSchema.validate(req.body);

  if (validation.error) return res.sendStatus(422);

  next();
}

export async function editValidation(req, res, next) {
  const validation = editSchema.validate(req.body);

  if (validation.error) return res.sendStatus(422);

  next();
}
