import React, { useState, useEffect, useRef } from "react";
import { render } from "react-dom";
import Draggable from 'react-draggable';
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

const maxPopups = 50;
const maxLevels = 5;

// GAME STATES:
// MAIN_MENU: start of the game
// NEW_LEVEL: you get notifications about how hard this level is, and how long you have, clicking accept starts the level
// WORK_STARTED: timer starts here
// WORK_COMPLETE: calculate monuse clicks, keystrokes, wpm, display point total
// GAME_OVER: you failed, you dounce
// SETTINGS_MAIN: settings menu but returns to main menu when closed
// SETTINGS_PLAYING: pause screen, returns to game when closed
// FINISHED: you won! high score page perhaps?!
function Game() {
	const [distractions, setDistractions] = useState({});
	const [gameState, setGameState] = useState("MAIN_MENU");
    const [gameLevel, setGameLevel] = useState(1);
	const [distractionSpeed, setDistractionSpeed] = useState(3000);
	const [score, setScore] = useState(0);

     useInterval(() => {
		if (gameState === "PLAYING") {
			const typeOfDistractions = ["POPUP"];
			const distractionType = typeOfDistractions[randomInt(0, typeOfDistractions.length)];
			switch(distractionType) {
				case "POPUP":
					setDistractions({
						...distractions,
						[uuidv4()]: {
							image: getPhoto(),
							type: distractionType,
						}
					});
					popupSound.play();
					break;
				case "NOTIFICATION":
					setDistractions({
						...distractions,
						[uuidv4()]: {
							message: getNotification(),
							type: distractionType,
						}
					});
					popupSound.play();
					break;
				case "UPDATE":
					setDistractions({
						...distractions,
						[uuidv4()]: {
							title: getUpdatingTitle(),
							type: distractionType,
						}
					});
					popupSound.play();
					break;
			}
		}
	}, distractionSpeed);

	return (
		<>
			<div className="taskbar">
				<span className="title">MangoOS</span>
				<span>
					File
					<div className="taskbar-menu">
						<span
							onClick={() => {
								setGameState("PLAYING");
								setScore(0);
								setDistractions({});
							}}
						>
							New Game
						</span>
						<span
							onClick={() => {
								setGameState("MAIN_MENU");
								setScore(0);
								setDistractions({});
							}}
						>
							Quit
						</span>
					</div>
				</span>
				<span>Edit</span>
				<span>View</span>
				<span>Help</span>
				<span>Score: {score}</span>
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
							<Window left={100} top={100}>
								<div className="main-menu">
									<button onClick={() => setGameState("PLAYING")}>
										Start Game
									</button>
									<button onClick={() => setGameState("SETTINGS_MAIN")}>
										Settings
									</button>
								</div>
							</Window>
						);
                    // case "NEW_LEVEL":
                    //     return(<>);
					case "PLAYING":
						return (
							<>
								<Terminal gameLevel={gameLevel} score={score} updateLevel={setGameLevel} updateState={setGameState} updateDistractions={setDistractions} updateScore={setScore} commandEntered={(cmd) => {
									// const index = popups.findIndex((word) => word === cmd);

									// if (index > -1) {
									// 	distractions.splice(index, 1);
									// 	setDistractions(distractions);
									// }
								}}/>
								{Object.entries(distractions).map(([id,  distraction]) => {
									switch (distraction.type) {
										case "POPUP":
											return (
												<Window key={id} onClose={() => {
													const { [id]: removed, ...rest } = distractions;
													setDistractions(rest);
													setScore(score + 10);
												}} fileName={`${id.substring(0, 3)}.png`}>
													<img src={distraction.image} width="300"/>
												</Window>
											);
										case "NOTIFICATION":
											return (
												<Notification key={id} onClose={() => {
													const { [id]: removed, ...rest } = distractions;
													setDistractions(rest);
												}}>
													{distraction.message}
												</Notification>
											);
										case "UPDATE":
											return (
												<Update
													key={id}
													onClose={() => {
														const { [id]: removed, ...rest } = distractions;
														setDistractions(rest);
													}}
												>
													{distraction.title}
												</Update>
											);
									}
								})}
							</>
						);
					case "SETTINGS_MAIN":
					case "SETTINGS_PLAYING":
						return (
							<Window
								key="settings"
                                left={100}
                                top={100}
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

//assuming "b" contains a subsequence containing
//all of the letters in "a" in the same order
function getDifference(a, b)
{
    var i = 0;
    var j = 0;
    var result = "";

    while (j < b.length)
    {
        if (a[i] != b[j] || i == a.length)
            result += b[j];
        else
            i++;
        j++;
    }
    return result;
}

function Terminal({ commandEntered, gameLevel, score, updateLevel, updateState, updateDistractions, updateScore }) {
	const [currentInput, setCurrentInput] = useState("");
	const [previousInputs, setPreviousInputs] = useState([]);
    const [comboCount, setComboCount] = useState(0);
    const [saveState, setSaveState] = useState("");
    const [program, setProgram] = useState(window.LEVELS[gameLevel]);

	return (
		<Window left={40} top={40} onClose={() => {}} fileName={'Project ' + gameLevel}>
            <div className="editor-window">
	            <div className="editor-folders">
                    <div className="editor-title">FOLDERS</div>
                    <ul>
                        <li>.github</li>
                        <li>dist</li>
                        <li>src</li>
                        <li className="highlighted">work.ccp</li>
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
                        onKeyDown={(e) => {
                            if (e.keyCode === 9) { // tab was pressed
                                // get caret position/selection
                                var target = e.target;
                                var start = target.selectionStart;
                                var end = target.selectionEnd;
                                var value = target.value;

                                // set textarea value to: text before caret + tab + text after caret
                                target.value = value.substring(0, start)
                                            + "  "
                                            + value.substring(end);

                                // put caret at right position again (add one for the tab)
                                target.selectionStart = target.selectionEnd = start + 2;

                                // prevent the focus lose
                                e.preventDefault();
                            }
                        }}
                        value={currentInput}
                    />
                </div>
			</div>
            <div className="save-container">
                <button className="save-button" onClick={() => {
                    // console.log(program.trim().replace('<br>',''));
                    // console.log(currentInput.trim());
                    if (program.trim().replace(/<br>/g,'') === currentInput.trim()) {
                        // success
                        // setSaveState('success');
                        updateLevel(++gameLevel);
                        setCurrentInput("");
                        updateDistractions({});

                        if (gameLevel > maxLevels) {
                            updateState("FINISHED");
                        } else {
                            setProgram(window.LEVELS[gameLevel]);
                            setSaveState('');
                        }
                        console.log(gameLevel);
                    } else {
                        // failed
                        // console.log(getDifference(program.trim().replace('<br>',''), currentInput.trim()))
                        setSaveState('failed');
                        console.log('failed');
                    }
                }}>Save</button>
                <div>{saveState}</div>
            </div>
		</Window>
	)
}

function Window({ left, top, children, onClose, fileName }) {
	const [position, setPosition] = useState({
		left: left != null ? left : randomInt(10, window.innerWidth - 210),
		top: top != null ? top : randomInt(20, window.innerHeight - 210)
	});
	const [isDragging, setDragging] = useState(false);
	// const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [maximized, setMaximized] = useState(false);
	const content = (
		<div
			style={{
				left: maximized ? 0 : position.left,
				top: maximized ? 32 : position.top,
				...(maximized ? { width: window.innerWidth, height: window.innerHeight - 32 } : {})
			}}
			className="faux-window"
		>
            <div className="window-header">
                <div className="window-control-header">
                    <div className="window-control-button-group">
                        <button className="close" onClick={onClose}></button>
                        <button className="maximize" onClick={() => setMaximized(!maximized)}></button>
                        <button className="minimize"></button>
                    </div>
                    <div className="window-control-filename">{fileName}</div>
                </div>
             </div>
			{children}
		</div>
	);

	if (maximized) {
		return content;
	}

	return (
		<Draggable
	        handle=".window-header"
	        defaultPosition={{
	        	x: left != null ? left : 0,
				y: top != null ? top : 0
	        }}
	        position={null}
       	>
			{content}
		</Draggable>
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

function getNotification() {
	const notifications = [
		"Get back to work! - Boss",
		"Got any extra RAM? - Charles",
	];
	return notifications[randomInt(0, notifications.length)];
}

function Notification({ children }) {
	return (
		<div className="notification">
			{children}
		</div>
	);
}

function getUpdatingTitle() {
	const version = `${randomInt(0, 1000)}.${randomInt(0, 1000)}`;
    const updateNames = [
		"Legacy Email Client",
		"Client Browser Interfaces",
        "User Visual Interfaces",
        "Upstream Downstream Dependencies",
        "Company External Great Firewalls",
	];
	return `${updateNames[randomInt(0, updateNames.length)]}_${version}`;
}

function Update({ onClose, title }) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, 6000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<Window onClick={() => {}}>
			<span className="updating-title">Updating {title}...</span>
			<div className="update">
				<div></div>
			</div>
		</Window>
	);
}
