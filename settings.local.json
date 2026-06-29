---
name: token-optimization-workflow
description: Reduce Claude API token usage and costs. Use when asked to "optimize tokens", "reduce API costs", "lower latency", "audit prompt token usage", or "set up prompt caching".
---

# Token Optimization Workflow

This skill helps you reduce token usage across Claude API calls — lowering cost and latency without sacrificing quality.

## When to Use

Invoke this skill when:
- API costs are higher than expected
- Requests are hitting context limits
- Response latency needs to improve
- You want to audit an existing prompt or codebase for waste

---

## Step 1 — Measure First

Before optimizing, get a baseline. Use the token counting endpoint:

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.count_tokens(
    model="claude-opus-4-8",
    messages=[{"role": "user", "content": YOUR_PROMPT}],
)
print(response.input_tokens)
```

Track: input tokens, output tokens, and cache hit rate per request type.

---

## Step 2 — Reduce Input Tokens

### Prompt compression
- Remove filler phrases ("Please", "Could you", "I would like you to")
- Use bullet points instead of prose instructions
- Delete redundant context the model does not need

### Trim documents
- Chunk large documents; only send the relevant chunk
- Summarize long histories instead of replaying them verbatim
- Use the Files API to reference uploaded content instead of inlining it

### Structured system prompts
- Move static instructions to the system prompt (cached on repeat calls)
- Keep the user turn short and dynamic

---

## Step 3 — Enable Prompt Caching

Cache static content so repeated calls only bill for the delta:

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": LARGE_STATIC_CONTEXT,
            "cache_control": {"type": "ephemeral"},
        }
    ],
    messages=[{"role": "user", "content": dynamic_query}],
)
```

Rules:
- Cache breakpoint must be at a stable prefix (system prompt, reference docs)
- Cache TTL is 5 minutes — keep request interval under that for warm hits
- Check `usage.cache_read_input_tokens` to confirm hits

---

## Step 4 — Reduce Output Tokens

- Set `max_tokens` to the minimum needed for your use case
- Add explicit length instructions: "Reply in one sentence", "Return JSON only"
- Use structured outputs (`output_config.format`) to eliminate prose wrapping
- For extraction tasks, ask for the field value only, not an explanation

---

## Step 5 — Right-Size the Model

| Task | Recommended model |
|---|---|
| Classification, routing, extraction | `claude-haiku-4-5` |
| Summarization, Q&A, drafting | `claude-sonnet-4-6` |
| Complex reasoning, coding, agents | `claude-opus-4-8` |

Use `effort` to tune within a model:
- `output_config={"effort": "low"}` — fast, cheap subagent tasks
- `output_config={"effort": "high"}` — default, most tasks
- `output_config={"effort": "max"}` — when correctness > cost

---

## Step 6 — Batch Non-Urgent Requests

Use the Batches API for workloads that do not need real-time responses (50% cost discount):

```python
batch = client.messages.batches.create(
    requests=[
        {
            "custom_id": str(i),
            "params": {
                "model": "claude-haiku-4-5",
                "max_tokens": 256,
                "messages": [{"role": "user", "content": item}],
            },
        }
        for i, item in enumerate(items)
    ]
)
```

---

## Quick Checklist

- [ ] Baseline token counts measured
- [ ] `cache_control` on static system prompt / docs
- [ ] `max_tokens` set to realistic ceiling
- [ ] Output length instruction in prompt
- [ ] Model matched to task complexity
- [ ] Batch API used for async workloads
- [ ] Cache hit rate > 80% on repeat call patterns
