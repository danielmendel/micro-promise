# micro-promise
A small A+ compliant toy Promises implementation, do not use.

I wrote this to try and thoroughly understand the [Promises/A+ specification](https://promisesaplus.com/). Comments in the code refer to each specific clause in the specification, for example: 2.3.3.1 [[code]](https://github.com/danielmendel/micro-promise/blob/master/main.js#L31-L32) and [[spec]](https://promisesaplus.com/#point-54)

The specification is delightfully brief, precise, and includes an extremely comprehensive test suite — this is the yardstick against which I make the claim of compliance. Many many thanks and kudos to the contributors there.

If you're looking for a Promises library to *use* — then I reccomend the [ES6-promise](https://github.com/stefanpenner/es6-promise) polyfill, and also recommend dropping it once ES6 compatibility in browsers is satisfactory for your use case.

to be entirely clear:

# :rotating_light: UNSUPPORTED SOFTWARE :rotating_light: 
Released for educational purposes, other use not endorsed or supported. 

If you are learning about how promises work and have questions about this toy implementation, open an issue and I'll be happy to answer them.
