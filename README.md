# demo-golang-nodejs-extension-calculator
[![Support us on Patreon][badge_patreon]][patreon] [![Build Status][badge_travis]][travis]

Demo: Golang Node.js Extension: Calculator

## :cloud: Installation

```sh
$ npm i --save demo-golang-nodejs-extension-calculator
```

## :clipboard: Example

```js
const calculator = require("demo-golang-nodejs-extension-calculator");

console.log('4+5=', calculator.add(4, 5));
```

## :memo: Documentation
Based on this tutorial: https://www.krishnaraman.net/blog/node-addons-written-in-go

When creating an Node.js extension with Golang you first need to create your `go` script file.
Make sure to import `C` package:

```go
import "C"
```

Then add the function or functions you want to implement in your extension.

For this demo:

```go
func Sum(x, y float64) float64 {
	return x + y
}
```

You can keep `main()` function empty:

```go
func main() {}
```

Then you need to add your `.cc` C/C++ file.

For this demo the name of the file is `node-calculator.cc`.

First you need to include these two libraries:

```c
#include "calculator.h"
#include <node.h>
```

The `calculator.h` will be generated later.

The `<node.h>` is for this code to talk to Node.js.

Then you add the rest of the code:

```c
namespace calc {

  using v8::FunctionCallbackInfo;
  using v8::Isolate;
  using v8::Local;
  using v8::Object;
  using v8::String;
  using v8::Value;
  using v8::Number;
  using v8::Exception;

  void add(const FunctionCallbackInfo<Value>& args) {
    Isolate* isolate = args.GetIsolate();

    // Check the number of arguments passed.
    if (args.Length() < 2) {
      // Throw an Error that is passed back to JavaScript
      isolate->ThrowException(Exception::TypeError(
          String::NewFromUtf8(isolate, "Wrong number of arguments")));
      return;
    }

    // Check the argument types
    if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
      isolate->ThrowException(Exception::TypeError(
          String::NewFromUtf8(isolate, "Wrong arguments")));
      return;
    }

    // Perform the operation
    double total = Sum(args[0]->NumberValue(), args[1]->NumberValue());
    Local<Number> num = Number::New(isolate, total);

    // Set the return value (using the passed in
    // FunctionCallbackInfo<Value>&)
    args.GetReturnValue().Set(num);
  }

  void init(Local<Object> exports) {
    NODE_SET_METHOD(exports, "add", add);
  }

  NODE_MODULE(calculator, init)
}
```

You need to add the C++ methods. That you want to have access to in Node.js.

For this demo we are using:

```c
void add(const FunctionCallbackInfo<Value>& args)
```

It is a good idea to validate the function arguments before passing them to golang scripts.

```c
    // Check the number of arguments passed.
    if (args.Length() < 2) {
      // Throw an Error that is passed back to JavaScript
      isolate->ThrowException(Exception::TypeError(
          String::NewFromUtf8(isolate, "Wrong number of arguments")));
      return;
    }

    // Check the argument types
    if (!args[0]->IsNumber() || !args[1]->IsNumber()) {
      isolate->ThrowException(Exception::TypeError(
          String::NewFromUtf8(isolate, "Wrong arguments")));
      return;
    }
```

Then you use you golang method:

```c
double total = Sum(args[0]->NumberValue(), args[1]->NumberValue());
```

The rest is for Node.js:

```c
  void init(Local<Object> exports) {
    NODE_SET_METHOD(exports, "add", add);
  }

  NODE_MODULE(calculator, init)
```

## :scroll: License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

[badge_patreon]: https://propolisframework.github.io/assets/img/patreon.svg
[badge_travis]: https://travis-ci.org/jnbdz/demo-golang-nodejs-extension-calculator.svg?branch=master

[patreon]: https://www.patreon.com/jnbdz
[travis]: https://travis-ci.org/jnbdz/demo-golang-nodejs-extension-calculator