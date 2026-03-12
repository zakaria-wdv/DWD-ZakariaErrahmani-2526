// === Oefening 1: querySelector() ===
{
  console.log("\n%c=== querySelector ===", "color: #0c0");

  const hdrTitel = document.querySelector("#ex1-html h3");
  console.log(hdrTitel);

  const imgVaas = document.querySelector("#ex1-html #vaas");
  console.log(imgVaas);

  const lstKenmerken = document.querySelector("#ex1-html ul");
  console.log(lstKenmerken);

  const liTweede = document.querySelector("#ex1-html ul li:nth-child(2)");
  console.log(liTweede);

  const spnDatum = document.querySelector("#ex1-html .datum");
  console.log(spnDatum);

  const lnkLijst = document.querySelector("#ex1-html ul a");
  console.log(lnkLijst);

  const tblTest = document.querySelector("#ex1-html table");
  console.log(tblTest);
}

// === Oefening 2: querySelectorAll() ===
{
  console.log("\n%c=== querySelectorAll ===", "color: #0c0");
  const liItems = document.querySelectorAll("#ex2-html .item");

  console.log(`Aantal elementen met class item: ${liItems.length}`);

  liItems.forEach((el) => {
    console.log(el.innerText);
  });

  const receptenMetEi = [...liItems]
    .map((el) => el.innerText)
    .filter((txt) => txt.includes(" ei"));

  console.log(receptenMetEi);
}

// === Oefening 3: addEventListener() ===
{
  console.log("\n%c=== addEventListener() ===", "color: #0c0");

  const btn1 = document.querySelector("#ex3 .btn-1");
  const btn2 = document.querySelector("#ex3 .btn-2");
  const selKeuze = document.querySelector("#ex3 select");
  const imgVaas = document.querySelector("#ex3 img");

  function btn1ClickHandler() {
    console.log("er is op button 1 geklikt");
  }

  function btn2ClickHandler() {
    console.log("er is op button 2 geklikt");
  }

  function selKeuzeChangeHandler() {
    console.log("nieuwe waarde gekozen");
  }

  function imgVaasMouseoverHandler() {
    console.log("muis over de afbeelding");
  }

  function imgVaasMouseoutHandler() {
    console.log("muis uit de afbeelding");
  }

  // events koppelen
  btn1.addEventListener("click", btn1ClickHandler);
  btn2.addEventListener("click", btn2ClickHandler);
  selKeuze.addEventListener("change", selKeuzeChangeHandler);
  imgVaas.addEventListener("mouseover", imgVaasMouseoverHandler);
  imgVaas.addEventListener("mouseout", imgVaasMouseoutHandler);
}

// === Oefening 4: innerHTML en innerText ===
{
  // DOBBELSTEEN OEFENING
  const spnDice = document.querySelector("#ex4 .dice-value");

  function spnDiceClickHandler() {
    const getal = Math.floor(Math.random() * 6) + 1;
    spnDice.innerText = getal;
  }

  function spnDiceMouseoutHandler() {
    spnDice.innerText = "?";
  }

  spnDice.addEventListener("click", spnDiceClickHandler);
  spnDice.addEventListener("mouseout", spnDiceMouseoutHandler);

  // AANTAL TEKENS OEFENING
  const txtBericht = document.querySelector("#ex4 textarea");
  const parTekens = document.querySelector("#ex4 .message");

  function txtBerichtInputHandler() {
    const tekst = txtBericht.value;
    parTekens.innerHTML = `Het bericht bestaat uit <em>${tekst.length} tekens</em>.`;
  }

  txtBericht.addEventListener("input", txtBerichtInputHandler);
}

// === Oefening 5: HTML-attributen lezen en schrijven ===
{
  const imgInstrument = document.querySelector("#ex5-html img");
  const btnNext = document.querySelector("#ex5-html #btn-next");
  const parMessage = document.querySelector("#ex5-html .message");

  const afbeeldingen = [
    "img/altsax.jpg",
    "img/bastrompet.jpg",
    "img/bugel.jpg",
    "img/hoorn.jpg",
  ];

  let index = 0;

  function btnNextClickHandler() {
    index++;

    if (index >= afbeeldingen.length) {
      index = 0;
    }

    imgInstrument.src = afbeeldingen[index];

    const bestandsnaam = afbeeldingen[index].split("/").pop();
    parMessage.innerHTML = `wordt getoond: <em>${bestandsnaam}</em>`;
  }

  btnNext.addEventListener("click", btnNextClickHandler);
}

// === Oefening 6: validatie tekstinvoer ===
{
  // ALLEEN LETTERS EN SPATIES OEFENING
  const txtNaam = document.querySelector("#ex6-html1 input");

  function txtNaamInputHandler() {
    let tekst = txtNaam.value;

    tekst = tekst.replace(/[^a-zA-Z\s]/g, "");

    txtNaam.value = tekst;
  }

  txtNaam.addEventListener("input", txtNaamInputHandler);
  // WACHWOORD VALIDATIE OEFENING
  const txtPassword = document.querySelector("#ex6-html2 input");
  const parError = document.querySelector("#ex6-html2 .error");

  function txtPasswordInputHandler() {
    const wachtwoord = txtPassword.value;

    if (wachtwoord.length === 0) {
      parError.innerText = "";
      return;
    }

    if (wachtwoord.length < 8) {
      parError.innerText = "moet minstens 8 tekens bevatten";
      return;
    }

    if (!/[A-Z]/.test(wachtwoord)) {
      parError.innerText = "moet minstens één hoofdletter bevatten";
      return;
    }

    if (!/[0-9]/.test(wachtwoord)) {
      parError.innerText = "moet minstens één cijfer bevatten";
      return;
    }

    parError.innerText = "";
  }

  txtPassword.addEventListener("input", txtPasswordInputHandler);
}

// === Oefening 7: e.preventDefault() ===
{
  console.log("\n%c=== e.preventDefault() ===", "color: #0c0");

  const lnkCursussen = document.querySelectorAll("#ex7-html a");
  const spnUitvoer = document.querySelector("#ex7-html .uitvoer span");

  function lnkCursusClickHandler(e) {
    e.preventDefault();
    spnUitvoer.innerHTML = `<strong>${this.innerText}</strong> (url: ${this.href})`;
  }

  lnkCursussen.forEach((lnk) => {
    lnk.addEventListener("click", lnkCursusClickHandler);
  });
}

// === Oefening 8: e.target ===
{
  const elsItems = document.querySelectorAll("#ex8-html .items > *");
  const parOutput = document.querySelector("#ex8-output");

  function elsItemsClickHandler(e) {
    const element = e.target.tagName;
    const id = e.target.id;
    const html = e.target.innerHTML;

    parOutput.innerHTML = `<strong>element</strong>: ${element}<br>
       <strong>id</strong>: ${id}<br>
       <strong>innerHTML</strong>: ${html}`;
  }

  elsItems.forEach((el) => {
    el.addEventListener("click", elsItemsClickHandler);
  });
}

// === Oefening 9: event bubbling ===
{
  const divKleuren = document.querySelector("#ex9-html .kleuren");
  const spnUitvoer = document.querySelector("#ex9-html .uitvoer span");
  const parBericht = document.querySelector("#ex9-html .bericht");

  let volgorde = [];

  function divKleurenClickHandler(e) {
    if (!e.target.classList.contains("kleur")) {
      return;
    }

    const kleur = e.target.id;
    spnUitvoer.innerText = kleur;

    volgorde.push(kleur);

    if (volgorde.length === 3) {
      if (
        volgorde[0] === "zwart" &&
        volgorde[1] === "geel" &&
        volgorde[2] === "rood"
      ) {
        parBericht.innerText = "Juist!";
      } else {
        parBericht.innerText = "Fout. Probeer opnieuw.";
      }

      volgorde = [];
    }
  }

  divKleuren.addEventListener("click", divKleurenClickHandler);
}

// === Oefening 10: formvalidatie ===
{
  const frmContact = document.querySelector("#ex10-form");
  const inpEmail = frmContact.querySelector('input[type="email"]');
  const selOnderwerp = frmContact.querySelector("select");
  const txtBericht = frmContact.querySelector("textarea");
  const chkVoorwaarden = frmContact.querySelector('input[type="checkbox"]');
  const divErrors = frmContact.querySelector(".errors");

  function frmContactSubmitHandler(e) {
    e.preventDefault();

    const errors = [];
    divErrors.innerHTML = "";

    if (inpEmail.value === "") {
      errors.push("het e-mailveld mag niet leeg zijn");
    }

    if (inpEmail.value !== "" && !inpEmail.value.includes("@")) {
      errors.push("het e-mailveld moet een @ bevatten");
    }

    if (selOnderwerp.value === "") {
      errors.push("er moet een optie in de dropdown gekozen zijn");
    }

    if (txtBericht.value.trim().length < 5) {
      errors.push("het bericht moet minstens een paar tekens bevatten");
    }

    if (!chkVoorwaarden.checked) {
      errors.push("de checkbox moet aangevinkt zijn");
    }

    if (errors.length > 0) {
      divErrors.innerHTML = errors.join("<br>");
    }
  }

  frmContact.setAttribute("novalidate", "novalidate");

  frmContact.addEventListener("submit", frmContactSubmitHandler);
}
