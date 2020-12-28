function shuffleArray(array) {
    /**
     * Fisher-Yates Algorithm
     * Mutates array in place with a random permutation of its items
     */
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));

        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
}

module.exports = shuffleArray;