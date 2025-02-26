const express = require('express');
const mysql = require('mysql2');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
require('dotenv').config();

const app = express();
//npm i  --dev  dotenv
const port = process.env.PORT || 3001;

// 解析请求体
app.use(express.urlencoded({ extended: true })); //  用于解析 URL 编码的请求体，这通常是表单提交时使用的格式
app.use(express.json()); // 用于解析JSON格式的请求体,这通常是在 API 请求或 AJAX 请求中使用的


// 生成 Swagger 文档配置
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',//OpenAPI 是一个用于描述 API 的规范，
        info: {
            title: 'API Documentation',
            version: '1.0.0',//项目的版本
        },
    },
    apis: ['./restfulApp_userinfo_crud.js.js'], // 指定包含 API 路由的文件
    host: port,
    basePath: '/',
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


// 连接 MySQL 数据库
const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'carInsurance'
});

/*
GET：读取（Read）
POST：新建（Create）
PUT：更新（Update）
DELETE：删除（Delete）


POST /zoos 新建一个动物园
GET /zoos 列出所有动物园
GET /zoos/:id 获取某个指定动物园的信息
PUT /zoos  更新某个指定动物园的全部信息
DELETE /zoos/:id 删除某个动物园
*/




// 示例 API 路由
//https://apifox.com/apiskills/how-to-use-swagger-create-nodejs-api/
//http://localhost:3000/api-docs
/**
     * @openapi
     * '/user':
     *  post:
     *     tags:
     *     - User add Controller
     *     summary: 新增用户
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - username
     *              - password
     *            properties:
     *              username:
     *                type: string
     *                default: johndoe
     *              password:
     *                type: string
     *                default: johnDoe20!@
     *     responses:
     *      201:
     *        description: Created
     *      409:
     *        description: Conflict
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
app.post('/user', async (req, res) => {
    const connection = await pool.promise().getConnection();
    const results = await connection.query('insert into userinfo(username,password) value(?,?)',[req.body.username,req.body.password])
    res.json(results);


});



/**
   * @openapi
   * '/user':
   *  get:
   *     tags:
   *     - User query all Controller
   *     summary: 获取所有用户信息
   *     responses:
   *      200:
   *        description: Fetched Successfully
   *      400:
   *        description: Bad Request
   *      404:
   *        description: Not Found
   *      500:
   *        description: Server Error
   */
app.get('/user', async (req, res) => {
    const connection = await pool.promise().getConnection();
    const results = await connection.query('SELECT * FROM userinfo')
    res.json(results);


});




/** GET Methods *//**
   * @openapi
   * '/user/{id}':
   *  get:
   *     tags:
   *     - User Controller
   *     summary: 通过id获取用户
   *     parameters:
   *      - name: id
   *        in: path
   *        description: 
   *        required: true
   *     responses:
   *      200:
   *        description: Fetched Successfully
   *      400:
   *        description: Bad Request
   *      404:
   *        description: Not Found
   *      500:
   *        description: Server Error
   */
app.get('/user/:id', async (req, res) => {
    const connection = await pool.promise().getConnection();
    const results = await connection.query('SELECT * FROM userinfo where userid=?',[req.params.id])
    res.json(results);
   
    
});


/**
     * @openapi
     * '/user':
     *  put:
     *     tags:
     *     - User Controller
     *     summary: Modify a user
     *     requestBody:
     *      required: true
     *      content:
     *        application/json:
     *           schema:
     *            type: object
     *            required:
     *              - id
     *            properties:
     *              id:
     *                type: string
     *                default: ''
     *              username:
     *                type: string
     *                default: ''
     *              password:
     *                type: string
     *                default: ''
     *     responses:
     *      200:
     *        description: Modified
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     */
app.put('/user', async (req, res) => {

    const connection = await pool.promise().getConnection();
    const results = await connection.query('update userinfo set username=?,password=? where userid=?',[req.body.username,req.body.password,req.body.id])
    res.json(results);
});




/**
     * @openapi
     * '/user/{id}':
     *  delete:
     *     tags:
     *     - User Controller
     *     summary: Delete user by Id
     *     parameters:
     *      - name: id
     *        in: path
     *        description: The unique Id of the user
     *        required: true
     *     responses:
     *      200:
     *        description: Removed
     *      400:
     *        description: Bad request
     *      404:
     *        description: Not Found
     *      500:
     *        description: Server Error
     *
     */
app.delete('/user/:id', async (req, res) => {
    const connection = await pool.promise().getConnection();
    const results = await connection.query('delete from  userinfo  where userid=?',[req.params.id])
    res.json(results);
});







app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
