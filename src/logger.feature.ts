import { buildFeature, FeatureType } from 'adminjs';
import {
  createLogAction,
  LoggerPropertiesMapping,
  rememberInitialRecord,
} from './log.action';

/**
 * Feature configuration object
 *
 * @memberof module:@adminjs/logger
 * @alias LoggerFeatureOptions
 */
export type LoggerFeatureOptions = {
  /**
   * For the feature to work you must define a model using an ORM of your choice.
   * In case you want to use different attribute names, you can use this
   * options to configure the mapping.
   */
  propertiesMapping?: LoggerPropertiesMapping;
  /**
   * Log's resource name. Defaults to 'Log'.
   */
  resourceName?: string;
  /**
   * Usually a primary key which identifies the currently logged in user.
   */
  userIdAttribute?: string;
};

const loggerFeature = (options: LoggerFeatureOptions): FeatureType => {
  return buildFeature({
    actions: {
      new: {
        before: rememberInitialRecord,
        after: createLogAction({ onlyForPostMethod: true, options }),
      },
      edit: {
        before: rememberInitialRecord,
        after: createLogAction({ onlyForPostMethod: true, options }),
      },
      delete: {
        before: rememberInitialRecord,
        after: createLogAction({ options }),
      },
    },
  });
};

export default loggerFeature;
