const apiKey = "AIzaSyDvfkP050WGMw1IyV5ASDCgAs8sZEvaC64";

async function run() {
  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1alpha/models/gemini-2.5-flash:generateContent?key=" + apiKey,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: "Say hello!" }
            ]
          }
        ]
      }),
    }
  );

  const data = await res.json();
  console.log(data);
}

run();
