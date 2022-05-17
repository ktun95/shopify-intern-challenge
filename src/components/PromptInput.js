export const PromptInput = ({
  handleSubmit,
  handleChange,
  prompt,
  isSubmitting
}) => {
  return (
    <section id="prompt-controls">
      <h1>OpenAI Completion</h1>
      <form
        action="submit-prompt"
        method="GET"
        datatype="text"
        id="prompt-submission-form"
        onSubmit={handleSubmit}
      >
        <div id="text-input-button-block">
          <textarea
            id="prompt-input"
            onChange={handleChange}
            value={prompt}
          ></textarea>
          <div id="controls">
            <button type="submit" disabled={isSubmitting}>Submit</button>
          </div>
        </div>
      </form>
    </section>
  );
};