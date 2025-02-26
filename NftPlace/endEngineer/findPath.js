//模块
const express = require('express')
const router = express.Router()
//get接口
router.get('/get', (req, res) => {
    const query = req.query
    //调用exrpess提供的res.send()方法，向客户端响应一个JSON对象   
    res.send({
        status: 0,
        msg: 'GET请求成功',
        data: query
    })
})

router.post('/post', (req, res) => {
    const body = req.body
    //调用express提供的res.send()方法，向客户端响应一个文本字符串  
    res.send({
        status: 0,
        msg: 'post请求成功',
        data: body
    })

})
module.exports = router