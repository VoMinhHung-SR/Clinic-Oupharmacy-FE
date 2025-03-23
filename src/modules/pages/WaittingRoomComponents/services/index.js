
// TODO: Remove
// export const generateQueryGetExamsListPerDay = (date) => {
//     const todayStr = moment(date).format('YYYY-MM-DD');
//     const waitingRoomRef = doc(db, `${APP_ENV}_waiting-room`, todayStr);

//     return new Promise((resolve, reject) => {
//       const unsubscribe = onSnapshot(waitingRoomRef, (docSnapshot) => {
//         if (docSnapshot.exists()) {
//           const examsArray = docSnapshot.data().exams;
//           resolve(examsArray);
//         } else {
//           resolve([]);
//         }
//       }, (error) => {
//         reject([]);
//       });
  
//       return () => unsubscribe();
//     });
//   }