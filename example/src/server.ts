import SequelizeAdapter from '@adminjs/sequelize';
import AdminJSExpress from '@adminjs/express';
import AdminJS from 'adminjs';
import express from 'express';
import { hash, verify } from 'argon2';

import { UserModel } from './user/user.model';
import { sequelize } from './sequelize';
import UserResource from './user/user.resource';
import LogResource from './log/log.resource';
import ItemResource from './item/item.resource';

AdminJS.registerAdapter(SequelizeAdapter);

const ADMIN = {
  email: 'test@example.com',
  password: 'password',
};

const createAdmin = async () => {
  const admin = await UserModel.findOne({
    where: { email: ADMIN.email },
  });

  if (admin) return;

  await UserModel.create({
    email: ADMIN.email,
    password: await hash(ADMIN.password),
  });
};

const start = async () => {
  await sequelize.sync({ force: true });
  await createAdmin();

  const app = express();

  const adminJs = new AdminJS({
    resources: [UserResource, LogResource, ItemResource],
    rootPath: '/admin',
  });

  const router = AdminJSExpress.buildAuthenticatedRouter(adminJs as any, {
    authenticate: async (email, password) => {
      const admin = await UserModel.findOne({ where: { email } });
      if (!admin) return null;

      if (await verify(admin.password, password)) {
        return admin;
      }

      return null;
    },
    cookiePassword: 'somasd1nda0asssjsdhb21uy3g',
    maxRetries: {
      count: 3,
      duration: 120,
    },
  });

  await adminJs.watch();

  app.use(adminJs.options.rootPath, router);

  const port = process.env.PORT ?? 8080;
  app.listen(port, () =>
    console.log(`AdminJS is running under localhost:${port}/admin`)
  );
};

start();
