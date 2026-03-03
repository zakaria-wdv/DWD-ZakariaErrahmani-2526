function isCorrectPassword(pw) {
    if (pw.length < 9) return false;
    if (pw.includes("@")) return false;
    if (pw === "password") return false;
    return true;
}

const passwords = [
    "klepketoe",
    "test",
    "Azerty123",
    "rogier@work",
    "password",
    "MisterNasty12",
    "pwnz0red"
];

console.log("Alle paswoorden:");
for (let i = 0; i < passwords.length; i++) {
    console.log(`${i + 1}. ${passwords[i]}`);
}

console.log("");

let welOk = [];
let nietOk = [];

for (let i = 0; i < passwords.length; i++) {
    if (isCorrectPassword(passwords[i])) {
        welOk.push(passwords[i]);
    } else {
        nietOk.push(passwords[i]);
    }
}

console.log("Ok: " + welOk.join(", "));
console.log("Niet ok: " + nietOk.join(", "));
