export const ResponseList = ({
  responses,
  setPrompt,
  setResponses,
  textAreaRef
}) => {
  const handleRewrite = (response) => {
    setPrompt(response.prompt);
    textAreaRef.current.focus({ preventScroll: true });
    window.scroll({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="responses-list">
      <h1>Responses</h1>
      <button
        id="clear-all-button"
        name="clear-all"
        onClick={() => setResponses([])}
      >
        Clear all
      </button>
      {responses.map((res) => (
        <div className="result-block" key={res.id}>
          <div className="prompt">
            <div className="data-label">Prompt:</div>
            <div className="data-field">{res.prompt}</div>
          </div>
          <div className="response">
            <div className="data-label">Reponse: </div>
            <div className="data-field">{res.responseString}</div>
          </div>
          <button
            className="icon-button"
            name="rewrite-prompt"
            onClick={() => handleRewrite(res)}
          >
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      ))}
    </section>
  );
};
