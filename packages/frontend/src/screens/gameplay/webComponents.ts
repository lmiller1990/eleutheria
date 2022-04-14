class Panel extends HTMLElement {
  constructor() {
    super();
    const slot = this.innerHTML;
    this.innerHTML = `
      <div class="padding-s rounded-border-s shadow gray-1">
        ${slot}
      </div>
    `;
  }
}

window.customElements.define("b-panel", Panel);
