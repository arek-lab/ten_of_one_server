require('dotenv').config();
module.exports = {
  auth: {
    api_key: process.env.NODE_MAILER_API_KEY,
    domain: process.env.NODE_MAILER_DOMAIN,
  },
};
