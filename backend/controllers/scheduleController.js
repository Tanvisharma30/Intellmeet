const Schedule = require("../models/Schedule");



// CREATE
exports.createSchedule = async (req,res)=>{

    try{

        const meeting = await Schedule.create(req.body);

        res.status(201).json(meeting);

    }

    catch(err){

        res.status(500).json({
            error:err.message,
        });

    }

};




// GET ALL
exports.getSchedules = async(req,res)=>{

    try{

        const meetings = await Schedule.find().sort({
            createdAt:-1,
        });

        res.json(meetings);

    }

    catch(err){

        res.status(500).json({
            error:err.message,
        });

    }

};




// DELETE

exports.deleteSchedule = async(req,res)=>{

    try{

        await Schedule.findByIdAndDelete(req.params.id);

        res.json({
            message:"Deleted"
        });

    }

    catch(err){

        res.status(500).json({
            error:err.message,
        });

    }

};