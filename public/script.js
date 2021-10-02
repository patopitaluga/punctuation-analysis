import { analyzeComponent } from './analyze.mjs';

const analyzeApp = Vue.createApp({
  data: function() {
    return {
      vdComparing: false,
      vdAuthors: [],
    };
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
});

analyzeApp.component('analyze', analyzeComponent);

analyzeApp.mount('#app');
