const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
{
    title:{
        type:String,
        required:true,
    },

    description:{
        type:String,
        default:"",
    },

    roomId:{
        type:String,
        required:true,
    },

    date:{
        type:String,
        required:true,
    },

    time:{
        type:String,
        required:true,
    },

    participants:{
        type:[String],
        default:[],
    },

    createdBy:{
        type:String,
        default:"Guest",
    }

},
{
    timestamps:true,
}
);

module.exports = mongoose.model("Schedule",scheduleSchema);