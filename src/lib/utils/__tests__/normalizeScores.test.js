const { readCsvString, normalizeTeamScore, normalizeIndividualScores, normalizeScores } = require('../tabulateScores');
const fs = require('fs');
const path = require('path');

describe('normalizeScores function', () => {
    it('normalize all scores, team scores first', () => {
        const logFile = fs.openSync(path.join(__dirname, '..', 'log.txt'), 'w');
        let roster = path.join(__dirname, '..', 'testData', 'roster.csv');
        roster = fs.readFileSync(roster, 'utf-8');
        roster = readCsvString(roster, logFile, type="roster");
        let teams = path.join(__dirname, '..', 'testData', 'teams.csv');
        teams = fs.readFileSync(teams, 'utf-8');
        teams = readCsvString(teams, logFile, type="teams");
        let guts = path.join(__dirname, '..', 'testData', 'guts.csv');
        guts = fs.readFileSync(guts, 'utf-8');
        guts = readCsvString(guts, logFile, "");
        let power = path.join(__dirname, '..', 'testData', 'power.csv');
        power = fs.readFileSync(power, 'utf-8');
        power = readCsvString(power, logFile, "");
        let team = path.join(__dirname, '..', 'testData', 'team.csv');
        team = fs.readFileSync(team, 'utf-8');
        team = readCsvString(team, logFile, "");
        let general = path.join(__dirname, '..', 'testData', 'general.csv');
        general = fs.readFileSync(general, 'utf-8');
        general = readCsvString(general, logFile, "");
        let discrete = path.join(__dirname, '..', 'testData', 'discrete.csv');
        discrete = fs.readFileSync(discrete, 'utf-8');
        discrete = readCsvString(discrete, logFile, "");
        let algebra = path.join(__dirname, '..', 'testData', 'algebra.csv');
        algebra = fs.readFileSync(algebra, 'utf-8');
        algebra = readCsvString(algebra, logFile, "");
        let geometry = path.join(__dirname, '..', 'testData', 'geometry.csv');
        geometry = fs.readFileSync(geometry, 'utf-8');
        geometry = readCsvString(geometry, logFile, "");
        let calculus = path.join(__dirname, '..', 'testData', 'calculus.csv');
        calculus = fs.readFileSync(calculus, 'utf-8');
        calculus = readCsvString(calculus, logFile, "");
        let normalized = normalizeTeamScore(logFile, roster, [], guts, 'guts');
        normalized = normalizeTeamScore(logFile, roster, normalized, power, 'power');
        normalized = normalizeTeamScore(logFile, roster, normalized, team, 'team');
        normalized = normalizeIndividualScores(logFile, roster, normalized, general, discrete, algebra, geometry, calculus);
        expect(normalized.length).toBe(teams.length);
        const expected = [
            {
              id: '013',
              scores: {
                guts: 149.77,
                power: 201.69,
                team: 137.5,
                individualAverage: 105.36
              }
            },
            {
              id: '008',
              scores: {
                guts: 145.12,
                power: 184.75,
                team: 137.5,
                individualAverage: 72.86
              }
            },
            {
              id: '020',
              scores: {
                guts: 137.21,
                power: 203.39,
                team: 137.5,
                individualAverage: 104.76
              }
            },
            {
              id: '006',
              scores: {
                guts: 131.16,
                power: 115.25,
                team: 150,
                individualAverage: 83.45
              }
            },
            {
              id: '010',
              scores: {
                guts: 131.16,
                power: 155.93,
                team: 100,
                individualAverage: 70.62
              }
            },
            {
              id: '028',
              scores: {
                guts: 125.12,
                power: 155.93,
                team: 137.5,
                individualAverage: 102.58
              }
            },
            {
              id: '014',
              scores: {
                guts: 124.65,
                power: 188.14,
                team: 137.5,
                individualAverage: 81.39
              }
            },
            {
              id: '036',
              scores: {
                guts: 114.42,
                power: 135.59,
                team: 137.5,
                individualAverage: 76.15
              }
            },
            {
              id: '039',
              scores: { guts: 108.84, power: 100, team: 100, individualAverage: 57.29 }
            },
            {
              id: '009',
              scores: { guts: 100, power: 57.63, team: 75, individualAverage: 43.76 }
            },
            {
              id: '011',
              scores: { guts: 96.28, power: 232.2, team: 150, individualAverage: 51.94 }
            },
            {
              id: '007',
              scores: { guts: 89.77, power: 57.63, team: 100, individualAverage: 49.13 }
            },
            {
              id: '040',
              scores: { guts: 82.33, power: 67.8, team: 62.5, individualAverage: 54.92 }
            },
            {
              id: '031',
              scores: { guts: 81.4, power: 79.66, team: 100, individualAverage: 65.43 }
            },
            {
              id: '023',
              scores: { guts: 80, power: 91.53, team: 75, individualAverage: 50.33 }
            },
            {
              id: '032',
              scores: { guts: 77.21, power: 66.1, team: 87.5, individualAverage: 64.76 }
            },
            {
              id: '038',
              scores: { guts: 76.28, power: 98.31, team: 100, individualAverage: 62.5 }
            },
            {
              id: '022',
              scores: { guts: 72.09, power: 22.03, team: 25, individualAverage: 32.1 }
            },
            {
              id: '012',
              scores: { guts: 65.58, power: 57.63, team: 100, individualAverage: 45.67 }
            },
            {
              id: '018',
              scores: { guts: 61.4, power: 84.75, team: 50, individualAverage: 44.48 }
            },
            {
              id: '029',
              scores: { guts: 60.93, power: 64.41, team: 62.5, individualAverage: 50.99 }
            },
            {
              id: '027',
              scores: { guts: 60, power: 61.02, team: 75, individualAverage: 25.71 }
            },
            {
              id: '041',
              scores: { guts: 60, power: 94.92, team: 37.5, individualAverage: 44.17 }
            },
            {
              id: '004',
              scores: { guts: 59.53, power: 100, team: 100, individualAverage: 49.67 }
            },
            {
              id: '017',
              scores: { guts: 53.49, power: 91.53, team: 62.5, individualAverage: 37.86 }
            },
            {
              id: '005',
              scores: { guts: 52.09, power: 45.76, team: 50, individualAverage: 34.56 }
            },
            {
              id: '016',
              scores: { guts: 48.37, power: 50.85, team: 62.5, individualAverage: 38.33 }
            },
            {
              id: '025',
              scores: { guts: 43.26, power: 77.97, team: 87.5, individualAverage: 42.74 }
            },
            {
              id: '001',
              scores: { guts: 33.02, power: 35.59, team: 25, individualAverage: 10 }
            },
            {
              id: '003',
              scores: { guts: 31.16, power: 35.59, team: 50, individualAverage: 24.13 }
            },
            {
              id: '019',
              scores: { guts: 26.05, power: 37.29, team: 37.5, individualAverage: 20.71 }
            },
            {
              id: '015',
              scores: { guts: 25.12, power: 27.12, team: 37.5, individualAverage: 26.33 }
            },
            {
              id: '026',
              scores: { guts: 21.86, power: 35.59, team: 25, individualAverage: 8.33 }
            },
            {
              id: '033',
              scores: { guts: 20.47, power: 45.76, team: 50, individualAverage: 16.63 }
            },
            {
              id: '035',
              scores: { guts: 20.47, power: 40.68, team: 25, individualAverage: 10.67 }
            },
            {
              id: '034',
              scores: { guts: 20, power: 50.85, team: 50, individualAverage: 33.69 }
            },
            {
              id: '030',
              scores: { guts: 15.35, power: 45.76, team: 50, individualAverage: 19.72 }
            },
            {
              id: '021',
              scores: { guts: 9.3, power: 55.93, team: 25, individualAverage: 28.33 }
            },
            {
              id: '024',
              scores: { guts: 9.3, power: 22.03, team: 25, individualAverage: 38.06 }
            },
            { id: '002', scores: { guts: 0, power: 0, individualAverage: 0 } },
            {
              id: '037',
              scores: { guts: 0, power: 28.81, team: 25, individualAverage: 4 }
            },
            { id: 'PLACEHOLDER', scores: { individualAverage: 0 } }
          ];
        expect(normalized.sort((a, b) => a.id.localeCompare(b.id))).toEqual(expected.sort((a, b) => a.id.localeCompare(b.id)));
        expect(normalizeScores(logFile, roster, team, power, guts, general, discrete, algebra, geometry, calculus).sort((a, b) => a.id.localeCompare(b.id))).toEqual(expected);
    });
    it('normalize all scores, individual scores first', () => {
        const logFile = fs.openSync(path.join(__dirname, '..', 'log.txt'), 'w');
        let roster = path.join(__dirname, '..', 'testData', 'roster.csv');
        roster = fs.readFileSync(roster, 'utf-8');
        roster = readCsvString(roster, logFile, type="roster");
        let teams = path.join(__dirname, '..', 'testData', 'teams.csv');
        teams = fs.readFileSync(teams, 'utf-8');
        teams = readCsvString(teams, logFile, type="teams");
        let guts = path.join(__dirname, '..', 'testData', 'guts.csv');
        guts = fs.readFileSync(guts, 'utf-8');
        guts = readCsvString(guts, logFile, "");
        let power = path.join(__dirname, '..', 'testData', 'power.csv');
        power = fs.readFileSync(power, 'utf-8');
        power = readCsvString(power, logFile, "");
        let team = path.join(__dirname, '..', 'testData', 'team.csv');
        team = fs.readFileSync(team, 'utf-8');
        team = readCsvString(team, logFile, "");
        let general = path.join(__dirname, '..', 'testData', 'general.csv');
        general = fs.readFileSync(general, 'utf-8');
        general = readCsvString(general, logFile, "");
        let discrete = path.join(__dirname, '..', 'testData', 'discrete.csv');
        discrete = fs.readFileSync(discrete, 'utf-8');
        discrete = readCsvString(discrete, logFile, "");
        let algebra = path.join(__dirname, '..', 'testData', 'algebra.csv');
        algebra = fs.readFileSync(algebra, 'utf-8');
        algebra = readCsvString(algebra, logFile, "");
        let geometry = path.join(__dirname, '..', 'testData', 'geometry.csv');
        geometry = fs.readFileSync(geometry, 'utf-8');
        geometry = readCsvString(geometry, logFile, "");
        let calculus = path.join(__dirname, '..', 'testData', 'calculus.csv');
        calculus = fs.readFileSync(calculus, 'utf-8');
        calculus = readCsvString(calculus, logFile, "");
        let normalized = normalizeIndividualScores(logFile, roster, [], general, discrete, algebra, geometry, calculus);
        normalized = normalizeTeamScore(logFile, roster, normalized, guts, 'guts');
        normalized = normalizeTeamScore(logFile, roster, normalized, power, 'power');
        normalized = normalizeTeamScore(logFile, roster, normalized, team, 'team');
        expect(normalized.length).toBe(teams.length);
        const expected = [
            {
              id: '013',
              scores: {
                guts: 149.77,
                power: 201.69,
                team: 137.5,
                individualAverage: 105.36
              }
            },
            {
              id: '008',
              scores: {
                guts: 145.12,
                power: 184.75,
                team: 137.5,
                individualAverage: 72.86
              }
            },
            {
              id: '020',
              scores: {
                guts: 137.21,
                power: 203.39,
                team: 137.5,
                individualAverage: 104.76
              }
            },
            {
              id: '006',
              scores: {
                guts: 131.16,
                power: 115.25,
                team: 150,
                individualAverage: 83.45
              }
            },
            {
              id: '010',
              scores: {
                guts: 131.16,
                power: 155.93,
                team: 100,
                individualAverage: 70.62
              }
            },
            {
              id: '028',
              scores: {
                guts: 125.12,
                power: 155.93,
                team: 137.5,
                individualAverage: 102.58
              }
            },
            {
              id: '014',
              scores: {
                guts: 124.65,
                power: 188.14,
                team: 137.5,
                individualAverage: 81.39
              }
            },
            {
              id: '036',
              scores: {
                guts: 114.42,
                power: 135.59,
                team: 137.5,
                individualAverage: 76.15
              }
            },
            {
              id: '039',
              scores: { guts: 108.84, power: 100, team: 100, individualAverage: 57.29 }
            },
            {
              id: '009',
              scores: { guts: 100, power: 57.63, team: 75, individualAverage: 43.76 }
            },
            {
              id: '011',
              scores: { guts: 96.28, power: 232.2, team: 150, individualAverage: 51.94 }
            },
            {
              id: '007',
              scores: { guts: 89.77, power: 57.63, team: 100, individualAverage: 49.13 }
            },
            {
              id: '040',
              scores: { guts: 82.33, power: 67.8, team: 62.5, individualAverage: 54.92 }
            },
            {
              id: '031',
              scores: { guts: 81.4, power: 79.66, team: 100, individualAverage: 65.43 }
            },
            {
              id: '023',
              scores: { guts: 80, power: 91.53, team: 75, individualAverage: 50.33 }
            },
            {
              id: '032',
              scores: { guts: 77.21, power: 66.1, team: 87.5, individualAverage: 64.76 }
            },
            {
              id: '038',
              scores: { guts: 76.28, power: 98.31, team: 100, individualAverage: 62.5 }
            },
            {
              id: '022',
              scores: { guts: 72.09, power: 22.03, team: 25, individualAverage: 32.1 }
            },
            {
              id: '012',
              scores: { guts: 65.58, power: 57.63, team: 100, individualAverage: 45.67 }
            },
            {
              id: '018',
              scores: { guts: 61.4, power: 84.75, team: 50, individualAverage: 44.48 }
            },
            {
              id: '029',
              scores: { guts: 60.93, power: 64.41, team: 62.5, individualAverage: 50.99 }
            },
            {
              id: '027',
              scores: { guts: 60, power: 61.02, team: 75, individualAverage: 25.71 }
            },
            {
              id: '041',
              scores: { guts: 60, power: 94.92, team: 37.5, individualAverage: 44.17 }
            },
            {
              id: '004',
              scores: { guts: 59.53, power: 100, team: 100, individualAverage: 49.67 }
            },
            {
              id: '017',
              scores: { guts: 53.49, power: 91.53, team: 62.5, individualAverage: 37.86 }
            },
            {
              id: '005',
              scores: { guts: 52.09, power: 45.76, team: 50, individualAverage: 34.56 }
            },
            {
              id: '016',
              scores: { guts: 48.37, power: 50.85, team: 62.5, individualAverage: 38.33 }
            },
            {
              id: '025',
              scores: { guts: 43.26, power: 77.97, team: 87.5, individualAverage: 42.74 }
            },
            {
              id: '001',
              scores: { guts: 33.02, power: 35.59, team: 25, individualAverage: 10 }
            },
            {
              id: '003',
              scores: { guts: 31.16, power: 35.59, team: 50, individualAverage: 24.13 }
            },
            {
              id: '019',
              scores: { guts: 26.05, power: 37.29, team: 37.5, individualAverage: 20.71 }
            },
            {
              id: '015',
              scores: { guts: 25.12, power: 27.12, team: 37.5, individualAverage: 26.33 }
            },
            {
              id: '026',
              scores: { guts: 21.86, power: 35.59, team: 25, individualAverage: 8.33 }
            },
            {
              id: '033',
              scores: { guts: 20.47, power: 45.76, team: 50, individualAverage: 16.63 }
            },
            {
              id: '035',
              scores: { guts: 20.47, power: 40.68, team: 25, individualAverage: 10.67 }
            },
            {
              id: '034',
              scores: { guts: 20, power: 50.85, team: 50, individualAverage: 33.69 }
            },
            {
              id: '030',
              scores: { guts: 15.35, power: 45.76, team: 50, individualAverage: 19.72 }
            },
            {
              id: '021',
              scores: { guts: 9.3, power: 55.93, team: 25, individualAverage: 28.33 }
            },
            {
              id: '024',
              scores: { guts: 9.3, power: 22.03, team: 25, individualAverage: 38.06 }
            },
            { id: '002', scores: { guts: 0, power: 0, individualAverage: 0 } },
            {
              id: '037',
              scores: { guts: 0, power: 28.81, team: 25, individualAverage: 4 }
            },
            { id: 'PLACEHOLDER', scores: { individualAverage: 0 } }
          ];
          expect(normalized.sort((a, b) => a.id.localeCompare(b.id))).toEqual(expected.sort((a, b) => a.id.localeCompare(b.id)));
          expect(normalizeScores(logFile, roster, team, power, guts, general, discrete, algebra, geometry, calculus).sort((a, b) => a.id.localeCompare(b.id))).toEqual(expected);
    });
});