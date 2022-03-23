import {
  DataTypes,
  Model,
  Optional,
  NonAttribute,
  HasOneGetAssociationMixin,
  Association,
} from 'sequelize';

import { sequelize } from '../sequelize';
import { UserModel } from '../user/user.model';

type Log = {
  id: number;
  recordId: number;
  recordTitle: string;
  difference: Record<string, any>;
  userId: number;
  action: string;
  resource: string;
  createdAt: Date;
  updatedAt: Date;
};

type LogCreationAttributes = Optional<Log, 'id' | 'createdAt' | 'updatedAt'>;

export class LogModel extends Model<Log, LogCreationAttributes> {
  declare id: number;
  declare recordId: number;
  declare recordTitle: string;
  declare difference: Record<string, any>;
  declare userId: number;
  declare action: string;
  declare resource: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare user?: NonAttribute<UserModel>;

  declare getUser: HasOneGetAssociationMixin<UserModel>;

  declare static associations: {
    user: Association<UserModel>;
  };
}

LogModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    resource: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recordId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    recordTitle: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    difference: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'logs',
    modelName: 'Log',
    timestamps: true,
  }
);

LogModel.belongsTo(UserModel, {
  foreignKey: 'userId',
  targetKey: 'id',
  as: 'user',
});
