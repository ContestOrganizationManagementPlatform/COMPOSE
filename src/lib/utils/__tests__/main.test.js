const { main, readCsvString } = require('../tabulateScores');
const fs = require('fs');
const path = require('path');

describe('main function', () => {
    it('works on full 2023 dataset', () => {
        const logFile = fs.openSync(path.join(__dirname, '..', 'log.txt'), 'w');
        const directoryName = path.join(__dirname, '..', 'testData');

        main(directoryName);
        let output = fs.readFileSync(path.join(__dirname, '..', 'overall.csv'), 'utf8');
        output = readCsvString(output, logFile, "");

        let expected = fs.readFileSync(path.join(__dirname, '..', 'testData', 'correctOverall.csv'), 'utf8');
        expected = readCsvString(expected, logFile, "");

        expect(output).toEqual(expected);
    });
});