/**
 * 
 * 
  _____                      _              _ _ _     _   _     _        __ _ _      
 |  __ \                    | |            | (_) |   | | | |   (_)      / _(_) |     
 | |  | | ___    _ __   ___ | |_    ___  __| |_| |_  | |_| |__  _ ___  | |_ _| | ___ 
 | |  | |/ _ \  | '_ \ / _ \| __|  / _ \/ _` | | __| | __| '_ \| / __| |  _| | |/ _ \
 | |__| | (_) | | | | | (_) | |_  |  __/ (_| | | |_  | |_| | | | \__ \ | | | | |  __/
 |_____/ \___/  |_| |_|\___/ \__|  \___|\__,_|_|\__|  \__|_| |_|_|___/ |_| |_|_|\___|
 
 * DO NOT EDIT THIS FILE!! 
 * 
 *  TO CUSTOMIZE UserModelGenerated.js PLEASE EDIT ../UserModel.js
 * 
 *  -- THIS FILE WILL BE OVERWRITTEN ON THE NEXT SKAFFOLDER'S CODE GENERATION --
 * 
 */
// Database
import Database from "../../../classes/Database_AuraWeb_db";
import Sequelize from "sequelize";
import RolesModel from "../RolesModel";

// Logger
import Logger from "../../../classes/Logger";

const generatedModel = {

  // Start queries
    

  // CRUD METHODS

  
  /**
  * UserModel.create
  *   @description CRUD ACTION create
  *
  */
  async create(item) {
    let result = await Database.getConnection().models.User.create(item);

    // Create roles
    var roles = [];
    for (let i in item.roles) {
      let roleDb = await Database.getConnection().models.Roles.findOrCreate({
        where: {
          role: item.roles[i],
          _user: result._id
        }
      });
      roles.push(roleDb[0].dataValues._id);
    }

    result.setRoles(roles);
    return result;
  },
  
  /**
  * UserModel.delete
  *   @description CRUD ACTION delete
  *   @param ObjectId id Id
  *
  */
  async delete(id) {
    return await Database.getConnection().models.User.destroy({ where: { _id: id } });
  },
  
  /**
  * UserModel.get
  *   @description CRUD ACTION get
  *   @param ObjectId id Id resource
  *
  */
  async get(id) {
    let result = await Database.getConnection().models.User.findByPk(id, {
      attributes: {
        exclude: ["password"]
      }
    });

    // Find roles
    let roles = await result.getRoles({ raw: true });
    result.dataValues.roles = roles.map(item => item.role);
    return result;
  },
  
  /**
  * UserModel.list
  *   @description CRUD ACTION list
  *
  */
  async list() { 
    let list = await Database.getConnection().models.User.findAll(
      {
        raw: true
      },
      {
        attributes: {
          exclude: ["password"]
        }
      }
    );

    // Find roles
    for (let i in list) {
      let roles = await Database.getConnection().models.Roles.findAll({
        where: {
          _user: list[i]._id
        },
        raw: true
      });
      list[i].roles = roles.map(item => item.role);
    }

    return list;
  },
  
  /**
  * UserModel.update
  *   @description CRUD ACTION update
  *   @param ObjectId id Id
  *
  */
  async update(item) { 
    delete item.password;

    let result = await Database.getConnection().models.User.update(item, {
      where: { _id: item._id }
    });
    // Update roles
    result = await Database.getConnection().models.User.findByPk(item._id);
    var roles = [];
    for (let i in item.roles) {
      let roleDb = await Database.getConnection().models.Roles.findOrCreate({
        where: {
          role: item.roles[i],
          _user: item._id
        }
      });
      roles.push(roleDb[0].dataValues._id);
    }

    result.setRoles(roles);
    return result;
  },
  



  // Start custom queries User

  /**
   * Get User by username e password
   */
  getByUsernameAndPassword: async (username, password) => {
    // CUSTOMIZE THIS FUNCTION
    // if you want to change login method

    let user = await Database.getConnection().models.User.findOne({
      where: {
        username: username,
        password: password
      },
      raw: true
    });
    if (user) {
      user.password = undefined;

      let roles = await Database.getConnection().models.Roles.findAll({
        where: {
          _user: user._id
        },
        raw: true
      });
      user.roles = roles.map(item => item.role);
    }

    return user;
  },

  /**
   * Update password
   */
  updatePassword: async (idUser, password) => {
    let user = await Database.getConnection().models.User.update(
      {
        password: password
      },
      {
        where: { _id: idUser }
      }
    );
    return user;
  },

  /**
   * Create ADMIN user if it not exists
   */
  createAdminUser: async () => {
    const count = await Database.getConnection().models.User.count();
    if (count == 0) {
      Logger.info("Create admin user");
      var admin = {
        username: "admin",
        password:
          "62f264d7ad826f02a8af714c0a54b197935b717656b80461686d450f7b3abde4c553541515de2052b9af70f710f0cd8a1a2d3f4d60aa72608d71a63a9a93c0f5",
        roles: ["ADMIN"]
      };
      let res = await Database.getConnection().models.User.create(admin);

      let role = {
        role: "ADMIN",
        _user: res._id
      };
      await Database.getConnection().models.Roles.create(role);
    }
  }
};

export default generatedModel;
