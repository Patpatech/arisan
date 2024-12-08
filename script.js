const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinButton = document.getElementById("spinButton");
const openPopup = document.getElementById("openPopup");
const popup = document.getElementById("popup");
const resultPopup = document.getElementById("resultPopup");
const resultText = document.getElementById("resultText");
const closePopup = document.getElementById("closePopup");
const closeResult = document.getElementById("closeResult");
const saveParticipants = document.getElementById("saveParticipants");
const participantInputs = document.getElementById("participantInputs");
const addInput = document.getElementById("addInput");
const logPopup = document.getElementById("logPopup");
const closeLogPopup = document.getElementById("closeLogPopup");
const winnersLog = document.getElementById("winnersLog");

let participants = [];
let currentAngle = 0;
let spinning = false;
let isFirstSpin = true; // Untuk memastikan ROSIDAH menang di spin pertama

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
  participants = Array.from(participantInputs.querySelectorAll("input"))
    .map((input) => input.value)
    .filter((value) => value.trim() !== "");

  drawWheel();
  popup.classList.add("hidden");
});

// Spin the wheel
spinButton.addEventListener("click", () => {
  if (spinning || participants.length === 0) return;

  spinning = true;

  const spinTime = Math.random() * 3000 + 2000; // Random spin time
  const spinAngle = Math.random() * 360 + 720; // Random angle
  const targetAngle = currentAngle + spinAngle;

  const spin = setInterval(() => {
    currentAngle += 5;

    if (currentAngle >= targetAngle) {
      clearInterval(spin);
      spinning = false;

      let winner;
      if (isFirstSpin) {
        // ROSIDAH menang pada spin pertama
        winner = "ROSIDAH";
        isFirstSpin = false; // Setelah spin pertama, ubah menjadi false
      } else {
        // Spin acak untuk peserta lainnya
        const randomIndex = Math.floor(Math.random() * participants.length);
        winner = participants[randomIndex];
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
  }, 16);
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
    const angle = currentAngle * (Math.PI / 180) + index * arc;
    ctx.beginPath();
    ctx.fillStyle = index % 2 === 0 ? "#f0f0f0" : "#cccccc";
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, angle, angle + arc);
    ctx.fill();
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
}

// Log popup functionality
const logButton = document.querySelector('button > svg path[d="M3 3v18h18M9 9h6M9 15h6"]');
logButton.parentElement.addEventListener("click", () => {
  logPopup.classList.toggle("hidden");
});

closeLogPopup.addEventListener("click", () => {
  logPopup.classList.add("hidden");
});
                        
