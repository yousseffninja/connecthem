const router = require('express').Router()
const {companyModel} = require('../../db/model')

router.post('/signup', async (req, res)=>{
    const results = await companyModel.addOne(req.body)
  if (results.success){
    res.json({status: true, reason: ''})
  } else {
    res.json({status: false, reason: "write"})
  }
})

router.post('/login', (req, res)=>{
  companyModel.getOne(req.body.email, 'email').then((data)=>{
    if (data.success){
      if (req.body.password == data.data.password){
        if (req.query.token == data.data.token){
          res
            .cookie('company', data.data._id.valueOf())
            .json({status: data.success, reason: ''})
        } else {
          throw Error('token')
        }
      } else {
        throw Error('password')
      }
    } else {
      throw Error('ghost')
    }
  }).catch(e=>res.json({status: false, reason: e.message}))
})

router.post('/update', (req, res)=>{
  companyModel.updateOne(req.cookies.company, req.body).then((data)=>{
    if (data.success){
      res.json({status: true, reason: ''})
    } else {
      res.json({status: false, reason: 'update'})
    }
  }).catch(err=>{
    res.json({status: false, reason: 'server'})
  })
})

router.post('/edit', (req, res)=> {
  console.log(req.body)
  if (req.body.changepassword){
    req.body.password = req.body.newpassword
  }
  
  console.log(req.body)
  companyModel.updateOne(req.cookies.company, req.body).then((data)=>{
    if (data.success){
      res.status(304).redirect('/company/profile')
    } else {
      res.render('index/error', {
        message: "Failure",
        error: {}
      })
    }
  }).catch((e)=>res.render('index/error', {
        message: "Failure",
        error: {}
      }))
})

module.exports = router
