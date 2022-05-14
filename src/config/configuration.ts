import ormConfig from '../../ormconfig';

export default async () => ({
  databaseOptions: ormConfig,
});
