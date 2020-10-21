import { buildFeature, FeatureType } from 'admin-bro';
import { createLogAction, rememberInitialRecord } from './log.action';

const loggerFeature = (): FeatureType => {
  return buildFeature({
    actions: {
      new: {
        before: rememberInitialRecord,
        after: createLogAction({ onlyForPostMethod: true }),
      },
      edit: {
        before: rememberInitialRecord,
        after: createLogAction({ onlyForPostMethod: true }),
      },
      delete: {
        before: rememberInitialRecord,
        after: createLogAction(),
      },
    },
  });
};

export default loggerFeature;
