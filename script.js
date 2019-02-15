class Context {
    constructor() {
        this.list = {}
    }

    write(key, value) {
        if (!key || typeof key !== 'string') throw new Error('Invalid key')
        if (!this.list.hasOwnProperty(key))
            this.list[key] = []
        this.list[key].push(value)
    }
}

let inputText = `word
word
aashish
new
new
word
this`
let mapperText = 'function mapper(input, context)\n{\n\t\n\treturn context\n}'
mapperText = `function mapper(input, context)
{
	context.write(input, 1)
	return context
}`
let reducerText = `function reducer(key, list, context)
{
    context.write(key, list.length)
    return context
}`

let inputEditor = ace.edit('input-editor')
inputEditor.setTheme('ace/theme/dracula')
inputEditor.session.setMode('ace/mode/plain_text')
inputEditor.setValue(inputText)
inputEditor.selection.moveTo(0, 0)

let mapperEditor = ace.edit('mapper-editor')
mapperEditor.setTheme('ace/theme/dracula')
mapperEditor.session.setMode('ace/mode/javascript')
mapperEditor.setValue(mapperText)
mapperEditor.selection.moveTo(2, 1)

let reducerEditor = ace.edit('reducer-editor')
reducerEditor.setTheme('ace/theme/dracula')
reducerEditor.session.setMode('ace/mode/javascript')
reducerEditor.setValue(reducerText)
reducerEditor.selection.moveTo(2, 1)

let outputEditor = ace.edit('output-editor')
outputEditor.setTheme('ace/theme/dracula')
outputEditor.session.setMode('ace/mode/json')
outputEditor.setReadOnly(true)

let btnRun = document.getElementById('run')
run.addEventListener('click', event => {
    let funcMap = mapperEditor.getValue()
    let funcRed = reducerEditor.getValue()
    let input = inputEditor.getValue().split('\n')

    let mapper = new Function(`return(${funcMap})`)()
    let mapperContext = mapperExecute(mapper, input)
    console.log(mapperContext)

    outputEditor.setValue(JSON.stringify(mapperContext.list, null, '\t'))
    outputEditor.selection.moveTo(0, 0)

    let reducer = new Function(`return(${funcRed})`)()
    let reducerContext = reducerExecute(reducer, mapperContext.list)
    console.log(reducerContext)
    
    outputEditor.setValue(JSON.stringify(reducerContext.list, null, '\t'))
    outputEditor.selection.moveTo(0, 0)
})

function mapperExecute(mapper, input) {
    let context = new Context()
    for (let line of input) {
        mapper(line, context)
    }
    return context
}

function reducerExecute(reducer, map) {
    let context = new Context()
    for (let key in map) {
        reducer(key, map[key], context)
    }
    return context
}

// Word Count Mapper
function mapper(input, context) {
    context.write(input, 1)
    return context
}

// Word Count Reducer
function reducer(key, list, context) {
    context.write(key, list.length)
    return context
}