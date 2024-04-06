const { calculateOverallScores } = require('../tabulateScores');
const fs = require('fs');
const path = require('path');

describe('calculateOverallTeamScore function', () => {
    it('works on full 2023 dataset', () => {
        const logFile = fs.openSync(path.join(__dirname, '..', 'log.txt'), 'w');
        let roster = path.join(__dirname, '..', 'testData', 'roster.csv');
        let algebra = path.join(__dirname, '..', 'testData', 'algebra.csv');
        let calculus = path.join(__dirname, '..', 'testData', 'calculus.csv');
        let discrete = path.join(__dirname, '..', 'testData', 'discrete.csv');
        let general = path.join(__dirname, '..', 'testData', 'general.csv');
        let geometry = path.join(__dirname, '..', 'testData', 'geometry.csv');
        let guts = path.join(__dirname, '..', 'testData', 'guts.csv');
        let power = path.join(__dirname, '..', 'testData', 'power.csv');
        let team = path.join(__dirname, '..', 'testData', 'team.csv');
        let teams = path.join(__dirname, '..', 'testData', 'teams.csv');
        roster = fs.readFileSync(roster, 'utf-8');
        algebra = fs.readFileSync(algebra, 'utf-8');
        calculus = fs.readFileSync(calculus, 'utf-8');
        discrete = fs.readFileSync(discrete, 'utf-8');
        general = fs.readFileSync(general, 'utf-8');
        geometry = fs.readFileSync(geometry, 'utf-8');
        guts = fs.readFileSync(guts, 'utf-8');
        power = fs.readFileSync(power, 'utf-8');
        team = fs.readFileSync(team, 'utf-8');
        teams = fs.readFileSync(teams, 'utf-8');
        const overallScores = calculateOverallScores(logFile, teams, roster, team, power, guts, general, 
            discrete, algebra, geometry, calculus);
        const numScoreLines = overallScores.split('\n').length;
        const numTeamLines = teams.split('\n').length;
        expect(numScoreLines).toEqual(numTeamLines);
        const ranked = fs.readFileSync(path.join(__dirname, '..', 'overall.csv'), 'utf-8');
        const expected = "id,name,score,rank\n013,Random Math,143.15,1\n020,AlphaStar AIR,140.8,2\n008,San Diego Math Circle,129.08,3\n014,Gunn High: Roger Fan Club,128.23,4\n028,Saratoga,128.23,4\n011,Proof School,126.28,5\n006,YEA Spice,119.32,6\n036,AlphaStar EARTH,114.1,7\n010,Lynbrook Vikings,108.6,8\n039,Canyon Crest Conspiracy,88.96,9\n038,Mission San Jose,83.67,10\n031,BISV Bobcats,81.84,11\n004,Menlo School,76.81,12\n032,Amador Valley High School,74.34,13\n007,Quarry Lane Cougars,74.22,14\n023,Harker Eagles,71.91,15\n012,TKA,68.34,16\n009,Saint Francis High School,67.15,17\n040,Homestead High Mustangs,65.25,18\n025,Leland High: Almaden Platyπ,63.32,19\n029,DVHS,59.12,20\n017,LAHS,59.11,21\n018,Athemath,57.57,22\n041,Paly Trolls,55.49,23\n027,San Mateo Bearcats,54.42,24\n016,Irvington High Blue,50.09,25\n005,LCHS-P,44.94,26\n034,Milpitas High: AP® Sleep Deprivation >:),39.28,27\n022,EDUBUS,35.95,28\n003,SCMC Limit Breakers,35.59,29\n033,SCHSMathletes,33.24,30\n030,Lowell,33.14,31\n019,LCHS-Q,30.13,32\n015,West Ranch High School,29.6,33\n021,Stratford Math Circles,29.05,34\n024,Monte Vista: Allen's Apostles,25.18,35\n001,CAMS,24.22,36\n035,Mountain House Mustangs,22.93,37\n026,Terra Linda High: Super Secret Math Club,21.49,38\n037,Cupertino High Red,14.46,39\n002,Los Gatos High School,0,40\nPLACEHOLDER,,0,40\n";
        expect(ranked).toEqual(expected);

    });
});