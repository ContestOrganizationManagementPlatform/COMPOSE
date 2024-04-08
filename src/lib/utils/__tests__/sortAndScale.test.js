const { readCsvString, calculateScalingFactor, sortAndScale } = require('../tabulateScores');
const fs = require('fs');
const path = require('path');

describe('sortAndScale function', () => {
    // Log file to write errors to from readCsvString
    const logFile = fs.openSync(path.join(__dirname, '..', 'log.txt'), 'w');
    it('sortAndScale for small-algebra', () => {
        let algebra = path.join(__dirname, '..', 'testData', 'small-algebra.csv');
        algebra = fs.readFileSync(algebra, 'utf-8');
        algebra = readCsvString(algebra, logFile, "");
        scaleSorted = sortAndScale(algebra, 'algebra');
        algebra.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(algebra, 'algebra');
        algebra.forEach((person) => {
            person.score *= scalingFactor;
        });

        expect(algebra).toEqual(scaleSorted);
    });
    it('sortAndScale for algebra', () => {
        let algebra = path.join(__dirname, '..', 'testData', 'algebra.csv');
        algebra = fs.readFileSync(algebra, 'utf-8');
        algebra = readCsvString(algebra, logFile, "");
        scaleSorted = sortAndScale(algebra, 'algebra');
        algebra.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(algebra, 'algebra');
        algebra.forEach((person) => {
            person.score *= scalingFactor;
        });

        expect(algebra).toEqual(scaleSorted);
    });
    it('sortAndScale for calculus', () => {
        let calculus = path.join(__dirname, '..', 'testData', 'calculus.csv');
        calculus = fs.readFileSync(calculus, 'utf-8');
        calculus = readCsvString(calculus, logFile, "");
        scaleSorted = sortAndScale(calculus, 'calculus');
        calculus.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(calculus, 'calculus');
        calculus.forEach((person) => {
            person.score *= scalingFactor;
        });

        expect(calculus).toEqual(scaleSorted);
    });
    it('sortAndScale for discrete', () => {
        let discrete = path.join(__dirname, '..', 'testData', 'discrete.csv');
        discrete = fs.readFileSync(discrete, 'utf-8');
        discrete = readCsvString(discrete, logFile, "");
        scaleSorted = sortAndScale(discrete, 'discrete');
        discrete.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(discrete, 'discrete');
        discrete.forEach((person) => {
            person.score *= scalingFactor;
        });

        expect(discrete).toEqual(scaleSorted);
    });
    it('sortAndScale for general', () => {
        let general = path.join(__dirname, '..', 'testData', 'general.csv');
        general = fs.readFileSync(general, 'utf-8');
        general = readCsvString(general, logFile, "");
        scaleSorted = sortAndScale(general, 'general');
        general.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(general, 'general');
        general.forEach((person) => {
            person.score *= scalingFactor;
        });

        expect(general).toEqual(scaleSorted);
    });
    it('sortAndScale for geoemtry', () => {
        let geometry = path.join(__dirname, '..', 'testData', 'geometry.csv');
        geometry = fs.readFileSync(geometry, 'utf-8');
        geometry = readCsvString(geometry, logFile, "");
        scaleSorted = sortAndScale(geometry, 'geometry');
        geometry.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(geometry, 'geometry');
        geometry.forEach((person) => {
            person.score *= scalingFactor;
        });

        expect(geometry).toEqual(scaleSorted);
    });
    it('sortAndScale for guts', () => {
        let guts = path.join(__dirname, '..', 'testData', 'guts.csv');
        guts = fs.readFileSync(guts, 'utf-8');
        guts = readCsvString(guts, logFile, "");
        scaleSorted = sortAndScale(guts, 'guts');
        guts.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(guts, 'guts');
        guts.forEach((person) => {
            person.score *= scalingFactor;
        });

        expect(guts).toEqual(scaleSorted);
    });
    it('sortAndScale for power', () => {
        let power = path.join(__dirname, '..', 'testData', 'power.csv');
        power = fs.readFileSync(power, 'utf-8');
        power = readCsvString(power, logFile, "");
        scaleSorted = sortAndScale(power, 'power');
        power.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(power, 'power');
        power.forEach((person) => {
            person.score *= scalingFactor;
        });

        expect(power).toEqual(scaleSorted);
    });
    it('sortAndScale for team', () => {
        let team = path.join(__dirname, '..', 'testData', 'team.csv');
        team = fs.readFileSync(team, 'utf-8');
        team = readCsvString(team, logFile, "");
        scaleSorted = sortAndScale(team, 'team');
        team.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(team, 'team');
        team.forEach((person) => {
            person.score *= scalingFactor;
        });

        expect(team).toEqual(scaleSorted);
    });
});