export const ResponseList = ({ responses }) => {

  return (
    <section id="responses-list">
      <h1>Responses</h1>
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
        </div>
      ))}
    </section>
  );
};
