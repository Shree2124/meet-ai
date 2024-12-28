import { createTransport } from "nodemailer";
import { CronJob } from "cron";
import { format, subMinutes } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const sendMail = async (email: any, subject: any, data: any) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_ADDRESS!,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD!,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        h1 {
            color: red;
        }
        p {
            margin-bottom: 20px;
            color: #666;
        }
        .otp {
            font-size: 36px;
            color: #7b68ee; /* Purple text */
            margin-bottom: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>OTP Verification</h1>
        <p>Hello ${data.name} your (One-Time Password) for your account verification is.</p>
        <p class="otp">${data.otp}</p> 
    </div>
</body>
</html>
`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject,
    html,
  });
};

export default sendMail;

export const sendForgotMail = async (subject: any, data: any) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_PASSWORD!,
      pass: process.env.NEXT_PUBLIC_EMAIL_ADDRESS!,
    },
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f3f3;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      padding: 20px;
      margin: 20px auto;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      max-width: 600px;
    }
    h1 {
      color: #5a2d82;
    }
    p {
      color: #666666;
    }
    .button {
      display: inline-block;
      padding: 15px 25px;
      margin: 20px 0;
      background-color: #5a2d82;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 16px;
    }
    .footer {
      margin-top: 20px;
      color: #999999;
      text-align: center;
    }
    .footer a {
      color: #5a2d82;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Reset Your Password</h1>
    <p>Hello,</p>
    <p>You have requested to reset your password. Please click the button below to reset your password.</p>
    <a href="${process.env.frontendurl}/reset-password/${data.token}" class="button">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    <div class="footer">
      <p>Thank you,<br>Your Website Team</p>
      <p><a href="https://yourwebsite.com">yourwebsite.com</a></p>
    </div>
  </div>
</body>
</html>
`;

  await transport.sendMail({
    from: process.env.Gmail,
    to: data.email,
    subject,
    html,
  });
};

const sendMeetingNotification = async (
  email: string,
  subject: string,
  data: {
    name: string;
    meetingTitle: string;
    meetingTime: Date;
    roomId: string;
    type: string;
  }
) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL_ADDRESS!,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD!,
    },
  });

  await transport.sendMail({
    from: process.env.Gmail,
    to: email,
    subject: `Reminder ${subject} meeting starts in 10 minutes!`,
    html: getMeetingNotificationHTML(data),
  });
};

export const scheduleMeetingNotification = (
  meetingData: {
    name: string;
    email: string;
    subject: string;
    meetingTitle: string;
    meetingTime: Date;
    roomId: string;
    type: string;
  },
  minutesBefore: number = 10
) => {
  /* Notification time, email should be sent before 10 minutes of the meeting! */
  const notificationTime = subMinutes(meetingData.meetingTime, minutesBefore);

  const job = new CronJob(
    notificationTime,
    async function () {
      try {
        await sendMeetingNotification(meetingData.email, meetingData.subject, {
          name: meetingData.name,
          meetingTime: meetingData.meetingTime,
          meetingTitle: meetingData.meetingTitle,
          roomId: meetingData.roomId,
          type: meetingData.type,
        });

        const istTime = toZonedTime(new Date(), "Asia/Kolkata");
        console.log(
          `Meeting notification sent successfully to ${meetingData.email} at ${format(istTime, "PPpp")} IST`
        );
      } catch (error) {
        console.error("Failed to send email notification: ", error);
      }
      job.stop();
    },
    null,
    true,
    "Asia/Kolkata"
  );
};

const getMeetingNotificationHTML = (data: {
  name: string;
  meetingTitle: string;
  meetingTime: Date;
  roomId: string;
  type: string;
}) => {
  // Convert UTC to IST for display
  const istTime = toZonedTime(data.meetingTime, "Asia/Kolkata");

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meeting Reminder</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f3f3f3;
        margin: 0;
        padding: 0;
      }
      .container {
        background-color: #ffffff;
        padding: 20px;
        margin: 20px auto;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        max-width: 600px;
      }
      h2 {
        color: #5a2d82;
        margin-bottom: 24px;
      }
      p {
        color: #666666;
        line-height: 1.6;
        margin: 12px 0;
      }
      ul {
        list-style-type: none;
        padding-left: 0;
      }
      li {
        color: #666666;
        margin: 10px 0;
        padding: 8px;
        background-color: #f8f8f8;
        border-radius: 4px;
      }
      .meeting-link {
        display: inline-block;
        padding: 12px 20px;
        margin: 16px 0;
        background-color: #5a2d82;
        color: white !important;
        text-decoration: none;
        border-radius: 4px;
        font-size: 16px;
      }
      .room-id {
        font-weight: bold;
        color: #5a2d82;
      }
      .footer {
        margin-top: 24px;
        padding-top: 16px;
        border-top: 1px solid #eee;
        color: #999999;
      }
      strong {
        color: #5a2d82;
      }
      a {
        color: #5a2d82;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Meeting Reminder</h2>
      
      <p>Hello ${data.name},</p>
      
      <p>This is a reminder that your meeting "${data.meetingTitle}" starts in 10 minutes.</p>
      
      <p><strong>Meeting Details:</strong></p>
      <ul>
        <li>Time: ${format(istTime, "PPpp")} IST</li>
        <li>Meeting Code: <span class="room-id">${data.roomId}</span></li>
      </ul>
      
      <p>Please ensure you're ready to join the meeting on time.</p>
      <p>Log in from your account and join the meeting with the given code.</p>

      ${
        data.type !== "private"
          ? `<p>Alternatively, you can join as a guest by clicking the link below:</p>
             <a href="http://localhost:3000/user/meeting/${data.roomId}" class="meeting-link">
               Join Meeting
             </a>`
          : `<p>As this is a private meeting, please ensure you are logged in before joining.</p>`
      }
      
      <div class="footer">
        <p>Best regards,<br/>MeetAI Team</p>
      </div>
    </div>
  </body>
  </html>`;
};
