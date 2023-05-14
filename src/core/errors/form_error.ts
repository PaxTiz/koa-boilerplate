export interface FormError {
  param: string;
  msg: string;
}

export const isFormError = (value: object): value is FormError => {
  const typedObject = value as FormError;
  return typedObject.param !== undefined && typedObject.msg !== undefined;
};

export const createFormError = (key: string, value: string): FormError => ({
  param: key,
  msg: value,
});
