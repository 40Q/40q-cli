export const typeChoices = ['block'] as const;
export type Types = (typeof typeChoices)[number];

export const templateChoices = ['section-header'] as const;
export type Templates = (typeof templateChoices)[number] | 'default';
