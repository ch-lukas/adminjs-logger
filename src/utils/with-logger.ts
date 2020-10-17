import { Action, ActionResponse, After, Before } from 'admin-bro';
import { createLogAction, rememberInitialRecord } from '../log.action';

export const withLogger = (
  action: Partial<Action<ActionResponse>>,
  { onlyForPostMethod }: { onlyForPostMethod: boolean } = {
    onlyForPostMethod: false,
  }
): Partial<Action<ActionResponse>> => ({
  ...action,
  before: (Array.isArray(action.before)
    ? [...action.before, rememberInitialRecord]
    : [action.before, rememberInitialRecord]
  ).filter(Boolean) as Before[],
  after: (Array.isArray(action.after)
    ? [...action.after, createLogAction({ onlyForPostMethod })]
    : [action.after, createLogAction({ onlyForPostMethod })]
  ).filter(Boolean) as After<ActionResponse>[],
});
