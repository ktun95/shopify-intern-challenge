/*
  CHANGE - Use an environmental variable for SECRET
  ADD - more sophisticated error handling on getOpenAIReponseObject
  ADD - Local Storage 
*/

import "./styles.css";
import React, { useState, useEffect } from "react";
import { PromptInput } from "./components/PromptInput.js";
import { ResponseList } from "./components/ResponseList.js";

const API_TOKEN = "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";
const INITIAL_PROMPT = "Write a recipe for an invisibility potion.";

const getOpenAIResponseObject = async (
  promptString,
  engineId = "text-curie-001"
) => {
  let response;

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
    response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchAndSetInitialResponse();
  }, []);

  const fetchAndSetInitialResponse = async () => {
    const initialFetchData = await getOpenAIResponseObject(INITIAL_PROMPT);
    const initialResponseItem = parseAPIResponse(initialFetchData);
    setResponses([
      ...responses,
      { prompt: INITIAL_PROMPT, ...initialResponseItem }
    ]);
  };

  const handleChange = (evt) => {
    setPrompt(evt.target.value);
  };

  const handleSubmit = async (evt) => {
    setIsSubmitting(true);
    evt.preventDefault(); // return false
    let newResponseItem;

    const data = await getOpenAIResponseObject(prompt);
    const responseAttributes = parseAPIResponse(data);
    newResponseItem = { prompt, ...responseAttributes };

    setPrompt("");
    setResponses([newResponseItem, ...responses]);
    setIsSubmitting(false);
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
