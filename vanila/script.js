import bot from "./assets/bot.png";
import user from "./assets/user.png";
const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");
const landing = document.querySelector(".landing");
  
let loadInterval;
function loading(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";
    if (element.textContent == "....") {
      element.textContent = "";
    }
  }, 300);
}

function textLoad(element, text) {
  let index = 0;
   
   let Interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
//     chatContainer.scrollTop =chatContainer.scrollHeight;

    } else {
      clearInterval(Interval);
    }
  }, 20);

  
}

function generateUniqeId() {
  const time = Date.now();
  const random = Math.random();
  const hexaDecimal = random.toString(16);
  return `id-${time}-${hexaDecimal}`;
}

function mark(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && "ai"}" > 
      <div class="chat">
      <div class="profile"> 
      <img  src="${isAi ? bot : user}"
      alt="${isAi ? "AI" : "YOU"}"
      
      />
      </div>
      <div class="message"  id= ${uniqueId}>
              ${value}
      </div>
      </div>
    </div>
    
    `;
}

const handleSubmit = async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  chatContainer.innerHTML += mark(false, data.get("prompt"));
  form.reset();

  const unique = generateUniqeId();
  chatContainer.innerHTML += mark(true, "", unique);
  chatContainer.scrollTop = chatContainer.scrollHeight + chatContainer.scrollHeight;


  const message = document.getElementById(unique);

  
  loading(message);
  const response = await fetch("https://chat-m284.onrender.com/", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });
  clearInterval(loadInterval);
  message.innerHTML = "";
  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    textLoad(message, parsedData);
  } else {
    const err = await response.text();
    message.innerHTML = "OOPS THERE IS AN ERROR ";
    alert(err);
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.code == "Enter") {
    landing.innerHTML = "";
    handleSubmit(e);
  }
});



