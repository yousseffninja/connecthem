const constants = require('../constants')
const {
  admin, student, ngo, company, grant, internship, auth
} = require('./schema')

const getReference = (what)=>{
  switch(what){
    case constants.CODE_IDTF_STUDENT:
      return student
    case constants.CODE_IDTF_NGO:
      return ngo
    case constants.CODE_IDTF_COMPANY:
      return company
    case constants.CODE_IDTF_GRANT:
      return student
    case constants.CODE_IDTF_INTERNSHIP:
      return student
    case constants.CODE_IDTF_ADMIN:
      return admin
    case constants.CODE_IDTF_AUTH:
      return auth
  }
}

module.exports.addOne = async (what, data)=>{
  let collection = getReference(what)
  if (collection){
    return await new collection(data).save().then(d=>({success: true, data: d})).catch(e=>({success: false, reason: e}))
  } else {
    return {
      success: false,
      reason: 'invalid collection'
    }
  }
}

module.exports.verify = async (code, id)=>{
  return await getReference(code).findOneAndUpdate({_id: id}, {status: constants.STATUS.verified}).lean().then(data=>({
    success: true, data
  })).catch(e=>({success: false, reason: e}))
}

module.exports.reject = async (code, id, msg)=>{
   return await getReference(code).findOneAndUpdate({_id: id}, {status: constants.STATUS.blacked, msg: msg}).lean().then(data=>({
    success: true, data
  })).catch(e=>({success: false, reason: e}))
}

module.exports.getOne = async (what, id, field='_id')=>{
  let collection = getReference(what)
  if (collection){
    return await collection.findOne({[field]: id}).lean().then(data=>{
      return {success: true, data}
    }).catch(e=>({success:false, reason: e}))
  } else {
    return {
      success: false, reason: "invalid collection"
    }
  }
}

module.exports.updateOne = async (what, id, data, field='_id')=>{
  let collection = getReference(what);
  if (collection){
    console.log(collection)
    return await collection.findOneAndUpdate({[field]: id}, data, {
      "new": true
    }).lean().then(data=>{
      return {success: true, data}
    }).catch(e=>{
      console.log(e)
      return {success:false, reason: e}
    })
  } else {
    console.log('ere')
    return {
      success: false, reason: "invalid collection"
    }
  }
}

module.exports.getAll = (what, page = 0)=>{
  return getReference(what).find().limit(10).skip(page).then(data=>{
    success: true, data
  }).catch(e=>({success:false, reason: e}))
}

module.exports.getAllFiltered = (what, by)=>{
  let limit = parseInt(by.limit) || 10
  let skip = parseInt(by.page)*limit || 0
  let select = by.select
  delete by.page
  delete by.limit
  delete by.select
  return getReference(what).find(by, select).limit(limit).skip(skip).lean().then(data=>{
    return {
      success: true, data
    }
  }).catch(e=>({success:false, reason: e}))
}
