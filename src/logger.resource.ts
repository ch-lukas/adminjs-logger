import { ResourceWithOptions } from 'adminjs';
import { bundleComponents } from './components/bundle';

const { RECORD_DIFFERENCE, RECORD_LINK } = bundleComponents();

export const createLoggerResource = ({
  resource,
}: {
  resource: unknown;
}): ResourceWithOptions => ({
  resource,
  options: {
    sort: {
      direction: 'desc',
      sortBy: 'createdAt',
    },
    listProperties: ['user', 'recordId', 'resource', 'action', 'createdAt'],
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
      _id: {
        isVisible: {
          list: false,
        },
      },
      difference: {
        components: {
          show: RECORD_DIFFERENCE,
        },
        position: 110,
      },
      recordId: {
        components: {
          list: RECORD_LINK,
          show: RECORD_LINK,
        },
      },
      updatedAt: {
        isVisible: false,
      },
    },
  },
});
