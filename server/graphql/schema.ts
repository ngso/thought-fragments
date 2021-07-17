import { join } from 'path';
import { makeSchema } from 'nexus';
import * as types from './resolvers';

export const schema = makeSchema({
  types,
  outputs: {
    schema: join(__dirname, '..', 'generated', 'schema.graphql'),
    typegen: join(__dirname, '..', 'generated', 'typegen.ts'),
  },
  contextType: {
    module: join(__dirname, 'context.ts'),
    export: 'Context',
  },
});
