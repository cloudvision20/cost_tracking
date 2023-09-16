import moment from "moment/moment";
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const dateFromDateString = (dateString) => {
    //return moment(new Date(dateString)).format('YYYY-MM-DDT00:00:00.000');
    return moment(new Date(dateString)).format();
};
export const dateForPicker = (dateString) => {
    return moment(new Date(dateString)).format('YYYY-MM-DD')
};
export const todayForPicker = () => {
    return moment(new Date()).format('YYYY-MM-DD')
};
export const today2Weekday = () => {
    return weekday[(new Date()).getDay()]
};
export const date2Weekday = (dateString) => {
    return weekday[(new Date(dateString)).getDay()]
};