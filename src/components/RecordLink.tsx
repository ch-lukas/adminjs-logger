import React, { FC } from 'react';
import { BasePropertyProps, ViewHelpers } from 'adminjs';
import { FormGroup, Link } from '@adminjs/design-system';

const viewHelpers = new ViewHelpers();
const RecordLink: FC<BasePropertyProps> = ({ record }) => {
  if (!record?.params) {
    return null;
  }

  const { recordId, resource, recordTitle } = record?.params;
  if (!recordId || !resource) {
    return null;
  }

  return (
    <FormGroup>
      <Link
        href={viewHelpers.recordActionUrl({
          actionName: 'show',
          recordId,
          resourceId: resource,
        })}
      >
        {recordTitle}
      </Link>
    </FormGroup>
  );
};

export default RecordLink;
