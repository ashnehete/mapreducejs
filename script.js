class Context {
    constructor() {
        this.list = {}
    }

    write(key, value) {
        if (!key) throw new Error('Invalid key')
        if (!this.list.hasOwnProperty(key))
            this.list[key] = []
        this.list[key].push(value)
    }
}

let inputText = wordInput
let mapperText = wordMapper
let reducerText = wordReducer
info.innerHTML = infoText

let inputEditor = ace.edit('input-editor')
inputEditor.setTheme('ace/theme/github')
inputEditor.session.setMode('ace/mode/plain_text')
inputEditor.setValue(inputText)
inputEditor.selection.moveTo(0, 0)

let mapperEditor = ace.edit('mapper-editor')
mapperEditor.setTheme('ace/theme/github')
mapperEditor.session.setMode('ace/mode/javascript')
mapperEditor.setValue(mapperText)
mapperEditor.selection.moveTo(2, 1)

let reducerEditor = ace.edit('reducer-editor')
reducerEditor.setTheme('ace/theme/github')
reducerEditor.session.setMode('ace/mode/javascript')
reducerEditor.setValue(reducerText)
reducerEditor.selection.moveTo(2, 1)

let mapperOutput = ace.edit('mapper-output')
mapperOutput.setTheme('ace/theme/github')
mapperOutput.session.setMode('ace/mode/json')
mapperOutput.setReadOnly(true)

let reducerOutput = ace.edit('reducer-output')
reducerOutput.setTheme('ace/theme/github')
reducerOutput.session.setMode('ace/mode/json')
reducerOutput.setReadOnly(true)

run.addEventListener('click', event => {
    let funcMap = mapperEditor.getValue()
    let funcRed = reducerEditor.getValue()
    let input = inputEditor.getValue().split('\n')

    let mapper = new Function(`return(${funcMap})`)()
    let mapperContext = mapperExecute(mapper, input)
    console.log(mapperContext)

    mapperOutput.setValue(JSON.stringify(mapperContext.list, null, '\t'))
    mapperOutput.selection.moveTo(0, 0)

    let reducer = new Function(`return(${funcRed})`)()
    let reducerContext = reducerExecute(reducer, mapperContext.list)
    console.log(reducerContext)

    reducerOutput.setValue(JSON.stringify(reducerContext.list, null, '\t'))
    reducerOutput.selection.moveTo(0, 0)
})

example.onchange = event => {
    switch (event.target.value) {
        case 'word-count':
        inputText = wordInput
        mapperText = wordMapper
        reducerText = wordReducer
        break

        case 'count':
        inputText = countInput
        mapperText = countMapper
        reducerText = countReducer
        break

        case 'blank':
        inputText = ''
        mapperText = blankMapper
        reducerText = blankReducer
    }

    inputEditor.setValue(inputText)
    mapperEditor.setValue(mapperText)
    reducerEditor.setValue(reducerText)
}

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