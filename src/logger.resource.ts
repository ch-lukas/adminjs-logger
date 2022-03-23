import { ResourceWithOptions } from 'adminjs';
import { LoggerFeatureOptions } from '.';
import { bundleComponents } from './components/bundle';
import { getLogPropertyName } from './utils/get-log-property-name';

const { RECORD_DIFFERENCE, RECORD_LINK } = bundleComponents();

export const createLoggerResource = ({
  resource,
  featureOptions,
}: {
  resource: unknown;
  featureOptions?: LoggerFeatureOptions;
}): ResourceWithOptions => {
  const { propertiesMapping = {}, resourceName } = featureOptions ?? {};

  return {
    resource,
    options: {
      id: resourceName,
      sort: {
        direction: 'desc',
        sortBy: getLogPropertyName('createdAt', propertiesMapping),
      },
      listProperties: [
        getLogPropertyName('user', propertiesMapping),
        getLogPropertyName('recordId', propertiesMapping),
        getLogPropertyName('resource', propertiesMapping),
        getLogPropertyName('action', propertiesMapping),
        getLogPropertyName('createdAt', propertiesMapping),
      ],
      actions: {
        edit: { isAccessible: false },
        new: { isAccessible: false },
        delete: { isAccessible: false },
        show: {
          showInDrawer: true,
          containerWidth: '700px',
        },
      },
      properties: {
        [getLogPropertyName('id', propertiesMapping)]: {
          isVisible: {
            list: false,
          },
        },
        [getLogPropertyName('difference', propertiesMapping)]: {
          components: {
            show: RECORD_DIFFERENCE,
          },
          position: 110,
        },
        [getLogPropertyName('recordId', propertiesMapping)]: {
          components: {
            list: RECORD_LINK,
            show: RECORD_LINK,
          },
        },
        [getLogPropertyName('updatedAt', propertiesMapping)]: {
          isVisible: false,
        },
      },
    },
  };
};
