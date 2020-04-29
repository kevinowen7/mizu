const express = require("express")
const router = express.Router()
const adminController = require("../controller/adminController")
const cookieParser = require('cookie-parser');


router.get("/", adminController.index)
router.get("/register", adminController.register)
router.post("/login", adminController.login_post)
router.post("/register", adminController.register_post)
router.get("/logout", adminController.logout)

router.get("/dashboard", adminController.dashboard)
router.get("/get_graph", adminController.getGraphData)
router.get("/get_order_today", adminController.getTotalOrderToday)
router.get("/get_profit_today", adminController.getTotalProfitToday)
router.get("/get_gallon_today", adminController.getTotalGallonToday)
router.post("/set_finish", adminController.setFinish)
router.post("/set_cancel", adminController.setCancel)

router.get("/history", adminController.history)

router.get("/stock", adminController.stock)
router.post("/stock", adminController.add_stock)
router.post("/stock_edit", adminController.edit_stock)
router.post("/stock_delete", adminController.remove_stock)

module.exports = router
