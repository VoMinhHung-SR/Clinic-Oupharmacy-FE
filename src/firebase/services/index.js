// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import nodemailer from 'nodemailer';
// import moment from 'moment';
// import { CURRENT_DATE } from '../../lib/constants';

// admin.initializeApp();

// const firestore = admin.firestore();

// export const sendReminderEmails = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {
//   // Get the current timestamp
//   const now = new Date();

//   // Construct the end timestamp for the exams
//   const end = new Date(now.getTime() + 120000); // Add 120000 ms (2 minutes) to the current timestamp

//   // Query Firestore for exams that are due for a emailRemind email
//   const query = firestore.collection(`waiting-room/${moment(CURRENT_DATE).format('YYYY-MM-DD')}/exams`)
//     .where('emailRemind', '==', false)
//     .where('isCommitted', '==', false)
//     .where('startTime', '<=', end);

//   const snapshot = await query.get();

//   // Send reminder emails for the exams that match the query
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: import.meta.env.VITE_EMAIL_USERNAME_ACCOUNT, // Replace with your Gmail address
//       pass: import.meta.env.VITE_EMAIL_PASSWORD_ACCOUNT // Replace with your Gmail password
//     }
//   });

//   snapshot.forEach(async (doc) => {
//     const exam = doc.data();

//     // Update the exam's emailRemind field to true
//     await doc.ref.update({ emailRemind: true });

//     // Construct the email message
//     const message = {
//       from: import.meta.env.VITE_EMAIL_USERNAME_ACCOUNT, // Replace with your Gmail address
//       to: exam.author, // Use recipient email from the document
//       subject: 'Reminder: Your exam is starting soon',
//       text: `Your exam (ID: ${exam.examID}) is starting at ${exam.startTime}. Don't forget to log in and start the exam before it's too late!`
//     };

//     // Send the email
//     await transporter.sendMail(message);
//   });
// });
