const router = require('express').Router()
const {companyModel, studentModel} = require('../../db/model')
const constants = require('../../constants')
const APIFeatures = require('../../utils/apifeatures')
const {student} = require("../../db/schema");

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

router.get('/students', async (req, res)=>{
  console.log(req.query.skills)
  const arr = req.query.skills === undefined ? [] : (req.query.skills.in)
  if(arr.isArray)
    arr = arr.filter(element => {
      return element !== '';
    });
  let page = parseInt(req.query.page) || 0
  let filter = {page}
  const features = new APIFeatures(student.find(filter), req.query)
      .filter()
      .Pagination();
  const data = await features.query
  if (data) {
    res.render('company/list', {
      students: data,
      params: arr
    })
  }

  // studentModel.getAll({
  //   status: constants.STATUS.verified,
  //   internship: constants.STATUS.pending,
  //   skills: { $in: req.query.skills.split(' ')},
  // }).then((data)=>{
  //   res.render('company/list', {
  //     students: data.data
  //   })
  // }).catch((e)=>{
  //   res.render('index/error', {
  //     message: "An error occured", error: {}
  //   })
  // })
})

module.exports = router
