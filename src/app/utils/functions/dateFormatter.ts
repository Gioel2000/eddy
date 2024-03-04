import moment from 'moment';

export const dateToString = (date: Date) => moment(date).format('YYYY-MM-DD').toString();
export const objToDate = (obj: { year: number; month: number; day: number }) => moment(obj).toDate();
