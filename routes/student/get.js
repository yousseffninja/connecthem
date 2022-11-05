const router = require('express').Router()
const {studentModel} = require('../../db/model')
const {progress_codes} = require('../../constants')

router.get('/profile', async (req, res, next) =>{
  if (!req.cookies.user){
    res.render('student/login')
  } else {
    let nn = await studentModel.getOne( req.cookies.user, 'cnic');
    res.render('student/profile', {
      ...nn.data,
      code: {...(Object.keys(progress_codes).reduce((r, k)=>{
        if (k.startsWith('img')){
          r[k] = progress_codes[k]
          return r
        }
        return r
      }, {}))}
    });
  }
});

router.get('/signup', function(req, res, next) {
  res.render('student/signup');
});

router.get('/login', function(req, res, next) {
  res.render('student/login');
});

module.exports = router
