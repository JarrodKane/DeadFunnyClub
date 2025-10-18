export const IconType = {
  Youtube: 'youtube',
  Instagram: 'instagram',
  Onlyfans: 'onlyfans',
  Tiktok: 'tiktok',
  Github: 'github',
  Tickets: 'tickets'
} as const;

export type IconType = typeof IconType[keyof typeof IconType];