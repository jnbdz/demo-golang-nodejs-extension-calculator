# demo-golang-nodejs-extension-calculator
[![Support us on Patreon][badge_patreon]][patreon] [![Build Status][badge_travis]][travis]

Demo: Golang Node.js Extension: Calculator

## :cloud: Installation
Make sure to have the `npm` package `node-gyp` installed.

```sh
$ npm i --save demo-golang-nodejs-extension-calculator
```

You might need to run:

```sh
npm install
```

It will execute:

```sh
go build -buildmode c-archive -o src/calculator.a src/calculator.go && node-gyp rebuild
```

If you run into some errors you might need to install other packages on your system like: `gcc` and `build-essential`.

## :clipboard: Example

```js
const calculator = require("demo-golang-nodejs-extension-calculator");

console.log('4+5=', calculator.add(4, 5));
```

## :recycle: Testing
To run the unit test, you need to make sure you have [Jest][jest_link] installed.

You can install it with [npm][npm_link]:

```sh
npm install --save-dev jest
```

Or you can install it with [yarn][yarn_link]:

```sh
yarn add --dev jest
```

Or globally with [npm][npm_link]:

```sh
sudo npm install -g jest --unsafe-perm=true --allow-root
```

### Running the tests

```sh
npm test
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

The last part is to create the methods for Node.js:

```c
void init(Local<Object> exports) {
NODE_SET_METHOD(exports, "add", add);
}

NODE_MODULE(calculator, init)
```

You use `NODE_SET_METHOD` to set the methods you want to use inside of Node.js:

```c
NODE_SET_METHOD(exports, "add", add);
```

You also need this file at the root of your project: `binding.gyp`. It is self explanatory.

```json
{
  "targets": [
    {
      "target_name": "node-calculator",
      "sources": [
        "src/node-calculator.cc"
      ],
      "libraries": [
        "../src/calculator.a"
      ],
    },
  ],
}
```

The file `calculator.a` is also automatically generated. It should not be commited.

When you run `npm install` it runs:

```sh
go build -buildmode c-archive -o src/calculator.a src/calculator.go && node-gyp rebuild
```

The first command generates `calculator.a` and `calculator.h`. With the other command `node-gyp rebuild` it generates `build/` directory.

Make sure you have `node-gyp` installed. You can install it with `npm`.

## :scroll: License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).

[badge_patreon]: https://propolisframework.github.io/assets/img/patreon.svg
[badge_travis]: https://travis-ci.org/jnbdz/demo-golang-nodejs-extension-calculator.svg?branch=master

[patreon]: https://www.patreon.com/jnbdz
[travis]: https://travis-ci.org/jnbdz/demo-golang-nodejs-extension-calculator

[jest_link]: https://facebook.github.io/jest/
[npm_link]: https://npmjs.com/
[yarn_link]: https://yarnpkg.com/