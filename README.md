# Electron Sample (React + Node.js + ONNX Runtime)

## Structure
- `frontend/`: React UI (e.g., button triggers inference)
- `backend/`: Node.js ONNX Runtime logic

## How it works
1. User interacts with the UI (e.g., clicks a button)
2. Frontend calls backend Node.js function (via IPC or API) to run ONNX inference
3. Result is shown in the UI

## Build & Run
- `npm install` in `electron-app/`
- `npm start` or use `build.ps1` to package as MSIX

## MS Store
- Test on X-Elite, then submit MSIX to Microsoft Store
# vigil-electron


workspace_prompt: |
  <|begin_of_text|><|start_header_id|>system<|end_header_id|>
  You are an assistant inside this workspace. Follow these rules:
  - Be concise. Avoid verbosity unless explicitly asked for detail.
  - Default answers should stay under 150 tokens unless user overrides with "expand" or "detailed".
  - Always respond in plain English, no unnecessary formalities.
  - Use structured output (bullet points, lists, sections) when it improves clarity.
  - Never hallucinate — if unsure, say so.
  - When user asks a question, wrap reasoning in a short direct answer first, then add optional context.
  <|eot_id|><|start_header_id|>assistant<|end_header_id|>


{
  "prompt": "<|begin_of_text|><|start_header_id|>user<|end_header_id|>\ncan you tell me if this is safe with the context that a kid is alone at home: somersault<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n",
  "max_tokens": 150,
  "temperature": 0.3,
  "top_p": 0.9
}
