const twitter = require('../utils/twitter');
const sendGrid = require('../utils/sendgrid');

exports.handler = async (event, context)=>{
         try{
             //Validate the request method and the authorization header
             if(event.httpMethod != 'POST') return {statusCode: 404}
             //404 code for no reveal(401 works too but reveals that the endpoint exists, our cron job will 
             //always have its authorization header set so we can safely assume any access w/o it is someone else.
             if(!event.headers.authorization)  return {statusCode: 404};
             //check for valid authorization value
             const basicAuth = (new Buffer(`${process.env.AUTH_USER}:${process.env.AUTH_PASS}`)).toString('base64')
             if(event.headers.authorization.split(' ')[1] !== basicAuth) return {statusCode: 404};
             //get tweets
             const tweets = await twitter();
             //send email if there are tweets available
             if(tweets.length > 0) await sendGrid(tweets);
             // success
             return {statusCode: 200}
             
         }catch(err){
             console.log(err)
             //error
             return {statusCode: 500}
         }
}