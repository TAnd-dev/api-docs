---
icon: code
---

# Generate a Video

## Overview

You can generate a video using the AI/ML API. In the basic setup, you need only a prompt and image url.

{% swagger src="../../../.gitbook/assets/docs-public.yaml" path="/v2/generate/video/kling/generation" method="post" %}
[docs-public.yaml](../../../.gitbook/assets/docs-public.yaml)
{% endswagger %}

## Example

{% hint style="info" %}
Ensure you replace `"my_key"` with your actual API key before running the code.
{% endhint %}

{% tabs %}
{% tab title="JavaScript" %}
```javascript
const main = async () => {
  const response = await fetch('https://api.aimlapi.com/v2/generate/video/kling/generation', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer my_key',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'kling-video/v1/standard/image-to-video',
      prompt: 'Mona Lisa puts on glasses with her hands.',
      ratio: '16:9',
      image_url: 'https://s2-111386.kwimgs.com/bs2/mmu-aiplatform-temp/kling/20240620/1.jpeg',
      duration: '5',
    }),
  }).then((res) => res.json());

  console.log('Generation:', response);
};

main()
```
{% endtab %}

{% tab title="Python" %}
```python
def main():
    url = "https://api.aimlapi.com/v2/generate/video/kling/generation"
    payload = {
        "model": "kling-video/v1/standard/image-to-video",
        "prompt": "Mona Lisa puts on glasses with her hands.",
        "ratio": "16:9",
        "image_url": "https://s2-111386.kwimgs.com/bs2/mmu-aiplatform-temp/kling/20240620/1.jpeg",
        "duration": "5",
    }
    headers = {"Authorization": "Bearer my_key", "Content-Type": "application/json"}

    response = requests.post(url, json=payload, headers=headers)
    print("Generation:", response.json())


if __name__ == "__main__":
    main()

```
{% endtab %}
{% endtabs %}
