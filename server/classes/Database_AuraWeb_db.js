// Import Sequelize
import Sequelize from "sequelize";
import InitSchema from "../models/schema_AuraWeb_db";
import UserModel from "../models/AuraWeb_db/UserModel";

// Logging
import Logger from "./Logger";
// Properties
import properties from "../properties.js";

class Database {
  constructor() {}

  /**
   * Init database
   */
  async init() {
    await this.authenticate();
    Logger.info(
      "Database connected at: " +
        properties.AuraWeb_db.host +
        ":" +
        properties.AuraWeb_db.port +
        "//" +
        properties.AuraWeb_db.user +
        "@" +
        properties.AuraWeb_db.name
    );

    // Import schema
    InitSchema();

    await UserModel.createAdminUser();

  }

  /**
   * Start database connection
   */
  async authenticate() {
    Logger.info("Authenticating to the databases...");

    const sequelize = new Sequelize(
      properties.AuraWeb_db.name,
      properties.AuraWeb_db.user,
      properties.AuraWeb_db.password,
      {
        host: properties.AuraWeb_db.host,
        dialect: properties.AuraWeb_db.dialect,
        port: properties.AuraWeb_db.port,
        logging: false
      }
    );
    this.dbConnection_AuraWeb_db = sequelize;

    try {
      await sequelize.sync();
    } catch (err) {
      // Catch error here
      Logger.error(`Failed connection to the DB`);
      Logger.error(err);
      await new Promise(resolve => setTimeout(resolve, 5000));
      await this.authenticate();
    }
  }

  /**
   * Get connection db
   */
  getConnection() {
    return this.dbConnection_AuraWeb_db;
  }
}

export default new Database();
