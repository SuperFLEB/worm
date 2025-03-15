import worm from "../src/index.ts";

describe("WORM property creator", () => {
	it("sets default values and allows reading", () => {
		const obj = {a: 1};
		worm(["a"], obj);
		expect(obj.a).toBe(1);
	});

	it("only allows writing to the property once and only once", () => {
		const obj = {a: 1, b: 2, c: 3};
		worm(["a", "b"], obj);
		const bump = () => {
			obj.a = 1000;
		};
		// First time is fine
		expect(bump).not.toThrow();
		// Second time should throw
		expect(bump).toThrow();
	});

	it("does not affect unspecified properties", () => {
		const obj = {a: 1, b: 2};
		worm(["a"], obj);
		const bump = () => {
			obj.b += 1000;
		};
		expect(bump).not.toThrow();
		expect(bump).not.toThrow();
		expect(bump).not.toThrow();
		expect(obj.b).toBe(3002);
	});

	it("does not affect properties added later", () => {
		const obj: Record<string, number> = {a: 1, b: 2};
		worm(["a", "b"], obj);
		const bump = () => {
			obj.c = 1000;
		};
		expect(bump).not.toThrow();
		expect(bump).not.toThrow();
		expect(bump).not.toThrow();
		expect(obj.c).toBe(1000);
	});

	it("works on all properties when the keys object is omitted", () => {
		const bump = (k: "a" | "b" | "c") => () => {
			obj[k] = 1000;
		};
		const obj = {a: 1, b: 2, c: 3};
		worm(undefined, obj);
		expect(bump("a")).not.toThrow();
		expect(bump("a")).toThrow();
		expect(bump("b")).not.toThrow();
		expect(bump("b")).toThrow();
		expect(bump("c")).not.toThrow();
		expect(bump("c")).toThrow();
	});

	it("works on all properties when undefined is passed as a keys object", () => {
		const bump = (k: "a" | "b") => () => {
			obj[k] = 1000;
		};
		const obj = {a: 1, b: 2};
		worm(undefined, obj);
		expect(bump("a")).not.toThrow();
		expect(bump("a")).toThrow();
		expect(bump("b")).not.toThrow();
		expect(bump("b")).toThrow();
	});

	it("does not apply to any keys when an empty array is passed as a keys object", () => {
		const bump = (k: "a" | "b") => () => {
			obj[k] = 1000;
		};
		const obj = {a: 1, b: 2};
		worm([], obj);
		expect(bump("a")).not.toThrow();
		expect(bump("a")).not.toThrow();
		expect(bump("b")).not.toThrow();
		expect(bump("b")).not.toThrow();
	});

	it("retains the existing value, but makes it WORM", () => {
		const bump = (k: "a" | "b") => () => {
			obj[k] = 1000;
		};
		const obj = {a: 1, b: 2};
		worm(undefined, obj);
		expect(obj.a).toBe(1);
		expect(bump("a")).not.toThrow();
		expect(bump("a")).toThrow();
		expect(obj.a).toBe(1000);
	});

	it("Can be done multiple times to the same keys", () => {
		const bump = (k: "a" | "b") => () => {
			obj[k] = 1000;
		};
		const obj = {a: 1, b: 2};
		worm(["a"], obj);
		worm(["a"], obj);
		worm(["a"], obj);
		expect(obj.a).toBe(1);
		expect(bump("a")).not.toThrow();
		expect(bump("a")).toThrow();
		expect(bump("b")).not.toThrow();
		expect(bump("b")).not.toThrow();
		expect(bump("b")).not.toThrow();
		expect(obj.a).toBe(1000);
	});

	it("Can be done twice to different keys", () => {
		const bump = (k: "a" | "b" | "c") => () => {
			obj[k] = 1000;
		};
		const obj = {a: 1, b: 2, c: 3};
		worm(["a"], obj);
		worm(["b"], obj);
		expect(obj.a).toBe(1);
		expect(bump("a")).not.toThrow();
		expect(bump("a")).toThrow();
		expect(bump("b")).not.toThrow();
		expect(bump("b")).toThrow();
		expect(bump("c")).not.toThrow();
		expect(bump("c")).not.toThrow();
		expect(bump("c")).not.toThrow();
		expect(obj.a).toBe(1000);
		expect(obj.b).toBe(1000);
		expect(obj.c).toBe(1000);
	});

	it("Creates an undefined property when the property doesn't already exist", () => {
		const bump = (k: "a" | "b" | "c") => () => {
			obj[k] = 1000;
		};
		const obj: Record<string, number> = {a: 1, b: 2};
		worm(["c"], obj);

		expect(obj.a).toBe(1);
		expect(obj.b).toBe(2);
		expect("c" in obj).toBe(true);
		expect(obj.c).toBeUndefined();

		expect(bump("c")).not.toThrow();
		expect(bump("c")).toThrow();
		expect(obj.c).toBe(1000);
	});

	it("Creates an object with the specified keys when an undefined object is given", () => {
		const bump = (k: "a" | "b" | "c") => () => {
			obj[k] = 1000;
		};
		const obj: Record<string, number> = {a: 1, b: 2};
		worm(["c"], obj);

		expect(obj.a).toBe(1);
		expect(obj.b).toBe(2);
		expect("c" in obj).toBe(true);
		expect(obj.c).toBeUndefined();

		expect(bump("c")).not.toThrow();
		expect(bump("c")).toThrow();
		expect(obj.c).toBe(1000);
	});

	it("Warns when neither array nor object are given", () => {
		const warnSpy = jest.spyOn(console, "warn");
		const result = worm();
		expect(warnSpy).toBeCalled();
		expect(result).toEqual({});
		warnSpy.mockRestore();
	});

	it("Warns when no array and empty object are given", () => {
		const warnSpy = jest.spyOn(console, "warn");
		const result = worm(undefined, {});
		expect(warnSpy).toBeCalled();
		expect(result).toEqual({});
		warnSpy.mockRestore();
	});

	it("Warns when empty array and no object are given", () => {
		const warnSpy = jest.spyOn(console, "warn");
		const result = worm([]);
		expect(warnSpy).toBeCalled();
		expect(result).toEqual({});
		warnSpy.mockRestore();
	});
});
