const router = require("express").Router();
const userController = require("../Controllers/userController");

router.post("/login", userController.login); //Login
router.post("/createNewItem", userController.addNewItem); // Add Item
router.get("/fetchItemList", userController.getItemData); // item List
router.post("/updateItems", userController.updateItemDetails); // Update Item
router.get("/fetchItems", userController.getItemList); // Order item List
router.post("/createNewSize", userController.addNewSize); // create new size
router.post("/updateSizes", userController.updateSizeDetails); // Update Sizes
router.get("/fetchSizeList", userController.getSizeData); // get Size List
router.get("/fetchSizeType", userController.getSizeType); // get size type List
router.post("/saveOrderData", userController.saveOrderDetails); // Update Sizes
router.get("/fetchOrderNumber", userController.getOrderNumber); // get order number
router.get("/fetchOrderList", userController.getOrderdata); // get order List
router.get("/fetchCustomerList", userController.getCustomerdata); // get Customer List
router.post("/createCustAccount", userController.addCustAccount); // add new Customer Account
router.post("/updateCustomer", userController.updateCustomerData); // Update Customer Account
router.get("/fetchCustomersList", userController.fetchCustomersDetails); // get Customers List
router.post("/assignCustBill", userController.assignCustomerBill); // assign Customer Bill

module.exports = router;
