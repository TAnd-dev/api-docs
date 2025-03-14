---
icon: code
---

# Generate an audio (Minimax Music)

## Overview

* **High-Quality Music Generation**: Create music tracks based on descriptive prompts.
* **Flexible Integration**: Compatible with various programming languages and frameworks.

## Consumption

1 audio file will be generated for each request, consuming a total of 73 500 AI/ML Tokens.

## API Reference

{% openapi src="../../../api-overview/audio-models-music-and-vocal/minimax-music-legacy/minimax-docs.yaml" path="/v2/generate/audio" method="post" %}
[minimax-docs.yaml](../../../api-overview/audio-models-music-and-vocal/minimax-music-legacy/minimax-docs.yaml)
{% endopenapi %}

## Examples

{% tabs %}
{% tab title="JavaScript" %}
```javascript
const main = async () => {
  const response = await fetch("https://api.aimlapi.com/v2/generate/audio", {
    method: "POST",
    headers: {
      Authorization: "Bearer <YOUR_API_KEY>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "minimax-music",
      prompt: "## Fast and Limitless. In the heart of the code, where dreams collide, FALs the name, taking tech for a ride. Generative media, blazing the trail, Fast inference power, we'll never fail.##",
      reference_audio_url: "https://cdn.aimlapi.com/squirrel/files/zebra/WzNbqH7vR20MNTOD1Ec7k_output.mp3",
    })
  }).then((res) => res.json());

  console.log("Generation:", response);
};

main()

```
{% endtab %}

{% tab title="Python" %}
```python
import requests


def main():
    url = "https://api.aimlapi.com/v2/generate/audio"
    payload = {
        "model": "minimax-music",
        "prompt": "## Fast and Limitless. In the heart of the code, where dreams collide, FALs the name, taking tech for a ride. Generative media, blazing the trail, Fast inference power, we'll never fail.##",
        "reference_audio_url": "https://cdn.aimlapi.com/squirrel/files/zebra/WzNbqH7vR20MNTOD1Ec7k_output.mp3",
    }
    headers = {"Authorization": "Bearer <YOUR_API_KEY>", "Content-Type": "application/json"}

    response = requests.post(url, json=payload, headers=headers)
    print("Generation:", response.json())


if __name__ == "__main__":
    main()

```
{% endtab %}
{% endtabs %}
