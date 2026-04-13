import { SetMetadata } from '@nestjs/common';

export enum UserRole {
  CUSTOMER = 'customer',
  VENDOR_OWNER = 'vendor_owner',
  RIDER = 'rider',
  ADMIN = 'admin',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
