const router = require('express').Router()
const {
  studentModel,
  adminModel,
  ngoModel,
  companyModel,
} = require('../../db/model')

const APIFeatures = require('../../utils/apifeatures')
const {student} = require("../../db/schema");

router.get('/', (req, res)=>{
  res.render('boss')
})

router.get('/company', (req, res)=>{
  res.render('company/signup')
})

router.get('/ngo', (req, res)=>{
  res.render('ngo/signup')
})

router.get('/admin', (req, res)=>{
  res.render('admin/signup')
})



router.get('/list/students', async (req, res)=>{
  let page = parseInt(req.query.page) || 0
  let filter = {page}
  const features = new APIFeatures(student.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .Pagination();
  const data = await features.query
  console.log(data)
  if (data) {
    res.render('admin/list', {data: data, handle: "students"})
  }
})
//   studentModel.getAll({
//     page,
//   }, req.query).then(data=>{
//     if (data.success){
//       res.render('admin/list', {data: data.data, handle: "students"})
//     } else {
//       throw Error("failure")
//     }
//   }).catch(e=>res.render('index/error', {message: "Error", error: e}))
// })

router.get('/list/admins', (req, res)=>{
  let page = parseInt(req.query.page) || 0
  adminModel.getAll({
    page
  }).then(data=>{
    if (data.success){
      res.render('admin/list', {data: data.data})
    } else {
      throw Error("failure")
    }
  }).catch(e=>res.render('index/error', {message: "Error", error: e}))
})

router.get('/list/companies', (req, res)=>{
  let page = parseInt(req.query.page) || 0
  companyModel.getAll({
    page
  }).then(data=>{
    if (data.success){
      res.render('admin/list', {data: data.data})
    } else {
      throw Error("failure")
    }
  }).catch(e=>res.render('index/error', {message: "Error", error: e}))
})

router.get('/list/ngos', (req, res)=>{
  let page = parseInt(req.query.page) || 0
  ngoModel.getAll({
    page
  }).then(data=>{
    if (data.success){
      res.render('admin/list', {data: data.data})
    } else {
      throw Error("failure")
    }
  }).catch(e=>res.render('index/error', {message: "Error", error: e}))
})


module.exports = router
