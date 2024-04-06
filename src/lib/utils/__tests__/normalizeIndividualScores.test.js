const { readCsvString, normalizeIndividualScores } = require('../tabulateScores');
const fs = require('fs');
const path = require('path');

describe('normalizeIndividualScores function', () => {
    // Log file to write errors to
    const logFile = fs.openSync(path.join(__dirname, '..', 'log.txt'), 'w');
    let teams = path.join(__dirname, '..', 'testData', 'teams.csv');
    teams = fs.readFileSync(teams, 'utf-8');
    teams = readCsvString(teams, logFile, type="teams");
    it('normalizeIndividualScore for the whole gamut', () => {
        let roster = path.join(__dirname, '..', 'testData', 'roster.csv');
        roster = fs.readFileSync(roster, 'utf-8');
        roster = readCsvString(roster, logFile, type="roster");
        let general = path.join(__dirname, '..', 'testData', 'general.csv');
        general = fs.readFileSync(general, 'utf-8');
        general = readCsvString(general, logFile);
        let discrete = path.join(__dirname, '..', 'testData', 'discrete.csv');
        discrete = fs.readFileSync(discrete, 'utf-8');
        discrete = readCsvString(discrete, logFile);
        let algebra = path.join(__dirname, '..', 'testData', 'algebra.csv');
        algebra = fs.readFileSync(algebra, 'utf-8');
        algebra = readCsvString(algebra, logFile);
        let geometry = path.join(__dirname, '..', 'testData', 'geometry.csv');
        geometry = fs.readFileSync(geometry, 'utf-8');
        geometry = readCsvString(geometry, logFile);
        let calculus = path.join(__dirname, '..', 'testData', 'calculus.csv');
        calculus = fs.readFileSync(calculus, 'utf-8');
        calculus = readCsvString(calculus, logFile);
        let normalized = normalizeIndividualScores(logFile, roster, [], general, discrete, algebra, geometry, calculus);
        expect(normalized.length).toBe(teams.length);
        let expected = [
            { id: 'PLACEHOLDER', scores: { individualAverage: 0 } },
            { id: '001', scores: { individualAverage: 10 } },
            { id: '002', scores: { individualAverage: 0 } },
            { id: '003', scores: { individualAverage: 24.13 } },
            { id: '004', scores: { individualAverage: 49.67 } },
            { id: '005', scores: { individualAverage: 34.56 } },
            { id: '006', scores: { individualAverage: 83.45 } },
            { id: '007', scores: { individualAverage: 49.13 } },
            { id: '008', scores: { individualAverage: 72.86 } },
            { id: '009', scores: { individualAverage: 43.76 } },
            { id: '010', scores: { individualAverage: 70.62 } },
            { id: '011', scores: { individualAverage: 51.94 } },
            { id: '012', scores: { individualAverage: 45.67 } },
            { id: '013', scores: { individualAverage: 105.36 } },
            { id: '014', scores: { individualAverage: 81.39 } },
            { id: '015', scores: { individualAverage: 26.33 } },
            { id: '016', scores: { individualAverage: 38.33 } },
            { id: '017', scores: { individualAverage: 37.86 } },
            { id: '018', scores: { individualAverage: 44.48 } },
            { id: '019', scores: { individualAverage: 20.71 } },
            { id: '020', scores: { individualAverage: 104.76 } },
            { id: '021', scores: { individualAverage: 28.33 } },
            { id: '022', scores: { individualAverage: 32.1 } },
            { id: '023', scores: { individualAverage: 50.33 } },
            { id: '024', scores: { individualAverage: 38.06 } },
            { id: '025', scores: { individualAverage: 42.74 } },
            { id: '026', scores: { individualAverage: 8.33 } },
            { id: '027', scores: { individualAverage: 25.71 } },
            { id: '028', scores: { individualAverage: 102.58 } },
            { id: '029', scores: { individualAverage: 50.99 } },
            { id: '030', scores: { individualAverage: 19.72 } },
            { id: '031', scores: { individualAverage: 65.43 } },
            { id: '032', scores: { individualAverage: 64.76 } },
            { id: '033', scores: { individualAverage: 16.63 } },
            { id: '034', scores: { individualAverage: 33.69 } },
            { id: '035', scores: { individualAverage: 10.67 } },
            { id: '036', scores: { individualAverage: 76.15 } },
            { id: '037', scores: { individualAverage: 4 } },
            { id: '038', scores: { individualAverage: 62.5 } },
            { id: '039', scores: { individualAverage: 57.29 } },
            { id: '040', scores: { individualAverage: 54.92 } },
            { id: '041', scores: { individualAverage: 44.17 } }
        ]
        expect(normalized).toEqual(expected);
    });
});
