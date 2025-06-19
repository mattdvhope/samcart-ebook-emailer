const mailgun = require('mailgun-js');

exports.handler = async function (event, context) {
  console.log("📥 Function triggered. Raw event body:", event.body);

  const data = JSON.parse(event.body || '{}');
  const email = data?.orderSummary?.customer?.email;

  if (!email) {
    console.error("❌ No customer email found.");
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing customer email' }),
    };
  }

  console.log("📧 Email to send:", email);

  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

  const emailData = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `How to Start Reading Your Ebook`,
    html: `Thanks for your purchase! Click <a href="https://www.sourceofallwealth.com/e-book-install-instructions">here</a> to get instructions on how to open your ebook.`,
  };

  console.log("📨 Mailgun payload:", emailData);

  try {
    const response = await mg.messages().send(emailData);
    console.log("✅ Mailgun response:", response);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error("🚨 Mailgun error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Email failed to send', error: error.message }),
    };
  }
};
