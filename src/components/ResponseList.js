export const ResponseList = ({ responses, setPrompt, setResponses }) => {

  return (
    <section id="responses-list">
      <h1>Responses</h1>
      <button id="clear-all-button" name="clear-all" onClick={() => setResponses([])}>Clear all</button>
      {responses.map((response) => (
        <div className="result-block" key={response.id}>
          <div className="prompt">
            <div className="data-label">Prompt:</div>
            <div className="data-field">{response.prompt}</div>
          </div>
          <div className="response">
            <div className="data-label">Reponse: </div>
            <div className="data-field">{response.responseString}</div>
          </div>
          <button className="icon-button" name="rewrite-prompt" onClick={() => {setPrompt(response.prompt); window.scroll({top: 0, behavior: 'smooth'})}}>
            <span className="material-symbols-outlined">
              refresh 
            </span>
          </button>
        </div>
      ))}
    </section>
  );
}
