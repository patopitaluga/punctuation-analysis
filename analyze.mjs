const analyzeComponent = {
  props: {
    vpAuthors: {
      type: Array,
      required: true,
    },
  },
  data: function() {
    return {
      vdCurrentAuthor: (this.vpAuthors.length === 1) ? this.vpAuthors[0] : {},
      vdCurrentAuthorIndex: (this.vpAuthors.length === 1) ? 0 : -1,
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
<div style="margin: 0 auto auto; width: 50%; flex: 0 0 auto;">
  <div class="selector">
    <div style="width: 100px;">
      <button
        v-show="this.vpAuthors.length > 1 && this.vdCurrentAuthorIndex > -1"
        type="button"
        @click="mtdPrev"
      >&lt;</button>
    </div>
    <div v-cloak>
      <h2>{{ ((vdCurrentAuthorIndex > -1) ? vdCurrentAuthor.name : 'Autor') }}</h2>
      <p>{{ ((vdCurrentAuthorIndex > -1) ? vdCurrentAuthor.period : '') }}</p>
    </div>
    <div style="width: 100px;">
      <button
        v-show="this.vpAuthors.length > 1 && this.vdCurrentAuthorIndex < this.vpAuthors.length - 1"
        type="button"
        @click="mtdNext"
      >&gt;</button>
    </div>
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
      <blockquote style="text-align: left;height: 110px;overflow: auto">
        {{ vdCurrentAuthor.longestSentence }}
      </blockquote>
    </p>
    <p>
      Oraciones cortas:
      <blockquote style="text-align: left;">
        <div
          v-for="(_eachSentence, _index) in vdCurrentAuthor.shortSentences"
          :key="_index"
        >
          {{ _eachSentence }}
        </div>
      </blockquote>
    </p>

    <table style="font-size: 12px;border-collapse: collapse;">
      <tr
        v-for="(_eachRow, _index) in vdCurrentAuthor.sentencesWith"
        :key="_index"
        >
        <td style="text-align: right;">
          Oraciones con {{ _eachRow.numberOfWords }} palabras
        </td>
        <td style="text-align: left;padding-left: 16px;">
          <span
            v-for="_eachHowMany in _eachRow.numberOfSentences"
            :key="_eachHowMany"
            style="display: inline-block;width: 10px; height: 10px; background: #999;margin-left: 1px;margin-top: 4px;"
          >
          </span>
        </td>
      </tr>
    </table>

    <p>
      Cantidad de puntos: <strong>{{ vdCurrentAuthor.howManyPeriods }}</strong>
    </p>
    <p>
      Cantidad de comas: <strong>{{ vdCurrentAuthor.howManyCommas }}</strong>
    </p>
    <p>
      Signos:
    </p>
    <pre style="font-size: 18px;text-align: left;">{{ vdCurrentAuthor.art }}
    </pre>
  </div>
</div>
`,
};

export { analyzeComponent };