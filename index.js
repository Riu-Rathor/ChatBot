const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");
let userMessage;
const inputInitHeight = chatInput.scrollHeight;

const createCharLi = (message, className) => {
    // create a chat Li element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").innerHTML = message;
    return chatLi;
}

const generateResponse = async (incomingChatLi) => {
    const url = 'https://robomatic-ai.p.rapidapi.com/api';
    const messageElement = incomingChatLi.querySelector("p");
    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '227b010bc3mshfada98bcd3819b2p1c518cjsn61aeaf388db1',
            'X-RapidAPI-Host': 'robomatic-ai.p.rapidapi.com'
        },
        body: new URLSearchParams({
            in: userMessage,
            op: 'in',
            cbot: '1',
            SessionID: 'RapidAPI1',
            cbid: '1',
            key: 'RHMN5hnQ4wTYZBGCF3dfxzypt68rVP',
            ChatSource: 'RapidAPI',
            duration: '1'
        })
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        messageElement.innerHTML = result.out;
    } catch (error) {
        messageElement.classList.add("error");
        messageElement.innerHTML = "Oops! Something went wrong. Please try again";
    }
    finally {
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }    
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // append the user's message to the chatbox
    chatbox.appendChild(createCharLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // displaying the thinking message until the response will come
        const incomingChatLi = createCharLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600)    
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});


sendChatBtn.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
});

chatbotCloseBtn.addEventListener("click", () => {
    document.body.classList.remove("show-chatbot");
});