//1、引入express
const express =require('express')
//导入处理querystring的node.js内置模块
const qs = require('querystring')
//调用qs.parse()方法，把查询字符串解析为对象

//这是解析表单数据的中间件
const bodyParser = (req,res,next)=>{
    //定义中间件具体的业务逻辑
    //定义一个str字符串，专门用来存储客户端发过来的请求体数据
    let str = ''
    //监听req的data事件
    req.on('data',(chunk)=>{
        str +=chunk
    })
    //监听req的end事件
    req.on('end',()=>{
        //在str中存放的是完整的请求体数据
    //   console.log(str)
      //TODO:把字符串格式的请求体数据，解析成对象格式
      const body = qs.parse(str)
      req.body = body
       next()
    })
}

module.exports = bodyParser
