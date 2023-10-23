import { config } from '../../config';

export const typeChoices = config.typeChoices;
export type Types = (typeof typeChoices)[number];

export const templateChoices = config.templateChoices.block;
export type Templates = (typeof templateChoices)[number] | 'default';
