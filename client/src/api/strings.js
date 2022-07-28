/**
 * Formats a UTC date string so that it's easier to read
 * @param {String} date string representing a UTC date
 * @returns {String} date formatted as a string
 */
 export function getDateString(date) {
    const d = new Date(date)
    const day = d.getUTCDate();
    const month = d.getMonth();
    const year = d.getFullYear();

    var monthString = ""
    switch (month) {
        case 0:
            monthString = "January";
            break;
        case 1:
            monthString = "February";
            break;
        case 2:
            monthString = "March";
            break;
        case 3:
            monthString = "April";
            break;
        case 4:
            monthString = "May";
            break;
        case 5:
            monthString = "June";
            break;
        case 6:
            monthString = "July";
            break;
        case 7:
            monthString = "August";
            break;
        case 8:
            monthString = "September";
            break;
        case 9:
            monthString = "October";
            break;
        case 10:
            monthString = "November";
            break;
        case 11:
            monthString = "December";
            break;
        default:
            monthString = "";
            break;
    }

    return day + " " + monthString + ", " + year;
}

/**
 * Formats a UTC date string so that it's easier to read
 * @param {String} date string representing a UTC date
 * @returns {String} date formatted as a string
 */
 export function getSlashDateString(date) {
    const d = new Date(date)
    const day = d.getUTCDate();
    const month = d.getMonth();
    const year = d.getFullYear();

    var monthString = ""
    switch (month) {
        case 0:
            monthString = "January";
            break;
        case 1:
            monthString = "February";
            break;
        case 2:
            monthString = "March";
            break;
        case 3:
            monthString = "April";
            break;
        case 4:
            monthString = "May";
            break;
        case 5:
            monthString = "June";
            break;
        case 6:
            monthString = "July";
            break;
        case 7:
            monthString = "August";
            break;
        case 8:
            monthString = "September";
            break;
        case 9:
            monthString = "October";
            break;
        case 10:
            monthString = "November";
            break;
        case 11:
            monthString = "December";
            break;
        default:
            monthString = "";
            break;
    }

    return (month + 1) + "/" + day + "/" + year;
}

/**
 * Cuts a string at an index and places an ellipsis
 * @param {String} string input string to cut
 * @param {Number} index last index to show 
 */
export function cutAtIndex(string, index) {
    if (string) {
        return string.slice(0, index) + "...";
    }
}