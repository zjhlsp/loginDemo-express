// 密码解密
import { myDecrypt } from '../public/javascripts/myEncrypion'
var express = require('express');
var router = express.Router();
const userList = require('../db').userList

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  userList.all((err, userList) => {
    if (err) return next(err);
    res.send(userList)
  })
});


  // 删除用户
router.delete('/:id', (req, res, next) => {
  userList.delete(req.params.id, (err, asw) => {
    console.log('111',req.params);
    if (err) return next(err);
    res.send("删除成功")
  })
  });

  router.get('/:user', (req, res, next) => {
    userList.find(req.params.user, (err, id) => {
      if (err) return next(err);
      console.log(id);
      res.send(id)
    })
    });

  // 创建用户
router.post('/create', (req, res, next) => {
  let EXISTS
  userList.find(req.body.user, (err, id) => {
    if (err) return next(err);
    EXISTS = id
    console.log(EXISTS);
    if (!EXISTS) {
      userList.create({
        "user": req.body.user ? req.body.user : '',
        "password": req.body.password ? req.body.password : '',
        "user_group": req.body.group ? req.body.group : 'Operator',
        "auth_type": req.body.auth_type ? req.body.auth_type : '0',
        "is_active": req.body.is_active ? req.body.is_active : 1,
        "description": req.body.description ? req.body.description : ''

      }, (err, data) => {
        if (err) return next(err);
        res.send('创建用户成功')
      });
    } else {
      console.log(222);
      res.send(code=455, {
        code: 422,
        msg:'用户名重复',
        ret:false
    })
    }
  })

  });
  // 登录
  router.post('/login', (req, res, next) => {
    const password = myDecrypt(req.body.password)
    userList.login({
      "user": req.body.user ? req.body.user : '',
      "password": req.body.password ? password : ''
    }, (err, data) => {
      if (err) return next(err);
      if (data[0]) {
      const vali = password === data[0].password;
      res.send(vali ? '1' : '0')
      } else {
        res.send('0')
      }
    });
    });

// 更新用户信息
router.put('/:id', (req, res, next) => {
  userList.update({
    "id":req.params.id,
    "user": req.body.user ? req.body.user : '',
    "password": req.body.password ? req.body.password : ''
  }, (err, data) => {
    if(err) return next(err);
    res.send('更新成功')
  });
  })

module.exports = router;
