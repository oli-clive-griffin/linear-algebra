
type VectorSpace<V, S> = {
	zero: V,
	add: (a: V, B: V) => V,
	scalarMul: (v: V, s: S) => V,
	randomV: () => V,
	randomS: () => S,
	verifyVector: (v: V) => boolean,
}

const rn = (n: number): VectorSpace<Array<number>, number> => ({
	zero: Array(n).fill(0),
	add: (a, b) => a.map((aItem, i) => aItem + b[i]),
	scalarMul: (v, s) => v.map(item => item * s),
	randomV: () => Array(n).fill(0).map(() => Math.random()),
	randomS: () => Math.random(),
	verifyVector: (v) => v.length === n && v.every(item => typeof item === 'number'),
})

type PositiveNumber = number

const positiveNumbersSpace: VectorSpace<PositiveNumber, number> = {
	zero: 1 as PositiveNumber,
	add: (a, b) => (a * b) as PositiveNumber,
	scalarMul: (v, s) => (v ** s) as PositiveNumber,
	randomV: () => (Math.random() * 100) as PositiveNumber,
	randomS: () => Math.random() * 100 + 0.01,
	verifyVector: v => v > 0 && typeof v === 'number',
}

const positiveNumbersSpaceBroken: VectorSpace<PositiveNumber, number> = {
	zero: 1 as PositiveNumber,
	add: (a, b) => (a + b) as PositiveNumber,
	scalarMul: (v, s) => (v * s) as PositiveNumber,
	randomV: () => (Math.random() * 100) as PositiveNumber,
	randomS: () => Math.random() * 100 + 0.01,
	verifyVector: v => v > 0 && typeof v === 'number',
}


const testClosedOverAdd = (space: VectorSpace<any, any>) => {
	for (let i = 0; i < 100; i++) {
		const { add, randomV, verifyVector } = space
		const a = randomV()
		const b = randomV()
		const x = add(a, b)
		if (!verifyVector(x)) {
			console.log(x)
			return false
		}
	}
	return true
}

const testAssociativeAdd = (space: VectorSpace<any, any>) => {
	for (let i = 0; i < 100; i++) {
		const { add, randomV } = space
		const a = randomV()
		const b = randomV()
		const c = randomV()
		const x = add(add(a, b), c)
		const y = add(a, add(b, c))
		if (x - y > 0.00003) {
			return false
		}
	}
	return true
}

const testClosedOverScalarMul = (space: VectorSpace<any, any>) => {
	for (let i = 0; i < 100; i++) {
		const { scalarMul, randomV, randomS, verifyVector } = space
		const v = randomV()
		const s = randomS()
		const x = scalarMul(v, s)
		if (!verifyVector(x)) {
			return false
		}
	}
	return true
}

const spaces = { r3: rn(3), rn4: rn(4), positiveNumbersSpace }

for (const [name, space] of Object.entries(spaces)) {
	if (!testClosedOverAdd(space)) {
		console.log(`${name} failed the test: ClosedOverAdd`);
	}

	if (!testAssociativeAdd(space)) {
		console.log(`${name} failed the test: AssociativeAdd`);
	}

	if (!testClosedOverScalarMul(space)) {
		console.log(`${name} failed the test: ClosedOverScalarMul`);
	}
}