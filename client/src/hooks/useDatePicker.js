import moment from "moment/moment";

export const dateFromDateString = (dateString) => {
    //return moment(new Date(dateString)).format('YYYY-MM-DDT00:00:00.000');
    return moment(new Date(dateString)).format();
};
export const dateForPicker = (dateString) => {
    return moment(new Date(dateString)).format('YYYY-MM-DD')
};