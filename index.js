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