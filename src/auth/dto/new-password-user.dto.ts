import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

// Custom Validator for Matching Passwords
@ValidatorConstraint({ name: 'Match', async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];
    return value === relatedValue;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must match ${args.constraints[0]}`;
  }
}

// Match Decorator
export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

// New Password DTO
export class NewPasswordDto {
  old_password(old_password: any) {
    throw new Error('Method not implemented.');
  }
  @IsString()
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(30, { message: 'Password must not exceed 30 characters' })
  @Matches(/(?=.*[a-z])/, {
    message: 'Password must contain at least one lowercase letter',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'Password must contain at least one uppercase letter',
  })
  @Matches(/(?=.*\d)/, { message: 'Password must contain at least one number' })
  @Matches(/(?=.*[\W_])/, {
    message: 'Password must contain at least one special character',
  })
  @Matches(/^\S*$/, { message: 'Password must not contain whitespace' })
  new_password: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Match('new_password', {
    message: 'Confirm password must match new password',
  })
  confirm_password: string;
}
