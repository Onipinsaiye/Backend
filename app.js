//import modules
import express from "express";

import bodyParser from "body-parser";

import mongoose from "mongoose";

import cors from "cors";

import pg from "pg";

import env from "dotenv";

import bcrypt  from "bcrypt";

import path from "path";

import { fileURLToPath } from "url";

const app = express();

const port = process.env.PORT || 7000;

const hashing = 15;

//Convert `import.meta.url` to a file path
const _filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(_filename)

//Middleware
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.urlencoded({extended: false}));

app.use("/static", express.static(path.join(__dirname, "../frontend/public")));

app.set("views", path.join(__dirname, "../frontend/views"))

app.set("view engine", "ejs");

//Mongodb models- Get gift card
mongoose.connect("mongodb://127.0.0.1:27017/AfribreathDB")

const GetGiftCardSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },

    organization: {
        type: String,
        require: true
    },

    nameOfOrganization: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },

    phoneNummber: {
        type: Number,
        require: true
    },
    
    noOfCards:{
        type: Number,
    },

    ratePerCard:{
        type: Number,
    },

    discount:{
        type: Number,
    },

    totalAmount:{
        type: Number
    },

    date:{
        type: Date,
        default: Date.now
    }
});

const GetGiftCard = new mongoose.model("GetGiftCard", GetGiftCardSchema);


//Mongodb models-Redeem gift card
const RedeemGiftCardSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    organization: {
        type: String,
        require: true
    },

    nameOfOrganinzation:{
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true
    },

    phoneNumber: {
        type: String,
        require: true
    },

    studentName: {
        type: String,
    },

    studentEmail: {
        type: String,
    },

    studentPhoneNumber: {
        type: String
    },

    studentRole:{
        type: String
    },

    studentSkill: {
        type: String,
    }
});

const RedeemGiftCard = new mongoose.model("RedeemGiftcard", RedeemGiftCardSchema);

//Mongodb models-Individual application
const IndividualApplicationSchema = new mongoose.Schema({
    firstName:{
        type: String,
        require: true
    },
    lastName:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true
    },
    startTime:{
        type: String,
        require: true
    },
    workHours:{
        type: String,
        require: true
    },
    country:{
        type: String,
        require: true
    },
    experience:{
        type: String,
        require: true
    },
    primarySkill:{
        type: String,
        require: true
    },
    otherSkills:{
        type: String
    },
    englishProficiency:{
        type: String,
        require: true
    },
    resume:{
        type:String,
    },
    coverLetter:{
        type:String,
    },
    recommendationLetter:{
        type: String,
    },
    date:{
        type: Date,
        default: Date.now
    }
});


const IndividualApplication = new mongoose.model("IndividualApplication", IndividualApplicationSchema);

//Mongodb models-Instructor application
const InstructorApplicationSchema = new mongoose.Schema({
    identity:{
        type: String,
        require: true
    },
    terms:{
        type: String,
        require: true
    },
    paymentProof:{
        type: String,
        require: true
    },
    coverLetter:{
        type: String,
    },
    date:{
        type: Date,
        debugger: Date.now
    }
});

const InstructorApplication = new mongoose.model("InstructorApplication", InstructorApplicationSchema);


// Get Routes
app.get("/", (req, res)=>{
    res.render("index")
    // res.send("Landing page has loaded successfully!")
});

app.get("/about", (req, res)=>{
    res.render("about")
});

app.get("/careers", (req, res)=>{
    res.render("careers")
});

app.get("/contact", (req, res)=>{
    res.render("contact")
});

app.get("/how-it-works", (req, res)=>{
    res.render("how-it-works")
});

app.get("/partnership", (req, res)=>{
    res.render("partnership")
});

app.get("/privacy", (req, res)=>{
    res.render("privacy")
});

app.get("/terms", (req, res)=>{
    res.render("terms")
});

const amount = ""
app.get("/get-gift-card", async(req, res)=>{
    try{

        const result = await GetGiftCard.find()
        const resultData = result[0]
        console.log(resultData)
        res.render("get-gift-card",{
            total: "Total amount", data: result
        })

    }catch(err){
        console.log("Connection error", err)
    }
})


app.get("/redeem-gift-card", (req, res)=>{
    res.render("redeem-gift-card")
})

//post routes
app.post("/get-gift-card", async(req, res)=>{

        try{
            var button = req.body.btn;

            let numberOfCards = req.body.noOfCards;

            let ratePerCard = req.body.ratePerCard;

            let totalToPay = numberOfCards * ratePerCard;

            let name = req.body.name;
            
            if(button === "" && name !== " "){
                
                const data = new GetGiftCard(
                    {
                        name: req.body.name,
                        organization: req.body.organization,
                        nameOfOrganinzation: req.body.nameOfOrganinzation,
                        email: req.body.email,
                        phoneNumber: req.body.phoneNumber,
                        noOfCards: req.body.noOfCards,
                        ratePerCard: req.body.ratePerCard,
                        discount: req.body.discount,
                        totalAmount: totalToPay
            
                    }
                    
                ) 
        
                await data.save()

                console.log("User created successfully: ", data)
                res.redirect("/get-gift-card")
            }else{
                res.send("Data creation failed please try again")
            }
    
        }catch(err){
            console.log("Activity was not successful", err)
        }

});

app.post("/redeem-gift-card", async(req, res)=>{
    try{

        var button = req.body.btn;

        var name = req.body.name;

        var organization = req.body.organization;

        var email = req.body.email;


        if(button === "" && name !== "" && organization !== "" && email !== ""){
            const data = new RedeemGiftCard({
                name: name,
                organization: organization,
                nameOfOrganinzation: req.body.nameOfOrganinzation,
                email: email,
                phoneNumber: req.body.phoneNumber,
                studentName: req.body.studentName,
                studentEmail: req.body.studentEmail,
                studentPhoneNumber: req.body.studentPhoneNumber,
                studentRole: req.body.studentRole,
                studentSkill: req.body.studentSkill

            })

            await data.save()
            console.log("Data was created successfully: ", data)
            res.redirect("/redeem-gift-card")
        }else{
            res.send("Activity was not successful, please try again")
        }

    }catch(err){
        console.log(err)
    }
});

app.post("/individual-application", async(req, res)=>{
    try{

        let button = req.body.btn;

        let firstName = req.body.firstName;

        let lastName = req.body.lastName;

        if(button === "" && firstName !== "" && lastName !== ""){

            const data = new IndividualApplication({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                startTime: req.body.startTime,
                workHours: req.body.workHours,
                country: req.body.country,
                experience: req.body.experience,
                primarySkill: req.body.primarySkill,
                otherSkills: req.body.otherSkills,
                englishProficiency: req.body.englishProficiency,
                resume: req.body.resume,
                coverLetter: req.body.coverLetter,
                recommendationLetter: req.body.recommendationLetter
            });
    
            await data.save()
            console.log("Data was successfully created: ", data)
            res.redirect("/individual-application")

        }else{
            res.send("Data creation activity was not successful, please try again")
        }

    }catch(err){
        console.log(err)
    }
})


app.post("/instructor-application", async(req, res)=>{
    try{

        let button = req.body.btn;

        let identity = req.body.identity;

        let terms = req.body.terms;

        if(button === " " && identity !== "" && terms !== ""){

            const data = new InstructorApplication({
                identity: req.body.identity,
                terms: req.body.terms,
                paymentProof: req.body.paymentProof,
                coverLetter: req.body.coverLetter
            })
    
            await data.save()
            console.log("Data was successfully created: ", data)
            res.redirect("/instructor-application")

        }else{
            res.send("Data creation activity was not successful, please try again")
        }




    }catch(err){
        console.log(err)
    }
})
//connect server
app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
});

