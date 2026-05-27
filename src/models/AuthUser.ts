import { AvatarId } from '../constants/avatars';

export type AuthUser = {
  id: string;
  name: string;
  avatarId?: AvatarId;
};
