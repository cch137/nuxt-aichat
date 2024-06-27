import FreeGptAsiaChatbotCore from "./cores/FreeGPTAsia";
import formatUserCurrentTime from "./utils/formatUserCurrentTime";
import type { OpenAIMessage } from "./cores/types";
import { messagesToQuestionContext } from "./utils/openAiMessagesConverter";

class HunYuanFgaChatbot {
  core: FreeGptAsiaChatbotCore;
  constructor(core?: FreeGptAsiaChatbotCore) {
    this.core = core || new FreeGptAsiaChatbotCore();
  }
  async ask(
    messages: OpenAIMessage[],
    options: {
      timezone?: number;
      context?: string;
      streamId?: string;
      temperature?: number;
    } = {}
  ) {
    const { timezone = 0, streamId, temperature } = options;
    const {
      question = "",
      context = "",
      isContinueGenerate,
    } = messagesToQuestionContext(messages);
    return {
      ...(await this.core.ask(messages, {
        model: "hunyuan",
        streamId,
        temperature,
      })),
      question,
      isContinueGenerate,
    };
  }
}

export default HunYuanFgaChatbot;
