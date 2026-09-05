import { Injectable, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

/** Reject values with more than 2 decimal places (do not auto-round). */
function maxTwoDecimals(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
      return null;
    }
    const num = Number(value);
    if (Number.isNaN(num)) {
      return { maxTwoDecimals: true };
    }
    return Math.round(num * 100) / 100 === num ? null : { maxTwoDecimals: true };
  };
}

/** Date must be today (UTC calendar) or later. */
function notPastUtcDate(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return null;
    }
    const local = new Date(value);
    if (Number.isNaN(local.getTime())) {
      return { invalidDate: true };
    }
    const now = new Date();
    const todayUtc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const selected = Date.UTC(local.getFullYear(), local.getMonth(), local.getDate());
    return selected >= todayUtc ? null : { pastDate: true };
  };
}

/**
 * Copied from product-form.service.ts — offer fields + exam validators.
 */
@Injectable()
export class ProductOfferFormService {
  private fb = inject(FormBuilder);

  createProductOfferForm(): FormGroup {
    return this.fb.group({
      code: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
          Validators.pattern(/^OFF-/),
        ]
      ],
      productId: [
        null as number | null,
        [Validators.required]
      ],
      discountPercent: [
        null as number | null,
        [
          Validators.required,
          Validators.min(0.01),
          Validators.max(50),
          maxTwoDecimals(),
        ]
      ],
      validUntilUtc: [
        null as Date | null,
        [
          Validators.required,
          notPastUtcDate(),
        ]
      ],
    });
  }

  getErrorMessage(form: FormGroup, controlName: string): string {
    const control = form.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return 'This field is required';
    }
    if (errors['minlength']) {
      return `Minimum ${errors['minlength'].requiredLength} characters required`;
    }
    if (errors['maxlength']) {
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    }
    if (errors['pattern']) {
      return 'Code must start with OFF-';
    }
    if (errors['min']) {
      return `Minimum value is ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `Maximum value is ${errors['max'].max}`;
    }
    if (errors['maxTwoDecimals']) {
      return 'At most 2 decimal places';
    }
    if (errors['pastDate'] || errors['invalidDate']) {
      return 'Date must be today or later';
    }

    return 'Invalid value';
  }
}
