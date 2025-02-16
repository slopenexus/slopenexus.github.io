if (document.querySelector("canvas")) {
    startupConverter(document.querySelector("canvas"))
} else {
    let original = document.createElement
    document.createElement = function (name, options) {
        let result = original.call(document, name, options)
        if (name === "canvas") {
            startupConverter(result)
            document.createElement = original
        }
        return result
    }
}

function startupConverter(canvas) {
    let canvasLeftPos = 0
    
    setInterval(() => {
        canvasLeftPos = canvas.getBoundingClientRect().left
    
        //hide mobile warning button
        document.querySelector("button")?.click()
    }, 100)
    
    let mainTouchId = null
    
    canvas.addEventListener("touchstart", event => {
        event.preventDefault()
        if (mainTouchId !== null) return
        for (touch of event.touches) {
            mainTouchId = touch.identifier
            let x = touch.clientX - canvasLeftPos
            startTouch(x, touch.clientX, touch.clientY, touch.screenX, touch.screenY)
            return
        }
    })
    canvas.addEventListener("touchmove", event => {
        event.preventDefault()
        if (mainTouchId === null) return
        for (touch of event.touches) {
            if (touch.identifier === mainTouchId) {
                let x = touch.clientX - canvasLeftPos
                moveTouch(x, touch.clientX, touch.clientY, touch.screenX, touch.screenY)
                return
            }
        }
    })
    function touchEndHandler(event) {
        event.preventDefault()
        if (mainTouchId === null) return
        let otherTouch = null
        for (touch of event.touches) {
            if (touch.identifier === mainTouchId) return
            otherTouch = touch
        }
        if (otherTouch) {
            mainTouchId = otherTouch.identifier
            let x = otherTouch.clientX - canvasLeftPos
            moveTouch(x, otherTouch.clientX, otherTouch.clientY, otherTouch.screenX, otherTouch.screenY)
            return
        }
        mainTouchId = null
        endTouch()
    }
    canvas.addEventListener("touchend", touchEndHandler)
    canvas.addEventListener("touchcancel", touchEndHandler)
    
    let originalAddEventListener = canvas.addEventListener
    
    canvas.addEventListener = function(name, func) {
        if (name.startsWith("touch")) return
        originalAddEventListener.call(canvas, name, func)
    }
    
    
    
    
    
    let isPressingLeft = false
    let isPressingRight = false
    let oldClientX = 0
    let oldClientY = 0
    let oldScreenX = 0
    let oldScreenY = 0
    
    function startTouch(x, clientX, clientY, screenX, screenY) {
        canvas.dispatchEvent(new MouseEvent("mousemove", {
            clientX,
            clientY,
            screenX,
            screenY,
            button: 0,
            buttons: 1,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            movementX: clientX - oldClientX,
            movementY: clientY - oldClientY,
            bubbles: true
        }))
        oldClientX = clientX
        oldClientY = clientY
        oldScreenX = screenX
        oldScreenY = screenY
        canvas.dispatchEvent(new MouseEvent("mousedown", {
            clientX,
            clientY,
            screenX,
            screenY,
            button: 0,
            buttons: 1,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            movementX: 0,
            movementY: 0,
            bubbles: true
        }))
    
        let isRightHalf = x > canvas.clientWidth / 2
        updateKeyPresses(!isRightHalf, isRightHalf)
    }
    
    function moveTouch(x, clientX, clientY, screenX, screenY) {
        canvas.dispatchEvent(new MouseEvent("mousemove", {
            clientX,
            clientY,
            screenX,
            screenY,
            button: 0,
            buttons: 1,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            movementX: clientX - oldClientX,
            movementY: clientY - oldClientY,
            bubbles: true
        }))
        oldClientX = clientX
        oldClientY = clientY
        oldScreenX = screenX
        oldScreenY = screenY
    
        let isRightHalf = x > canvas.clientWidth / 2
        updateKeyPresses(!isRightHalf, isRightHalf)
    }
    
    function endTouch() {
        canvas.dispatchEvent(new MouseEvent("mouseup", {
            clientX: oldClientX,
            clientY: oldClientY,
            screenX: oldScreenX,
            screenY: oldScreenY,
            button: 0,
            buttons: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            movementX: 0,
            movementY: 0,
            bubbles: true
        }))
    
        updateKeyPresses(false, false)
    }
    
    function updateKeyPresses(left, right) {
        if (isPressingLeft && !left) {
            canvas.dispatchEvent(new KeyboardEvent("keyup", {
                location: 0,
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                repeat: false,
                charCode: 0,
                keyCode: 37,
                which: 37,
                bubbles: true
            }))
        }
        if (isPressingRight && !right) {
            canvas.dispatchEvent(new KeyboardEvent("keyup", {
                location: 0,
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                repeat: false,
                charCode: 0,
                keyCode: 39,
                which: 39,
                bubbles: true
            }))
        }
        if (!isPressingLeft && left) {
            canvas.dispatchEvent(new KeyboardEvent("keydown", {
                location: 0,
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                repeat: false,
                charCode: 0,
                keyCode: 37,
                which: 37,
                bubbles: true
            }))
        }
        if (!isPressingRight && right) {
            canvas.dispatchEvent(new KeyboardEvent("keydown", {
                location: 0,
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                repeat: false,
                charCode: 0,
                keyCode: 39,
                which: 39,
                bubbles: true
            }))
        }
        isPressingLeft = left
        isPressingRight = right
    }
}