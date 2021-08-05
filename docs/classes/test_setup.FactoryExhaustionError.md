[ghostmeme.api.hscc.bdpa.org](../README.md) / [test/setup](../modules/test_setup.md) / FactoryExhaustionError

# Class: FactoryExhaustionError

[test/setup](../modules/test_setup.md).FactoryExhaustionError

## Hierarchy

- [`TestError`](src_backend_error.TestError.md)

  ↳ **`FactoryExhaustionError`**

## Table of contents

### Constructors

- [constructor](test_setup.FactoryExhaustionError.md#constructor)

### Properties

- [message](test_setup.FactoryExhaustionError.md#message)
- [name](test_setup.FactoryExhaustionError.md#name)
- [stack](test_setup.FactoryExhaustionError.md#stack)
- [prepareStackTrace](test_setup.FactoryExhaustionError.md#preparestacktrace)
- [stackTraceLimit](test_setup.FactoryExhaustionError.md#stacktracelimit)

### Methods

- [captureStackTrace](test_setup.FactoryExhaustionError.md#capturestacktrace)

## Constructors

### constructor

• **new FactoryExhaustionError**(`message?`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `string` |

#### Inherited from

[TestError](src_backend_error.TestError.md).[constructor](src_backend_error.TestError.md#constructor)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:979

## Properties

### message

• **message**: `string`

#### Inherited from

[TestError](src_backend_error.TestError.md).[message](src_backend_error.TestError.md#message)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:974

___

### name

• **name**: `string`

#### Inherited from

[TestError](src_backend_error.TestError.md).[name](src_backend_error.TestError.md#name)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:973

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

[TestError](src_backend_error.TestError.md).[stack](src_backend_error.TestError.md#stack)

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:975

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

Optional override for formatting stack traces

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

[TestError](src_backend_error.TestError.md).[prepareStackTrace](src_backend_error.TestError.md#preparestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

[TestError](src_backend_error.TestError.md).[stackTraceLimit](src_backend_error.TestError.md#stacktracelimit)

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

[TestError](src_backend_error.TestError.md).[captureStackTrace](src_backend_error.TestError.md#capturestacktrace)

#### Defined in

node_modules/@types/node/globals.d.ts:4
