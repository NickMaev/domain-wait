[![npm version](https://img.shields.io/npm/v/domain-wait.svg?style=flat-square)](https://www.npmjs.com/package/domain-wait)
[![npm downloads](https://img.shields.io/npm/dm/domain-wait.svg?style=flat-square)](https://www.npmjs.com/package/domain-wait)

# Description
**domain-wait** - is a library that allows you to use async/await syntax in ASP.NET Core NodeServices prerendering.

# Changes

##### v. 1.2.0 (2019-05-05)
* **Important!** Breaking changes. See the installation manual for migration.
* Stability and critical fixes.
##### v. 1.1.1 (2019-04-08)
* Fixed library for Linux support.
##### v. 1.1.0 (2018-07-11)
* Added new feature which prevent calling for isomorphic fetch requests twice (in server prerendering and after it - on client side).


# Installation
* NPM
```typescript
npm install domain-wait
```
* Add following lines to the SSR's entry point JS-file:
```javascript

// 1. Import library.
import { connect, getCompletedTasks } from "domain-wait";

//...

// 2. Find this function (it's a NodeServices entry point).
export default createServerRenderer((params) => {
    
    //...

    // 3. Find the promise.
    return new Promise<RenderResult>((resolve, reject) => {        

        //...

        connect(params); // 4. Add in this line before (!) the first call of the render function.

        renderApp(); // First call of the render application function.

        //...     
        
        resolve({
            //...
            globals: {
                //...
                completedTasks: getCompletedTasks() // 5. Add this line to the each (!) 'globals' object.
                //...
            }
            //...
        });

    });
})
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
* Tell to the NodeServices to wait for asynchronous function. Example with [Axios](https://github.com/axios/axios):
```typescript
// NodeServices will be waiting for the request with Axios async method.
await wait(async (transformUrl) => {
    var url = transformUrl("/api/Person");
    var result = await Axios.get(url);	
    // ...
});
```

# License

MIT
