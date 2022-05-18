/*
  ADD - more sophisticated error handling on getOpenAIReponseObject
*/

import "./styles.css";
import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { PromptInput } from "./components/PromptInput.js";
import { ResponseList } from "./components/ResponseList.js";

const API_TOKEN = window.API_TOKEN;
const LOCAL_STORAGE_KEY = "openAIResponses";
const INITIAL_PROMPT = "Write a .";

const getOpenAIResponseObject = async (
  promptString,
  engineId = "text-curie-001"
) => {
  let response;
  let timeout = 6000;
  const controller = new AbortController();

  let url = `https://api.openai.com/v1/engines/${engineId}/completions`;
  let headers = {
    Authorization: `Bearer ${API_TOKEN}`,
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

  useEffect(() => {
    const savedResponses = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));
    console.log(savedResponses, savedResponses.length)
    if (!savedResponses || savedResponses.length == 0) {
      console.log("fetching intial response")
      fetchAndSetResponse(INITIAL_PROMPT);
    } else {
      setResponses(savedResponses);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(responses));
  }, [responses]);

  const fetchAndSetResponse = async (promptString) => {
    const fetchedData = await getOpenAIResponseObject(promptString);

    const responseItem = parseAPIResponse(fetchedData);
    setResponses((prevResponses) => [
      { prompt: promptString, ...responseItem },
      ...prevResponses
    ]);
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
      />
      <ResponseList responses={responses} setResponses={setResponses} setPrompt={setPrompt}  />
    </div>
  );
}
