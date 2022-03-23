import { ResourceWithOptions } from 'adminjs';
import { UserModel } from './user.model';

const isDisabled = { isAccessible: false };

const UserResource: ResourceWithOptions = {
  resource: UserModel,
  options: {
    listProperties: ['id', 'email'],
    showProperties: ['id', 'email', 'createdAt', 'updatedAt'],
    actions: {
      edit: isDisabled,
      new: isDisabled,
      delete: isDisabled,
    },
  },
};

export default UserResource;
