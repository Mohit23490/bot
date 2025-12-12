const chatbody = document.querySelector(".chat-body")
const a = document.querySelector(".message-input")
const smbtn = document.getElementById("send-message")
const fileinput = document.querySelector("#file-input")
const fileuploadwrapper = document.querySelector(".file-upload-wrapper")
const fcbtn = document.querySelector("#file-cancel")
const toggler = document.querySelector("#chat-toggler")
const closebot = document.querySelector("#close-chatbot")


const API_KEY = "AIzaSyDvfkP050WGMw1IyV5ASDCgAs8sZEvaC64"
const API_URL = `https://generativelanguage.googleapis.com/v1alpha/models/gemini-2.5-flash:generateContent?key=${API_KEY}`
const Userdata = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
}

const Data = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
}

const generatebotResponse = async (c) => {
    const messageElement = c.querySelector(".message-text")
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contents: [
                { parts: [{ text: Userdata.message }, ...(Userdata.file.data ? [{ inline_data: Userdata.file }] : [])] }
            ]
        })
    }
    try {
        const response = await fetch(API_URL, requestOptions)
        const data = await response.json();
        if (!response.ok) throw new Error(data.error.message);
        const apiresponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
        messageElement.innerText = apiresponseText;

    }
    catch (error) {
        console.log(error)
        messageElement.innerText = error.message;
        messageElement.style.color = "red"
        messageElement.style.color.width = "75%"
    }
    finally {
        c.classList.remove("thinking")
        Userdata.file = {};
        chatbody.scrollTo({ top: chatbody.scrollHeight, behavior: "smooth" })        
    }
}


const box = (e) => {
    e.preventDefault();
    Userdata.message = a.value.trim()
    a.value = "";
    fileuploadwrapper.classList.remove("file-uploaded")
    // const messagegiven = `<div class="message-text"></div> ${Userdata.file.data ?
    //      `<img src="data:${Userdata.file.data.mime_type};base64,${Userdata.file.data}" class="attachment" /> `: ""}`
    const messagegiven = `
    <div class="message-text"></div>
    ${Userdata.file?.data
            ? `<img src="data:${Userdata.file.data.mime_type};base64,${Userdata.file.data}" class="attachment" />`: ""}`;

    const b = Data(messagegiven, "user-message")
    b.querySelector(".message-text").textContent = Userdata.message
    chatbody.appendChild(b);
    chatbody.scrollTo({ top: chatbody.scrollHeight, behavior: "smooth" })
    setTimeout(() => {
        const secmessgiven = `<div class="message bot-message">
            <img class="bot-avtar" width='25px' src="logo.svg" alt=""></img>
            <div class="message-text">
                <div class="thinking-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        </div>`
        const c = Data(secmessgiven, "bot-message", "thinking")
        chatbody.appendChild(c);
        chatbody.scrollTo({ top: chatbody.scrollHeight, behavior: "smooth" })
        generatebotResponse(c)
    }, 600);
}
a.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage) {
        box(e);
    }
});

fileinput.addEventListener("change", () => {
    const file = fileinput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
         fileuploadwrapper.querySelector("img").src= e.target.result;
         fileuploadwrapper.classList.add("file-uploaded")
        const basee64String = e.target.result.split(",")[1];
        Userdata.file = {
            data: basee64String,
            mime_type: file.type
        }
        console.log(file)
        fileinput.value = "";
    }
    reader.readAsDataURL(file);
})

fcbtn.addEventListener("click",() =>{
    Userdata.file = {};
     fileuploadwrapper.classList.remove("file-uploaded")
})

const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = a;
        a.setRangeText(emoji.native, start, end, "end");
        a.focus();
    },
    onClickOutside : (e) =>{
        if(e.target.id === "emoji-pickers"){
            document.body.classList.toggle("show-emoji-picker")
        }else{
            document.body.classList.remove("show-emoji-picker")
        }
    }
})

document.querySelector(".chat-form").appendChild(picker);
smbtn.addEventListener("click", (e) => box(e))
document.querySelector("#file-upload").addEventListener("click", () => fileinput.click())

toggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"))
closebot.addEventListener("click", () => document.body.classList.remove("show-chatbot"))