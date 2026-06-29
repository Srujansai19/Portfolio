/* Typewriter Effect */
(function () {
  'use strict';

  class Typewriter {
    constructor(el, words, wait) {
      this.el     = el;
      this.words  = words;
      this.wait   = parseInt(wait, 10);
      this.txt    = '';
      this.wIdx   = 0;
      this.del    = false;
      this._tick();
    }

    _tick() {
      const full = this.words[this.wIdx % this.words.length];

      if (this.del) {
        this.txt = full.substring(0, this.txt.length - 1);
      } else {
        this.txt = full.substring(0, this.txt.length + 1);
      }

      this.el.textContent = this.txt;

      let speed = this.del ? 55 : 105;

      if (!this.del && this.txt === full) {
        speed = this.wait;
        this.del = true;
      } else if (this.del && this.txt === '') {
        this.del = false;
        this.wIdx++;
        speed = 400;
      }

      setTimeout(() => this._tick(), speed);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('tw-el');
    if (!el) return;
    const words = JSON.parse(el.dataset.words || '[]');
    const wait  = el.dataset.wait || 2800;
    new Typewriter(el, words, wait);
  });
})();
