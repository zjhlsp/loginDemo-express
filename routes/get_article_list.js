var express = require('express');
var router = express.Router();
const dbArticles = require('../db').Articles

router.get('/', function (req, res, next) {
  dbArticles.all((err, articles) => {
    if (err) return next(err);
    res.send(articles)
})
});
const bodyParser = require('body-parser');
router.get('/a', function (req, res, next) {
  res.send('响应aaa成功!')
});

module.exports = router;