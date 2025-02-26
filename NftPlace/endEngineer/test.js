//1、引入express
const express =require('express')

//2、创建web服务器
const app = express()

//4、监听客户端的GET和POST请求，并向客户端响应具体的内容
app.get('/user',()=>{
 //调用express提供的res.send()方法，向客户端响应一个JSON对象   
    // res.send({name:'zs',age:20,gender:'男'})
})

app.post('/user',()=>{
    //调用express提供的res.send()方法，向客户端响应一个文本字符串  
       res.send('请求成功')
   })


app.get('/',(req,res)=>{
//通过req.query可以获取到客户端发过来的查询参数    
//req.query 默认是一个空对象
//客户端使用?name=zs&age=20 这种查询字符串形式，发送到服务器的参数
//可以通过req.query对象访问到，例如:
//req.query.name req.query.age
    console.log(req.query)
    res.send(req.query)
})
//3、调用 app.listen(端口号,启动成功后的回调函数)，启动服务器
app.listen(80,() =>{
  console.log('express server runing at http://127.0.0.1')
})

//参数1:客户端请求的 URL 地址
//参数2:请求对应的处理函数
//  req:请求对象(包含了与请求相关的属性与方法)
//  res:响应对象(包含了与响应相关的属性与方法)
app.get('请求URL',function(req,res){/*处理函数*/})

//URL 地址种，可以通过:参数名的形式。匹配动态参数值
//:id动态参数
app.get('/user/:id',(req,res)=>{
    //req.params默认是一个空对象
    //里面存放着通过:动态匹配到的参数值
    //动态匹配到1的URL参数，默认也是一个空对象
    console.log(req.params)
})
//app.use(express.static('./文件名'))
//匹配GET请求，且请求URL为/
app.get('/',function(req,res){
    res.send('hello world!')
})
//导入路由模块
const router = require('./test2')
//注册路由模块
//app.use函数作用注册全局中间件
//为路由模块添加访问前缀
app.use('abc',router)
