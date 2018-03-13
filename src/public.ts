import * as tock from './tock';

export function logExampleTimecardInfo() {
    const res = tock.getTimecards({
      date: '2018-03-05',
      user: 'atul.varma',
    });
    Logger.log(res[0]);
}
