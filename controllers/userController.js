
const User = require('../models/userModel')
const bcrypt = require("bcryptjs")
const jwt  = require('jsonwebtoken')

require('dotenv').config()

    BASEURL = 'http://localhost:7005/uploads/'


    const register = async (req,res)=>{

    console.log(req.body)
    let {name, email , password, contactNumber, address} = req.body

    imagePath = req.file ? req.file.filename  :  null
    console.log(imagePath , "image")

        try {
                const existingUser = await User.findOne({email : email})
                console.log("exist " ,existingUser);

            if(!existingUser)
            {   
                const salt = await bcrypt.genSalt(10)
                password  = await bcrypt.hash(req.body.password , salt)

                console.log("pass ",password);

                const newUser = await User.create({name , email , password , contactNumber , address , imagePath})
                console.log(newUser)
                await newUser.save()

                     res.status(200).send({msg:"Registered successfully" ,success :true})

                }
            if (existingUser) {
                    res.status(200).send({msg : "User already exists " , success :false})
            }

        } catch (error) {
            console.log(error)
            res.status(500).send({msg:"Server Error"})
        }
    }


    const login = async (req,res)=>{

    console.log(req.body)
    const {email , password} = req.body

    try {
        const loggedUser = await User.findOne({email : email})

        console.log(loggedUser , "XX--------Loguser");

        if (!loggedUser) {
            return res.status(400).send({msg:"User not found Register first" , success : false})
        }
            if (await bcrypt.compare(password , loggedUser.password)) {

                const payload  = {id: loggedUser._id , role :loggedUser.role}
                console.log("pay" ,"id:" ,loggedUser._id , "role :" ,loggedUser.role)

                const token = jwt.sign(payload , process.env.SECRET_KEY , {expiresIn : "1d"})

                ////user info

                const loggedUserinfo = await User.findById(loggedUser._id , { password: 0})  //ignore passsowrd //  { password: 0 , address : 0}
                loggedUserinfo.imagePath =  BASEURL + loggedUserinfo.imagePath

                console.log(loggedUserinfo , loggedUserinfo.imagePath);
              //  res.status(200).send({user : loggedUserinfo , success : true})

                res.status(202).send({msg:"Logged in successfully" , user : loggedUserinfo , success : true , token: token})
            }else{
                res.status(400).send({msg:"Password is incorrect!!" , success : false})
            }
    } catch (error) {

        res.status(500).send({msg:"Server error" , success : false})
    }
}

const getUserInfo = async(req,res)=>{
    //console.log("link ",req.params.ID);
    console.log(req.user.id , "controller")

    try {

        const loggedUser = await User.findById(req.user.id , { password: 0})  //ignore passsowrd //  { password: 0 , address : 0}
        loggedUser.imagePath =  BASEURL + loggedUser.imagePath

        console.log(loggedUser , loggedUser.imagePath);
        res.status(200).send({user : loggedUser , success : true})
    } catch (error) {
        res.status(500).send({msg:"Server error" , success : false})
    }
}


// // const doctorList = async(req,res)=>{

// //     console.log(req.user , "controller")
// //     try {

// //         const doctors = await User.find({role : 'Doctor'} ,{ password: 0} ) && Doctor.find({specialist})
// //         console.log("DOC ",doctors);

// //          doctors.imagePath =  BASEURL + doctors.imagePath

// //         console.log(doctors , doctors.imagePath);
// //        // res.status(200).send({user : loggedUser , success : true})

// //         res.status(200).send({doctors : doctors , success : true})
// //     } catch (error) {
// //         console.log(error)
// //         res.status(500).send({msg:"Server error" , success : false})
// //     }
// // }

// const doctorList = async (req, res) => {
//   try {

//     const doctors = await Doctor.aggregate([
//       {
//         $lookup: {
//           from: "users",               // collection name (plural!)
//           localField: "userID",
//           foreignField: "_id",
//           as: "user"
//         }
//       },
//       { $unwind: "$user" },

//       { $match: { "user.role": "Doctor" }
//       },

//       {
//         $project: {
//           _id: 1,
//           specialist: 1,
//           fees: 1,
//           status: 1,
//           createdAt: 1,
//           userID : 1,

//           // user fields
//           name: "$user.name",
//           email: "$user.email",
//           contactNumber: "$user.contactNumber",
//           role: "$user.role",
//           address: "$user.address",
//           imagePath: {
//             $cond: {
//               if: { $ifNull: ["$user.imagePath", false] },
//               then: { $concat: [BASEURL, "$user.imagePath"] },
//               else: null
//             }
//           }
//         }
//       }
//     ]);

//     res.status(200).send({ success: true,doctors });

//   } catch (error) {
//     console.log(error);
//     res.status(500).send({success: false, msg: "Server error" });
//   }
// };


const userList = async(req,res)=>{
  //  console.log(req.user , "controller")
    try {

        const users = await User.find({role : 'User'} ,{ password: 0} ).lean(); // 🔥 IMPORTANT
        console.log("users ",users);
         // ✅ Add BASEURL to imagePath
        const updatedUser = users.map(user => ({
          ...user,
          imagePath: user.imagePath
            ? BASEURL + user.imagePath
            : null
        }));
        console.log(updatedUser)

        res.status(200).send({usersAll : updatedUser , success : true})
    } catch (error) {
        console.log(error)
        res.status(500).send({msg:"Server error" , success : false})
    }
}




const updateUser = async (req, res) => {

  try {

    console.log("bosy ",req.body);
    console.log("link ",req.params.ID);

    console.log("userlogin  createdBy ", req.user.id);

      const imagePath = req.file ? req.file.filename : undefined;

      console.log("imagePath:", imagePath);
      console.log("req.file:", req.file);
          // ✅ only update image if new file uploaded
          if (imagePath) {
            req.body.imagePath = imagePath;
          }
                const  UserUpdate = await User.findByIdAndUpdate({_id : req.params.ID},{
                $set:{ name:req.body.name , email : req.body.email ,address:req.body.address ,
                  contactNumber:req.body.contactNumber,member:req.body.member , imagePath:req.body.imagePath }
              })
                console.log("UserUpdate" ,UserUpdate);
            
             res.status(200).send({msg:"User is updated" , success:true})
    
  } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Server Error" });
  }

}


// const deleteUser = async (req, res) => {

//      const {ID}  = req.params // user id from url parameters
//      console.log("ID #### ",ID)
//      try {   
//           const UserDelete = await User.findByIdAndDelete({ _id:ID })
//           console.log(UserDelete,'UserDelete')
 
//              if(!UserDelete){
//                  res.status(400).send({msg:"User not found", success:false})
//              }
     
//          res.status(200).send({msg:"User deleted succcessfully" ,success :true})
//      } catch (error) {
//         console.log(error);
        
//          res.status(500).send({msg:"Server Error"})
//      }
// }




 module.exports = { register , login , getUserInfo  ,userList  ,updateUser } //deleteUser} 
