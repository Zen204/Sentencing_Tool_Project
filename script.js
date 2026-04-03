let currentPage = 0;
const pages = document.querySelectorAll(".page");
const grid = {
  1: { // Category 1
    A: { start: 0.75, min: 0.60, max: 0.90 },
    B: { start: 0.65, min: 0.50, max: 0.80 },
    C: { start: 0.50, min: 0.35, max: 0.65 }
  },
  2: { // Category 2
    A: { start: 0.65, min: 0.50, max: 0.80 },
    B: { start: 0.50, min: 0.35, max: 0.65 },
    C: { start: 0.40, min: 0.25, max: 0.55 }
  },
  3: { // Category 3
    A: { start: 0.50, min: 0.35, max: 0.65 },
    B: { start: 0.40, min: 0.25, max: 0.55 },
    C: { start: 0.30, min: 0.00, max: 0.45 }
  }
};

let data = {
  consequence: "",
  seriousness: "",
  consequenceFactors: [],
  seriousnessFactors: [],
  consequenceReason: "",
  seriousnessReason: "",
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
  container.innerHTML += `<label><input type="checkbox" class="consequenceBox"> ${opt}</label>`;
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
  container.innerHTML += `<label><input type="checkbox" class="seriousnessBox"> ${opt}</label>`;
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

  const MAX = 30;

  let category = getCategory(data.consequence);
  let level = getLevel(data.seriousness);

  let selected = grid[category][level];

  let startingPoint = (selected.start * MAX).toFixed(2);
  let rangeMin = (selected.min * MAX).toFixed(2);
  let rangeMax = (selected.max * MAX).toFixed(2);

  let container = document.getElementById("factorsPage");

  container.innerHTML = `

  <h2><b>Starting Point: ${startingPoint} years</b></h2>
  <h3>Range: ${rangeMin} – ${rangeMax} years</h3>

  <p><b>Instructions:</b></p>
  <p>Enter percentage adjustments. Use positive numbers only. Aggravating factors increase the sentence and mitigating factors decrease the sentence.</p>
  

  <h3>Offence Aggravating Factors %</h3>

  <ul>
  <li>Firearm modified to make it more dangerous</li>
  <li>Position of authority abused</li>
  <li>Steps taken to prevent reporting</li>
  <li>Possession motivated by revenge</li>
  <li>Possession over sustained time</li>
  <li>Attempt to conceal or dispose evidence</li>
  <li>Firearm unrecovered</li>
  </ul>

  <input id="aggOff" type="number">

  <p>Reasoning:</p>
  <textarea id="aggOffReason"></textarea>

  <h3>Offence Mitigating Factors %</h3>

  <ul>
  <li>Voluntary surrender of firearm</li>
  <li>Belief firearm did not require licence</li>
  <li>Mistaken belief item not firearm</li>
  <li>Coercion or intimidation</li>
  <li>Serious medical condition</li>
  </ul>

  <input id="mitOff" type="number">

  <p>Reasoning:</p>
  <textarea id="mitOffReason"></textarea>

  <h3>Offender Aggravating Factors %</h3>

  <ul>
  <li>Previous firearm convictions</li>
  <li>Relevant criminal history</li>
  <li>Offence committed while on bail</li>
  </ul>

  <input id="aggOffender" type="number">

  <p>Reasoning:</p>
  <textarea id="aggOffenderReason"></textarea>

  <h3>Offender Mitigating Factors %</h3>

  <ul>
  <li>Good character</li>
  <li>Genuine remorse</li>
  <li>Disability or ill-health</li>
  <li>Steps taken to address behaviour</li>
  <li>Youth or lack of maturity</li>
  <li>Assistance to authorities</li>
  </ul>

  <input id="mitOffender" type="number">

  <p>Reasoning:</p>
  <textarea id="mitOffenderReason"></textarea>

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

    <p>Guilty plea credit %</p>
    <input id="guilty" type="number">
    <p>Reasoning:</p><textarea></textarea>

    <p>Sentencing for other offences debit %</p>
    <input id="other" type="number">
    <p>Reasoning:</p><textarea></textarea>

    <p>Time spent on remand for offence credit %</p>
    <input id="remand" type="number">
    <p>Reasoning:</p><textarea></textarea>

    <p>Ancillary and restraining orders, confiscation, compensation, etc, debit %</p>
    <input id="ancillary" type="number">
    <p>Reasoning:</p><textarea></textarea>

    <button onclick="calculateResult()">Next</button>
  `;

  nextPage();
}

//helper function for calculations

function getCategory(consequence) {
  if (consequence === "Highest") return 1;
  if (consequence === "High") return 2;
  return 3;
}

function getLevel(seriousness) {
  if (seriousness === "High") return "A";
  if (seriousness === "Medium") return "B";
  return "C";
}

// ---------------- FINAL RESULT ----------------
function calculateResult() {
  data.consequenceFactors =
[...document.querySelectorAll(".consequenceBox:checked")]
.map(x => x.parentElement.innerText);

data.seriousnessFactors =
[...document.querySelectorAll(".seriousnessBox:checked")]
.map(x => x.parentElement.innerText);

data.consequenceReason = document.getElementById("consequenceReason")?.value || "";
  const MAX = 30;

  let category = getCategory(data.consequence);
  let level = getLevel(data.seriousness);

  let selected = grid[category][level];

  // Calculate starting point and range
  let startingPoint = selected.start * MAX;
  let rangeMin = selected.min * MAX;
  let rangeMax = selected.max * MAX;

  // Get percentage inputs
  let aggOff = Number(document.getElementById("aggOff").value);
  let mitOff = Number(document.getElementById("mitOff").value);
  let aggOffender = Number(document.getElementById("aggOffender").value);
  let mitOffender = Number(document.getElementById("mitOffender").value);

  let guilty = Number(document.getElementById("guilty").value);
  let other = Number(document.getElementById("other").value);
  let remand = Number(document.getElementById("remand").value);
  let ancillary = Number(document.getElementById("ancillary").value);

  // Validate inputs
  let inputs = [aggOff, mitOff, aggOffender, mitOffender, guilty, other, remand, ancillary];
  if (inputs.some(val => isNaN(val))) {
    alert("Please enter only numbers for all percentage fields.");
    return;
  }

  let sentence = startingPoint;

  // Apply aggravating (+)
  sentence += startingPoint * (aggOff + aggOffender + other + ancillary) / 100;

  // Apply mitigating (-)
  sentence -= startingPoint * (mitOff + mitOffender + guilty + remand) / 100;

  // Clamp within range
  if (sentence < rangeMin) sentence = rangeMin;
  if (sentence > rangeMax) sentence = rangeMax;

  // Display results
  let container = document.getElementById("resultPage");

container.innerHTML = `

<h1>Final Sentence</h1>

<h2>${sentence.toFixed(2)} years</h2>

<h3>Starting Point Calculation</h3>

<p>Maximum sentence = 30 years</p>
<p>Grid starting percentage = ${selected.start * 100}%</p>

<p>
Starting Point = ${selected.start * 100}% × 30  
= ${startingPoint.toFixed(2)} years
</p>

<p>
Range = ${selected.min * 100}% – ${selected.max * 100}% of 30  
= ${rangeMin.toFixed(2)} – ${rangeMax.toFixed(2)} years
</p>

<h3>Your Selections</h3>

<p><b>Consequence Category:</b> ${data.consequence}</p>

<p><b>Factors selected:</b></p>
<ul>
${data.consequenceFactors.map(x => `<li>${x}</li>`).join("")}
</ul>

<p><b>Seriousness Level:</b> ${data.seriousness}</p>

<p><b>Factors selected:</b></p>
<ul>
${data.seriousnessFactors.map(x => `<li>${x}</li>`).join("")}
</ul>

<h3>Adjustments</h3>

<p>Offence aggravating: ${aggOff}%</p>
<p>Offence mitigating: ${mitOff}%</p>
<p>Offender aggravating: ${aggOffender}%</p>
<p>Offender mitigating: ${mitOffender}%</p>

<h3>Credits and Debits</h3>

<p>Guilty plea credit: ${guilty}%</p>
<p>Other offences debit: ${other}%</p>
<p>Remand credit: ${remand}%</p>
<p>Ancillary orders debit: ${ancillary}%</p>

`;

  nextPage();
}
