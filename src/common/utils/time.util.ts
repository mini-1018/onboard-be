import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');

class Time {
  calculateTimeGap(createAt: Date | string): string {
    return dayjs(createAt).fromNow();
  }

  currentTime(createAt: Date | string): string {
    return dayjs(createAt).format('YYYY-MM-DD');
  }
}

export const currentTime = new Time().currentTime;
