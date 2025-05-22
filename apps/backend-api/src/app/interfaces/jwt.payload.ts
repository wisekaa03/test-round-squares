import type { JwtPayload } from 'jsonwebtoken';

import { UserEntity } from '@api/database/user.entity';

export const JWT_BASE_OPTIONS = {};

export interface RoundSquaresJwtPayload extends JwtPayload {
  sub?: UserEntity['id'];
  name?: UserEntity['name'];
  role?: UserEntity['role'];
}
