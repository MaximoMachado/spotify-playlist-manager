
function* combinations(array, length) {
    /**
     * Yields all combinations of a certain length from the array
     * Params:
     * array {array}: Array to take combinations of
     * length {int}: Number of items in each combination
     */

    if (array.length === 0 || array.length < length || length === 0) {
        yield [];
    } else if (array.length === length) {
        yield array.map(el => el);
    } else {
        rest = array.slice(1, array.length);

        // Take first item
        for (let combination of combinations(rest, length - 1)) {
            yield [array[0]].concat(combination);
        }

        // Don't take first item
        for (let combination of combinations(rest, length)) {
            yield combination;
        }
    }
}

module.exports = {combinations};