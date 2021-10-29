const mongoose = require('mongoose')
const { Schema } = mongoose


const UserSchema=new Schema({
    userName:{type:String, required:true},
    email:{type:String, required:true},
})

const RepliesSchema=new Schema({
    body:{type:String, required:true},
    user:[UserSchema],
})

const CommentsSchema=new Schema({
    body:{type:String, required:true},
    user:[UserSchema],
    replies:[RepliesSchema]

})

const PostSchema=new Schema({
    id:Schema.Types.ObjectId,
    title:{type:String, required:true},
    body:{type:String, required:true},
    comments:[CommentsSchema],

    likes:{type:Number},
    dislikes:{type:Number},
})









const Blog=mongoose.model("Blog", PostSchema)

module.exports={
    Blog
}

