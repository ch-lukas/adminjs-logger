import { FeatureType, ResourceWithOptions } from 'adminjs';
import { ItemModel } from './item.model';
import loggerFeature from '../../../src';
import loggerConfig from '../logger.config';

const ItemResource: ResourceWithOptions = {
  resource: ItemModel,
  options: {
    editProperties: ['name', 'description'],
  },
  features: [loggerFeature(loggerConfig) as FeatureType],
};

export default ItemResource;
