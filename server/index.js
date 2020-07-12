const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var jwt = require('jsonwebtoken')

const {auth} = require('./middleware/auth');
const { User } = require("./models/User");

const config = require('./config/key');





//application/x-xxx-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
//application/json
app.use(bodyParser.json());
//cookieParser사용하려면 써줘야한다. 
app.use(cookieParser());

const mongoose = require('mongoose')

mongoose.connect(config.mongoURI, {
    useNewUrlParser:true, useUnifiedTopology:true, useCreateIndex:true, useFindAndModify:false
}).then(()=> console.log('MongoDB Connected..'))
.catch(err => console.log(err))




app.get('/', (req, res) => {
    res.send('Hello World!~~ ')
})


app.get('/api/hello', (req, res)=>{
    
    //원래는 여기서 req받은거 처리해준다. 

    res.send("안녕하세요. ");
})


app.post('/api/user/register', (req, res) => {
    //회원가입할때 필요한 정보들을 client에서 가져오면 
    //그것들을 데이터 베이스에 넣어준다. 
    const newUserInfo = new User(req.body)

    newUserInfo.save((err, userInfo) => {
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success:true
        })
    })
})





app.post('/api/user/login', (req, res) => {

    console.log("로그인 요청");

    //1. 요청된 이메일이 데이터베이스에 잇는지 확인
    User.findOne({ email : req.body.email}, (err, userInfo) => {
        if(!userInfo){
            return res.json({
                loginSuccess: false,
                message : "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }



        //email이 일치하는 하나의 userInfo.         
        //2. 요청된 비밀번호가 등록된 비밀번호와 같은지 확인
        userInfo.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({
                    loginSuccess : false,
                    message : "비밀번호가 틀렸습니다."
                });

            //3. 비밀번호도 일치한다면 토큰을 생성한다. 
            userInfo.generateToken((err, user) =>{

                if(err) return res.status(400).send(err);
                
                res.cookie("x_auth", user.token)
                .status(200)
                .json({
                    loginSuccess:true,
                    userId: user._id
                })
            })
        })

    })
})

//의문, 중간에 오는것은 미들웨어이다? 
app.get('/api/user/auth', auth,  (req, res) =>{
    //여기까지 왓다? => 미들웨어를 통과했다. 
    //Authentication이 True이다. 

    res.status(200).json({
        _id : req.user._id,
        isAdmin : req.user.role == 0 ? false : true,
        isAuth : true,
        email : req.user.email,
        name : req.user.name,
        lastname : req.user.lastname,
        role : req.user.role,
        image : req.user.image
    })

})


app.get('/api/user/logout', auth, (req, res)=>{

    User.findOneAndUpdate( {_id : req.user_id}, {token : ""}, (err, user) =>{
        if(err) return res.json({
            success : false, err
        })
        return res.status(200).send({
            success:true
        })
    })

})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))