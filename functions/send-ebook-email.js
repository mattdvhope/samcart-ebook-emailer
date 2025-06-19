const mailgun = require('mailgun-js');

exports.handler = async function (event, context) {
  const data = JSON.parse(event.body || '{}');
  const email = data?.orderSummary?.customer?.email;

  if (!email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing customer email' }),
    };
  }

  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

  const emailData = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: 'How to Start Reading Your Ebook',
    text: 'Thanks for your purchase! Click here to get instructions on how to open your ebook: https://www.sourceofallwealth.com/e-book-install-instructions',
  };

  try {
    await mg.messages().send(emailData);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Email failed to send', error: error.message }),
    };
  }
};
