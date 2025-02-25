---
description: >-
  Learn how to connect large language models to external tools using function
  calls.
icon: code
---

# Function Calling

## Introduction

When using the API, you can define functions that the model can choose to call, generating a JSON object with the necessary arguments. The Chat Completions API itself does not execute these functions; instead, it outputs the JSON, which you can then use to call the function within your code.

The latest models (gpt-4o, gpt-4-turbo, and gpt-3.5-turbo) are designed to detect when a function should be called based on the input and to produce JSON that closely matches the function signature. However, this functionality comes with potential risks. We strongly recommend implementing user confirmation steps before performing actions that could impact the real world (e.g., sending an email, posting online, making a purchase).

This guide focuses on function calling with the Chat Completions API.

## Common Use Cases

Function calling allows you to obtain structured data reliably from the model. For example, you can:

* **Create assistants that answer questions by calling external APIs**
  * Example functions: `send_email(to: string, body: string)`, `get_current_weather(location: string, unit: 'celsius' | 'fahrenheit')`
* **Convert natural language into API calls**
  * Example conversion: "Who are my top customers?" to `get_customers(min_revenue: int, created_before: string, limit: int)`, then call your internal API
* **Extract structured data from text**
  * Example functions: `extract_data(name: string, birthday: string)`, `sql_query(query: string)`

## Basic Sequence of Steps for Function Calling

1. **Call the model** with the user query and a set of functions defined in the `functions` parameter.
2. **Model response**: The model may choose to call one or more functions. If so, it will output a stringified JSON object adhering to your custom schema (note: the model may hallucinate parameters).
3. **Parse the JSON**: In your code, parse the string into JSON and call the function with the provided arguments if they exist.
4. **Call the model again**: Append the function response as a new message and let the model summarize the results back to the user.

### Supported Models

* `mistralai/Mixtral-8x7B-Instruct-v0.1`
* `mistralai/Mistral-7B-Instruct-v0.1`
* `togethercomputer/CodeLlama-34b-Instruct`
* `gpt-4o-2024-05-13`
* `gpt-4-turbo`
* `gpt-4-turbo-2024-04-09`
* `gpt-4-turbo-preview`
* `gpt-4-0125-preview`
* `gpt-4-1106-preview`
* `gpt-4`
* `gpt-4-0613`
* `gpt-3.5-turbo`
* `gpt-3.5-turbo-0125`
* `gpt-3.5-turbo-1106`
* `gpt-3.5-turbo-0613`

## Examples

{% code title="python" %}
```python
import os
import json
import openai

client = openai.OpenAI(
    base_url="https://api.aimlapi.com/v1",
    api_key='AI_ML_API',
)

tools = [
  {
    "type": "function",
    "function": {
      "name": "get_current_weather",
      "description": "Get the current weather in a given location",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {
            "type": "string",
            "description": "The city and state, e.g. San Francisco, CA"
          },
          "unit": {
            "type": "string",
            "enum": [
              "celsius",
              "fahrenheit"
            ]
          }
        }
      }
    }
  }
]

messages = [
    {"role": "system", "content": "You are a helpful assistant that can access external functions. The responses from these function calls will be appended to this dialogue. Please provide responses based on the information from these function calls."},
    {"role": "user", "content": "What is the current temperature of New York, San Francisco, and Chicago?"}
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools,
    tool_choice="auto",
)

print(json.dumps(response.choices[0].message.model_dump()['tool_calls'], indent=2))

```
{% endcode %}
