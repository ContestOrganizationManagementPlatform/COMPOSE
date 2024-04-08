const { readCsvString, calculateScalingFactor, SCALING_MAP } = require('../tabulateScores');
const fs = require('fs');
const path = require('path');

describe('calculateScalingFactor function', () => {
    // Log file to write errors to from readCsvString
    const logFile = fs.openSync(path.join(__dirname, '..', 'log.txt'), 'w');
    it('calculates scaling factor for small-algebra', () => {
        let algebra = path.join(__dirname, '..', 'testData', 'small-algebra.csv');
        algebra = fs.readFileSync(algebra, 'utf-8');
        algebra = readCsvString(algebra, logFile, "");
        algebra.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(algebra, 'algebra');
        const expected = SCALING_MAP.individualSpecific/1;
        expect(scalingFactor).toEqual(expected);
    });
    it('calculates scaling factor for algebra', () => {
        let algebra = path.join(__dirname, '..', 'testData', 'algebra.csv');
        algebra = fs.readFileSync(algebra, 'utf-8');
        algebra = readCsvString(algebra, logFile, "");
        algebra.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(algebra, 'algebra');
        const expected = SCALING_MAP.individualSpecific/5;
        expect(scalingFactor).toEqual(expected);
    });
    it('calculates scaling factor for calculus', () => {
        let calculus = path.join(__dirname, '..', 'testData', 'calculus.csv');
        calculus = fs.readFileSync(calculus, 'utf-8');
        calculus = readCsvString(calculus, logFile, "");
        calculus.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(calculus, 'calculus');
        const expected = SCALING_MAP.individualSpecific/5;
        expect(scalingFactor).toEqual(expected);
    });
    it('calculates scaling factor for discrete', () => {
        let discrete = path.join(__dirname, '..', 'testData', 'discrete.csv');
        discrete = fs.readFileSync(discrete, 'utf-8');
        discrete = readCsvString(discrete, logFile, "");
        discrete.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(discrete, 'discrete');
        const expected = SCALING_MAP.individualSpecific/6;
        expect(scalingFactor).toEqual(expected);
    });
    it('calculates scaling factor for general', () => {
        let general = path.join(__dirname, '..', 'testData', 'general.csv');
        general = fs.readFileSync(general, 'utf-8');
        general = readCsvString(general, logFile, "");
        general.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(general, 'general');
        const expected = SCALING_MAP.general/12;
        expect(scalingFactor).toEqual(expected);
    });
    it('calculates scaling factor for geoemtry', () => {
        let geometry = path.join(__dirname, '..', 'testData', 'geometry.csv');
        geometry = fs.readFileSync(geometry, 'utf-8');
        geometry = readCsvString(geometry, logFile, "");
        geometry.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(geometry, 'geometry');
        const expected = SCALING_MAP.individualSpecific/7;
        expect(scalingFactor).toEqual(expected);
    });
    it('calculates scaling factor for guts', () => {
        let guts = path.join(__dirname, '..', 'testData', 'guts.csv');
        guts = fs.readFileSync(guts, 'utf-8');
        guts = readCsvString(guts, logFile, "");
        guts.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(guts, 'guts');
        const expected = SCALING_MAP.nonIndividual/215;
        expect(scalingFactor).toEqual(expected);
    });
    it('calculates scaling factor for power', () => {
        let power = path.join(__dirname, '..', 'testData', 'power.csv');
        power = fs.readFileSync(power, 'utf-8');
        power = readCsvString(power, logFile, "");
        power.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(power, 'power');
        const expected = SCALING_MAP.nonIndividual/59;
        expect(scalingFactor).toEqual(expected);
    });
    it('calculates scaling factor for team', () => {
        let team = path.join(__dirname, '..', 'testData', 'team.csv');
        team = fs.readFileSync(team, 'utf-8');
        team = readCsvString(team, logFile, "");
        team.sort((a, b) => b.score - a.score); // sort in descending order
        let scalingFactor = calculateScalingFactor(team, 'team');
        const expected = SCALING_MAP.nonIndividual/8;
        expect(scalingFactor).toEqual(expected);
    });
});