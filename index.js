const {ApolloServer, gql}=require("apollo-server")
const mongoose=require("mongoose")
const {Blog, }=require("./model")



//Type defs
const typeDefs = gql`
  type Author{
      name:String!
      email:String
      post:[Post]
  }

  input AuthorDetails{
      name:String!
  }


  type Post {
    _id: ID!
    title: String!
    body: String!
    comment: [Comment]
    likes:String,
    dislikes:String,
    author:Author!
  }

  type Comment {
    id: ID!
    body: String!
    postID: ID
    username: String
  }

  type CommentReplies {
    comment: Comment!
    id: ID!
    body: String!
    username: String!
  }

  type Query {
    posts: [Post]
    username: String!
  }

  type Mutation {
    createPost(id: ID, authorID:AuthorDetails!, title: String, body: String, likes:String, dislikes:String): Post!
    deletePost(_id:ID): Boolean
    updatePost(id:ID, title:String, body:String,  likes:String, dislikes:String ):Post
    likePost(_id:ID, likes:String):Boolean
    commentPost(id:ID, body:String, postID:ID ):Comment!
    deleteComment(id:ID, postID:ID,body:String):Boolean
  
  }
`;



//Resolvers
const resolvers={
    Query:{
        posts (parent, args, context, info) {       
            return Blog.find({})
                .then (blog => {
                    let posts=[]
                    posts=blog
                   return posts
                })
                .catch (err => {
                    console.error(err)
                })
        }
       
    },

    Mutation:{
        createPost(parent, args, context, info){
            const {title, body, user, id,likes,dislikes, authorID } = args
            const blogObj = new Blog({
                title,
                body,
                user,
                id,
                likes,
                dislikes,
                authorID,
            })
            blogObj.save()
            return blogObj
        },

        updatePost(parent, args, context, info){
            const{title,body,user, id, likes,dislikes}=args
            return Blog.find({_id:id}).then(
                post=>{
                    if(post.length>0){
                        post[0].title=title
                        post[0].body=body
                        post[0].likes=likes
                        post[0].dislike=dislikes
                        post[0].user=user
                        post[0].save()
                    }
                    
                }).catch(
                    err=>console.log(err)
                )
           
        },

        async deletePost(parent, args, context, info){
           const{_id}=args
           await Blog.findByIdAndDelete(_id)
           return true

        },

        async likePost(parent, args, context, info){
           const{_id, likes}=args
           Blog.findByIdAndUpdate({_id},{$set:{likes:`${likes}+1`}})   
           return true
        },

        // async dislikePost(parent, args, context, info){
        //     const{_id}=args
        //     Blog.findByIdAndUpdate({_id},{$set:{dislikes:`likes+1`}})   
        //     return true
        //  },

        commentPost(parent, args, context, info){
            const{body, id,postID }=args
            Blog.find({_id:postID}).then(
                doc=>{
                doc[0].comments.push({body:body, id:id})
                doc[0].save()
                }
            )
            return body
        },

        async deleteComment(parent, args, context, info){
            const{body, id,postID }=args
            await Blog.updateOne({},{
                $pull:{comments:{id:id}}
            })
            // await Blog.find({_id:postID}).then(
            //     item=>{
            //        console.log(item[0].comments.filter(item=>item._id!==id))
            //     }
            // )
            return true
        }
    }
    
}

//Server Instance
const server= new ApolloServer({typeDefs,resolvers})

// mongoose.connect(`mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0.ajmoq.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`,{useNewUrlParser: true,})
mongoose.connect(`mongodb://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0-shard-00-00.ajmoq.mongodb.net:27017,cluster0-shard-00-01.ajmoq.mongodb.net:27017,cluster0-shard-00-02.ajmoq.mongodb.net:27017/${process.env.mongoDatabase}?ssl=true&replicaSet=atlas-hzw64c-shard-0&authSource=admin&retryWrites=true&w=majority`)
.then(
    server.listen({ port: process.env.PORT || 4000 }).then(
        ({url})=>{
            console.log(`Server is ready at ${url}`)
        }
    )
)
.catch(
    (error)=>{console.log(error)}
)