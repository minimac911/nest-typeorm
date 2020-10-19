import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConnectionOptions, getConnectionOptions } from 'typeorm';

export const createTypeormConn = async (): Promise<TypeOrmModuleOptions> => {
  const connectionOptions: ConnectionOptions = await getConnectionOptions(
    process.env.NODE_EVN,
  );
  return connectionOptions;
};
