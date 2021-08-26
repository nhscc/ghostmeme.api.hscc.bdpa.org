#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');

const DESIRED_MOVIES = [
  'm5',
  'm39',
  'm43',
  'm67',
  'm75',
  'm76',
  'm95',
  'm97',
  'm125',
  'm126',
  'm135',
  'm142',
  'm159',
  'm179',
  'm182',
  'm189',
  'm211',
  'm226',
  'm259',
  'm260',
  'm261',
  'm262',
  'm282',
  'm304',
  'm346',
  'm433',
  'm473',
  'm540',
  'm541',
  'm542',
  'm543',
  'm544',
  'm556',
  'm574',
  'm579',
  'm584',
  'm590',
  'm610'
];

const rawTitles = fs.readFileSync('movie_titles_metadata.txt', 'utf-8').split('\n');
const rawLines = fs.readFileSync('movie_lines.txt', 'utf-8').split('\n');
const rawConvos = fs.readFileSync('movie_conversations.txt', 'utf-8').split('\n');

console.log('> mapping raw titles to title objects...');

const movies = rawTitles.map((ln) =>
  ((title) => ({
    id: title[0],
    title: title[1]
  }))(ln.split(' +++$+++ '))
);

const desiredMoviesRegex = RegExp(`\\b(${DESIRED_MOVIES.join('|')})\\b`, 'gi');
const filteredMovies = movies.filter((movie) => DESIRED_MOVIES.includes(movie.id));
const names = new Set();

process.stdout.write('> reducing raw lines to line map: 00/100');

const lines = rawLines.reduce((map, ln, ndx) => {
  const [lineNumber, actorId, movieId, actorName, text] = ln.split(' +++$+++ ');

  if (map.has(lineNumber)) {
    throw new Error(`encountered duplicate line number ${lineNumber}`);
  }

  if (actorName) names.add(actorName.toLowerCase().replace(/[^a-zA-Z0-9]+/gi, ''));
  if (DESIRED_MOVIES.includes(movieId)) map.set(lineNumber, { actorId, movieId, text });

  const x = Math.floor((ndx / rawLines.length) * 100).toString();
  process.stdout.write(`\b\b\b\b\b\b${x.length == 1 ? `0${x}` : x}/100`);

  return map;
}, new Map());

console.log('\b\b\b\b\b\b100/100');
console.log('> joining and filtering conversation dialog...');

// Lol, you try to pick out the PG-13 movies from the corpus, but still...
const censor = (line) => {
  return line
    .replace(
      /(\b| )\S*(?:fuck|shit|bitch|dick|cunt|ass|rape|cock|blow|suck|screw|faggot| cum )\S*( |\b)/gi,
      '$1[bleeped]$2'
    )
    .replace(/(\S)\s\s+(\S)/gi, '$1 $2');
};

let numLines = 0;

const convos = rawConvos
  .map((ln) => {
    if (!desiredMoviesRegex.test(ln)) return null;

    const [actorIdA, actorIdB, movieId, rawLineNumbers] = ln.split(' +++$+++ ');
    const lineNumbers = JSON.parse(rawLineNumbers.trim().replace(/'/g, '"'));
    const dialog = lineNumbers.map((lineNumber) => {
      const line = lines.get(lineNumber);

      if (![actorIdA, actorIdB].includes(line.actorId)) {
        throw new Error(
          `invalid actorId "${line.actorId}" didn't match "${actorIdA}" or "${actorIdB}"`
        );
      }

      numLines++;
      return { actor: actorIdA == line.actorId ? 'A' : 'B', line: censor(line.text) };
    });

    return { movieId, dialog };
  })
  .filter(Boolean);

console.log('> mapping movie dialog to desired movies...');

const dialogs = filteredMovies
  .map((movie) =>
    convos
      .filter((convo) => convo.movieId == movie.id)
      .reduce((result, { dialog }) => [...result, dialog], [])
  )
  .flat();

const usernames = Array.from(names.values());
fs.writeFileSync('corpus.json', JSON.stringify({ dialogs, usernames }));

console.log('> corpus generated successfully');
console.log(`
Latest corpus stats:

- ${numLines} total lines
- ${usernames.length} unique usernames
- 100 unique memes

Movie titles used:

- ${filteredMovies.map((movie) => movie.title).join('\n- ')}`);
