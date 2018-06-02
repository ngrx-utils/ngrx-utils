### Bitwise operations

Using bitwise operations is blazing fast for the VM.
Here is how you can encode and use information:
First you have to determine the number of operations that you need to encode to know how many bits
you need, based on 2^n, where n is the number of bits, and 2^n the number of operations that you can
encode.

For example if I have 5 operations, I need 3 bits (2^2 = 4 operations, and 2^3 = 8 operations).
Then you can encode the operations in an enum. Each operation will have a different number, and you
need to shift each operation by 32 bits - n (for 5 operations and 3 bits, we will shift by 32-3=29).

The last thing that you need is the mask, which will be used to decode the operations.

```typescript
const enum OPERATIONS {
  WRITE = 1 << 29,
  READ = 2 << 29,
  CREATE = 3 << 29,
  REMOVE = 4 << 29,
  INSERT = 5 << 29,
  UNMASK = (1 << 29) - 1,
  MASK = ~((1 << 29) - 1)
}
```

Now you can use those flags to store both the operation and a value (that needs to fit in the x bits
left, in our case 29). For example if you want to store the index 7, and the operation read, you can
do: const x = 7 | OPERATIONS.READ;.

You can then test the operation with MASK and extract the value with UNMASK:

```typescript
if ((x & OPERATIONS.MASK) === OPERATIONS.READ) {
  const index = x & I18N.UNMASK;
}
```
