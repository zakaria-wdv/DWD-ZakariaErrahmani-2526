const MIN = 1000;
const MAX = 9999;
const AANTAL_ITERATIES = 10000;

function genereerGetal() {
    return Math.floor(Math.random() * (MAX - MIN + 1)) + MIN;
}

function aantalGelijkeCijfers(a, b) {
    if (a === b) return 4;
    if (a % 1000 === b % 1000) return 3;
    if (a % 100 === b % 100) return 2;
    if (a % 10 === b % 10) return 1;
    return 0;
}

console.log("// trekking");
const getrokkenGetal = genereerGetal();
console.log("getrokken getal: " + getrokkenGetal);
console.log("");

console.log("// gokken");
console.log("aantal iteraties: " + AANTAL_ITERATIES);
console.log("");

let juist0 = 0, juist1 = 0, juist2 = 0, juist3 = 0, juist4 = 0;
let totaleWinst = 0;

for (let i = 0; i < AANTAL_ITERATIES; i++) {
    const gok = genereerGetal();
    const juist = aantalGelijkeCijfers(getrokkenGetal, gok);

    if (juist === 0) juist0++;
    else if (juist === 1) { juist1++; totaleWinst += 2.5; }
    else if (juist === 2) { juist2++; totaleWinst += 10; }
    else if (juist === 3) { juist3++; totaleWinst += 100; }
    else { juist4++; totaleWinst += 500; }
}

console.log("// resultaten");
console.log("0 juist: " + juist0);
console.log("1 juist: " + juist1);
console.log("2 juist: " + juist2);
console.log("3 juist: " + juist3);
console.log("4 juist: " + juist4);
console.log("");

const gemiddeldeWinst = totaleWinst / AANTAL_ITERATIES;
console.log("gemiddelde winst: €" + gemiddeldeWinst.toFixed(3));
