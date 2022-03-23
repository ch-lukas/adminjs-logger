/**
 * @module @adminjs/logger
 * @subcategory Features
 * @section modules
 */

import loggerFeature from './logger.feature';

export { createLoggerResource } from './logger.resource';
export { withLogger } from './utils/with-logger';
export { bundleComponents } from './components/bundle';
export { LoggerFeatureOptions } from './logger.feature';
export { LoggerPropertiesMapping } from './log.action';

export default loggerFeature;
