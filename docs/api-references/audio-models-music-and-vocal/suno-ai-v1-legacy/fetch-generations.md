---
icon: brackets-curly
---

# Fetch Generations

## API Reference

{% swagger src="https://api.aimlapi.com/docs-public-yaml?key=2b878a3c71a785f13366e9be96bacb29" path="/" method="get" %}
[https://api.aimlapi.com/docs-public-yaml?key=2b878a3c71a785f13366e9be96bacb29](https://api.aimlapi.com/docs-public-yaml?key=2b878a3c71a785f13366e9be96bacb29)
{% endswagger %}

## Examples

{% tabs %}
{% tab title="JavaScript" %}
```javascript
const axios = require('axios');

const url = 'https://api.aimlapi.com/?ids[0]=ID';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_API_KEY'
};

axios.get(url, { headers: headers })
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });

```
{% endtab %}

{% tab title="Python" %}
```python
import requests

url = "https://api.aimlapi.com/?ids[0]=ID"
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
}
response = requests.get(url, headers=headers)

print(response.text)

```
{% endtab %}

{% tab title="Ruby" %}
```ruby
message = "hello world"
puts message
```
{% endtab %}
{% endtabs %}
