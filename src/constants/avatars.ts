export const avatarOptions = [
  { id: 'female-1', label: 'Feminino 1', emoji: '👩🏻' },
  { id: 'female-2', label: 'Feminino 2', emoji: '👩🏽‍🦱' },
  { id: 'female-3', label: 'Feminino 3', emoji: '👩🏿‍🦰' },
  { id: 'male-1', label: 'Masculino 1', emoji: '👨🏻' },
  { id: 'male-2', label: 'Masculino 2', emoji: '👨🏽‍🦱' },
  { id: 'male-3', label: 'Masculino 3', emoji: '👨🏿‍🦰' },
] as const;

export type AvatarId = (typeof avatarOptions)[number]['id'];

export const defaultAvatarId: AvatarId = 'female-1';

export function getAvatarOption(avatarId?: string) {
  return avatarOptions.find((avatar) => avatar.id === avatarId) ?? avatarOptions[0];
}
