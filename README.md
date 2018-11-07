[![npm version](https://img.shields.io/npm/v/domain-wait.svg?style=flat-square)](https://www.npmjs.com/package/domain-wait)
[![npm downloads](https://img.shields.io/npm/dm/domain-wait.svg?style=flat-square)](https://www.npmjs.com/package/domain-wait)

# Description
domain-wait - is a library that allows you to use async/await syntax in ASP.NET Core NodeServices prerendering.

# Changes
Version | Date | Description
---|---|---
1.1.0 | 2018-07-11 | Added new feature which prevent calling for isomorphic fetch requests twice (in server prerendering and after it - on client side).

# Installation
* NPM
```typescript
npm install domain-wait
```
* Add the `completedTasks` variable to the `globals` of the SSR's entry point JS-file:
```typescript
import { completedTasks } from "domain-wait";

resolve({
    html: renderApp(),
    globals: {
        //...
        completedTasks // Add this.
    }
});
```
* Add variable to the `window` object
Add the `completedTasks` array to the `window` object in Razor's `.cshtml` file:
```html
@*Instead of using "aspnet-prerender" attribute / tag helper*@
@inject Microsoft.AspNetCore.SpaServices.Prerendering.ISpaPrerenderer
@{
    var prerenderResult = await prerenderer.RenderToString(%Path to JS file which will be entry point for the SSR%, customDataParameter: %Your data object from ASP.NET Core%);
    var completedTasksJson = prerenderResult?.Globals?["completedTasks"]?.ToString();
}

<head>
    <script>
    window.completedTasks = @Html.Raw(completedTasksJson)
    </script>
</head>

<body>
    @*Instead of using "aspnet-prerender" attribute / tag helper*@
    <div id="app">@Html.Raw(prerenderResult?.Html)</div>
</body>
```
# Usage

* Import library
```typescript
import { wait, transformUrl } from "domain-wait";
```
* Tell to the NodeServices to wait for async function
Example with [Axios](https://github.com/axios/axios):
```typescript
// NodeServices will be waiting for the request with Axios async method.
await wait(async (transformUrl) => {
    var url = transformUrl("/api/Person");
    var result = await Axios.get(url);	
    // ...
});
```
Or you can use any another library for waiting for the fetch of data in the server-side prerendering.
You can also call the `transformUrl` separately to prevent of always using it in the `wait` function.
