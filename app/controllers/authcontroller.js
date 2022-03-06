const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/user')





let refreshTokens = []
const authController = {
    registerUser: async(req, res) => {
         try {
             const salt = await bcrypt.genSalt(10)
             const hashed = await bcrypt.hash(req.body.password, salt)
             //Create new user
             const newUser = await new User({
                 username: req.body.username,
                 email: req.body.email,
                 password: hashed,
             })
             //save to database
             const user = await newUser.save()
             res.status(200).json(user)
         } catch (err) {    
             res.status(500).json(err)
         }
    },
    accessTokenVipPro:(user)=>{
        return jwt.sign(
            {
                id: user.id,
                admin: user.admin
            },
            "secretkey",
            {expiresIn: "30s"}
        )
    },
    accessTokenVipProSieuCap:(user)=>{
        return jwt.sign(
           {
                id: user.id,
                admin: user.admin
                },
                "secretkeyvip",
                {expiresIn: "30s"}
        )
    },
    //Login user
    loginUser: async(req, res)=>{
        try {
            const user = await User.findOne({username: req.body.username})
            if (!user) {
                res.status(404).json("wrong username!");
            }
            const passwordvalid = await bcrypt.compare(
                req.body.password,
                user.password
            )
            if (!passwordvalid) {
                res.status(404).json("wrong password!")
            }
            if (user && passwordvalid) {
               const accessToken =  authController.accessTokenVipPro(user)
                const refreshToken = authController.accessTokenVipProSieuCap(user)
                refreshTokens.push(refreshToken)
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                })
                const {password, ...others} = user._doc
                res.status(200).json({...others, accessToken});
            }
        } catch (err) {
            res.status(500).json(err)
        }
    },
    refreshTokenReq: async(req, res)=> {
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) return res.status(401).json("you are not auth");
        if(!refreshTokens.includes(refreshToken)) {
            return res.status(403).json("refresh token is not valid")
        }
        jwt.verify(refreshToken, "secretkeyvip", (err, user)=>{
            if(err){
                console.log(err)
            }
            refreshTokens = refreshTokens.filter((token)=> token !== refreshToken)
            const newAccessToken = authController.accessTokenVipPro(user)
            const newRefreshToken = authController.accessTokenVipProSieuCap(user)
            refreshTokens.push(newRefreshToken)
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict"
            })
            res.status(200).json({accessfull: newAccessToken})
        })
    },
    usersLogout: async (req, res)=>{
        res.clearCookie("refreshToken")
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken)
        res.status(200).json("đăng xuất thành công")
    }

}
module.exports= authController