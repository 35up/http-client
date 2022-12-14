# http-client

An library providing apis for http requests. It is basically a wrapper over 
XHR requests (uses fetch).


## Purpose

Provides an easy way to make http requests and handle the responses, eliminates
boilerplate code.

## APIs
The main API of the library is `createMethod`. This creates a ready to use function with some settings
already embedded into it. 
```
createMethod(method, baseUrl, defaultOptions)
```
Params:

| Parameter      | Description                                                                                                            | Type   | Optional |
|----------------|------------------------------------------------------------------------------------------------------------------------|--------|----------|
| method         | HTTP method: GET, POST, PUT, etc.                                                                                      | String | No       |
| baseUrl        | Base url of the request path (will be prefixed the final url). When not specified <br/> relative path will be used (/) | String | Yes      |
| defaultOptions | Request options that will be used by default. See details below                                                        | Object | Yes      |

Options:

| Parameter       | Description                                                                             | Type    | Optional |
|-----------------|-----------------------------------------------------------------------------------------|---------|----------|
| headers         | extra headers you would like to pass                                                    | Object  | Yes      |
| withCredentials | Flag whether to include cookies in the request (defaults to false)                      | Boolean | Yes      |
| mode            | Request mode                                                                            | String  | Yes      |
| params          | Search params object. Will be trasnformed to query string and <br/>appended to the request url | Object  | Yes      |

`createMethod` returns a function with the following signature:
```
method(endpointUrl, body, options)
```

Parameters:

| Parameter   | Description                                           | Type   | Optional |
|-------------|-------------------------------------------------------|--------|----------|
| endpointUrl | the request endpoint. Will be appended to the baseUrl | String | No       |
| body        | Request body                                          | Object | Yes      |
| options     | Request options. See details above                    | Object | Yes      |


Example:
```  
  const put = createMethod(
    'PUT',
    'https://my-website/apis/v1',
    {
      withCredentials: true, 
      headers: {'Content-Type': 'application/octet-stream'},
    },
   );
   
  // And then just use it to make an http request
  const result = await put('/order', {sku: '12345'}, {mode: 'cors'});
```
The returned value is a promise with decoded response body.

In case response fails method throws an exception of type `HttpError`

`HttpError` inherits from `Error` class has following extra properties:

| Property           | Description                                     | Type   |
|--------------------|-------------------------------------------------|--------|
| responseStatus     | status code (404, 500, etc.)                    | Number |
| responseStatusText | status text (i.e. internal server error)        | String |
| data               | Reponse data. This may contain arbitrary object | Object |


#### Checking if thrown exception is of type HttpError

This is possible with `isHttpError` utility:
```
  try {
    ...
    await method(...);
  } catch(e) {
    if (isHttpError(e)) {
      // ... An http error happened. handle it here
    }
    // Some other issue occured, deal with it in other way
  }
```

## Requirements

Http-client depends on the [Fetch API]. If you support older browsers which may
not yet provide these natively (e.g. IE), consider including a global polyfill
in your bundled application, such as [fetch].


<!-- LINKS -->

[Fetch API]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[fetch]: https://github.com/github/fetch
