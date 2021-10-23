const fs = require('fs');

const texts = [];
// if (process.argv[2])
// texts.push(fs.readFileSync('./' + process.argv[2], 'utf8'));

texts.push(fs.readFileSync('./Mairal - Los heroes.txt', 'utf8'));
texts.push(fs.readFileSync('./Claire Keegan - Sopa de pasaportes.txt', 'utf8'));
texts.push(fs.readFileSync('./Ernest Hemingway - Colinas como elefantes blancos.txt', 'utf8'));
texts.push(fs.readFileSync('./Franz Kafka - La Metamorfosis.txt', 'utf8'));
texts.push(fs.readFileSync('./Samanta Schweblin - Un hombre sin suerte.txt', 'utf8'));
texts.push(fs.readFileSync('./J. D. Salinger - Un día perfecto para el pez banana.txt', 'utf8'));


const allTextsJson = [];
const sampleLength = 2000;

const authors = [
  {
    "name": "Pedro Mairal",
    "period": "(1970 - )",
    "text": "Fragmento de Los Héroes"
  },
  {
    "name": "Claire Keegan",
    "period": "(1968 - )",
    "text": "Fragmento de Sopa de pasaportes"
  },
  {
    "name": "Ernest Hemingway",
    "period": "(1899 - 1961)",
    "text": "Fragmento de Colinas como elefantes blancos"
  },
  {
    "name": "Franz Kafka",
    "period": "(1883 - 1924)",
    "text": "Fragmento de La Metamorfosis"
  },
  {
    "name": "Samanta Schweblin",
    "period": "(1978 - )",
    "text": "Fragmento de Un hombre sin suerte"
  },
  {
    "name": "J. D. Salinger",
    "period": "(1919 - 2010)",
    "text": "Fragmento de Un hombre sin suerte"
  }
];

texts.forEach((_eachText, _textsIndex) => {
  let textBySentence = _eachText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '')
    .replace(/\.\"/g, '"')
    .replace(/\./g, '.BREAKSENTENCE')
    .replace(/\n\n/g, '\nBREAKSENTENCE');
  let sentences = textBySentence.split('BREAKSENTENCE');
  sentences = sentences.reduce((_arr, _) => {
    if (_ !== '') _arr.push(_.trim());
    return _arr;
  }, []);

  let sumWords = 0;
  let biggestSentence = 0;
  let smallestSentence = 0;
  let arHowManyWords = [];
  let countSentences = 0; // can't use sentences.length because I'm cutting the array process after sampleLength words.
  let howManyPeriods = 0;
  let howManyCommas = 0;
  let textWithLimit = '';
  sentences.forEach((_eachSentence) => {
    if (sumWords > sampleLength) return;
    textWithLimit += _eachSentence;
    countSentences++;

    howManyPeriods += (_eachSentence.match(/\./g) || []).length;
    howManyCommas += (_eachSentence.match(/\m/g) || []).length;

    const words = _eachSentence.split(' ');
    arHowManyWords.push(words.length);
    sumWords += words.length;
    if (words.length > biggestSentence) biggestSentence = words.length;
    /*
    if (smallestSentence === 0 || words.length <= smallestSentence) {
      if (!(words.length === 1 && words[0].length < 3)) // Ignore sentences like P.
        smallestSentence = words.length;
    }*/
    // console.log(_eachSentence, words.length);
    // words.forEach((_eachWord) => {
    // });
  });
  // console.log(sentences);
  const data = {
    name: authors[_textsIndex].name,
    period: authors[_textsIndex].period,
    text: authors[_textsIndex].text,

    sampleWords: sumWords,
    sampleSentences: countSentences,
    wordsPerSentence: (sumWords / countSentences).toFixed(2),
    longestSentenceLength: biggestSentence,
    howManyPeriods: howManyPeriods,
    howManyCommas: howManyCommas,
    shortSentences: [],
    sentencesWith: [],
    art: '',
  };

  /*
  console.log(sumWords + ' palabras en ' + countSentences + ' oraciones');
  console.log('Palabras promedio por oración: ', sumWords / countSentences);
  console.log('');
  console.log('Cantidad de puntos: ' + howManyPeriods);
  console.log('');
  console.log('Cantidad de comas: ' + howManyCommas);
  console.log('');
  console.log('Oración más larga: ' + biggestSentence + ' palabras: ');
*/

  let found = false;
  sentences.forEach((_eachSentence) => {
    if (found) return;
    const words = _eachSentence.split(' ');
    if (words.length === biggestSentence) {
      data.longestSentence = _eachSentence;
      // console.log(_eachSentence);
      found = true;
    }
  });
  // console.log('');
  // console.log('Oración más corta: ' + smallestSentence + ' palabras: ');

  /*
  sentences.forEach((_eachSentence) => {
    const words = _eachSentence.split(' ');
    if (words.length === 1 && words[0].length < 3) // Ignore sentences like P.
      return;
    if (words.length === smallestSentence)
      console.log(_eachSentence);
  });*/
  let countShortExamples = 0;
  sentences.forEach((_eachSentence) => {
    const words = _eachSentence.split(' ');

    if ((words.length === 3 || words.length === 4) && countShortExamples <= 4) {
      countShortExamples++;
      data.shortSentences.push(_eachSentence);
      // console.log(_eachSentence);
    }
  });

  // console.log('');
  const uniqueSet = [...(new Set(arHowManyWords))].sort(function(a, b) {
    return a - b;
  });
  uniqueSet.forEach((_eachNumberOfWords) => {
    let howManyThisLength = 0;
    sentences.forEach((_eachSentence) => {
      const words = _eachSentence.split(' ');
      if (words.length === _eachNumberOfWords) howManyThisLength++;
    });
    if (_eachNumberOfWords < 3) return;
    data.sentencesWith.push({
      numberOfWords: _eachNumberOfWords,
      numberOfSentences: howManyThisLength,
    });
    /* console.log(
      'Con ' +
      ((_eachNumberOfWords < 10) ? ' ' : '') +
      _eachNumberOfWords + ' palabras: ' + 'O'.repeat(howManyThisLength)
    ); */
  });

  let withoutWords = textWithLimit.replace(/[a-z]/g, '');
  withoutWords = withoutWords.replace(/[A-Z]/g, '');
  withoutWords = withoutWords.replace(/[0-9]/g, '');
  withoutWords = withoutWords.replace(/á/g, '');
  withoutWords = withoutWords.replace(/é/g, '');
  withoutWords = withoutWords.replace(/í/g, '');
  withoutWords = withoutWords.replace(/ó/g, '');
  withoutWords = withoutWords.replace(/ú/g, '');
  withoutWords = withoutWords.replace(/ü/g, '');
  withoutWords = withoutWords.replace(/ñ/g, '');
  withoutWords = withoutWords.replace(/Á/g, '');
  withoutWords = withoutWords.replace(/É/g, '');
  withoutWords = withoutWords.replace(/Í/g, '');
  withoutWords = withoutWords.replace(/Ó/g, '');
  withoutWords = withoutWords.replace(/Ú/g, '');
  withoutWords = withoutWords.replace(/Ñ/g, '');
  withoutWords = withoutWords.replace(/ /g, '');
  withoutWords = withoutWords.replace(/\*/g, '');
  withoutWords = withoutWords.replace(/\"/g, '');
  withoutWords = withoutWords.replace(/\'/g, '');
  withoutWords = withoutWords.replace(/\//g, '');

  /*withoutWords = withoutWords.replace(/\-/g, '');
  withoutWords = withoutWords.replace(/\(/g, '');
  withoutWords = withoutWords.replace(/\)/g, '');
  withoutWords = withoutWords.replace(/\;/g, '');
  withoutWords = withoutWords.replace(/\-/g, '');
  withoutWords = withoutWords.replace(/\:/g, '');
  withoutWords = withoutWords.replace(/\«/g, '');
  withoutWords = withoutWords.replace(/\»/g, '');
  withoutWords = withoutWords.replace(/\—/g, '');
  withoutWords = withoutWords.replace(/\[/g, '');
  withoutWords = withoutWords.replace(/\]/g, '');
  withoutWords = withoutWords.replace(/\¿/g, '');
  withoutWords = withoutWords.replace(/\?/g, '');
  withoutWords = withoutWords.replace(/\¡/g, '');
  withoutWords = withoutWords.replace(/\!/g, '');
  withoutWords = withoutWords.replace(/\…/g, '');*/

  // console.log(withoutWords);
  const punctiationArt = withoutWords.replace(/\r\n/g, '\n').replace(/\r/g, '').replace(/\n/g, '');
  const artLineByLine = punctiationArt.match(/.{1,30}/g); // the numbre after the comma is the desired length of the line.
  // console.log('');
  data.art = artLineByLine.join('\n');
  // console.log(artLineByLine.join('\n'));
  // console.log('');


  // console.log('');
  allTextsJson.push(data);
});
console.log(JSON.stringify(allTextsJson, null, 2));
console.log('');
