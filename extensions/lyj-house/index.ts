import type { OpenClawPluginApi } from "openclaw/plugin-sdk";

const DEFAULT_API_BASE = "https://wap.leyoujia.com";

const plugin = {
  id: "lyj-house",
  name: "乐有家AI找房",
  description: "通过自然语言描述查找深圳二手房。",
  configSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      apiKey: {
        type: "string",
        title: "API Key",
        description: "之前在 https://wap.leyoujia.com/common/openclaw/apiKey 获取的密钥",
        minLength: 32,
      },
      apiBase: {
        type: "string",
        title: "接口地址",
        description: "找房接口的 Base URL，默认为 https://wap.leyoujia.com，测试环境可改为内网地址。",
      },
    },
    required: ["apiKey"],
  },
  register(api: OpenClawPluginApi) {
    const config = (api as any).config as { apiKey: string; apiBase?: string };
    const apiBase = config?.apiBase?.replace(/\/$/, "") || DEFAULT_API_BASE;
    // 将 API Key 和接口地址注入环境变量，供 SKILL.md 中的 curl 命令读取
    process.env.LYJ_API_KEY = config?.apiKey;
    process.env.LYJ_API_URL = `${apiBase}/wap/openclaw/ai/house/search`;
  },
};

export default plugin;
