import { analyzeComponent } from './analyze.mjs';

const analyzeApp = Vue.createApp({
  data: function() {
    return {
      vdCompareOtherAuthor: false,
      vdCompareSelf: false,
      vdOwnTextInTextArea: '',
      vdOwnText: '',
      vdAuthors: [],
      vdOwnTextAnalysis: {},
    };
  },
  watch: {
    vdOwnText: function(_) {
      this.mtdAnalyze(_);
    },
  },
  mounted: function() {
    axios.get('./authors.json')
      .then((_) => {
        this.vdAuthors = _.data;
      })
      .catch((_err) => {
        console.log(_err);
      });
  },
  methods: {
    mtdAnalyze: function(_) {
      const sampleLength = 2000;
      let textBySentence = _
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
      });
      const data = {
        name: '',
        period: '',
        text: 'Texto subido por el usuario',

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

      let found = false;
      sentences.forEach((_eachSentence) => {
        if (found) return;
        const words = _eachSentence.split(' ');
        if (words.length === biggestSentence) {
          data.longestSentence = _eachSentence;
          found = true;
        }
      });
      let countShortExamples = 0;
      sentences.forEach((_eachSentence) => {
        const words = _eachSentence.split(' ');

        if ((words.length === 3 || words.length === 4) && countShortExamples <= 4) {
          countShortExamples++;
          data.shortSentences.push(_eachSentence);
        }
      });

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

      const punctiationArt = withoutWords.replace(/\r\n/g, '\n').replace(/\r/g, '').replace(/\n/g, '');
      const artLineByLine = punctiationArt.match(/.{1,30}/g); // the numbre after the comma is the desired length of the line.
      data.art = artLineByLine.join('\n');
      this.vdOwnTextAnalysis = data;
    },
  },
});

analyzeApp.component('analyze', analyzeComponent);

analyzeApp.mount('#app');
