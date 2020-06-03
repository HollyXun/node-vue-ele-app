const express = require("express")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const passport = require("passport")

const app = express()

//引入users.js和profiles.js
const users = require("./routes/api/users")
const profiles = require("./routes/api/profiles")

//DB config 数据库配置
const db = require("./config/keys").mongoURI;

//使用body-parser中间件
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//修复控制台报错findOneAndUpdate和findOneAndDelete方法
mongoose.set('useFindAndModify', false)
    //连接数据库,{useNewUrlParser:true, useUnifiedTopology: true }控制台输出报错
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB Connected")
    })
    .catch(() => {
        console.log(err)
    })

//passport 初始化
app.use(passport.initialize());
console.log('初始化passport了')
    //配置passport
require("./config/passport")(passport)


// app.get("/", (req, res) => {
//     res.send("Hello,World")
// })

//使用routes
app.use("/api/users", users)
app.use("/api/profiles", profiles)
console.log("走到使用路由了")
const port = process.env.PORT || 5000;
console.log("走到这里了")
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})