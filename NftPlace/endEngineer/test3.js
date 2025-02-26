const express =require('express')
const app =express()
//一定要在路由之前注册中间件

//全局中间件的简化模式
app.use(function(req,res,next){
    //获取到请求到达服务器的时间
    const time=Date.now()
    //为req对象，挂载自定义属性，从而把时间共享给后面所有的路由和中间件
    req.startTime=time
    next()
})
//定义一个中间件函数
const  mw=function(req,res,next){
    console.log('最简单')
    next()
}
app.use(mw)//全局中间件
//mw1只在下面/user路由下使用，局部中间件
const  mw1=function(req,res,next){
    console.log('最简单')
    next()
}
app.get('/user',mw1,()=>{
  
    //调用express提供的res.send()方法，向客户端响应一个JSON对象   
       res.send({name:'zs',age:20,gender:'男'})
   })

app.get('/',()=>{
    //调用express提供的res.send()方法，向客户端响应一个JSON对象   
       res.send({name:'zs',age:20,gender:'男'})
       console.log('ad'+req.startTime)
   })
app.get('/ji',function(req,res){
    throw new Error('服务器内部发生了错误')
    res.send('ddad')
})
//错误级别中间件(注册在所有路由之后)
app.use(function(err,req,res,next){
    console.log('发生了错误'+err.message)
      //为req对象，挂载自定义属性，从而把时间共享给后面所有的路由和中间件
      res.send('Error'+err.message)
      next()
  })
  //配置解析application/json格式数据的内置中间件
  app.use(express.json())
    //配置解析application/x-www-form-urlencoded格式数据的内置中间件
    app.use(express.urlencoded({extended:false}))
app.listen(80,() =>{
    console.log('express server runing at http://127.0.0.1')
  })
