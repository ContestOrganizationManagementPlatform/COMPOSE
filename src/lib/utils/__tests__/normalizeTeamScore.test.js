const { readCsvString, normalizeTeamScore } = require('../tabulateScores');
const fs = require('fs');
const path = require('path');

describe('normalizeTeamScore function', () => {
    // Log file to write errors to from readCsvString
    const logFile = fs.openSync(path.join(__dirname, '..', 'log.txt'), 'w');
    it('normalizeTeamScore for small-algebra', () => {
        let roster = path.join(__dirname, '..', 'testData', 'roster.csv');
        roster = fs.readFileSync(roster, 'utf-8');
        roster = readCsvString(roster, logFile, type="roster");
        let algebra = path.join(__dirname, '..', 'testData', 'small-algebra.csv');
        algebra = fs.readFileSync(algebra, 'utf-8');
        algebra = readCsvString(algebra, logFile, "");
        normalizedAlgebra = normalizeTeamScore(logFile, roster, [], algebra, 'algebra');
        expect(normalizedAlgebra.length).toBe(algebra.length);
        let expected = [
            { id: '010', scores: { algebra: 500 } },
            { id: '009', scores: { algebra: 450 } },
            { id: '008', scores: { algebra: 400 } },
            { id: '007', scores: { algebra: 350 } },
            { id: '006', scores: { algebra: 300 } },
            { id: '005', scores: { algebra: 250 } },
            { id: '004', scores: { algebra: 200 } },
            { id: '003', scores: { algebra: 150 } },
            { id: '002', scores: { algebra: 100 } },
            { id: '001', scores: { algebra: 50 } }
        ]
        expect(normalizedAlgebra).toEqual(expected);
    })
    it('normalizeTeamScore for guts', () => {
        let roster = path.join(__dirname, '..', 'testData', 'roster.csv');
        roster = fs.readFileSync(roster, 'utf-8');
        roster = readCsvString(roster, logFile, type="roster");
        let guts = path.join(__dirname, '..', 'testData', 'guts.csv');
        guts = fs.readFileSync(guts, 'utf-8');
        guts = readCsvString(guts, logFile, "");
        normalizedGuts = normalizeTeamScore(logFile, roster, [], guts, 'guts');
        expect(normalizedGuts.length).toBe(guts.length);
        expect(normalizedGuts[9].scores.guts).toBe(100);
    })
    it('normalizeTeamScore for power', () => {
        let roster = path.join(__dirname, '..', 'testData', 'roster.csv');
        roster = fs.readFileSync(roster, 'utf-8');
        roster = readCsvString(roster, logFile, type="roster");
        let power = path.join(__dirname, '..', 'testData', 'power.csv');
        power = fs.readFileSync(power, 'utf-8');
        power = readCsvString(power, logFile, "");
        normalizedPower = normalizeTeamScore(logFile, roster, [], power, 'power');
        expect(normalizedPower.length).toBe(power.length);
        expect(normalizedPower[9].scores.power).toBe(100);
    })
    it('normalizeTeamScore for team', () => {
        let roster = path.join(__dirname, '..', 'testData', 'roster.csv');
        roster = fs.readFileSync(roster, 'utf-8');
        roster = readCsvString(roster, logFile, type="roster");
        let team = path.join(__dirname, '..', 'testData', 'team.csv');
        team = fs.readFileSync(team, 'utf-8');
        team = readCsvString(team, logFile, "");
        normalizedTeam = normalizeTeamScore(logFile, roster, [], team, 'team');
        expect(normalizedTeam.length).toBe(team.length);
        expect(normalizedTeam[9].scores.team).toBe(100);
    })
});