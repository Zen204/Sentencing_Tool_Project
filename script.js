let currentPage = 0;
const pages = document.querySelectorAll(".page");

let data = {
  consequence: "",
  seriousness: "",
  factors: {},
  credits: {}
};

function nextPage() {
  pages[currentPage].classList.remove("active");
  currentPage++;
  pages[currentPage].classList.add("active");
}

// ---------------- CONSEQUENCE ----------------
function loadConsequencePage() {
  let value = document.querySelector('input[name="consequence"]:checked');
  if (!value) return alert("Select an option");

  data.consequence = value.value;

  let container = document.getElementById("consequenceDetails");

  let options = {
    Lesser: [
      "The firearm is at all times concealed",
      "Ammunition not in a firearm",
      "None of categories 1 and 2 applies"
    ],
    High: [
      "There is more than one concealed firearm",
      "Renting or supplying or dealing or trafficking in less than five firearms",
      "Causing extensive damage to property with a firearm",
      "Carrying a firearm openly",
      "Presence of a firearm during the commission of an offence"
    ],
    Highest: [
      "Causing or attempting injury with a firearm",
      "Discharging a firearm to cause terror",
      "Renting or supplying or dealing or trafficking in five or more firearms",
      "The firearm is particularly dangerous"
    ]
  };

  container.innerHTML = `<h2>Check all that apply</h2>`;

container.innerHTML += `<div class="section">`;

options[value.value].forEach(opt => {
  container.innerHTML += `<label><input type="checkbox"> ${opt}</label>`;
});

container.innerHTML += `</div>`;

container.innerHTML += `
  <div class="section">
    <p>Explain your reasoning:</p>
    <textarea id="consequenceReason"></textarea>
  </div>

  <button onclick="nextPage()">Next</button>
`;
  nextPage();
}

// ---------------- SERIOUSNESS ----------------
function loadSeriousnessPage() {
  let value = document.querySelector('input[name="seriousness"]:checked');
  if (!value) return alert("Select an option");

  data.seriousness = value.value;

  let container = document.getElementById("seriousnessDetails");

  let options = {
    Lesser: [
      "The presence of a firearm not in a public place is unknown to others",
      "Ammunition is non-live",
      "None of the above levels A and B apply"
    ],
    Medium: [
      "The firearm is brandished",
      "The firearm remains concealed",
      "Recovered ammunition fits firearm",
      "More than 5 rounds",
      "Public place"
    ],
    High: [
      "Gang membership",
      "Group activity",
      "Associated with drugs",
      "More than two rounds",
      "Round in chamber",
      "More than 20 rounds",
      "Prohibited ammunition",
      "Intent to cause injury",
      "Near public gathering"
    ]
  };

  container.innerHTML = `<h2>Check all that apply</h2>`;

  options[value.value].forEach(opt => {
    container.innerHTML += `<label><input type="checkbox"> ${opt}</label>`;
  });

container.innerHTML += `
  <div class="section">
    <p>Explain your reasoning:</p>
    <textarea></textarea>
  </div>

  <button onclick="loadFactorsPage()">Next</button>
`;

  nextPage();
}

// ---------------- FACTORS ----------------
function loadFactorsPage() {
  let container = document.getElementById("factorsPage");

  container.innerHTML = `
    <h2><b>Starting Point: 10</b></h2>
    <h3>Range: 5-20</h3>

    <p>Offence Aggravating Factors %</p>
    <input id="aggOff" type="number">
    <p>Reasoning:</p><textarea></textarea>

    <p>Offence Mitigating Factors %</p>
    <input id="mitOff" type="number">
    <p>Reasoning:</p><textarea></textarea>

    <p>Offender Aggravating Factors %</p>
    <input id="aggOffender" type="number">
    <p>Reasoning:</p><textarea></textarea>

    <p>Offender Mitigating Factors %</p>
    <input id="mitOffender" type="number">
    <p>Reasoning:</p><textarea></textarea>

    <button onclick="loadCreditPage()">Next</button>
  `;

  nextPage();
}

// ---------------- CREDIT/DEBIT ----------------
function loadCreditPage() {
  let container = document.getElementById("creditPage");

  container.innerHTML = `
    <h2>Instructions:</h2>
    <p>Input only positive numbers. Sentence reduced for credit, increased for debit.</p>

    <p>"Guilty plea credit %"</p>
    <input id="guilty" type="number">
    <p>"Reasoning:"</p><textarea></textarea>

    <p>"Sentencing for other offences debit %"</p>
    <input id="other" type="number">
    <p>"Reasoning:"</p><textarea></textarea>

    <p>"Time spent on remand for offence credit %"</p>
    <input id="remand" type="number">
    <p>"Reasoning:"</p><textarea></textarea>

    <p>"Ancillary and restraining orders, confiscation, compensation, etc, debit %"</p>
    <input id="ancillary" type="number">
    <p>"Reasoning:"</p><textarea></textarea>

    <button onclick="calculateResult()">Next</button>
  `;

  nextPage();
}

// ---------------- FINAL RESULT ----------------
function calculateResult() {
  let base = 10;

  let aggOff = Number(document.getElementById("aggOff").value) || 0;
  let mitOff = Number(document.getElementById("mitOff").value) || 0;
  let aggOffender = Number(document.getElementById("aggOffender").value) || 0;
  let mitOffender = Number(document.getElementById("mitOffender").value) || 0;

  let guilty = Number(document.getElementById("guilty").value) || 0;
  let other = Number(document.getElementById("other").value) || 0;
  let remand = Number(document.getElementById("remand").value) || 0;
  let ancillary = Number(document.getElementById("ancillary").value) || 0;

  let sentence = base;

  // Apply percentages
  sentence += base * (aggOff + aggOffender + other + ancillary) / 100;
  sentence -= base * (mitOff + mitOffender + guilty + remand) / 100;

  let container = document.getElementById("resultPage");

  container.innerHTML = `
    <h1>Final Sentence</h1>
    <h2>${sentence.toFixed(2)} years</h2>
    <p>All inputs have been considered.</p>
  `;

  nextPage();
}
