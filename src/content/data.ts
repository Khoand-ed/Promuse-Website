import { z } from 'zod';
import characters from '../../content/data/characters.json';
import features from '../../content/data/features.json';
import gameplay from '../../content/data/gameplay.json';
import hero from '../../content/data/hero.json';
import reward from '../../content/data/reward.json';
import site from '../../content/data/site.json';
import story from '../../content/data/story.json';
import {
  charactersSchema,
  featuresSchema,
  gameplaySchema,
  heroSchema,
  rewardSchema,
  siteSchema,
  storySchema,
} from './schemas/data.ts';

function load<T extends z.ZodType>(name: string, schema: T, source: unknown): () => z.infer<T> {
  let value: z.infer<T> | undefined;
  return () => {
    if (value === undefined) {
      const result = schema.safeParse(source);
      if (!result.success) {
        throw new Error(
          `content/data/${name}.json is invalid. Run "npm run check:content" for details.\n${z.prettifyError(result.error)}`,
        );
      }
      value = result.data;
    }
    return value;
  };
}

export const getSite = load('site', siteSchema, site);
export const getHero = load('hero', heroSchema, hero);
export const getReward = load('reward', rewardSchema, reward);
export const getStory = load('story', storySchema, story);
export const getFeatures = load('features', featuresSchema, features);
export const getGameplay = load('gameplay', gameplaySchema, gameplay);
export const getCharacters = load('characters', charactersSchema, characters);
