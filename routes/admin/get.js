const router = require('express').Router()
const constants = require('../../constants')
const {adminModel, studentModel, ngoModel} = require('../../db/model')


const getNormalizeFilter = (filter)=>{
  let normalizedFilter = {}
  for (const k in filter){
    if (constants.allowedFilters.includes(k.toUpperCase())){
      normalizedFilter[k] = filter[k]
    }
  }
  return normalizedFilter
}
        

router.get('/', async (req, res)=> {
  let admin = await adminModel.getOne( req.admin.cnic, 'cnic');
  if (admin.success && admin.data)
    res.render('admin/admin', admin.data);
  else res.render('index/error', {
    message: "You can't access this page",
    error: {}
  })
});

router.get('/login', function(req, res, next) {
  res.render('admin/login');
});

router.get('/students/:id',async (req, res)=>{
  let data = await studentModel.getOne(req.params.id)
  if (data.success && data.data){
    res.render('admin/application', {attrs: data.data})
  } else {
    res.render('index/error', {
      message: "Seems like this record was invalid",
      error: {}
    })
  }
})

router.get('/students',async (req, res)=>{
  
  let filter = getNormalizeFilter(req.query)
  filter.progress = 2047
  filter.page = parseInt(req.query.page) || 0
  filter.select = "name _id cnic university email phone city grant internship msg"
  let data = await adminModel.getAllFiltered({...filter})
  if (data.success){
    console.log(data)
    res.render('admin/list', {
      option: filter.university || '',
      data: data.data,
      page: filter.page
    })
  } else {
    res.render('index/error', {
      message: "Seems like an error on server end",
      error: {}
    })
  }
})

module.exports = router
