const analyzeComponent = {
  props: {
    vpAuthors: {
      type: Array,
      required: true,
    },
  },
  data: function() {
    return {
      vdCurrentAuthor: {
        name: '',
        text: '',
        wordsPerSentence: 0,
        longestSentenceLength: '',
        longestSentence: '',
      },
      vdCurrentAuthorIndex: -1,
    };
  },
  methods: {
    /**
     * Triggered when the user clicks on the prev button.
     */
    mtdPrev: function() {
      if (this.vdCurrentAuthorIndex === -1) return;

      this.vdCurrentAuthorIndex--;
      this.vdCurrentAuthor = this.vpAuthors[this.vdCurrentAuthorIndex];
      // if (this.vdCurrentAuthorIndex === -1) this.vdCurrentAuthorIndex
    },

    /**
     * Triggered when the user clicks on the next button.
     */
    mtdNext: function() {
      if (this.vdCurrentAuthorIndex >= this.vpAuthors.length - 1) return;
      this.vdCurrentAuthorIndex++;
      this.vdCurrentAuthor = this.vpAuthors[this.vdCurrentAuthorIndex];
    },
  },
  template: `
<div style="margin: 0 auto auto; max-width: 50%;">
  <div class="selector">
    <button
      type="button"
      @click="mtdPrev"
    >&lt;</button>
    <div v-cloak>
      <h2>{{ ((vdCurrentAuthorIndex > -1) ? vdCurrentAuthor.name : 'Autor') }}</h2>
      <p>{{ ((vdCurrentAuthorIndex > -1) ? vdCurrentAuthor.period : '') }}</p>
    </div>
    <button
      type="button"
      @click="mtdNext"
    >&gt;</button>
  </div>

  <div
    v-cloak
    v-if="vdCurrentAuthorIndex > -1"
  >
    <p>
      Texto analizado: <strong>{{ vdCurrentAuthor.text }}</strong>
    </p>
    <p>
      Largo de la muestra: <strong>{{ vdCurrentAuthor.sampleWords }}</strong> palabras,
      <strong>{{ vdCurrentAuthor.sampleSentences }}</strong> oraciones.
    </p>
    <p>
      Palabras por oración en promedio: <strong>{{ vdCurrentAuthor.wordsPerSentence }}</strong>
    </p>
    <p>
      Oración más larga: <strong>{{ vdCurrentAuthor.longestSentenceLength }}</strong> palabras:
      <blockquote style="text-align: left;">
        {{ vdCurrentAuthor.longestSentence }}
      </blockquote>
    </p>
    <p v-if="false">
      Oración más corta: <strong>{{ vdCurrentAuthor.shortestSentenceLength }}</strong> palabras:
      <blockquote style="text-align: left;">
        {{ vdCurrentAuthor.shortestSentence }}
      </blockquote>
    </p>
    <p>
      Cantidad de puntos: <strong>{{ vdCurrentAuthor.howManyPeriods }}</strong>
    </p>
    <p>
      Cantidad de comas: <strong>{{ vdCurrentAuthor.howManyCommas }}</strong>
    </p>
  </div>
</div>
`,
};

export { analyzeComponent };