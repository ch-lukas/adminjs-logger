import { DataTypes, Model, Optional } from 'sequelize';

import { sequelize } from '../sequelize';

type Item = {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

type ItemCreationAttributes = Optional<Item, 'id' | 'createdAt' | 'updatedAt'>;

export class ItemModel extends Model<Item, ItemCreationAttributes> {
  declare id: number;
  declare name: string;
  declare description: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

ItemModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: new DataTypes.STRING(128),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    tableName: 'items',
    modelName: 'Item',
    timestamps: true,
  }
);
