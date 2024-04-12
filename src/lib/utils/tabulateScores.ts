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

const fs = require('fs');
const path = require('path');
const IN_PERSON = true;
const SCALING_MAP = {
  nonIndividual: 100,
  general: 60,
  individualSpecific: 50,
}



/* 
Takes in a CSV string and returns an array of JSON objects 
using the first line as the keys for the JSON objects.
*/
function readCsvString(csvString, logFile, type) {
  // Split the CSV string into an array of lines
  const lines = csvString.split("\n");


  const headers = lines[0].split(",");
  const lastHeader = headers[headers.length - 1];
  if (lastHeader.endsWith("\r")) {
    headers[headers.length - 1] = lastHeader.slice(0, -1);
  }
  const jsonArray = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    const jsonObject = {};
    for (let j = 0; j < headers.length; j++) {
      const value = values[j] || ''; // Add null check
      jsonObject[headers[j]] = value.endsWith("\r") ? value.slice(0, -1) : value;
    }
    if (type === "") {
      if ( jsonObject.id !== "" && jsonObject.score !== "") {
        jsonArray.push(jsonObject);
      } else {
        // console.error("Invalid data: ", jsonObject);
        fs.writeSync(logFile, `readCsvString - Invalid Data: ${JSON.stringify(jsonObject)}\n\n`, { flag: 'a' });
      }
    }
    else if (type === "teams") {
      if (jsonObject.id !== "" && jsonObject.name !== "") {
        jsonArray.push(jsonObject);
      } else {
        // console.error("Invalid roster data: ", jsonObject);
        fs.writeSync(logFile, `readCsvString - Invalid Data: ${JSON.stringify(jsonObject)}\n\n`, { flag: 'a' });
      }
    }
    else if (type === "roster") {
      if (jsonObject.studentID !== "" && jsonObject.teamID !== "" && jsonObject.name !== "") {
        jsonArray.push(jsonObject);
      } else {
        // console.error("Invalid roster data: ", jsonObject);
        fs.writeSync(logFile, `readCsvString - Invalid Roster Data: ${JSON.stringify(jsonObject)}\n\n`, { flag: 'a' });
      }
    } else {
      fs.writeSync(logFile, `readCsvString - Invalid type: ${type}\n\n`, { flag: 'a' });
    }
  }
  return jsonArray;
}

/*
Used to calculate the scaling factor any test
*/
function calculateScalingFactor(listOfScores, testName) {
  let scaling = 1;
  testName = testName.toLowerCase();

  // Figure out what we're scaling to
  let toScaleTo = 100;
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
      throw new Error(`Invalid test name: ${testName}`);
  }

  if (listOfScores.length <= 100) {
    // Get 10th place score and use it to scale all team scores
    let tenthScore = Number(listOfScores[9].score);
    scaling = toScaleTo / tenthScore;
  } else {
    // Get 10% place score and use it to scale all team scores
    let tenthPercentScore = Number(listOfScores[Math.ceil(listOfScores.length / 10) - 1].score);
    scaling = toScaleTo / tenthPercentScore;
  }
  return scaling
}

/* 
Used to normalize the scores for non-individual tests
Returns a JSON object that maps teamID to its name and its scores
*/
function normalizeTeamScore(logFile, roster, normalizedScores, listOfScores, testName) {

  listOfScores = sortAndScale(listOfScores, testName);

  // Add team scores to normalizedScores
  for (let team of listOfScores) {
    const index = normalizedScores.findIndex(json => json.id === team.id);
    const row = roster.find(row => row.teamID === team.id);
    // If teamID does not exist in roster.csv
    if (!row) {
      fs.writeSync(logFile, `normalizeTeamScore - ${team.id} will be added to normalizedScores but does not currently have a corresponding name in roster.csv\n\n`, { flag: 'a' });
    }
    // If team already exists in normalizedScores
    if (index !== -1) {
      // Add the team score
        normalizedScores[index].scores[testName] = Math.round(team.score * 100) / 100;
    } else { // The team does not yet exist in normalizedScores
      normalizedScores.push({
        id: team.id,
        scores: {
          [testName]: Math.round(team.score * 100) / 100,
        },
      });
    }
  }
  return normalizedScores;
}

/*
Sorts a list of scores in descending order and scales them
*/
function sortAndScale(list, testName) {
  list.sort((a, b) => Number(b.score) - Number(a.score));
  const scaling = calculateScalingFactor(list, testName);
  for (let team of list) {
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

  const teamTests = {};

  // Keep count of which row we're in
  let row = 0;
  // Iterate through each student in roster and get studentID and teamID
  for (let student of roster) {
    const studentID = student.studentID;
    const teamID = student.teamID;
    if (studentID === "" || teamID === "") {
      fs.writeSync(logFile, `normalizeIndividualScores - student ID: ${studentID}, teamID: ${teamID} for row ${row+1} is not valid\n\n`, { flag: 'a' });
    }
    else {
      // If the teamID is not in teamTests, add it
      if (!teamTests[teamID]) {
        teamTests[teamID] = {};
      }

      // boolean to check if student has a general test score
      const hasGeneral = general.some(test => test.id === studentID);

      if (hasGeneral) {
        // If there's a "general" test score, include it
        if (!teamTests[teamID][studentID]) {
          teamTests[teamID][studentID] = {};
        }
        teamTests[teamID][studentID].general = {
          score: general.find(test => test.id === studentID).score,
        };
      } else {
        // Otherwise, include two of the other four tests
        const otherTests = [discrete, algebra, geometry, calculus];
        let includedTests = 0;
        // A map from index to test name
        const indexToTest = {
          0: "discrete",
          1: "algebra",
          2: "geometry",
          3: "calculus",
        };
        for (let i = 0; i < otherTests.length; i++) {
          // If the student has a score for this test, include it
          const test = otherTests[i].find(test => test.id === studentID);
          if (test) {
            // If the student has not been added to teamTests, add them
            if (!teamTests[teamID][studentID]) {
              teamTests[teamID][studentID] = {};
            }
            // Add the test score to the student's scores
            if (teamTests[teamID][studentID][indexToTest[i]]) {
              fs.writeSync(logFile, `normalizeIndividualScores - teamTests[${teamID}][${studentID}] already has a score of ${teamTests[teamID][studentID][indexToTest[i]]} for ${indexToTest[i]}\n\n`, { flag: 'a' });
            }
            if (!teamTests[teamID][studentID][indexToTest[i]]) {
              teamTests[teamID][studentID][indexToTest[i]] = {};
            }
            teamTests[teamID][studentID][indexToTest[i]].score = test.score;
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
  }
  // Normalize the scores for each team
  for (let teamID in teamTests) {
    let totalScore = 0;
    let numPeople = 0;
    // Iterate through each student in the team
    for (let studentID in teamTests[teamID]) {
      const student = teamTests[teamID][studentID];
      if (student.general) {
        totalScore += Number(student.general.score);
      } else {
        for (let testID in student) {
          totalScore += Number(student[testID].score);
        }
      }
      numPeople++;
    }
    const averageScore = (IN_PERSON) ? (totalScore / Math.max(numPeople, 5)) : (totalScore / Math.max(numPeople, 6));
    const index = normalizedScores.findIndex(json => json.id === teamID);
    if (index === -1) {
      fs.writeSync(logFile, `normalizeIndividualScores - ${teamID} does not exist in normalizedScores, but will now add\n\n`, { flag: 'a' });
      normalizedScores.push({
        id: teamID,
        scores: {
          individualAverage: Math.round(averageScore * 100) / 100,
        },
      });
    } else {
      if (!normalizedScores[index].scores) {
        normalizedScores[index].scores = {};
      }
      normalizedScores[index].scores.individualAverage = Math.round(averageScore * 100) / 100;
    }
  }
  return normalizedScores;
}


/*
Normalizes the scores for all tests
*/
function normalizeScores(logFile, roster, team, power, guts, general, discrete, algebra, geometry, calculus) {
  // Make a list of JSON objects that maps teamID to its name and its scores
  let normalizedScores = [];

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
  const individualAverage = team.scores.individualAverage || 0;
  const power = team.scores.power || 0;
  const guts = team.scores.guts || 0;
  const teamScore = team.scores.team || 0;

  // Calculate the team score using the formula
  const overallScore = 0.3 * individualAverage + 0.2 * power + 0.2 * guts + 0.3 * teamScore;

  // Return the calculated score
  return overallScore;
}


function calculateOverallScores(logFile, teams, roster, team, power, guts, general, 
  discrete, algebra, geometry, calculus) {
    
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
  const normalizedScores = normalizeScores(logFile, roster, team, power, guts, general, discrete, 
    algebra, geometry, calculus);
  
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

  // Sort the normalizedScores array in descending order based on overallScore
  normalizedScores.sort((a, b) => b.scores.overallScore - a.scores.overallScore);

  let rankedCsv = "id,name,score,rank\n";
  let rank = 0;
  let previousScore = null;
  let toSkip = 0

  for (let team of normalizedScores) {
    const teamID = team.id;
    const teamJson = teams.find(json => json.id === teamID);
    const name = teamJson ? teamJson.name : "";
    const score = team.scores.overallScore;

    if (score !== previousScore) {
      rank += 1 + toSkip;
    }

    rankedCsv += `${teamID},${name},${score},${rank}\n`;
    previousScore = score;
  }
  fs.writeFileSync('overall.csv', rankedCsv, { flag: 'w' }, (err) => {
    if (err) {
      fs.writeSync(logFile, `calculateOverallScores - Error writing to overall.csv: ${err}\n\n`, { flag: 'a' });
    }
  });

  return rankedCsv;
}

function main(directoryName) {
  if (directoryName === '') {
    directoryName = path.join(__dirname, '.', 'grading');
  }
  // Open/Overwrite new file for logging
  const logFile = fs.openSync('log.txt', 'w');
  const data = directoryName;

  // Read in all csvs as strings
  const teams = fs.readFileSync(`${data}/teams.csv`, 'utf8');
  const roster = fs.readFileSync(`${data}/roster.csv`, 'utf8');
  const team = fs.readFileSync(`${data}/team.csv`, 'utf8');
  const power = fs.readFileSync(`${data}/power.csv`, 'utf8');
  const guts = fs.readFileSync(`${data}/guts.csv`, 'utf8');
  const general = fs.readFileSync(`${data}/general.csv`, 'utf8');
  const discrete = fs.readFileSync(`${data}/discrete.csv`, 'utf8');
  const algebra = fs.readFileSync(`${data}/algebra.csv`, 'utf8');
  const geometry = fs.readFileSync(`${data}/geometry.csv`, 'utf8');
  const calculus = fs.readFileSync(`${data}/calculus.csv`, 'utf8');

  calculateOverallScores(logFile, teams, roster, team, power, guts, general, discrete, algebra, geometry, calculus);

  fs.closeSync(logFile);
}

main(path.join(__dirname, '.', 'data'));

module.exports = { SCALING_MAP, readCsvString, calculateScalingFactor, normalizeTeamScore, sortAndScale, normalizeIndividualScores, normalizeScores, calculateOverallTeamScore, calculateOverallScores, main };