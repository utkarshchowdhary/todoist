interface Validatable {
  field: string;
  value: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}

export function validate(validatableInput: Validatable): [boolean, string[]] {
  let isValid = true;
  let errors: string[] = [];

  if (validatableInput.required) {
    let isTruthy = validatableInput.value.length !== 0;
    if (!isTruthy) {
      errors.push(`${validatableInput.field} is required`);
    }
    isValid = isValid && isTruthy;
  }
  if (validatableInput.minLength != null) {
    let isTruthy = validatableInput.value.length >= validatableInput.minLength;
    if (!isTruthy) {
      errors.push(
        `${validatableInput.field} should have a minimum length of ${validatableInput.minLength}`
      );
    }
    isValid = isValid && isTruthy;
  }
  if (validatableInput.maxLength != null) {
    let isTruthy = validatableInput.value.length <= validatableInput.maxLength;
    if (!isTruthy) {
      errors.push(
        `${validatableInput.field} can have a maximum length of ${validatableInput.maxLength}`
      );
    }
    isValid = isValid && isTruthy;
  }

  return [isValid, errors];
}
