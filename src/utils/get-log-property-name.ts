import { LoggerPropertiesMapping } from './../log.action';

export const getLogPropertyName = (
  property: string,
  mapping: LoggerPropertiesMapping = {}
) => {
  if (!mapping[property]) return property;
  return mapping[property];
};
