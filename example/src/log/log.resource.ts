import { LogModel } from './log.model';
import { createLoggerResource } from '../../../src';
import loggerConfig from '../logger.config';

const LogResource = createLoggerResource({
  resource: LogModel,
  featureOptions: loggerConfig,
});

export default LogResource;
