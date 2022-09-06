export interface Status {
  label: string;
  valid: boolean;
}

export type ValidatorFn = (actual: string) => Status;

export interface ValidationResult {
  valid: boolean;
  validations: Status[];
}

export function validate(actual: string, validators: ValidatorFn[]) {
  return validators.reduce<ValidationResult>(
    (acc, validation) => {
      const res = validation(actual);

      const next: ValidationResult = {
        valid: acc.valid === false ? false : res.valid,
        validations: acc.validations.concat(res),
      };

      return next;
    },
    { validations: [], valid: true }
  );
}

export const min = (min: number): ValidatorFn => {
  return function (actual: string): Status {
    if (actual.length < min) {
      return {
        label: `Min ${min}`,
        valid: false,
      };
    }

    return {
      label: `Min ${min}`,
      valid: true,
    };
  };
};

export const max = (max: number): ValidatorFn => {
  return function (actual: string): Status {
    if (actual.length > max) {
      return {
        label: `Max ${max}`,
        valid: false,
      };
    }

    return {
      label: `Max ${max}`,
      valid: true,
    };
  };
};

export const alphanumeric = (): ValidatorFn => {
  return function (actual: string): Status {
    const s = actual.replaceAll(/[a-zA-Z0-9_]/g, "");

    if (s.length > 0) {
      return {
        label: `Alphanumeric`,
        valid: false,
      };
    }

    return {
      label: `Alphanumeric`,
      valid: true,
    };
  };
};

const EMAIL_RE =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;

export const email = (): ValidatorFn => {
  return function (actual: string): Status {
    if (EMAIL_RE.test(actual)) {
      return {
        label: `Email`,
        valid: true,
      };
    }

    return {
      label: `Email`,
      valid: false,
    };
  };
};

export type Rule = typeof min | typeof max | typeof alphanumeric | typeof email;
