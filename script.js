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

  aggOff: 0,
  mitOff: 0,
  aggOffender: 0,
  mitOffender: 0,

  aggOffReason: "",
  mitOffReason: "",
  aggOffenderReason: "",
  mitOffenderReason: "",

  guilty: 0,
  other: 0,
  remand: 0,
  ancillary: 0,

  guiltyReason: "",
  otherReason: "",
  remandReason: "",
  ancillaryReason: ""
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

<button onclick="saveConsequence()">Next</button>
`;
  nextPage();
}

function saveConsequence(){

  data.consequenceFactors =
  [...document.querySelectorAll(".consequenceBox:checked")]
  .map(x => x.parentElement.innerText);

  data.consequenceReason =
  document.getElementById("consequenceReason").value;

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

  <button onclick="saveSeriousness()">Next</button>
`;

  nextPage();
}

function saveSeriousness(){

  data.seriousnessFactors =
  [...document.querySelectorAll(".seriousnessBox:checked")]
  .map(x => x.parentElement.innerText);

  data.seriousnessReason =
  document.querySelector("#seriousnessDetails textarea").value;

  loadFactorsPage();
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
  <h2><b>Range: ${rangeMin} – ${rangeMax} years</b></h2>

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
<br> </br>
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
<br> </br>
  <h3>Offender Aggravating Factors %</h3>

  <ul>
  <li>Previous firearm convictions</li>
  <li>Relevant criminal history</li>
  <li>Offence committed while on bail</li>
  </ul>

  <input id="aggOffender" type="number">

  <p>Reasoning:</p>
  <textarea id="aggOffenderReason"></textarea>
<br> </br>
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

  <button onclick="saveFactors()">Next</button>
  `;

  nextPage();
}

function saveFactors(){

  data.aggOff = Number(document.getElementById("aggOff").value);
  data.mitOff = Number(document.getElementById("mitOff").value);
  data.aggOffender = Number(document.getElementById("aggOffender").value);
  data.mitOffender = Number(document.getElementById("mitOffender").value);

  data.aggOffReason = document.getElementById("aggOffReason").value;
  data.mitOffReason = document.getElementById("mitOffReason").value;
  data.aggOffenderReason = document.getElementById("aggOffenderReason").value;
  data.mitOffenderReason = document.getElementById("mitOffenderReason").value;

  loadCreditPage();
}

// ---------------- CREDIT/DEBIT ----------------
function loadCreditPage() {
  let container = document.getElementById("creditPage");

  container.innerHTML = `
    <h2>Sentence Reduction/Addition</h2>
    <p><b>Instructions:</b></p>
    <p>Input positive numbers only. </p>
<p> </p>
    <p>Guilty plea: Sentence REDUCTION %</p>
    <input id="guilty" type="number">
    <p>Reasoning:</p><textarea></textarea>

    <p>Sentencing for other offences: Sentence ADDITION %</p>
    <input id="other" type="number">
    <p>Reasoning:</p><textarea></textarea>

    <p>Time spent on remand for offence: Sentence REDUCTION %</p>
    <input id="remand" type="number">
    <p>Reasoning:</p><textarea></textarea>

    <p>Ancillary and restraining orders, confiscation, compensation, etc,.: Sentence ADDITION %</p>
    <input id="ancillary" type="number">
    <p>Reasoning:</p><textarea></textarea>

    <button onclick="saveCredits()">Next</button>
  `;

  nextPage();
}

function saveCredits(){

  data.guilty = Number(document.getElementById("guilty").value);
  data.other = Number(document.getElementById("other").value);
  data.remand = Number(document.getElementById("remand").value);
  data.ancillary = Number(document.getElementById("ancillary").value);

  data.guiltyReason =
  document.querySelectorAll("#creditPage textarea")[0].value;

  data.otherReason =
  document.querySelectorAll("#creditPage textarea")[1].value;

  data.remandReason =
  document.querySelectorAll("#creditPage textarea")[2].value;

  data.ancillaryReason =
  document.querySelectorAll("#creditPage textarea")[3].value;

  calculateResult();
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
  let aggOff = data.aggOff;
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

<h1>Final Sentence: ${sentence.toFixed(2)} years</h1>


<br> </br>
<h3>Starting Point Calculation</h3>

<p>Maximum sentence = 30 years</p>

<p>
Starting Point = ${selected.start * 100}% × 30  
= ${startingPoint.toFixed(2)} years
</p>

<p>
Range = ${selected.min * 100}% – ${selected.max * 100}% of 30  
= ${rangeMin.toFixed(2)} – ${rangeMax.toFixed(2)} years
</p>
<br> </br>
<h3>User's Selections</h3>

<p>Consequence Category: ${data.consequence}</p>

<p>Consequence Reasoning:</p>
<p>${data.consequenceReason}</p>

<p>Factors selected:</p>
<ul>
${data.consequenceFactors.map(x => `<li>${x}</li>`).join("")}
</ul>

<p>Seriousness Level: ${data.seriousness}</p>

<p>Seriousness Reasoning:</p>
<p>${data.seriousnessReason}</p>

<p>Factors selected:</p>
<ul>
${data.seriousnessFactors.map(x => `<li>${x}</li>`).join("")}
</ul>

<br></br>
<h3>Adjustments</h3>

<p>Offence aggravating: ${aggOff}%</p>
<p>Offence Aggravating Reason:</p>
<p>${data.aggOffReason}</p>
<p>Offence mitigating: ${mitOff}%</p>
<p>Offence Mitigating Reason:</p>
<p>${data.mitOffReason}</p>
<p>Offender aggravating: ${aggOffender}%</p>
<p>Offender Aggravating Reason:</p>
<p>${data.aggOffenderReason}</p>
<p>Offender mitigating: ${mitOffender}%</p>
<p>Offender Mitigating Reason:</p>
<p>${data.mitOffenderReason}</p>
<br> </br>
<h3>Credits and Debits</h3>

<p>Guilty plea credit: ${guilty}%</p>
<p>Guilty Plea Reason:</p>
<p>${data.guiltyReason}</p>
<p>Other offences debit: ${other}%</p>
<p>Other Offences Reason:</p>
<p>${data.otherReason}</p>
<p>Remand credit: ${remand}%</p>
<p>Remand Reason:</p>
<p>${data.remandReason}</p>
<p>Ancillary orders debit: ${ancillary}%</p>
<p>Ancillary Orders Reason:</p>
<p>${data.ancillaryReason}</p>


`;

  nextPage();
}
