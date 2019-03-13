const ctx = require('../context')
const messageStrategy = require('./strategy/messageStrategy')
const {Wit, log} = require('node-wit');

const witClient = new Wit({
    accessToken: process.env.WIT_AI_ACCESS_TOKEN,
    logger: new log.Logger(log.DEBUG)
});

module.exports = async (user, message) => {

    console.log(`Got a message: ${message}`)
    let context = await ctx.getContext(user);
    console.log(`Context is: ${JSON.stringify(context)}`)

    let intent;
    let payload;

    try {
        let data = await witClient.message(message, {})
        if (Array.isArray(data.entities.intent)) {
            intent = data.entities.intent[0].value;
            payload = data;
        }
        else {
            intent = null;
            payload = data;
        }
        console.log(`Intent is: ${intent}`)
        let replies = await messageStrategy(context, intent, message, user);
        console.log(`REPLIES: ${replies}`)
        return replies;
    }
    catch(e) {
      console.error(e);
      return {
        "type": "text",
        "text": "Maaf, ada kesalahan."
      }
    }    
}