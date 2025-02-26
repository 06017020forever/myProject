//1、引入express
const express =require('express')

//2、创建web服务器
const app = express()

//4、监听客户端的GET和POST请求，并向客户端响应具体的内容
app.get('/user',()=>{
 //调用express提供的res.send()方法，向客户端响应一个JSON对象   
    res.send({name:'zs',age:20,gender:'男'})
})

//默认情况下，如果不配置解析表单数据的中间件，则req.body默认等于undefined
// 配置解析表单JSON格式数据的中间件
app.use(express.json())

// 配置解析表单url-encode格式数据的中间件
app.use(express.urlencoded({extended:false}))

app.post('/user',(req,res)=>{
    //调用express提供的res.send()方法，向客户端响应一个文本字符串  
       res.send('请求成功')
       //在服务器，可以使用req.body这个属性，来接受客户端发送过来的请求体数据
       console.log(req.body)
   })

   app.post('/book',(req,res)=>{
    //调用express提供的res.send()方法，向客户端响应一个文本字符串  
       res.send('请求成功')
       //在服务器，可以使用req.body这个属性，来获取JSON格式的表单数据和url-encode格式数据
       console.log(req.body)
   })

//3、调用 app.listen(端口号,启动成功后的回调函数)，启动服务器
app.listen(80,() =>{
  console.log('express server runing at http://127.0.0.1')
})
app.get('/',function(req,res){
    res.send('hello world!')
})

