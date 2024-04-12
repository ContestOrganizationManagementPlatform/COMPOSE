/*
IMPORTANT: Must run this script from COMPOSE/src/lib/utils directory
Files are expected to be in "${data}" directory
For all files , the first line of the CSV file should be the headers.
For all files related to grades/scores, a row must have a value for "id" and "score" to be valid/included
For roster.csv, a row must have a value for "name", "studentID", and "teamID" to be valid/included
For teams.csv, a row must have a value for "name" and "id" to be valid/included
Errors will be written to log.txt
*/
// TODO
// Fix
// If a team doesn't have all their scores, treat the missing scores as zeroes
// If there are less then 10 scores in a category, scale to the lowest score(?) or 90th percentile(?)
var fs = require('fs');
var path = require('path');
var IN_PERSON = true;
var SCALING_MAP = {
    nonIndividual: 100,
    general: 60,
    individualSpecific: 50,
};
/*
Takes in a CSV string and returns an array of JSON objects
using the first line as the keys for the JSON objects.
*/
function readCsvString(csvString, logFile, type) {
    // Split the CSV string into an array of lines
    var lines = csvString.split("\n");
    var headers = lines[0].split(",");
    var lastHeader = headers[headers.length - 1];
    if (lastHeader.endsWith("\r")) {
        headers[headers.length - 1] = lastHeader.slice(0, -1);
    }
    var jsonArray = [];
    for (var i = 1; i < lines.length; i++) {
        var values = lines[i].split(",");
        var jsonObject = {};
        for (var j = 0; j < headers.length; j++) {
            var value = values[j] || ''; // Add null check
            jsonObject[headers[j]] = value.endsWith("\r") ? value.slice(0, -1) : value;
        }
        if (type === "") {
            if (jsonObject.id !== "" && jsonObject.score !== "") {
                jsonArray.push(jsonObject);
            }
            else {
                // console.error("Invalid data: ", jsonObject);
                fs.writeSync(logFile, "readCsvString - Invalid Data: ".concat(JSON.stringify(jsonObject), "\n\n"), { flag: 'a' });
            }
        }
        else if (type === "teams") {
            if (jsonObject.id !== "" && jsonObject.name !== "") {
                jsonArray.push(jsonObject);
            }
            else {
                // console.error("Invalid roster data: ", jsonObject);
                fs.writeSync(logFile, "readCsvString - Invalid Data: ".concat(JSON.stringify(jsonObject), "\n\n"), { flag: 'a' });
            }
        }
        else if (type === "roster") {
            if (jsonObject.studentID !== "" && jsonObject.teamID !== "" && jsonObject.name !== "") {
                jsonArray.push(jsonObject);
            }
            else {
                // console.error("Invalid roster data: ", jsonObject);
                fs.writeSync(logFile, "readCsvString - Invalid Roster Data: ".concat(JSON.stringify(jsonObject), "\n\n"), { flag: 'a' });
            }
        }
        else {
            fs.writeSync(logFile, "readCsvString - Invalid type: ".concat(type, "\n\n"), { flag: 'a' });
        }
    }
    return jsonArray;
}
/*
Used to calculate the scaling factor any test
*/
function calculateScalingFactor(listOfScores, testName) {
    var scaling = 1;
    testName = testName.toLowerCase();
    // Figure out what we're scaling to
    var toScaleTo = 100;
    switch (testName) {
        case "team":
        case "power":
        case "guts":
            toScaleTo = SCALING_MAP.nonIndividual;
            break;
        case "general":
            toScaleTo = SCALING_MAP.general;
            break;
        case "discrete":
        case "algebra":
        case "geometry":
        case "calculus":
            toScaleTo = SCALING_MAP.individualSpecific;
            break;
        default:
            throw new Error("Invalid test name: ".concat(testName));
    }
    if (listOfScores.length <= 100) {
        // Get 10th place score and use it to scale all team scores
        var tenthScore = Number(listOfScores[9].score);
        scaling = toScaleTo / tenthScore;
    }
    else {
        // Get 10% place score and use it to scale all team scores
        var tenthPercentScore = Number(listOfScores[Math.ceil(listOfScores.length / 10) - 1].score);
        scaling = toScaleTo / tenthPercentScore;
    }
    return scaling;
}
/*
Used to normalize the scores for non-individual tests
Returns a JSON object that maps teamID to its name and its scores
*/
function normalizeTeamScore(logFile, roster, normalizedScores, listOfScores, testName) {
    listOfScores = sortAndScale(listOfScores, testName);
    var _loop_1 = function (team) {
        var _a;
        var index = normalizedScores.findIndex(function (json) { return json.id === team.id; });
        var row = roster.find(function (row) { return row.teamID === team.id; });
        // If teamID does not exist in roster.csv
        if (!row) {
            fs.writeSync(logFile, "normalizeTeamScore - ".concat(team.id, " will be added to normalizedScores but does not currently have a corresponding name in roster.csv\n\n"), { flag: 'a' });
        }
        // If team already exists in normalizedScores
        if (index !== -1) {
            // Add the team score
            normalizedScores[index].scores[testName] = Math.round(team.score * 100) / 100;
        }
        else { // The team does not yet exist in normalizedScores
            normalizedScores.push({
                id: team.id,
                scores: (_a = {},
                    _a[testName] = Math.round(team.score * 100) / 100,
                    _a),
            });
        }
    };
    // Add team scores to normalizedScores
    for (var _i = 0, listOfScores_1 = listOfScores; _i < listOfScores_1.length; _i++) {
        var team = listOfScores_1[_i];
        _loop_1(team);
    }
    return normalizedScores;
}
/*
Sorts a list of scores in descending order and scales them
*/
function sortAndScale(list, testName) {
    list.sort(function (a, b) { return Number(b.score) - Number(a.score); });
    var scaling = calculateScalingFactor(list, testName);
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var team = list_1[_i];
        team.score = Number(team.score) * scaling;
    }
    return list;
}
/*
Normalizes the scores for individual tests
*/
function normalizeIndividualScores(logFile, roster, normalizedScores, general, discrete, algebra, geometry, calculus) {
    // Sort + Scale each of the individual tests - tests should already be in JSON form
    general = sortAndScale(general, "general");
    discrete = sortAndScale(discrete, "discrete");
    algebra = sortAndScale(algebra, "algebra");
    geometry = sortAndScale(geometry, "geometry");
    calculus = sortAndScale(calculus, "calculus");
    var teamTests = {};
    // Keep count of which row we're in
    var row = 0;
    var _loop_2 = function (student) {
        var studentID = student.studentID;
        var teamID = student.teamID;
        if (studentID === "" || teamID === "") {
            fs.writeSync(logFile, "normalizeIndividualScores - student ID: ".concat(studentID, ", teamID: ").concat(teamID, " for row ").concat(row + 1, " is not valid\n\n"), { flag: 'a' });
        }
        else {
            // If the teamID is not in teamTests, add it
            if (!teamTests[teamID]) {
                teamTests[teamID] = {};
            }
            // boolean to check if student has a general test score
            var hasGeneral = general.some(function (test) { return test.id === studentID; });
            if (hasGeneral) {
                // If there's a "general" test score, include it
                if (!teamTests[teamID][studentID]) {
                    teamTests[teamID][studentID] = {};
                }
                teamTests[teamID][studentID].general = {
                    score: general.find(function (test) { return test.id === studentID; }).score,
                };
            }
            else {
                // Otherwise, include two of the other four tests
                var otherTests = [discrete, algebra, geometry, calculus];
                var includedTests = 0;
                // A map from index to test name
                var indexToTest = {
                    0: "discrete",
                    1: "algebra",
                    2: "geometry",
                    3: "calculus",
                };
                for (var i = 0; i < otherTests.length; i++) {
                    // If the student has a score for this test, include it
                    var test_1 = otherTests[i].find(function (test) { return test.id === studentID; });
                    if (test_1) {
                        // if (teamID === '006') {
                        //     console.log(test_1);
                        // }
                        // If the student has not been added to teamTests, add them
                        if (!teamTests[teamID][studentID]) {
                            teamTests[teamID][studentID] = {};
                        }
                        // Add the test score to the student's scores
                        if (teamTests[teamID][studentID][indexToTest[i]]) {
                            fs.writeSync(logFile, "normalizeIndividualScores - teamTests[".concat(teamID, "][").concat(studentID, "] already has a score of ").concat(teamTests[teamID][studentID][indexToTest[i]], " for ").concat(indexToTest[i], "\n\n"), { flag: 'a' });
                        }
                        if (!teamTests[teamID][studentID][indexToTest[i]]) {
                            teamTests[teamID][studentID][indexToTest[i]] = {};
                        }
                        teamTests[teamID][studentID][indexToTest[i]].score = test_1.score;
                        includedTests++;
                        // Break the loop when two tests are included
                        if (includedTests === 2) {
                            break;
                        }
                    }
                }
            }
        }
        row++;
    };
    // Iterate through each student in roster and get studentID and teamID
    for (var _i = 0, roster_1 = roster; _i < roster_1.length; _i++) {
        var student = roster_1[_i];
        _loop_2(student);
    }
    var _loop_3 = function (teamID) {
        var totalScore = 0;
        var numPeople = 0;
        // Iterate through each student in the team
        for (var studentID in teamTests[teamID]) {
            var student = teamTests[teamID][studentID];
            if (student.general) {
                totalScore += Number(student.general.score);
            }
            else {
                for (var testID in student) {
                    totalScore += Number(student[testID].score);
                }
                // console.log(teamID);
                // console.log(teamID === '014');
                // if (teamID === '014') {
                //     console.log(totalScore);
                // }
            }
            numPeople++;
        }
        var minStudents = (IN_PERSON) ? 5 : 6;
        var maxStudents = (IN_PERSON) ? 6 : 8;
        // if (teamID === '006') {
        //     console.log(totalScore);
        // }
        var averageScore = totalScore * maxStudents / Math.max(numPeople, minStudents);
        // (IN_PERSON) ? (totalScore / Math.max(numPeople, 5)) : (totalScore / Math.max(numPeople, 6));
        var index = normalizedScores.findIndex(function (json) { return json.id === teamID; });
        if (index === -1) {
            fs.writeSync(logFile, "normalizeIndividualScores - ".concat(teamID, " does not exist in normalizedScores, but will now add\n\n"), { flag: 'a' });
            normalizedScores.push({
                id: teamID,
                scores: {
                    individualAverage: Math.round(averageScore * 100) / 100,
                },
            });
        }
        else {
            if (!normalizedScores[index].scores) {
                normalizedScores[index].scores = {};
            }
            normalizedScores[index].scores.individualAverage = Math.round(averageScore * 100) / 100;
        }
    };
    // Normalize the scores for each team
    for (var teamID in teamTests) {
        _loop_3(teamID);
    }
    return normalizedScores;
}
/*
Normalizes the scores for all tests
*/
function normalizeScores(logFile, roster, team, power, guts, general, discrete, algebra, geometry, calculus) {
    // Make a list of JSON objects that maps teamID to its name and its scores
    var normalizedScores = [];
    // Normalize the scores for each non-individual test round
    normalizedScores = normalizeTeamScore(logFile, roster, normalizedScores, team, "team");
    normalizedScores = normalizeTeamScore(logFile, roster, normalizedScores, power, "power");
    normalizedScores = normalizeTeamScore(logFile, roster, normalizedScores, guts, "guts");
    // Normalize the scores for each individual test round
    normalizedScores = normalizeIndividualScores(logFile, roster, normalizedScores, general, discrete, algebra, geometry, calculus);
    return normalizedScores;
}
/*
 Calculates the SMT overall score for a team
  */
function calculateOverallTeamScore(team) {
    var individualAverage = team.scores.individualAverage || 0;
    var power = team.scores.power || 0;
    var guts = team.scores.guts || 0;
    var teamScore = team.scores.team || 0;
    // console.log(team);
    // Calculate the team score using the formula
    var overallScore = 0.3 * individualAverage + 0.2 * power + 0.2 * guts + 0.3 * teamScore;
    // console.log(overallScore)
    // Return the calculated score
    return overallScore;
}
function calculateOverallScores(logFile, teams, roster, team, power, guts, general, discrete, algebra, geometry, calculus) {
    // Read all the csvs into JSON objects
    teams = readCsvString(teams, logFile, "teams");
    roster = readCsvString(roster, logFile, "roster");
    team = readCsvString(team, logFile, "");
    power = readCsvString(power, logFile, "");
    guts = readCsvString(guts, logFile, "");
    general = readCsvString(general, logFile, "");
    discrete = readCsvString(discrete, logFile, "");
    algebra = readCsvString(algebra, logFile, "");
    geometry = readCsvString(geometry, logFile, "");
    calculus = readCsvString(calculus, logFile, "");
    // normalizedScores is a JSON object that maps a teamID to its name and its normalized scores 
    // The normalized scores are its own nested JSON object, with team, power, guts, and individualAvg
    var normalizedScores = normalizeScores(logFile, roster, team, power, guts, general, discrete, algebra, geometry, calculus);
    for (var i = 0; i < normalizedScores.length; i++) {
        var team_1 = normalizedScores[i];
        // Calculate the overall score using the provided formula
        var overallScore = calculateOverallTeamScore(team_1);
        // Add the overall score to the scores object for the team
        if (!team_1.scores) {
            normalizedScores[i].scores = {};
        }
        normalizedScores[i].scores.overallScore = Math.round(overallScore * 100) / 100;
    }
    // Sort the normalizedScores array in descending order based on overallScore
    normalizedScores.sort(function (a, b) { return b.scores.overallScore - a.scores.overallScore; });
    var rankedCsv = "id,name,score,rank\n";
    var rank = 0;
    var previousScore = null;
    var toSkip = 0;
    var _loop_4 = function (team_2) {
        var teamID = team_2.id;
        var teamJson = teams.find(function (json) { return json.id === teamID; });
        var name_1 = teamJson ? teamJson.name : "";
        var score = team_2.scores.overallScore;
        if (score !== previousScore) {
            rank += 1 + toSkip;
            toSkip = 0;
        } else {
            toSkip++;
        }
        rankedCsv += "".concat(teamID, ",").concat(name_1, ",").concat(score, ",").concat(rank, "\n");
        previousScore = score;
    };
    for (var _i = 0, normalizedScores_1 = normalizedScores; _i < normalizedScores_1.length; _i++) {
        var team_2 = normalizedScores_1[_i];
        _loop_4(team_2);
    }
    fs.writeFileSync('overall.csv', rankedCsv, { flag: 'w' }, function (err) {
        if (err) {
            fs.writeSync(logFile, "calculateOverallScores - Error writing to overall.csv: ".concat(err, "\n\n"), { flag: 'a' });
        }
    });
    return rankedCsv;
}
function main(directoryName) {
    if (directoryName === '') {
        directoryName = path.join(__dirname, '.', 'grading');
    }
    // Open/Overwrite new file for logging
    var logFile = fs.openSync('log.txt', 'w');
    var data = directoryName;
    // Read in all csvs as strings
    var teams = fs.readFileSync("".concat(data, "/teams.csv"), 'utf8');
    var roster = fs.readFileSync("".concat(data, "/roster.csv"), 'utf8');
    var team = fs.readFileSync("".concat(data, "/team.csv"), 'utf8');
    var power = fs.readFileSync("".concat(data, "/power.csv"), 'utf8');
    var guts = fs.readFileSync("".concat(data, "/guts.csv"), 'utf8');
    var general = fs.readFileSync("".concat(data, "/general.csv"), 'utf8');
    var discrete = fs.readFileSync("".concat(data, "/discrete.csv"), 'utf8');
    var algebra = fs.readFileSync("".concat(data, "/algebra.csv"), 'utf8');
    var geometry = fs.readFileSync("".concat(data, "/geometry.csv"), 'utf8');
    var calculus = fs.readFileSync("".concat(data, "/calculus.csv"), 'utf8');
    calculateOverallScores(logFile, teams, roster, team, power, guts, general, discrete, algebra, geometry, calculus);
    fs.closeSync(logFile);
}
main(path.join(__dirname, '.', 'grading'));
module.exports = { SCALING_MAP: SCALING_MAP, readCsvString: readCsvString, calculateScalingFactor: calculateScalingFactor, normalizeTeamScore: normalizeTeamScore, sortAndScale: sortAndScale, normalizeIndividualScores: normalizeIndividualScores, normalizeScores: normalizeScores, calculateOverallTeamScore: calculateOverallTeamScore, calculateOverallScores: calculateOverallScores, main: main };
