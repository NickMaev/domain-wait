[![npm version](https://img.shields.io/npm/v/domain-wait.svg?style=flat-square)](https://www.npmjs.com/package/domain-wait)
[![npm downloads](https://img.shields.io/npm/dm/domain-wait.svg?style=flat-square)](https://www.npmjs.com/package/domain-wait)

# Description
domain-wait - is a library that allows you to use async/await syntax in ASP.NET Core NodeServices prerendering.

# Installation
```typescript
npm install domain-wait
```

# Usage

## Import library
```typescript
import { wait, transformUrl } from "domain-wait";
```

## Tell to the NodeServices to wait for async function
Example with [axios](https://github.com/axios/axios):
```typescript
// NodeServices will be waiting for the request with axios.
await wait(async (transformUrl) => {
	var url = transformUrl("/api/Person");
    var result = await Axios.get(url);	
	// ...
});
```
Or you can use any another library for waiting for the fetch of data in the server-side prerendering.
You can also call the `transformUrl` separately to prevent of always using it in the `wait` function.
