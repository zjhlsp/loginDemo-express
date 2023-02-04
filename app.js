var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const app = express();

// test zjh
// const expressWs = require('express-ws') // 引入 WebSocket 包
// expressWs(app)  // 混入ws
var getArticleList = require('./routes/get_article_list')
app.use('/get_article_list', getArticleList)
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//---------------------------------------------------------
// app.ws('/basic', function (ws, req) {
//   console.log('connect success')
//   console.log(ws)
  
//   // 使用 ws 的 send 方法向连接另一端的客户端发送数据
//   ws.send('connect to express server with WebSocket success')

//   // 使用 on 方法监听事件
//   //   message 事件表示从另一段（服务端）传入的数据
//   ws.on('message', function (msg) {
//     console.log(`receive message ${msg}`)
//     ws.send('default response')
//   })

//   // 设置定时发送消息
//   let timer = setInterval(() => {
//     ws.send(`interval message ${new Date()}`)
//   }, 2000)

//   // close 事件表示客户端断开连接时执行的回调函数
//   ws.on('close', function (e) {
//     console.log('close connection')
//     clearInterval(timer)
//     timer = undefined
//   })
// })


// 用于处理post请求的消息体
const bodyParser = require('body-parser');
// const userList = require('./db').userList

// 使用body-parser,支持编码为json的请求体
app.use(bodyParser.json());
// 支持编码为表单的消息体
app.use(bodyParser.urlencoded(
    {
        extended: true
    }
))


module.exports = app;
