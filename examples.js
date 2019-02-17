const infoText = `The context parameter is used to store the outputs of all operations. <br>
<code>context.write(key, value)</code> is a function that can be used in both the mapper and the reducer.`
// Word Count
const wordInput =
`one
two
three
two
three
three`
const wordMapper =
`function mapper(line, context)
{
    // The input parameter line will contain
    // each individual word
	context.write(line, 1) // key = word, value = 1
	return context
}`
const wordReducer =
`function reducer(key, list, context)
{
    // In the reducer function we will just count
    // how many times the word has occurred
    context.write(key, list.length)
    return context
}`

// Count
const countInput =
`a 10
b 10
c 50
d 100
a 10
a 60
b 50
c 50`
const countMapper =
`function mapper(line, context)
{
    // Split line into letter and value
    let letter = line.split(' ')[0]
    let value = parseInt(line.split(' ')[1]) // Convert string to int
	context.write(letter, value) // key = letter, value
	return context
}`
const countReducer =
`function reducer(key, list, context)
{
    // Get the sum of all values in a list
    let sum = 0
    for (let i = 0; i < list.length; i++) {
        sum += list[i]
    }
    context.write(key, sum)
    return context
}`

// Blank
const blankMapper =
`function mapper(line, context)
{
    // Insert your code
	// context.write(key, value)
	return context
}`
const blankReducer =
`function reducer(key, list, context)
{
    // Insert your code
    // context.write(key, value)
    return context
}`