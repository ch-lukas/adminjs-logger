import { isEqual, transform } from 'lodash';

export const difference = (
  object: Record<string, string>,
  base: Record<string, string>
): Record<string, { before: string; after: string }> =>
  transform(
    { ...object, ...base },
    (
      result: Record<string, { before: string; after: string }>,
      value: string,
      key: string
    ) => {
      if (!isEqual(object[key], base[key])) {
        result[key] = {
          before: base[key],
          after: object[key],
        };
      }
    }
  );
