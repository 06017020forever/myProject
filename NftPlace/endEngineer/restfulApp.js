const express = require('express');
const mysql = require('mysql2');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
require('dotenv').config();
const app = express();
//npm i  --dev  dotenv
const port = process.env.PORT || 3004;

// 解析请求体
app.use(express.urlencoded({ extended: true })); //  用于解析 URL 编码的请求体，这通常是表单提交时使用的格式
app.use(express.json()); // 用于解析JSON格式的请求体,这通常是在 API 请求或 AJAX 请求中使用的


// 生成 Swagger 文档配置
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',//OpenAPI 是一个用于描述 API 的规范，
        info: {
            title: 'API Documentation',
            version: '1.0.0',//项目的般般
        },
    },
    apis: ['./restfulApp_userinfo_crud.js'], // 指定包含 API 路由的文件
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

/*GET：读取（Read）
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
/**
     * @openapi
     * '/zoos':
     *  post:
     *     tags:
     *     - User Controller
     *     summary: Login as a user
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
app.post('/zoos', async (req, res) => {
    const connection = await pool.promise().getConnection();
    const username = req.body.username;
    const results = await connection.query('SELECT * FROM userinfo')
    res.json(results);


});



/**
   * @openapi
   * '/api/data':
   *  get:
   *     tags:
   *     - User Controller
   *     summary: Get a zoo by id
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
app.get('/zoos', async (req, res) => {
    const connection = await pool.promise().getConnection();
    const results = await connection.query('SELECT * FROM userinfo')
    res.json(results);


});



// GET /zoos/:id
// :id是动物园ID的参数
/** GET Methods *//**
   * @openapi
   * '/zoos/{id}':
   *  get:
   *     tags:
   *     - User Controller
   *     summary: Get a zoo by id
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
app.get('/zoos/:id', (req, res) => {
    const zooId = req.params.id;
    // 获取动物园信息并响应
    res.send(`Zoo ID: ${zooId}`);
});

// PUT /zoos/:id
/**
     * @openapi
     * '/zoos':
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
     *              firstName:
     *                type: string
     *                default: ''
     *              lastName:
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
app.put('/zoos', (req, res) => {
    const zooId = req.body.id;
    // 更新动物园信息并响应
    res.send(`Updated zoo ID: ${zooId}`);
});



// DELETE /zoos/:id
/**
     * @openapi
     * '/zoos/{id}':
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
app.delete('/zoos/:id', (req, res) => {
    const zooId = req.params.id;
    // 删除动物园并响应
    res.send(`Deleted zoo ID: ${zooId}`);
});







app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/api-docs/#/`);
});
