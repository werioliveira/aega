module.exports = {
    async captchaVerified(req, res, next) {
        if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
            //return res.redirect(401,'/register'); 
            return res.render('main/register',{error: "Captcha Incorreto"})
        }
        // Put your secret key here.
        var secretKey = process.env.SECRET_CAPTCHA;
        // req.connection.remoteAddress will provide IP address of connected user.
        var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
        // Hitting GET request to the URL, Google will respond with success or error scenario.
        request(verificationUrl,function(error,response,body) {
            body = JSON.parse(body);
            // Success will be true or false depending upon captcha validation.
            if(body.success !== undefined && !body.success) {
                return res.render('main/register',{error: "Erro no captcha"})
            }
        });
        next();
    }
}