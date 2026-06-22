export type ValidationErrorDetails = { message?: string };

export type ValidationError<T extends string = string> = {
  [key in T]?: ValidationErrorDetails[];
};

export interface AppError {
  message?: string;
  formErrors?: ValidationErrorDetails[];
  fieldErrors?: ValidationError;
}
