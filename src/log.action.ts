import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  After,
  Before,
  flat,
} from 'adminjs';

import { difference } from './utils/difference';
import { getLogPropertyName } from './utils/get-log-property-name';
import { LoggerFeatureOptions } from './logger.feature';

export const rememberInitialRecord: Before = async (
  request: ActionRequest,
  context: ActionContext
) => {
  if (request.params.action === 'bulkDelete') {
    context.initialRecords = request.query?.recordIds
      ? await context.resource.findMany(request.query.recordIds.split(','))
      : [];
  } else {
    const id = context.record?.id();
    context.initialRecord = id ? await context.resource.findOne(id) : {};
  }

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
    const { records, record } = context;
    const { params, method } = request;

    if (
      (onlyForPostMethod && method !== 'post') ||
      Object.keys(record?.errors || {}).length
    ) {
      return response;
    }

    const persistLog = createPersistLogAction(request, context, options);

    if (request.params.action === 'bulkDelete') {
      await Promise.all(
        (records || []).map(async record => {
          const recordId = (await record.params).id;
          await persistLog(
            recordId,
            record,
            context.initialRecords.find(r => {
              return r.params.id === recordId;
            })
          );
        })
      );
    } else {
      const recordId =
        params.recordId ||
        (typeof record?.params?.id === 'string'
          ? record?.params?.id
          : record?.params?.id?.());
      if (recordId) {
        await persistLog(recordId, context.record, context.initialRecord);
      }
    }

    return response;
  };

const createPersistLogAction =
  (request, context, options) => async (recordId, record, initialRecord) => {
    const { currentAdmin, _admin } = context;
    const { params } = request;
    const {
      resourceName = 'Log',
      propertiesMapping = {},
      userIdAttribute,
    } = options ?? {};

    const Log = _admin.findResource(resourceName);
    const ModifiedResource = _admin.findResource(params.resourceId);

    const adminId = userIdAttribute
      ? currentAdmin?.[userIdAttribute]
      : currentAdmin?.id ?? currentAdmin?._id ?? currentAdmin;

    try {
      const modifiedRecord = await ModifiedResource.findOne(recordId);
      if (!modifiedRecord) {
        return;
      }

      const newParamsToCompare = ['delete', 'bulkDelete'].includes(
        params.action
      )
        ? {}
        : flat.flatten<object, object>(
            JSON.parse(JSON.stringify(modifiedRecord.params))
          );

      await Log.create({
        [getLogPropertyName('recordTitle', propertiesMapping)]:
          getRecordTitle(modifiedRecord),
        [getLogPropertyName('resource', propertiesMapping)]: params.resourceId,
        [getLogPropertyName('action', propertiesMapping)]: params.action,
        [getLogPropertyName('recordId', propertiesMapping)]: recordId,
        [getLogPropertyName('user', propertiesMapping)]: adminId,
        [getLogPropertyName('difference', propertiesMapping)]: JSON.stringify(
          difference(
            newParamsToCompare,
            flat.flatten(
              initialRecord?.params
                ? JSON.parse(JSON.stringify(await initialRecord.params))
                : {}
            )
          )
        ),
      });
    } catch (e) {
      console.error(e);
    }
  };
