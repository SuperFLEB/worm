# @superfleb/worm

A JavaScript/TypeScript utility module that makes properties of an object Write-once/Read-many, i.e., writing to the
property will work the first time, but fail on subsequent tries.

Usage:

```javascript
import worm from "@superfleb/worm"; // CJS module is also available

function assignId(user) {
	// Totally secure and collision-proof user ID generation. Just run with it.
	user.id = Math.floor(Math.random() * (36 ** 5)).toString(36);
}

// Make a user an WORM-lock the "id" field. Once the ID is written once, it will fail.
worm(["id"], {
	name: "John Q. Public",
	id: undefined,
});

// First time works fine.
assignId(user);

// But fails this time
assignId(user);
```
