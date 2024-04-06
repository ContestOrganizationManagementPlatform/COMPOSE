const { readCsvString, normalizeTeamScore, normalizeIndividualScores, normalizeScores, calculateOverallTeamScore } = require('../tabulateScores');
const fs = require('fs');
const path = require('path');

describe('calculateOverallTeamScore function', () => {
    it('works on full 2023 dataset', () => {
        const logFile = fs.openSync(path.join(__dirname, '..', 'log.txt'), 'w');
        let roster = path.join(__dirname, '..', 'testData', 'roster.csv');
        roster = fs.readFileSync(roster, 'utf-8');
        roster = readCsvString(roster, logFile, type="roster");
        let teams = path.join(__dirname, '..', 'testData', 'teams.csv');
        teams = fs.readFileSync(teams, 'utf-8');
        teams = readCsvString(teams, logFile, type="teams");
        let guts = path.join(__dirname, '..', 'testData', 'guts.csv');
        guts = fs.readFileSync(guts, 'utf-8');
        guts = readCsvString(guts, logFile);
        let power = path.join(__dirname, '..', 'testData', 'power.csv');
        power = fs.readFileSync(power, 'utf-8');
        power = readCsvString(power, logFile);
        let team = path.join(__dirname, '..', 'testData', 'team.csv');
        team = fs.readFileSync(team, 'utf-8');
        team = readCsvString(team, logFile);
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
        const normalizedScores = normalizeScores(logFile, roster, team, power, guts, general, discrete, algebra, geometry, calculus);
        for (let i = 0; i < normalizedScores.length; i++) {
            const team = normalizedScores[i];

            // Calculate the overall score using the provided formula
            const overallScore = calculateOverallTeamScore(team);
        
            // Add the overall score to the scores object for the team
            if (!team.scores) {
              normalizedScores[i].scores = {};
            }
            normalizedScores[i].scores.overallScore = Math.round(overallScore * 100) / 100;
        }
        let expected =       [
            {
              id: '011',
              scores: {
                team: 150,
                power: 232.2,
                guts: 96.28,
                individualAverage: 51.94,
                overallScore: 126.28
              }
            },
            {
              id: '006',
              scores: {
                team: 150,
                power: 115.25,
                guts: 131.16,
                individualAverage: 83.45,
                overallScore: 119.32
              }
            },
            {
              id: '008',
              scores: {
                team: 137.5,
                power: 184.75,
                guts: 145.12,
                individualAverage: 72.86,
                overallScore: 129.08
              }
            },
            {
              id: '013',
              scores: {
                team: 137.5,
                power: 201.69,
                guts: 149.77,
                individualAverage: 105.36,
                overallScore: 143.15
              }
            },
            {
              id: '014',
              scores: {
                team: 137.5,
                power: 188.14,
                guts: 124.65,
                individualAverage: 81.39,
                overallScore: 128.23
              }
            },
            {
              id: '036',
              scores: {
                team: 137.5,
                power: 135.59,
                guts: 114.42,
                individualAverage: 76.15,
                overallScore: 114.1
              }
            },
            {
              id: '028',
              scores: {
                team: 137.5,
                power: 155.93,
                guts: 125.12,
                individualAverage: 102.58,
                overallScore: 128.23
              }
            },
            {
              id: '020',
              scores: {
                team: 137.5,
                power: 203.39,
                guts: 137.21,
                individualAverage: 104.76,
                overallScore: 140.8
              }
            },
            {
              id: '038',
              scores: {
                team: 100,
                power: 98.31,
                guts: 76.28,
                individualAverage: 62.5,
                overallScore: 83.67
              }
            },
            {
              id: '039',
              scores: {
                team: 100,
                power: 100,
                guts: 108.84,
                individualAverage: 57.29,
                overallScore: 88.96
              }
            },
            {
              id: '010',
              scores: {
                team: 100,
                power: 155.93,
                guts: 131.16,
                individualAverage: 70.62,
                overallScore: 108.6
              }
            },
            {
              id: '012',
              scores: {
                team: 100,
                power: 57.63,
                guts: 65.58,
                individualAverage: 45.67,
                overallScore: 68.34
              }
            },
            {
              id: '004',
              scores: {
                team: 100,
                power: 100,
                guts: 59.53,
                individualAverage: 49.67,
                overallScore: 76.81
              }
            },
            {
              id: '007',
              scores: {
                team: 100,
                power: 57.63,
                guts: 89.77,
                individualAverage: 49.13,
                overallScore: 74.22
              }
            },
            {
              id: '031',
              scores: {
                team: 100,
                power: 79.66,
                guts: 81.4,
                individualAverage: 65.43,
                overallScore: 81.84
              }
            },
            {
              id: '032',
              scores: {
                team: 87.5,
                power: 66.1,
                guts: 77.21,
                individualAverage: 64.76,
                overallScore: 74.34
              }
            },
            {
              id: '025',
              scores: {
                team: 87.5,
                power: 77.97,
                guts: 43.26,
                individualAverage: 42.74,
                overallScore: 63.32
              }
            },
            {
              id: '009',
              scores: {
                team: 75,
                power: 57.63,
                guts: 100,
                individualAverage: 43.76,
                overallScore: 67.15
              }
            },
            {
              id: '027',
              scores: {
                team: 75,
                power: 61.02,
                guts: 60,
                individualAverage: 25.71,
                overallScore: 54.42
              }
            },
            {
              id: '023',
              scores: {
                team: 75,
                power: 91.53,
                guts: 80,
                individualAverage: 50.33,
                overallScore: 71.91
              }
            },
            {
              id: '040',
              scores: {
                team: 62.5,
                power: 67.8,
                guts: 82.33,
                individualAverage: 54.92,
                overallScore: 65.25
              }
            },
            {
              id: '029',
              scores: {
                team: 62.5,
                power: 64.41,
                guts: 60.93,
                individualAverage: 50.99,
                overallScore: 59.12
              }
            },
            {
              id: '017',
              scores: {
                team: 62.5,
                power: 91.53,
                guts: 53.49,
                individualAverage: 37.86,
                overallScore: 59.11
              }
            },
            {
              id: '016',
              scores: {
                team: 62.5,
                power: 50.85,
                guts: 48.37,
                individualAverage: 38.33,
                overallScore: 50.09
              }
            },
            {
              id: '003',
              scores: {
                team: 50,
                power: 35.59,
                guts: 31.16,
                individualAverage: 24.13,
                overallScore: 35.59
              }
            },
            {
              id: '034',
              scores: {
                team: 50,
                power: 50.85,
                guts: 20,
                individualAverage: 33.69,
                overallScore: 39.28
              }
            },
            {
              id: '005',
              scores: {
                team: 50,
                power: 45.76,
                guts: 52.09,
                individualAverage: 34.56,
                overallScore: 44.94
              }
            },
            {
              id: '033',
              scores: {
                team: 50,
                power: 45.76,
                guts: 20.47,
                individualAverage: 16.63,
                overallScore: 33.24
              }
            },
            {
              id: '030',
              scores: {
                team: 50,
                power: 45.76,
                guts: 15.35,
                individualAverage: 19.72,
                overallScore: 33.14
              }
            },
            {
              id: '018',
              scores: {
                team: 50,
                power: 84.75,
                guts: 61.4,
                individualAverage: 44.48,
                overallScore: 57.57
              }
            },
            {
              id: '041',
              scores: {
                team: 37.5,
                power: 94.92,
                guts: 60,
                individualAverage: 44.17,
                overallScore: 55.49
              }
            },
            {
              id: '019',
              scores: {
                team: 37.5,
                power: 37.29,
                guts: 26.05,
                individualAverage: 20.71,
                overallScore: 30.13
              }
            },
            {
              id: '015',
              scores: {
                team: 37.5,
                power: 27.12,
                guts: 25.12,
                individualAverage: 26.33,
                overallScore: 29.6
              }
            },
            {
              id: '037',
              scores: {
                team: 25,
                power: 28.81,
                guts: 0,
                individualAverage: 4,
                overallScore: 14.46
              }
            },
            {
              id: '001',
              scores: {
                team: 25,
                power: 35.59,
                guts: 33.02,
                individualAverage: 10,
                overallScore: 24.22
              }
            },
            {
              id: '035',
              scores: {
                team: 25,
                power: 40.68,
                guts: 20.47,
                individualAverage: 10.67,
                overallScore: 22.93
              }
            },
            {
              id: '026',
              scores: {
                team: 25,
                power: 35.59,
                guts: 21.86,
                individualAverage: 8.33,
                overallScore: 21.49
              }
            },
            {
              id: '024',
              scores: {
                team: 25,
                power: 22.03,
                guts: 9.3,
                individualAverage: 38.06,
                overallScore: 25.18
              }
            },
            {
              id: '022',
              scores: {
                team: 25,
                power: 22.03,
                guts: 72.09,
                individualAverage: 32.1,
                overallScore: 35.95
              }
            },
            {
              id: '021',
              scores: {
                team: 25,
                power: 55.93,
                guts: 9.3,
                individualAverage: 28.33,
                overallScore: 29.05
              }
            },
            {
              id: '002',
              scores: { power: 0, guts: 0, individualAverage: 0, overallScore: 0 }
            },
            {
              id: 'PLACEHOLDER',
              scores: { individualAverage: 0, overallScore: 0 }
            }
          ];
          expect(normalizedScores.sort((a, b) => a.id.localeCompare(b.id))).toEqual(expected.sort((a, b) => a.id.localeCompare(b.id)));
    });
});