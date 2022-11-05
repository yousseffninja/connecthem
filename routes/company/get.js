const router = require('express').Router()
const {companyModel, studentModel} = require('../../db/model')
const constants = require('../../constants')

router.get('/login', (req, res)=>{
  if (req.query.token){
    companyModel.getOne(req.query.token, 'token').then(data=>{
      if (data.success && data.data){
        res.render('company/login', data.data)
      } else {
        throw Error('Not Allowed')
      }
    }).catch(e=>{
      res.render('index/error', {
        message: "Cannot access this page", error: {}
      })
    })
  } else {
    res.render('index/error', {
      message: "Cannot access this page", error: {}
    })
  }
})

router.get('/profile', (req, res)=>{
  companyModel.getOne(req.cookies.company).then((data)=>{
    if (data.success && data.data){
      data.data.allskills = constants.allskills
      res.render('company/index', data.data)
    } else {
      res.render('index/error',  {
        message: "Failed",
        error: {}
      })
    }
  })
})

router.get('/students', (req, res)=>{
  
    studentModel.getAll({
      status: constants.STATUS.verified,
      internship: constants.STATUS.pending,
      skills: { $in: req.query.skills.split(' ')},
    }).then((data)=>{
      res.render('company/list', {
        students: data.data
      })
    }).catch((e)=>{
      res.render('index/error', {
        message: "An error occured", error: {}
      })
    })
})

module.exports = router
