const { readCsvString } = require('../tabulateScores');
const fs = require('fs');
const path = require('path');


describe('readCsvString function', () => {
    const logFile = fs.openSync(path.join(__dirname, '..', 'log.txt'), 'w');
    it('parses small-algebra', () => {
        let algebra = path.join(__dirname, '..', 'testData', 'small-algebra.csv');
        algebra = fs.readFileSync(algebra, 'utf-8');
        let expectedOutput = {
            id: '001', 
            name: 'Arpit', 
            score: '1',
        };
        algebra = readCsvString(algebra, logFile, "");
        expect(algebra[0].name).toEqual(expectedOutput.name);
        expect(algebra[0].id).toEqual(expectedOutput.id);
        expect(algebra[0].score).toEqual(expectedOutput.score);

        expectedOutput = {
            id: '004', 
            name: 'Dillon', 
            score: '4',
        };
        expect(algebra[3].name).toEqual(expectedOutput.name);
        expect(algebra[3].id).toEqual(expectedOutput.id);
        expect(algebra[3].score).toEqual(expectedOutput.score);

        
    });
    it('parses algebra', () => {
        let algebra = path.join(__dirname, '..', 'testData', 'algebra.csv');
        algebra = fs.readFileSync(algebra, 'utf-8');
        let expectedOutput = {
            id: '013E', 
            name: 'Advaith Avadhanam', 
            score: '8',
        };
        algebra = readCsvString(algebra, logFile, "");
        expect(algebra[0].name).toEqual(expectedOutput.name);
        expect(algebra[0].id).toEqual(expectedOutput.id);
        expect(algebra[0].score).toEqual(expectedOutput.score);

        expectedOutput = {
            id: '027A', 
            name: 'Soham Patil', 
            score: '1',
        };
        expect(algebra[99].name).toEqual(expectedOutput.name);
        expect(algebra[99].id).toEqual(expectedOutput.id);
        expect(algebra[99].score).toEqual(expectedOutput.score);

        
    });
    it('parses calculus', () => {
        let calculus = path.join(__dirname, '..', 'testData', 'calculus.csv');
        calculus = fs.readFileSync(calculus, 'utf-8');
        let expectedOutput = {
            id: '014D', 
            name: 'Roger Fan', 
            score: '7',
        };
        calculus = readCsvString(calculus, logFile, "");
        expect(calculus[0].name).toEqual(expectedOutput.name);
        expect(calculus[0].id).toEqual(expectedOutput.id);
        expect(calculus[0].score).toEqual(expectedOutput.score);

        expectedOutput = {
            id: '033F', 
            name: 'Soham Kulkarni', 
            score: '0',
        };
        expect(calculus[55].name).toEqual(expectedOutput.name);
        expect(calculus[55].id).toEqual(expectedOutput.id);
        expect(calculus[55].score).toEqual(expectedOutput.score);
    });
    it('parses teams', () => {
        let teams = path.join(__dirname, '..', 'testData', 'teams.csv');
        teams = fs.readFileSync(teams, 'utf-8');
        let expectedOutput = {
            id: '000', 
            name: 'BRO'
        };
        teams = readCsvString(teams, logFile, "teams");
        expect(teams[0].name).toEqual(expectedOutput.name);
        expect(teams[0].id).toEqual(expectedOutput.id);
        expect(teams[0].score).toEqual(expectedOutput.score);

        expectedOutput = {
            id: '041', 
            name: 'Paly Trolls'
        };
        expect(teams[41].name).toEqual(expectedOutput.name);
        expect(teams[41].id).toEqual(expectedOutput.id);
        expect(teams[41].score).toEqual(expectedOutput.score);

        
    });

    it('parses roster', () => {
        let roster = path.join(__dirname, '..', 'testData', 'roster.csv');
        roster = fs.readFileSync(roster, 'utf-8');
        let expectedOutput = {
            id: '00', 
            name: 'Bob',
            teamID: 'PLACEHOLDER'
        };
        roster = readCsvString(roster, logFile, "roster");
        expect(roster[0].name).toEqual(expectedOutput.name);
        expect(roster[0].studentID).toEqual(expectedOutput.id);
        expect(roster[0].teamID).toEqual(expectedOutput.teamID);

        expectedOutput = {
            id: 'sLIXY9wLmGSURpscubKvJwSNP1i1', 
            name: 'Aiden  Yuan',
            teamID: '041'
        };

        expect(roster[235].name).toEqual(expectedOutput.name);
        expect(roster[235].id).toEqual(expectedOutput.id);
        expect(roster[235].score).toEqual(expectedOutput.score);

        
    });

    // Add more test cases as needed
});

