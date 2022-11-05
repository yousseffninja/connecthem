const router = require('express').Router();
const up = require('../../cloud')
const mailer = require('../../mailer/mailer')
const constants = require("../../constants")
const { studentModel } = require('../../db/model')

const createUserData = (fields, progress) => {
  let data = {},
    set = (id) => {
      if (fields[id]) {
        if (fields[id] != '') {
          progress |= +constants.progress_codes[id];
          data[id] = fields[id]
        }
      }
    }
  set('cnic')
  set('name')
  set('email')
  set('phone')
  set('university')
  set('password')
  set('city')
  console.log(progress)
  if (progress)
    data.progress = progress
  data.status = constants.STATUS.pending;
  return data
}

router.post('/login', async (req, res) => {
  console.log(req.body)
  let st = await studentModel.getOne(req.body.cnic, 'cnic')
  console.log(st)
  if (!st.success || !st.data)
    return res.json({status: false, reason: 'ghost'})
  if (req.body.password == st.data.password) {
    res
      .cookie('user', st.data.cnic)
      .json({status: true, reason: ""})
      /*.render('index', {
        title: 'Express',
        bodyClass: "homepage",
        u: {
          text: req.body.cnic,
          href: '/student/profile'
        }
      })*/
  } else
    res.json({status: false, reason: "password"})

})

router.post('/signup', async (req, res) => {
  console.log(req.body)
  /*let student = await studentModel.getOne(req.body.cnic, 'cnic')
  if (student.success && student.data)
    res.json({ status: false, reason: 'dup' })
  else*/ {
    let results = await studentModel.addOne({ ...req.body, status: constants.STATUS.pending, progress: 7 });
    console.log(results)
    res.cookie("user", req.body.cnic).json({ status: true, reason: '' })
  }
})

router.post('/profile', up.fields([
  {name: 'imgcnic', maxCount: 1},
  {name: 'imgbill', maxCount: 1},
  {name: 'imgres', maxCount: 1},
  {name: 'imguni', maxCount: 1},
  {name: 'imgpic', maxCount: 1},
]), async (req, res) => {
  let update = createUserData(req.body, 7)
  for (let key in req.files){
    let name = req.files[key][0].fieldname
    update[name] = req.files[key][0].path
    update.progress |= constants.progress_codes[name]
  }
  update.$bit = {
    progress: {or: update.progress}
  }
  delete update.progress
  console.log(update)
  studentModel
    .updateOne(req.cookies.user, update ,"cnic")
    .then((data)=>{
      console.log(data.data.progress)
      if (data.data.progress == 2047){
        console.log('inside')
        mailer.send(mailer.composeEmailForSignup(data.email, data.name))
      }
      return res.json({status: true, reason: ''})
    })
    .catch(e=>res.json({ status: false, reason: 'db' }));
})

router.post('/grant', up.single('imgfee'), (req, res) => {
  studentModel.requestGrant(
    req.cookies.user,
    {
      grant: constants.STATUS.pending,
      imgfee: req.file.path
    },
    "cnic"
  ).then(()=>res.json({ status: true, reason: '' }))
   .catch(()=>res.json({ status: false, reason: 'write' }))
})

router.post('/internship', up.fields([
  {name: "imgcv", maxCount: 1},
  {name: "imgtranscript", maxCount: 1},
]), (req, res) => {
  console.log(req.files)
  console.log({
      internship: constants.STATUS.pending,
      skills: req.body.skills,
      imgcv: req.files.imgcv[0].path,
      imgtranscript: req.files.imgtranscript[0].path
    })
  studentModel.updateOne(
    req.cookies.user, {
      internship: constants.STATUS.pending,
      skills: req.body.skills,
      imgcv: req.files.imgcv[0].path,
      imgtranscript: req.files.imgtranscript[0].path
    },
    "cnic"
  ).then(()=>console.log("hr") || res.json({ status: true, reason: '' }))
    .catch(()=>console.log("hrr") || res.json({ status: false, reason: 'write' }))
})

module.exports = router
