# http-client

Provides convenient apis to make http requests and handle the responses, 
eliminates boilerplate code. It is basically a wrapper over XHR requests 
(uses fetch).

## APIs
The main API of the library is `createMethod`. This creates a ready to use 
function with some settings already embedded into it. 

```
createMethod(method, baseUrl, defaultOptions)
```

Params:

| Parameter      | Description                                                                                                             | Type   | Required |
|----------------|-------------------------------------------------------------------------------------------------------------------------|--------|----------|
| method         | HTTP method: `GET`, `POST`, `PUT`, etc.                                                                                 | String | Yes      |
| baseUrl        | Base url of the request path (will be prefixed the final url). When not specified <br/> relative path will be used `/`  | String | No       |
| defaultOptions | Request options that will be used by default. See details below                                                         | Object | No       |

Options:

| Parameter       | Description                                                                                    | Type    | Required |
|-----------------|------------------------------------------------------------------------------------------------|---------|----------|
| headers         | Extra headers you would like to pass                                                           | Object  | No       |
| withCredentials | Flag whether to include cookies in the request (defaults to `false`)                           | Boolean | No       |
| mode            | Request mode                                                                                   | String  | No       |
| params          | Search params object. Will be trasnformed to query string and <br/>appended to the request url | Object  | No       |

`createMethod` returns a function with the following signature:
```
method(endpointUrl, body, options)
```

Parameters:

| Parameter   | Description                                                                                             | Type   | Required |
|-------------|---------------------------------------------------------------------------------------------------------|--------|----------|
| endpointUrl | The request endpoint. Will be appended to the baseUrl                                                   | String | Yes      |
| body        | Request body                                                                                            | Object | No       |
| options     | Request options. See details above. This will be merged with defaultOptions specified at `createMethod` | Object | No       |


### Example
```  
  import { createMethod } from '@35up/http-client';
  
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

In case response fails, method throws an exception of type `HttpError`

`HttpError` inherits from `Error` class and has the following extra properties:

| Property           | Description                                     | Type   |
|--------------------|-------------------------------------------------|--------|
| responseStatus     | Status code (404, 500, etc.)                    | Number |
| responseStatusText | Status text (i.e. internal server error)        | String |
| data               | Reponse data. This may contain arbitrary object | Object |


### Checking if thrown exception is of type HttpError

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

### Shortcuts 

The library also exposes ready to use methods that do not have a base url so 
you could bypass calling `createMethod` in case your api base url is the same 
as your website (using relative path):
```
  import { get } from '@35up/http-client';
  
  const result = await get('/api/v1/orders');
```

The available functions are: 
`get`, `post`, `put`, `patch`, `deleteMethod`, `head`;

## Requirements

The library supports both browser and node environments.

Http-client depends on the [Fetch API]. If you support older browsers which may
not yet provide these natively (e.g. IE), consider including a global polyfill
in your bundled application, such as [fetch].


<!-- LINKS -->

[Fetch API]: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
[fetch]: https://github.com/github/fetch
