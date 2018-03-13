import { TOCK_API_KEY } from './config';

const TOCK_API_URL = "https://tock.18f.gov/api";

export default function myFunction() {
  var response = UrlFetchApp.fetch(`${TOCK_API_URL}/user_data.json`, {
    headers: {
      'Authorization': `Token ${TOCK_API_KEY}`
    }
  });
  Logger.log(response.getContentText());
}
