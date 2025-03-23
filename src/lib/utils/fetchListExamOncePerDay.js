import moment from "moment";
import { getListExamToday } from "./helper";

export function fetchListExamOncePerDay(url, onDataLoaded, onChangedParams) {
    return new Promise((resolve, reject) => {
      // Get the current date
      const today = new Date().toLocaleDateString()
      const todayStr = moment(today).format('YYYY-MM-DD')
      // Check if the last fetch was executed before today

      const lastFetchDate = localStorage.getItem("lastFetchDate");
      const lastTotalListExam = localStorage.getItem("lastTotalListExam")
      if (!lastFetchDate || lastFetchDate < todayStr || onChangedParams && lastTotalListExam !== onChangedParams.toString() || !lastTotalListExam) {
        // Execute the fetch API
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            
            // Update the last fetch date
            localStorage.setItem("lastFetchDate", todayStr);
            localStorage.setItem("lastTotalListExam", onChangedParams.toString());

            // Call the callback function with the fetched data
            onDataLoaded(data);

            // Resolve the promise with the fetched data
            resolve(data);
          })
          .catch((error) => reject(error));
      } else {
        // Call the callback function with the fetched data
        const data = getListExamToday();
        // onDataLoaded(data);
        
        // Resolve the promise with the fetched data
        resolve(data);
      }
    });
  }