const express = require('express')
let router= express.Router();
const adminController = require('../../controllers/Admin/admin')
const multer= require('multer')

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'./images')
    },
  filename:(req,file,cb)=>{
    cb(null,file.originalname)
    }
})

const upload=multer({storage:storage})
  
router.route('/login').post(adminController.signIn)
router.route('/getAlluserData').post(adminController.getAlluserData)
router.route('/deleteuser').post(adminController.deleteuser)
router.route('/Adduser').post(adminController.adduser)
router.route('/findUserbyID').post(adminController.findUserbyID)
router.route('/Edituser').post(adminController.edituser)  
router.route('/uploadimage').post(upload.single("file"),(req,res)=>{
   res.send({code:100,message:"Success"})
  })
  
module.exports = router ;