import PromptType from "../types/Prompt";

interface Props {
  prompt: PromptType,
  className?: string
}
export default function Prompt(props: Props) {
  return (
    <div
      role="dialog"
      aria-describedby="dialogDesc"
      className="prompt"
      hidden={!props.prompt.showPrompt}
    >
      <p id="dialog1Desc">{props.prompt.promptMessage}</p>
    </div>
  );
}
