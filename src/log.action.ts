import { ActionResponse, After, Before, flat } from 'adminjs';
import { merge } from 'lodash';

import { difference } from './utils/difference';
import { getLogPropertyName } from './utils/get-log-property-name';
import { LoggerFeatureOptions } from './logger.feature';

export const rememberInitialRecord: Before = async (request, context) => {
  const id = context.record?.id();

  context.initialRecord = id ? await context.resource.findOne(id) : {};
  return request;
};

/**
 * Mapping object for Log model
 *
 * @memberof module:@adminjs/logger
 * @alias LoggerPropertiesMapping
 */
export type LoggerPropertiesMapping = {
  /**
   * Primary key of your Log model
   */
  id?: string;
  /**
   * Field to store logged record's id
   */
  recordId?: string;
  /**
   * Field to store logged record's title
   */
  recordTitle?: string;
  /**
   * Field to store changes between actions. This has to be a text type field
   * or JSON/JSONB for databases which support this type
   */
  difference?: string;
  /**
   * Field to store the id of the user who triggered the action
   */
  user?: string;
  /**
   * Field to store the action's name
   */
  action?: string;
  /**
   * Field to store the resource's name
   */
  resource?: string;
  /**
   * Timestamp field indicating when the log has been created
   */
  createdAt?: string;
  /**
   * Timestamp field indicating when the log has been updated
   */
  updatedAt?: string;
};

export type CreateLogActionParams = {
  onlyForPostMethod?: boolean;
  options?: LoggerFeatureOptions;
};

const getRecordTitle = modifiedRecord => {
  switch (typeof modifiedRecord.title) {
    case 'string':
      return modifiedRecord.title;
    case 'function':
      return modifiedRecord.title();
  }
  return (
    Object.values(modifiedRecord).find(v => typeof v === 'string') ?? 'No title'
  );
};

export const createLogAction =
  ({
    onlyForPostMethod = false,
    options = {},
  }: CreateLogActionParams = {}): After<ActionResponse> =>
  async (response, request, context) => {
    const {
      resourceName = 'Log',
      propertiesMapping = {},
      userIdAttribute,
    } = options ?? {};
    const { currentAdmin, _admin } = context;
    const { params, method } = request;
    const Log = _admin.findResource(resourceName);
    const ModifiedResource = _admin.findResource(params.resourceId);

    if (!params.recordId || (onlyForPostMethod && method !== 'post')) {
      return response;
    }

    let adminId;
    if (userIdAttribute) adminId = currentAdmin?.[userIdAttribute];
    else adminId = currentAdmin?.id ?? currentAdmin?._id ?? currentAdmin;

    try {
      const modifiedRecord = merge(
        JSON.parse(JSON.stringify(context.record)),
        await ModifiedResource.findOne(params.recordId)
      );
      if (!modifiedRecord) {
        return response;
      }

      const newParamsToCompare =
        params.action === 'delete'
          ? {}
          : flat.flatten<any, any>(
              JSON.parse(JSON.stringify(modifiedRecord.params))
            );
      await Log.create({
        [getLogPropertyName('recordTitle', propertiesMapping)]:
          getRecordTitle(modifiedRecord),
        [getLogPropertyName('resource', propertiesMapping)]: params.resourceId,
        [getLogPropertyName('action', propertiesMapping)]: params.action,
        [getLogPropertyName('recordId', propertiesMapping)]:
          params.recordId ?? typeof modifiedRecord.id === 'string'
            ? modifiedRecord.id
            : modifiedRecord.id?.(),
        [getLogPropertyName('user', propertiesMapping)]: adminId,
        [getLogPropertyName('difference', propertiesMapping)]: JSON.stringify(
          difference(
            newParamsToCompare,
            flat.flatten(
              JSON.parse(JSON.stringify(context.initialRecord.params))
            )
          )
        ),
      });
    } catch (e) {
      console.error(e);
    }
    return response;
  };
