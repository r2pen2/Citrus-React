/**
 * Sorts a list by date
 * @param {[Object]} array list to be sorted
 * @returns {[Object]} sorted list
 */
export function sortByDate(array) {
    array.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    })
    return array;
}

/**
 * Sorts a list by createdAt
 * @param {[Object]} array list to be sorted
 * @returns {[Object]} sorted list
 */
 export function sortByCreatedAt(array) {
    array.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    })
    return array;
}