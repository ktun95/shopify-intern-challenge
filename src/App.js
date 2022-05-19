import "./styles.css";
import { useState, useEffect, useRef } from "react";
import { flushSync } from "react-dom";
import { PromptInput } from "./components/PromptInput.js";
import { ResponseList } from "./components/ResponseList.js";

const LOCAL_STORAGE_KEY = "openAIResponses";
const INITIAL_PROMPT =
  "Write a story about a man named Kevin who meets a toad who lives at the bottom of a well.";

const fetchAPIToken = async () => {
  const response = await fetch("/api/token");
  const data = await response.json();
  return data.API_TOKEN;
};

const getOpenAIResponseObject = async (
  promptString,
  apiToken,
  engineId = "text-curie-001"
) => {
  let response;
  let timeout = 6000;
  const controller = new AbortController();
  let url = `https://api.openai.com/v1/engines/${engineId}/completions`;
  let headers = {
    Authorization: `Bearer ${apiToken}`,
    "Content-Type": "application/json"
  };

  let body = {
    prompt: promptString,
    temperature: 0.5,
    max_tokens: 150,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
  };

  try {
    const id = setTimeout(() => controller.abort(), timeout);
    response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(id);
    return response.json();
  } catch (err) {
    console.error(err.message, err.stack);
  }
};

const parseAPIResponse = (responseObject) => {
  const { id, choices } = responseObject;
  return { id, responseString: choices[0].text };
};

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textAreaRef = useRef();

  useEffect(() => {
    const savedResponses = JSON.parse(
      window.localStorage.getItem(LOCAL_STORAGE_KEY)
    );
    if (!savedResponses || savedResponses.length === 0) {
      fetchAndSetResponse(INITIAL_PROMPT);
    } else {
      setResponses(savedResponses);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

  const fetchAndSetResponse = async (promptString) => {
    try {
      const OpenAIToken = await fetchAPIToken();
      const fetchedData = await getOpenAIResponseObject(
        promptString,
        OpenAIToken
      );
      const responseItem = parseAPIResponse(fetchedData);
      setResponses((prevResponses) => [
        { prompt: promptString, ...responseItem },
        ...prevResponses
      ]);
    } catch (err) {
      console.error(err.message, err.stack);
    }
  };

  const handleChange = (evt) => {
    setPrompt(evt.target.value);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    flushSync(() => {
      setIsSubmitting(true);
    });

    try {
      await fetchAndSetResponse(prompt);
    } catch (err) {
      console.error(err.message, err.stack);
    } finally {
      setPrompt("");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <PromptInput
        prompt={prompt}
        isSubmitting={isSubmitting}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        textAreaRef={textAreaRef}
      />
      <ResponseList
        responses={responses}
        setResponses={setResponses}
        setPrompt={setPrompt}
        textAreaRef={textAreaRef}
      />
    </div>
  );
}
