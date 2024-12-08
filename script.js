const canvas = document.getElementById("wheel"); 
const ctx = canvas.getContext("2d");

const spinButton = document.getElementById("spinButton");

const openPopup = document.getElementById("openPopup");
const popup = document.getElementById("popup");
const resultPopup = document.getElementById("resultPopup");
const resultText = document.getElementById("resultText");
const closePopup = document.getElementById("closePopup"); // Updated ID for participant popup
const closeResult = document.getElementById("closeResult"); // Updated ID for result popup
const saveParticipants = document.getElementById("saveParticipants");
const participantInputs = document.getElementById("participantInputs");
const addInput = document.getElementById("addInput");
const logPopup = document.getElementById("logPopup");
const closeLogPopup = document.getElementById("closeLogPopup");
const winnersLog = document.getElementById("winnersLog");

let participants = [];
let currentAngle = 0;
let spinning = false;
let isFirstSpin = true; // Menandakan apakah ini spin pertama setelah reload

// Open/Close popup for participants
openPopup.addEventListener("click", () => {
  popup.classList.toggle("hidden");
});

closePopup.addEventListener("click", () => {
  popup.classList.add("hidden");
});

// Add input fields dynamically
addInput.addEventListener("click", () => {
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = `Name ${participantInputs.children.length + 1}`;
  input.classList.add(
    "w-full",
    "px-3",
    "py-2",
    "border",
    "rounded-lg",
    "focus:outline-none",
    "focus:ring-2",
    "focus:ring-indigo-500"
  );
  participantInputs.appendChild(input);
});

// Save participants and update the wheel
saveParticipants.addEventListener("click", () => {
  participants = Array.from(
    participantInputs.querySelectorAll("input")
  )
    .map((input) => input.value)
    .filter((value) => value.trim() !== "");

  // Ensure "ROSIDAH" is included in participants
  if (!participants.map(name => name.toLowerCase()).includes("rosidah")) {
    participants.unshift("ROSIDAH");
  }

  drawWheel();
  popup.classList.add("hidden");
});

// Spin the wheel
spinButton.addEventListener("click", () => {
  if (spinning || participants.length === 0) return;
  spinning = true;

  const spinDuration = 3000; // Total spin duration in ms
  const spinInterval = 16; // Interval time in ms
  let elapsed = 0;

  let spinAngle;
  let targetAngle;

  if (isFirstSpin) {
    // Hitung segmen "ROSIDAH"
    const arc = (2 * Math.PI) / participants.length;
    // Tambahkan kelipatan penuh untuk memastikan roda berputar beberapa kali
    const fullRotations = 5; // Misalnya, 5 putaran penuh
    // Target angle untuk "ROSIDAH" berada di segmen pertama (index 0)
    spinAngle = fullRotations * 2 * Math.PI + 0 * arc + arc / 2;
    targetAngle = currentAngle + spinAngle;
  } else {
    // Spin acak
    spinAngle = Math.random() * 2 * Math.PI + 4 * 2 * Math.PI; // Minimal 4 putaran penuh
    targetAngle = currentAngle + spinAngle;
  }

  const spin = setInterval(() => {
    elapsed += spinInterval;
    const progress = Math.min(elapsed / spinDuration, 1);
    // Menggunakan easing untuk animasi lebih halus
    const easeOut = 1 - Math.pow(1 - progress, 3);
    currentAngle += 5 * easeOut;

    if (currentAngle >= targetAngle || elapsed >= spinDuration) {
      clearInterval(spin);
      spinning = false;

      let winner;

      if (isFirstSpin) {
        // ROSIDAH menang pada spin pertama
        winner = "ROSIDAH";
        isFirstSpin = false; // Setelah spin pertama, set menjadi false

        // Sesuaikan currentAngle agar roda berhenti di segmen "ROSIDAH"
        const arc = (2 * Math.PI) / participants.length;
        currentAngle = targetAngle - (currentAngle % (2 * Math.PI)) + (0 * arc) + arc / 2;
      } else {
        // Spin acak untuk peserta
        const normalizedAngle = currentAngle % (2 * Math.PI);
        const arc = (2 * Math.PI) / participants.length;
        const selected = Math.floor(normalizedAngle / arc);
        winner = participants[selected];
      }

      resultText.textContent = `Winner: ${winner}`;
      resultPopup.classList.remove("hidden");

      // Add the winner to the log
      const logEntry = document.createElement("li");
      logEntry.textContent = winner;
      logEntry.classList.add(
        "bg-gray-100",
        "px-3",
        "py-2",
        "rounded-lg",
        "shadow-sm"
      );
      winnersLog.appendChild(logEntry);
    }
    drawWheel();
  }, spinInterval);
});

// Close the result popup
closeResult.addEventListener("click", () => {
  resultPopup.classList.add("hidden");
});

// Draw the wheel
function drawWheel() {
  const radius = canvas.width / 2;
  const arc = (2 * Math.PI) / participants.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  participants.forEach((name, index) => {
    const angle = currentAngle + index * arc;

    // Pilih warna untuk setiap segmen
    ctx.beginPath();
    ctx.fillStyle = index % 2 === 0 ? "#f0f0f0" : "#cccccc";
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, angle, angle + arc);
    ctx.fill();

    // Gambar teks
    ctx.save();
    ctx.translate(
      radius + Math.cos(angle + arc / 2) * radius * 0.7,
      radius + Math.sin(angle + arc / 2) * radius * 0.7
    );
    ctx.rotate(angle + arc / 2);
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.font = "14px Arial";
    ctx.fillText(name, 0, 0);
    ctx.restore();
  });

  // Gambar penunjuk (pointer)
  ctx.beginPath();
  ctx.fillStyle = "#ff0000";
  ctx.moveTo(radius, radius - radius);
  ctx.lineTo(radius - 10, radius - radius - 20);
  ctx.lineTo(radius + 10, radius - radius - 20);
  ctx.closePath();
  ctx.fill();
}

// Initial draw
drawWheel();

// Log popup handling
const logButton = document.querySelector(
  'button > svg path[d="M3 3v18h18M9 9h6M9 15h6"]'
); // Select the log button based on SVG path

if (logButton && logButton.parentElement) {
  logButton.parentElement.addEventListener("click", () => {
    logPopup.classList.toggle("hidden");
  });
}

closeLogPopup.addEventListener("click", () => {
  logPopup.classList.add("hidden");
});
