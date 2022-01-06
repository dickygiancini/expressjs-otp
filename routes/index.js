var express = require('express');
var router = express.Router();
var connection = require('../lib/db');
var mysql = require('mysql');
var req = require('express/lib/request');
var res = require('express/lib/response');
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var email;

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service : 'Gmail',
    
    auth: {
      user: 'kangbejo1999@gmail.com',
      pass: 'dicky123#',
    }
});

router.get('/register', function(req, res) {
    res.render('register', { 
        title: 'Register',
        username: 'qwe',
        email: 'dicky.giancini.123@gmail.com'
    });
});

router.post('/register', (req, res, next) => {
    // res.redirect('/')
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;

    var otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);

    try {
        connection.query('SELECT * FROM users WHERE username = '+username, (err, result) => {
            if(err)
            {
                req.flash('error', err)
                // res.redirect('/')
                res.redirect('/')
            }
            else
            {
                if(result && result.length)
                {
                    req.flash('error', 'Username exists, please enter new one')
                    res.redirect('/')
                }
                // else
                // {
                    
                // }
            }
        })

        var mailOptions={
          to: email,
          subject: "Otp for registration is: ",
          html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
        };

        connection.query('INSERT INTO users (username,email,password,is_verified,otp) VALUES ("'+username+'","'+email+'","'+password+'","0","'+otp+'")', (err, result) => {
            if(err)
            {
                req.flash('error', err)
                res.redirect('/register', {
                    username: username,
                    email: email
                })
            }
            else
            {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }

                    // console.log('Message sent: %s', info.messageId);   
                    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
              
                    // res.redirect('otp');

                    req.flash('success', 'Message sent: %s', info.messageId);
                    res.redirect('/otp', {
                        title: 'OTP Verification',
                        email: email,
                        username: username
                    });
                });
            }
        })
    } catch (error) {
        req.flash('error', err)
        res.redirect('/')
    }
})

router.post('/register/resend', (req, res) => {
    let username = req.body.username;

    var otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);

    var mailOptions={
        to: email,
        subject: "Otp for registration is: ",
        html: "<h3>OTP for account verification is </h3>"  + "<h1 style='font-weight:bold;'>" + otp +"</h1>" // html body
    };

    try {
        var otpcode = {
            otp: otp
        }

        connection.query('UPDATE users SET ? where username = "'+username+'"', otpcode, (err, result) => {
            if(err)
            {
                req.flash('error', err)
                res.render('/otp', {
                    username: username,
                    email: email
                })
            }
            else
            {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }

                    // console.log('Message sent: %s', info.messageId);   
                    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
              
                    // res.render('otp');

                    req.flash('success', 'Message sent: %s', info.messageId);
                    res.render('/otp', {
                        title: 'OTP Verification',
                        email: email,
                        username: username
                    });
                });
            }
        })
    } catch (error) {
        req.flash('error', err)
        res.redirect('/otp')
    }
})
module.exports = router;
