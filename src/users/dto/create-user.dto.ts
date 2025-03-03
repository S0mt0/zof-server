import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional,
  MinLength,
  IsStrongPassword,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { AccountType } from '../../lib';

@ValidatorConstraint({ name: 'IsTrue', async: false })
export class IsTrueConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    const object = args.object as any;
    const accountType = object.account_type;

    // Only enforce 'true' for account_type 'user'
    if (accountType === 'user') {
      return value === true;
    }
    // For 'admin', terms_of_service can be true or false
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Please accept our terms of service to continue.';
  }
}

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  first_name: string;

  @IsString()
  account_type: AccountType;

  @IsString()
  @MinLength(3)
  last_name: string;

  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsBoolean()
  @Validate(IsTrueConstraint, {
    message: 'Please accept our terms of service to continue.',
  })
  terms_of_service: boolean;

  @IsString()
  @IsStrongPassword({ minLength: 6 })
  password?: string;
}
