[ghostmeme.api.hscc.bdpa.org][1] / lib/next-respond/types

# Module: lib/next-respond/types

## Table of contents

### References

- [HttpStatusCode][2]

### Type aliases

- [ErrorJsonResponse][3]
- [SuccessJsonResponse][4]

## References

### HttpStatusCode

Re-exports: [HttpStatusCode][5]

## Type aliases

### ErrorJsonResponse

Ƭ **ErrorJsonResponse**: `Record`<`string`, `unknown`> & { `error`: `string` ;
`success`: `false` }

#### Defined in

[lib/next-respond/types.ts:2][6]

---

### SuccessJsonResponse

Ƭ **SuccessJsonResponse**: `Record`<`string`, `unknown`> & { `success`: `true` }

#### Defined in

[lib/next-respond/types.ts:1][7]

[1]: ../README.md
[2]: lib_next_respond_types.md#httpstatuscode
[3]: lib_next_respond_types.md#errorjsonresponse
[4]: lib_next_respond_types.md#successjsonresponse
[5]: lib_next_isomorphic_redirect_types.md#httpstatuscode
[6]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/lib/next-respond/types.ts#L2
[7]:
  https://github.com/nhscc/ghostmeme.api.hscc.bdpa.org/blob/32c83e2/lib/next-respond/types.ts#L1
