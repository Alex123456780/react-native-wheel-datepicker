/**
 * @prettier
 * @flow
 * */

import moment from 'moment'

// https://github.com/moment/moment/issues/2962#issuecomment-418108517
// https://github.com/moment/moment/issues/2962#issuecomment-255637859
import 'moment/locale/ru';

moment.locale('ru');

const WEEK = 7;
const TODAY = 'Сегодня';
const TOMORROW = 'Завтра';
const ONE_SECOND = 1000;
const ONE_DAY_IN_MS = 86400 * ONE_SECOND;

export function emptyFunction () {}

export function getTimezoneOffset(current_timezone, user_timezone) {
    return zone_time = (user_timezone - current_timezone) * 60 * 60 * 1000;
}

export function increaseDateByDays(numOfDays = 0, time_offset = 0) {
    const current_date = new Date(Date.now() + time_offset);
    current_date.setDate(current_date.getDate() + numOfDays);
    return current_date;
}

export function pickerDateArray(date = 0, init_date_ms = 0) {
    const chosen_date = new Date(date + init_date_ms);
    let startDate = new Date(Date.now() + init_date_ms);
    startDate.setHours(0,0,0,0);
    const user_date_ms = Date.parse(chosen_date);
    const start_date_ms = Date.parse(startDate);
    let init_day_pos = 0;
    const arr = [];
    arr.push(TODAY);
    arr.push(TOMORROW);

    if (user_date_ms >= start_date_ms + ONE_DAY_IN_MS) {
        init_day_pos++;
    }

    for (let i = 2; i < WEEK + 1 ; i++) {
        const ithDateFromStartDate = start_date_ms + (i * ONE_DAY_IN_MS);
        if (user_date_ms >= ithDateFromStartDate) {
            init_day_pos++;
        }
        arr.push(formatDatePicker(ithDateFromStartDate));
    }
    return {
        chosen_date,
        init_day_pos,
        days_arr: arr,
    };
}

function formatDatePicker(date_in_ms = 0) {
    return moment.unix(date_in_ms / ONE_SECOND).format('D MMM');
}

function timeToString(time_value) {
    return time_value < 10 ? `0${time_value}` : `${time_value}`;
}

export function dateToString(date = new Date(), symbol='-') {
    const year = date.getFullYear();
    const month = timeToString(date.getMonth() + 1);
    const day = timeToString(date.getDate());
    const hour = timeToString(date.getHours());
    const minute = timeToString(date.getMinutes());
    return `${year}${symbol}${month}${symbol}${day} ${hour}:${minute}`;
}

function checkFirstMinutes(minutes_list, day_pos, hour_pos, day, minute) {
    const minute_pos = minutes_list.findIndex(function(el) {
        return Number(el) >= minute;
    });
    if (minute_pos !== -1) {
        return {
            chosen_day_pos: day_pos,
            chosen_hour_pos: hour_pos,
            chosen_minute_pos: minute_pos,
            chosen_day: day,
            chosen_minutes_value: 'start_hour',
        }
    }
    else {
        return {
            chosen_day_pos: day_pos,
            chosen_hour_pos: hour_pos + 1,
            chosen_minute_pos: 0,
            chosen_day: day,
            chosen_minutes_value: 'middle_hour',
        }
    }
}

function checkLastMinutes(time_list, minutes_list, day_pos, hour_pos, day, minute) {
    const minute_pos = minutes_list.findIndex(function(el) {
        return Number(el) >= minute;
    });
    if (minute_pos !== -1) {
        return {
            chosen_day_pos: day_pos,
            chosen_hour_pos: hour_pos,
            chosen_minute_pos: minute_pos,
            chosen_day: day,
            chosen_minutes_value: 'end_hour',
        }
    }
    else {
        const next_day = (day + 1) % 6;
        const next_day_time_list = time_list[`${next_day}`];
        const next_day_first_hour = Number(next_day_time_list.hours[0]);
        const next_day_first_minute = Number(next_day_time_list.minutes.start_hour[0]);
        return checkDay(time_list, next_day_time_list, (day_pos + 1) % 6, next_day, next_day_first_hour, next_day_first_minute)
    }
}

function checkMiddleMinutes(minutes_list, day_pos, hour_pos, hours_list_length, day, minute) {
    const minute_pos = minutes_list.findIndex(function(el) {
        return Number(el) >= minute;
    });
    if (minute_pos !== -1) {
        return {
            chosen_day_pos: day_pos,
            chosen_hour_pos: hour_pos,
            chosen_minute_pos: minute_pos,
            chosen_day: day,
            chosen_minutes_value: 'middle_hour',
        }
    }
    else {
        return {
            chosen_day_pos: day_pos,
            chosen_hour_pos: hour_pos + 1,
            chosen_minute_pos: 0,
            chosen_day: day,
            chosen_minutes_value: hour_pos + 1 < hours_list_length ? 'middle_hour' : 'end_hour',
        }
    }
}

function checkDay(time_list, day_time_list, day_pos, day, hour, minute) {

    const hours_list = day_time_list.hours;
    const minutes_object = day_time_list.minutes;

    const hour_pos = hours_list.indexOf(timeToString(hour));

    if (hour_pos !== -1) {
        if (hour_pos === 0) {
            return checkFirstMinutes(minutes_object.start_hour, day_pos, hour_pos, day, minute);
        }
        else if (hour_pos === hours_list.length - 1) {
            return checkLastMinutes(time_list, minutes_object.end_hour, day_pos, hour_pos, day, minute);
        }
        else {
            return checkMiddleMinutes(minutes_object.middle_hour, day_pos, hour_pos, hours_list.length - 1, day, minute);
        }
    }
    else {
        if (hour < Number(hours_list[0])) {
            return {
                chosen_day_pos: day_pos,
                chosen_hour_pos: 0,
                chosen_minute_pos: 0,
                chosen_day: day,
                chosen_minutes_value: 'start_hour',
            }
        }
        else {
            return {
                chosen_day_pos: (day_pos + 1) % 6,
                chosen_hour_pos: 0,
                chosen_minute_pos: 0,
                chosen_day: (day + 1) % 6,
                chosen_minutes_value: 'start_hour',
            }
        }
    }
}

export function getDatePosition(time_list, day, hour, minute, day_pos = 0) {
    return checkDay(time_list, time_list[`${day}`], day_pos, day, hour, minute)
}