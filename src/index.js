import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import dog_1 from "./assets/dog_1.jpg";
import dog_2 from "./assets/dog_2.jpg";
import cat_1_1 from "./assets/cat_1_1.jpg";
import cat_2_1 from "./assets/cat_2_1.jpg";
import sound_1 from "./assets/sound_1.wav";

const popupSound = new Audio(sound_1);


render(<Game />, document.getElementById("root"))


function Game() {
	const [popups, setPopups] = useState({});

	// useInterval(() => {
	// 	setPopups({...popups, [uuidv4()]: getPhoto() });
	// 	popupSound.play();
	// }, 3000);

	return (
		<>
			<div className="taskbar">BananaOS</div>
			<Terminal commandEntered={(cmd) => {
				// const index = popups.findIndex((word) => word === cmd);

				// if (index > -1) {
				// 	popups.splice(index, 1);
				// 	setPopups(popups);
				// }
			}}/>
			{Object.entries(popups).map(([id, image ]) => {
				return (
					<Window key={id} onClose={() => {
						const { [id]: removed, ...rest } = popups;
						setPopups(rest);
					}}>
						<img src={image} height="200"/>
					</Window>
				);
			})}
		</>
	);
}

document.querySelector("textarea").addEventListener('keydown', function(e) {
    if (e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var target = e.target;
        var value = target.value;

        // set textarea value to: text before caret + tab + text after caret
        target.value = value.substring(0, start)
                    + "  "
                    + value.substring(end);

        // put caret at right position again (add one for the tab)
        this.selectionStart = this.selectionEnd = start + 2;

        // prevent the focus lose
        e.preventDefault();
    }
}, false);

function createPopup() {
  const words = [
	"word",
	"hack",
	"computer",
	"system",
  ];

  const index = randomInt(0, words.length);

  return words[index]
}

function randomInt(min, max) {
	min = Math.floor(min);
	max = Math.floor(max);
  	return Math.floor(Math.random() * (max - min)) + min;
}

function Terminal({ commandEntered }) {
	const [currentInput, setCurrentInput] = useState("");
	const [previousInputs, setPreviousInputs] = useState([]);
    const foo = `// Your First C++ Program
                #include <iostream>
                using namespace std;
                <br>
                int main() {
                  cout << "Hello World!";
                  return 0;
                }`;

	return (
		<Window left={40} top={40} onClose={() => {}}>
			<div className="editor-window">
	            <div className="editor-folders">
                    <div className="editor-title">FOLDERS</div>
                    <ul>
                        <li>.github</li>
                        <li>dist</li>
                        <li>src</li>
                        <li className="highlighted">work.cpp</li>
                        <li>README.md</li>
                    </ul>
                </div>
                <div className="editor-gutter">
                    <ul>
                        {Array.apply(0, Array(35)).map(function (x, i) {
                          return <li key={i}>{i}</li>;
                        })}
                    </ul>
                </div>
    			<div className="editor-tab">
                    <div className="shadow-text">
                        {foo.split("\n").map((i,key) => {
                            if (i.trim() === "<br>") {
                                return <br key={key}></br>;
                            }
                            return <div key={key}>{i.trim()}</div>;
                        })}
                    </div>
                    <textarea
                        spellCheck="false"
                        className="editor"
                        autoFocus
                        onChange={({ target: { value } }) => setCurrentInput(value)}
                        value={currentInput}
                    />
                </div>
			</div>
		</Window>
	)
}

function Window({ left, top, children, onClose }) {
	const [position, setPosition] = useState({
		left: left != null ? left : randomInt(10, window.innerWidth - 210),
		top: top != null ? top : randomInt(42, window.innerHeight - 210)
	});
	const [isDragging, setDragging] = useState(false);

	return (
		<div
			style={{ left: position.left, top: position.top }}
			className="faux-window"
		>
			<div
				className="window-header"
				onMouseDown={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setDragging(true);
				}}
				onMouseUp={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setDragging(false);
				}}
				onMouseOut={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setDragging(false);
				}}
				onMouseMove={(e) => {
					if (isDragging) {
						// debugger;
						setPosition({
							left: position.left + e.movementX,
							top: position.top + e.movementY,
						});
					}
				}}
			>
                <button className="close" onClick={onClose}></button>
				<button className="maximize"></button>
                <button className="minimize"></button>
			</div>

			{children}
		</div>
	);
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function getPhoto() {
	const photos = [dog_1, dog_2, cat_1_1, cat_2_1];
	const index = randomInt(0, photos.length);

  	return photos[index]
}
