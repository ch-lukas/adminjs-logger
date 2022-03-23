module.exports = {
  development: {
    dialect: process.env.SEQUELIZE_TYPE || 'postgres',
    username: process.env.SEQUELIZE_USERNAME || 'postgres',
    password: process.env.SEQUELIZE_PASSWORD,
    host: process.env.SEQUELIZE_HOST || 'localhost',
    port: +process.env.SEQUELIZE_PORT || 5432,
    database: process.env.SEQUELIZE_DATABASE || 'adminjs_example',
  }
}
