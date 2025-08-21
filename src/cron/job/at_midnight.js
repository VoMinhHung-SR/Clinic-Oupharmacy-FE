import { CronJob } from "cron";
import { setListExamToday } from "../../lib/utils/helper";
import { endpoints } from "../../config/APIs";
import { SERVER } from "../../lib/constants";


export const jobMidnight = () => {
    // [ 0 0-7 * * * ] : every one hour in 0-7 AM
    const job = new CronJob('0 0-7 * * *', () => {
        fetch(SERVER + endpoints['get-list-exam-today'])
          .then((response) => response.json())
          .then((data) => {
            setListExamToday(data);
          })
          .catch((error) => console.log(error));
    });

    job.start();
}