const User = require("../Models/user");
const Item = require("../Models/item");
const Size = require("../Models/size");
const Order = require("../Models/order");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types;
const moment = require("moment-timezone");
const dotenv = require("dotenv");
dotenv.config();

async function getGenOrder() {
  let orderNo = "";
  var result = "";
  var characters =
    "A0B1C2D3E4F5G6H7I8J9K10L11M12N13O15P16Q17R18S19T20U21V22W23X24Y2Z26";
  var charactersLength = characters.length;
  for (var i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  orderNo = "CV" + result;
  const data = await Order.find();
  data.forEach((val) => {
    if (val.orderNo === orderNo) {
      getGenOrder();
    }
  });
  return orderNo;
}

module.exports = {
  async login(req, res) {
    try {
      const user = await User.findOne({
        email: req.body.email,
        status: 1,
      });
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res.status(400).send({ error: "Password is invalid" });
      }
      if (!user) {
        return res.status(400).send({
          error: "Email is invalid",
        });
      }
      const token = await jwt.sign({ id: user._id }, process.env.TOKEN_JWT, {
        expiresIn: "60000d",
      });

      const adminLoginUpdate = await User.findOneAndUpdate(
        { email: req.body.email, status: 1 },
        { $set: { token: token } },
        { new: true }
      );

      res.setHeader("x-auth-token", token);
      res.status(200).send({
        message: "Login successfully",
        data: adminLoginUpdate,
        token,
      });
    } catch (error) {
      return res
        .status(500)
        .send({ error: error.messsage, message: "something went wrong" });
    }
  },

  async addNewItem(req, res) {
    try {
      if (req.body.subTypeId === "") {
        delete req.body.subTypeId;
      }
      const item = await Item.create(req.body);
      return res.status(200).send({
        message: "Item Created Successfully!",
        data: item,
      });
    } catch (error) {
      return res.status(400).json({
        error: "There is an error!",
      });
    }
  },

  async getItemData(req, res, next) {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skipIndex = (page - 1) * limit;
      const results = {};
      results.results = await Item.find()
        .populate({
          path: "subTypeId",
          select: "id name",
        })
        .sort({ _id: 1 })
        .limit(limit)
        .skip(skipIndex)
        .exec();
      res.paginatedResults = results;
      const total = await Item.find().count();
      res.send({
        message: "Item data got successfully",
        data: results,
        total,
      });
      next();
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async updateItemDetails(req, res) {
    try {
      const itemData = await User.findById(req.body.id);
      const updated = await Item.findOneAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            name: req.body.name ? req.body.name : itemData.name,
            subTypeId: req.body?.subTypeId
              ? req.body?.subTypeId
              : itemData?.subTypeId,
            price: req.body.price ? req.body.price : itemData.price,
            type: req.body.type ? req.body.type : itemData.type,
          },
        },
        { new: true }
      );
      return res.status(200).send({
        message: "Item updated Successfully!",
        data: updated,
      });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async getItemList(req, res) {
    try {
      var finalArr = [];
      const data = await Item.find().populate({
        path: "subTypeId",
        select: "id name",
      });
      data.forEach((val) => {
        let value =
          val.subTypeId !== null
            ? val.name + " - " + val.subTypeId.name
            : val.name;
        let label =
          val.subTypeId !== null
            ? val.name + " - " + val.subTypeId.name
            : val.name;
        let id = val._id;
        let price = val.price;
        let type = val.type;
        finalArr.push({
          value: value,
          label: label,
          id: id,
          price: price,
          type: type,
          quantity: 1,
        });
      });
      res.send({ message: "Item List data got successfully", data: finalArr });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async addNewSize(req, res) {
    try {
      const size = await Size.create(req.body);
      return res.status(200).send({
        message: "Size Created Successfully!",
        data: size,
      });
    } catch (error) {
      return res.status(400).json({
        error: "There is an error!",
      });
    }
  },

  async updateSizeDetails(req, res) {
    try {
      const updated = await Size.findOneAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            name: req.body.name,
          },
        },
        { new: true }
      );
      return res.status(200).send({
        message: "Size updated Successfully!",
        data: updated,
      });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async getSizeData(req, res) {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skipIndex = (page - 1) * limit;
      const results = {};
      results.results = await Size.find()
        .sort({ _id: 1 })
        .limit(limit)
        .skip(skipIndex)
        .exec();
      res.paginatedResults = results;
      const total = await Size.find().count();
      return res.send({
        message: "Size data got successfully",
        data: results,
        total,
      });
      next();
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async getSizeType(req, res) {
    try {
      var finalArr = [];
      const data = await Size.find();
      data.forEach((val) => {
        let value = val.name;
        let label = val.name;
        let id = val._id;
        finalArr.push({
          value: value,
          label: label,
          id: id,
        });
      });
      res.send({ message: "Size List data got successfully", data: finalArr });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  async saveOrderDetails(req, res) {
    try {
      let OrderArr = {
        orderNo: req.query.orderNo,
        billAmount: req.query.billAmount,
      };
      const order = await Order.create(OrderArr);
      const checkId = await Order.findById(order._id);
      let orderItemArr = checkId.orderItem;
      orderItemArr = req.body;
      const updateOrder = await Order.findOneAndUpdate(
        { _id: order._id },
        { $set: { orderItem: orderItemArr } },
        { new: true }
      );
      return res.status(200).send({
        message: "Order Created Successfully!",
        data: updateOrder,
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  async getOrderNumber(req, res) {
    try {
      let result = await getGenOrder();
      res.status(200).send({
        message: "Order Number got Successfully!",
        data: result,
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  async getOrderdata(req, res) {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skipIndex = (page - 1) * limit;
      const results = {};
      results.results = await Order.find()
        .populate({
          path: "orderItem.itemId",
          select: "id name price",
        })
        .sort({ _id: 1 })
        .limit(limit)
        .skip(skipIndex)
        .exec();
      res.paginatedResults = results;
      const total = await Order.find().count();
      return res.send({
        message: "Order data got successfully",
        data: results,
        total,
      });
      next();
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  async getCustomerdata(req, res) {
    try {
      const page = parseInt(req.query.page);
      const limit = parseInt(req.query.limit);
      const skipIndex = (page - 1) * limit;
      const results = {};
      results.results = await User.find({ type: "CUSTOMER" })
        .sort({ _id: 1 })
        .limit(limit)
        .skip(skipIndex)
        .exec();
      res.paginatedResults = results;
      const total = await User.find({ type: "CUSTOMER" }).count();
      return res.send({
        message: "Customer data got successfully",
        data: results,
        total,
      });
      next();
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  async addCustAccount(req, res) {
    try {
      const user = await User.create(req.body);
      return res.status(200).send({
        message: "User Created Successfully!",
        data: user,
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  async updateCustomerData(req, res) {
    try {
      const userdata = await User.findById(req.body.id);
      const updated = await User.findOneAndUpdate(
        { _id: req.body.id },
        {
          $set: {
            firstName: req.body.firstName
              ? req.body.firstName
              : userdata.firstName,
            lastName: req.body.shareCharge
              ? req.body.shareCharge
              : userdata.shareCharge,
            mobile: req.body.mobile ? req.body.mobile : userdata.mobile,
            creditAmount: req.body.creditAmount
              ? req.body.creditAmount
              : userdata.creditAmount,
          },
        },
        { new: true }
      );
      return res.status(200).send({
        message: "Customer updated Successfully!",
        data: updated,
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  async fetchCustomersDetails(req, res) {
    try {
      var finalArr = [];
      const data = await User.find({ type: "CUSTOMER" });
      for (const val of data) {
        let value = val.firstName + " " + val.lastName;
        let label = val.firstName + " " + val.lastName;
        let id = val._id;
        finalArr.push({
          value: value,
          label: label,
          id: id,
        });
      }
      return res.send({
        message: "Customers data got successfully",
        data: finalArr,
      });
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },

  async assignCustomerBill(req, res) {
    try {
      const userdata = await User.findById(req.body.custId);
      let bill = userdata.creditAmount + req.body.totalPrice;
      const updated = await User.findOneAndUpdate(
        { _id: req.body.custId },
        {
          $set: {
            creditAmount: bill,
          },
        },
        { new: true }
      );
      return res.status(200).send({
        message: "Bill Assign to customer Successfully!",
        data: updated,
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  },
};
