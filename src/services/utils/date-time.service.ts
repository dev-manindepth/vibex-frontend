import { format } from 'date-fns';
class DateTimeUtil {
  static transform(value: string | Date) {
    const date = typeof value === 'string' ? new Date(value) : value;
    return this.prototype.timeDifference(new Date(), new Date(date));
  }
  static dayMonthYear(value: string | Date) {
    const date = typeof value === 'string' ? new Date(value) : value;
    return format(date, 'd MMMM yyyy');
  }
  static timeFormat(value: string | Date) {
    const date = typeof value === 'string' ? new Date(value) : value;
    return format(date, 'HH:mm a');
  }
  private timeDifference(current: Date, date: Date) {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const elapsed = current.valueOf() - date.valueOf();
    if (format(current, 'yyyy') === format(date, 'yyyy')) {
      if (elapsed < msPerMinute) {
        return this.secondsAgo(elapsed);
      } else if (elapsed < msPerHour) {
        return this.minutesAgo(elapsed, msPerMinute);
      } else if (elapsed < msPerDay) {
        return this.hoursAgo(elapsed, msPerHour);
      } else if (elapsed < msPerMonth) {
        return this.monthsAgo(date, elapsed, msPerDay);
      } else {
        return format(date, 'MMM d');
      }
    } else {
      return format(date, 'MMM d, yyyy');
    }
  }

  private secondsAgo(elapsed: number) {
    if (Math.round(elapsed / 1000) <= 1) {
      return 'a second ago';
    } else {
      return `${Math.round(elapsed / 1000)} seconds ago`;
    }
  }
  private minutesAgo(elapsed: number, msPerMinute: number) {
    if (Math.round(elapsed / msPerMinute) <= 1) {
      return 'a minute ago';
    } else {
      return `${Math.round(elapsed / msPerMinute)} minutes ago`;
    }
  }
  private hoursAgo(elapsed: number, msPerHour: number) {
    if (Math.round(elapsed / msPerHour) <= 1) {
      return 'an hour ago';
    } else {
      return `${Math.round(elapsed / msPerHour)} hours ago`;
    }
  }
  private monthsAgo(date: Date, elapsed: number, msPerDay: number) {
    if (Math.round(elapsed / msPerDay) <= 7) {
      return format(date, 'eeee');
    } else {
      return format(date, 'MMM d');
    }
  }
}

export default DateTimeUtil;
