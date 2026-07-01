const express = require("express");

const router = express.Router();

const scheduleController = require("../controllers/scheduleController");



// CREATE
router.post(
"/",
scheduleController.createSchedule
);


// GET
router.get(
"/",
scheduleController.getSchedules
);


// DELETE
router.delete(
"/:id",
scheduleController.deleteSchedule
);



module.exports = router;