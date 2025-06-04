import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsStringOrNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStringOrNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          return typeof value === 'string' || typeof value === 'number';
        },
        defaultMessage(_args: ValidationArguments) {
          return '$property phải là kiểu dữ liệu chuỗi hoặc số';
        },
      },
    });
  };
}
