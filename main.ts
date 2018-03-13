import * as tock from './tock';

export default function myFunction() {
    const res = tock.getUserData();
    Logger.log(res[0]);
}
