# AI驱动的工作流

## 概念

- `LLM` 是底座，只负责理解语言和生成文字，本身不能操作任何外部系统。
- `Tool` / `Function call` 是给 `LLM` 加上"手"的机制——让它能调用一个函数，比如查数据库、发 `HTTP` 请求。这是原理层，各家实现方式不同，格式也各异。
- `MCP`（Model Context Protocol）是为了解决"各家格式不统一"的问题。它定义了一套标准协议，让 `LLM` 通过统一的接口接入任意外部服务（文件系统、数据库、Slack、GitHub等等）。你可以理解为 AI 版的 USB 协议——设备（工具服务）和电脑（`LLM`）之间不需要专用线，插上就能用。
- `Agent` 是让 `LLM` "自主行动"的模式。它的核心是一个循环：思考 → 调用工具 → 观察结果 → 再思考。`Agent` 能自己分解任务、决定下一步，而不只是回答一个问题。
- `Skill` 是更轻量的东西，不是协议，就是一个 `.md` 文件，里面写着"当你遇到某类任务，应该按这个流程做"。它通过注入上下文的方式影响 `Agent` 的行为，相当于给 `Agent` 一本操作手册。`Skill` 不走网络、不调用服务，纯粹是知识和流程的描述。
- 应用层（`Claude Code`、`Cursor`、`Copilot` 等）就是把这些组合在一起卖给用户的产品，每家选用的组合方式不同。

用一句话概括它们的关系：`LLM` 是大脑，`Tool` 是手，`MCP` 是手腕的标准接口，`Agent` 是让大脑自主行动的机制，`Skill` 是教大脑某项专门技能的说明书。

## AgentSkill

Agent Skills are a lightweight, open format for extending AI agent capabilities with specialized knowledge and workflows.

At its core, a skill is a folder containing a **SKILL.md** file. This file includes **metadata** (name and description, at minimum) and instructions that tell an agent how to perform a specific task. Skills can also bundle **scripts**, **templates**, and **reference materials**.

```text
my-skill/
├── SKILL.md          # Required: instructions + metadata
├── scripts/          # Optional: executable code
├── references/       # Optional: documentation
└── assets/           # Optional: templates, resources
```

How skills work?

Skills use progressive disclosure to manage context efficiently:

1. **Discovery**: At startup, agents load only the name and description of each available skill, just enough to know when it might be relevant.
2. **Activation**: When a task matches a skill’s description, the agent reads the full SKILL.md instructions into context.
3. **Execution**: The agent follows the instructions, optionally loading referenced files or executing bundled code as needed.

This approach keeps agents fast while giving them access to more context on demand.

```markdown
---
name: pdf-processing
description: Extract PDF text, fill forms, merge files. Use when handling PDFs.
---

# PDF Processing

## When to use this skill

Use this skill when the user needs to work with PDF files...

## How to extract text

1. Use pdfplumber for text extraction...

## How to fill forms

...
```

## MCP

**MCP (Model Context Protocol)** is an open-source standard for connecting AI applications to external systems.

Using MCP, AI applications like Claude or ChatGPT can connect to data sources (e.g. local files, databases), tools (e.g. search engines, calculators) and workflows (e.g. specialized prompts)—enabling them to access key information and perform tasks.

Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect electronic devices, MCP provides a standardized way to connect AI applications to external systems.

- Agents can access your Google Calendar and Notion, acting as a more personalized AI assistant.
- Claude Code can generate an entire web app using a Figma design.
- Enterprise chatbots can connect to multiple databases across an organization, empowering users to analyze data using chat.
- AI models can create 3D designs on Blender and print them out using a 3D printer.

## 参考资料

[agentskills](https://agentskills.io/home)

[modelcontextprotocol](https://modelcontextprotocol.io/docs/getting-started/intro)

[skills](https://skills.sh/)

[MCP.so](https://mcp.so/)

[MCPMarket](https://mcpmarket.com/)
