import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import dog_1 from "./assets/dog_1.jpg";
import dog_2 from "./assets/dog_2.jpg";
import dog_3 from "./assets/dog_3.jpg";
import cat_1 from "./assets/cat_1.jpg";
import cat_2 from "./assets/cat_2.jpg";
import cat_3 from "./assets/cat_3.jpg";
import cat_4 from "./assets/cat_4.jpg";
import cat_5 from "./assets/cat_5.jpg";
import sound_1 from "./assets/sound_1.wav";

const popupSound = new Audio(sound_1);


render(<Game />, document.getElementById("root"))

const maxPopups = 20;

function Game() {
	const [popups, setPopups] = useState({});
	const [gameState, setGameState] = useState("MAIN_MENU");
	const [distractionSpeed, setDistractionSpeed] = useState(3000);

	useInterval(() => {
		if (gameState === "PLAYING") {
			setPopups({...popups, [uuidv4()]: getPhoto() });
			popupSound.play();
		}
	}, distractionSpeed);

	return (
		<>
			<div className="taskbar">
				<span className="title">MangoOS</span>
				<span>File</span>
				<span>Edit</span>
				<span>View</span>
				<span>Help</span>
				<span className="taskbar-spacer" />
				<button className="taskbar-button" onClick={() => {
					if (gameState === "MAIN_MENU") {
						setGameState("SETTINGS_MAIN");
					} else {
						setGameState("SETTINGS_PLAYING");
					}
				}}>
					<i className="fa fa-cog" aria-hidden="true"></i>
				</button>
			</div>
			{(function() {
				switch(gameState) {
					case "MAIN_MENU":
						return (
							<Window left={200} top={200}>
								<div className="main-menu">
									<button onClick={() => setGameState("PLAYING")}>
										Start Game
									</button>
									<button  onClick={() => setGameState("SETTINGS_MAIN")}>
										Settings
									</button>
								</div>
							</Window>
						);
					case "PLAYING":
						return (
							<>
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
					case "SETTINGS_MAIN":
					case "SETTINGS_PLAYING":
						return (
							<Window
								key="settings"
								onClose={() => {
									if (gameState === "SETTINGS_MAIN") {
										setGameState("MAIN_MENU");
									} else {
										setGameState("PLAYING");
									}
								}}
							>
								<label className="setting">
									Distraction Interval:
									<input type="range" value={distractionSpeed / 100} min={5} max={50} onChange={({ target: { value } }) => setDistractionSpeed(value * 100)} />
								</label>
							</Window>
						);
				}
			})()}
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
    const [comboCount, setComboCount] = useState(0);
    const [saveState, setSaveState] = useState("");
    const program = `// Your First C++ Program
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
                        <li className="highlighted">work.cp</li>
                        <li>README.md</li>
                    </ul>
                </div>
                <div className="editor-gutter">
                    <ul>
                        {Array.apply(0, Array(35)).map(function (x, i) {
                          return <li key={i}>{i+1}</li>;
                        })}
                    </ul>
                </div>
    			<div className="editor-tab">
                    <div className="shadow-text">
                        {program.split("\n").map((i,key) => {
                            if (i.trim() === "<br>") {
                                return <br key={key}></br>;
                            }
                            return <pre key={key}>{i}</pre>;
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
            <div className="save-container">
                <button className="save-button" onClick={() => {
                    if (program.replace('<br>','') === currentInput.trim()) {
                        // success
                        setSaveState('success');
                        console.log('success');
                    } else {
                        // failed
                        setSaveState('failed');
                        console.log('failed');
                    }
                }}>Save</button>
                <div>{saveState}</div>
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
	const [offset, setOffset] = useState({ x: 0, y: 0 });

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
					setOffset({ x: e.pageX - position.left, y: e.pageY - position.top });
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
						setPosition({
							left: e.pageX - offset.x,
							top: e.pageY - offset.y,
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
	const photos = [dog_1, dog_2, dog_3, cat_1, cat_2, cat_3, cat_4, cat_5];
	const index = randomInt(0, photos.length);

  	return photos[index]
}



// <div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
