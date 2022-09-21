* name in ``CodeElementMetadata`` entry may be incoherent on file exporting a single default class or interface whose
  name different that filename.
  **Example:**

```ts
// filename: foo.ts
export default interface SomeInterface {};
```

will produce:

```json
{
  "kind": "interface",
  "namespace": "",
  "name": "foo",
  "implements": [],
  "methods": {},
  "imports": [],
  "export": {
    "path": "foo.ts",
    "type": "export:default"
  }
}
```

todo:
* test interface inheritance
