import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,       
        pass: process.env.SMTP_PASS,       
      },
    });

    const info = await transporter.sendMail({
      from: `"SamSyncs Store" <${process.env.SENDER_EMAIL}>`,  
      to,
      subject,
      html,
    });

    console.log(' Email sent:', info.messageId);
  } catch (error) {
    console.error(' Email send failed:', error.message);
    throw new Error('Failed to send email');
  }
};
