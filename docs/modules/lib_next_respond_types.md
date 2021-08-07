[ghostmeme.api.hscc.bdpa.org](../README.md) / lib/next-respond/types

# Module: lib/next-respond/types

## Table of contents

### References

- [HttpStatusCode](lib_next_respond_types.md#httpstatuscode)

### Type aliases

- [ErrorJsonResponse](lib_next_respond_types.md#errorjsonresponse)
- [SuccessJsonResponse](lib_next_respond_types.md#successjsonresponse)

## References

### HttpStatusCode

Re-exports: [HttpStatusCode](lib_next_isomorphic_redirect_types.md#httpstatuscode)

## Type aliases

### ErrorJsonResponse

Ƭ **ErrorJsonResponse**: `Record`<`string`, `unknown`\> & { `error`: `string` ; `success`: ``false``  }

#### Defined in

[lib/next-respond/types.ts:2](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/lib/next-respond/types.ts#L2)

___

### SuccessJsonResponse

Ƭ **SuccessJsonResponse**: `Record`<`string`, `unknown`\> & { `success`: ``true``  }

#### Defined in

[lib/next-respond/types.ts:1](https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/b50e614/lib/next-respond/types.ts#L1)
