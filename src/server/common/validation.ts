import Joi from "joi";
interface FormData {
  [key: string]: string;
}

export type Validator = (formData: FormData) => Promise<Joi.ValidationResult>;

export function createValidation(schema: Joi.ObjectSchema<any>, postValidation?: (validationResult: Joi.ValidationResult) => Joi.ValidationResult): Validator {
  function defaultPostValidation(validationResult: Joi.ValidationResult) {
    return validationResult;
  }
  return async (formData: FormData) => {
    const validationResult = schema.validate(formData, { abortEarly: false });
    return postValidation ? postValidation(validationResult) : defaultPostValidation(validationResult);
  }
}