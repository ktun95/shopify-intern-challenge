/*
  ADD - more sophisticated error handling on getOpenAIReponseObject
  ADD - Local Storage 
  TEST - what fixed handleSubmit? flushSync or await?
  FIX - Initial response is fetched twice, when it should be fetched once.
*/

import "./styles.css";
import { useState, useEffect } from "react";
import { flushSync } from "react-dom";
import { PromptInput } from "./components/PromptInput.js";
import { ResponseList } from "./components/ResponseList.js";

const API_TOKEN = window.API_TOKEN;
const INITIAL_PROMPT = "Write a recipe for an invisibility potion.";

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
  console.log("from parseAPIresponse", responseObject);
  const { id, choices } = responseObject;
  return { id, responseString: choices[0].text };
};

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [responses, setResponses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log(window.API_TOKEN);

  useEffect(() => {
    fetchAndSetResponse(INITIAL_PROMPT);
  }, []);

  const fetchAndSetResponse = async (promptString) => {
    const fetchedData = await getOpenAIResponseObject(promptString);
    console.log("fromfetchAndSet", fetchedData);
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
    evt.preventDefault(); // return false

    flushSync(() => {
      console.log("flushing updates");
      setIsSubmitting(true);
    });

    try {
      await fetchAndSetResponse(prompt);
      console.log(isSubmitting);
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
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      <ResponseList responses={responses} />
    </div>
  );
}
