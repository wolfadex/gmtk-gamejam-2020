import moment from "moment"
import React, { useState, useEffect, useRef, useReducer } from "react";
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
import bg from "./assets/arcade.mp3";
import k1 from "./assets/keyboard/1.mp3";
import k2 from "./assets/keyboard/2.mp3";
import k3 from "./assets/keyboard/3.mp3";
import k4 from "./assets/keyboard/4.mp3";
import k5 from "./assets/keyboard/5.mp3";
import k6 from "./assets/keyboard/6.mp3";
import k7 from "./assets/keyboard/7.mp3";
import k8 from "./assets/keyboard/8.mp3";
import k9 from "./assets/keyboard/9.mp3";
import k10 from "./assets/keyboard/10.mp3";
import k11 from "./assets/keyboard/10.mp3";

const popupSound = new Audio(sound_1);
const bgMusic = new Audio(bg);
bgMusic.loop = true;
const key1 = new Audio(k1);
const key2 = new Audio(k2);
const key3 = new Audio(k3);
const key4 = new Audio(k4);
const key5 = new Audio(k5);
const key6 = new Audio(k6);
const key7 = new Audio(k7);
const key8 = new Audio(k8);
const key9 = new Audio(k9);
const key10 = new Audio(k10);
const key11 = new Audio(k11);
const keyboardSounds = [
    key1,
    key2,
    key3,
    key4,
    key5,
    key6,
    key7,
    key8,
    key9,
    key10,
    key11,
];

render(<Game />, document.getElementById("root"))
const maxPopups = 10;
const maxLevels = 5;
let highScore = localStorage.getItem("ceddy-wolfadex_gmtk2020_highscore");

// GAME STATES:
// MAIN_MENU: start of the game
// NEW_LEVEL: you get notifications about how hard this level is, and how long you have, clicking accept starts the level
// WORK_STARTED: timer starts here
// WORK_COMPLETE: calculate mouse clicks, keystrokes, wpm, display point total
// GAME_OVER: you failed, you dounce
// SETTINGS_MAIN: settings menu but returns to main menu when closed
// SETTINGS_PLAYING: pause screen, returns to game when closed
// FINISHED: you won! high score page perhaps?!
function Game() {
	const [distractions, dispatch] = useReducer(
		(state, action) => {
			switch(action.type) {
				case "ADD": {
					return { ...state, things: { ...state.things, [state.nextId]: action.payload }, nextId: state.nextId + 1 };
				}
				case "RESET":
					return { nextId: 0, things: {} };
				case "DELETE": {
					const { [action.payload]: removed, ...rest } = state.things;
					return { ...state, things: rest };
				}
				default:
					return state;

			}
		},
		{ nextId: 0, things: {} }
	);
	const [gameState, setGameState] = useState("MAIN_MENU");
    const [gameLevel, setGameLevel] = useState(1);
    const [levelTime, setLevelTime] = useState(window.LEVEL_TIMES[gameLevel]);
	const [distractionSpeed, setDistractionSpeed] = useState(3000);
	const [score, setScore] = useState(0);

    useInterval(() => {
		if (gameState === "PLAYING") {
            if (Object.keys(distractions.things).length > (maxPopups + 5 * gameLevel)) {
                setGameState('GAME_OVER');
                return;
            }

            // have some kind of scaling, so if you stop dismissing popups theres a higher change it happens
            // const trigger = randomInt(0, 100) - (Object.keys(distractions).length);
            // console.log(trigger);
            // if (trigger > 10) {
            //     return;
            // }

			const typeOfDistractions = ['NOTIFICATION', 'POPUP', 'UPDATE'];
			const distractionType = typeOfDistractions[randomInt(0, typeOfDistractions.length)];
			switch(distractionType) {
				case "POPUP":
					dispatch({
						type: "ADD",
						payload: {
							image: getPhoto(),
							type: distractionType,
							fileName: uuidv4(),
						}
					});
					popupSound.play();
					break;
				case "NOTIFICATION":
					dispatch({
						type: "ADD",
						payload: {
							author: "from " + getAuthor(),
							message: getNotification(),
							type: distractionType,
						}
					});
					popupSound.play();
					break;
				case "UPDATE":
					dispatch({
						type: "ADD",
						payload: {
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
                                setGameState("MAIN_MENU");
								setScore(0);
								dispatch({ type: "RESET" });
								setGameLevel(1);
								bgMusic.pause();
								bgMusic.currentTime = 0;
							}}
						>
							New Game
						</span>
						<span
							onClick={() => {
								setGameState("MAIN_MENU");
								setScore(0);
								dispatch({ type: "RESET" });
								setGameLevel(1);
								bgMusic.pause();
								bgMusic.currentTime = 0;
							}}
						>
							Quit
						</span>
					</div>
				</span>
				<span>Edit</span>
				<span>View</span>
				{(gameState === "MAIN_MENU" || gameState === "PLAYING") &&
					<span onClick={() => {
						if (gameState === "MAIN_MENU") {
							setGameState("HELP_MAIN");
						} else {
							setGameState("HELP_PLAYING");
						}
					}}>Help</span>
				}
				{highScore == null ? null :
					<span className="taskbar-score">High Score: {highScore}</span>
				}
				<span className="taskbar-score">Score: {score}</span>
				<span className="taskbar-spacer" />
				{(gameState === "MAIN_MENU" || gameState === "PLAYING") &&
					<button className="taskbar-button" onClick={() => {
						if (gameState === "MAIN_MENU") {
							setGameState("SETTINGS_MAIN");
						} else {
							setGameState("SETTINGS_PLAYING");
						}
					}}>
						<i className="fa fa-cog" aria-hidden="true"></i>
					</button>
				}
			</div>
			{(function() {
				switch(gameState) {
					case "MAIN_MENU":
						return (
							<div className="main-menu">
                                <div className="game-name shake">CTRL</div>
                                <button onClick={() => {
                                    setGameState("PLAYING");
                                    bgMusic.play();
                                }}>
									Start Game
								</button>
								<button onClick={() => setGameState("SETTINGS_MAIN")}>
									Settings
								</button>
							</div>
						);
                    // case "NEW_LEVEL":
                    //     return(<>);
					case "PLAYING":
						return (
							<>
								<Terminal
									key="terminal"
									gameLevel={gameLevel}
									score={score}
									updateLevel={setGameLevel}
									updateState={setGameState}
									clearDistractions={() => dispatch({ type: "RESET" })}
									updateScore={setScore}
									commandEntered={(cmd) => {}}
								/>
								{Object.entries(distractions.things).map(([id,  distraction]) => {
									switch (distraction.type) {
										case "POPUP": {
											function handleClose() {
												dispatch({ type: "DELETE", payload: id });
												setScore(score + 10);
											}
											console.log("carl", distraction.image);
											return (
												<Window key={id} onClose={handleClose} fileName={`${distraction.fileName.substring(0, 8)}.png`}>
													<img src={distraction.image} width="300" onClick={handleClose}/>
												</Window>
											);
										}
										case "NOTIFICATION":
											return (
												<Notification
													key={id}
													onClose={() => {
														dispatch({ type: "DELETE", payload: id });
														setScore(score + 3);
													}}
												>
                                                    <>
                                                        <div className="notification-author">{distraction.author}</div>
                                                        <div className="notification-message">{distraction.message}</div>
                                                    </>
												</Notification>
											);
										case "UPDATE":
											return (
												<Update
													key={id}
													onClose={() => {
														dispatch({ type: "DELETE", payload: id });
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
					case "HELP_MAIN":
					case "HELP_PLAYING":
						return (
							<Window
                                left={100}
                                top={100}
								onClose={() => {
									if (gameState === "HELP_MAIN") {
										setGameState("MAIN_MENU");
									} else {
										setGameState("PLAYING");
									}
								}}
							>
								<div className="tips-container">
                                    <div>TIPS</div>
                                    <div className="tip-items-container">
                                        <div className="tip-item">You can adjust how often distractions come up in the settings.</div>
                                        <div className="tip-item">You can dismiss most distractions by clicking on them.</div>
                                        <div className="tip-item">You can move windows by dragging them.</div>
                                    </div>
                                </div>
							</Window>
						);
					case "GAME_OVER":
						return (
							<Window onClose={() => {
                                setGameState("MAIN_MENU");
                                setScore(0);
								dispatch({ type: "RESET" });
							}} left={100} top={100} id="game-over">
                                <div className="game-won-container">
    								<div className="game-over">
    									YOU FAILED TO FINISH YOUR WORK!
    								</div>

                                    <div className="game-score">
                                        Your score: {score}
                                    </div>

                                    {highScore == null ? null :
                                        <div className="game-highscore">
                                            High Score: {highScore}
                                        </div>
                                    }

    								<button className="game-reset-button" onClick={() => {
    									setGameState("MAIN_MENU");
                                        setScore(0);
    									dispatch({ type: "RESET" });
    								}}>
    									I JUST NEED ANOTHER DAY OR TWO!
    								</button>
                                </div>
							</Window>
						);
					case "FINISHED":
						return (
							<Window onClose={() => {
								setGameState("PLAYING");
                                setScore(0);
								dispatch({ type: "RESET" });
							}} left={100} top={100} id="game-won">
								<div className="game-won-container">
                                    <div className="game-won">
    									You've completed all the work!
    								</div>

                                    <div className="game-score">
                                        Your score: {score}
                                    </div>

                                    {highScore == null ? null :
                                        <div className="game-highscore">
                                            High Score: {highScore}
                                        </div>
                                    }

    								<button className="game-won-button" onClick={() => {
    									setGameState("PLAYING");
                                        setScore(0);
    									dispatch({ type: "RESET" });
    								}}>
    									I want MORE WORK!
    								</button>
                                </div>
							</Window>
						);
				}
			})()}
            <div className="game-version">
                version 0.1
            </div>
            <div className="system-clock">
                {moment().format()}
            </div>
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

function Terminal({ commandEntered, gameLevel, score, updateLevel, updateState, clearDistractions, updateScore }) {
	const [currentInput, setCurrentInput] = useState("");
	const [previousInputs, setPreviousInputs] = useState([]);
    const [comboCount, setComboCount] = useState(0);
    const [saveState, setSaveState] = useState("");
    const [program, setProgram] = useState(window.LEVELS[gameLevel]);

	return (
		<Window id="main-editor" left={40} top={40} onClose={() => {}} fileName={'Project ' + gameLevel}>
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
                    <div className="shadow-text" onClick={() => {
                        document.querySelector("textarea").focus();
                    }}>
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
                            // sound eff
                            const randomSound = keyboardSounds[Math.floor(Math.random() * keyboardSounds.length)];
                            randomSound.play();

                            // some shakes
                            // const editorDom = document.getElementById('main-editor');
                            const originalTop = parseFloat(e.target.style.marginTop.replace('px', '')) || 0;
                            const originalLeft = parseFloat(e.target.style.marginLeft.replace('px', '')) || 0;
                            switch(originalTop) {
                                case 0:
                                    if (randomInt(0, 2) === 1) {
                                        e.target.style.marginTop = '0.5px';
                                    } else {
                                        e.target.style.marginTop = '-0.5px';
                                    }
                                    break;
                                case 0.5:
                                    if (randomInt(0, 2) === 1) {
                                        e.target.style.marginTop = '0px';
                                    } else {
                                        e.target.style.marginTop = '-0.5px';
                                    }
                                    break;
                                case -0.5:
                                    if (randomInt(0, 2) === 1) {
                                        e.target.style.marginTop = '0px';
                                    } else {
                                        e.target.style.marginTop = '0.5px';
                                    }
                                    break;
                            }

                            switch(originalLeft) {
                                case 0:
                                    if (randomInt(0, 2) === 1) {
                                        e.target.style.marginLeft = '0.5px';
                                    } else {
                                        e.target.style.marginLeft = '-0.5px';
                                    }
                                    break;
                                case 0.5:
                                    if (randomInt(0, 2) === 1) {
                                        e.target.style.marginLeft = '0px';
                                    } else {
                                        e.target.style.marginLeft = '-0.5px';
                                    }
                                    break;
                                case -0.5:
                                    if (randomInt(0, 2) === 1) {
                                        e.target.style.marginLeft = '0px';
                                    } else {
                                        e.target.style.marginLeft = '0.5px';
                                    }
                                    break;
                            }

                            if (e.keyCode >= 48 && e.keyCode <= 57) {
                                // 0-9
                                updateScore(score + 10);
                            } else if (e.keyCode === 32) {
                                // backspace
                                updateScore(score + 5);
                            } else if (e.keyCode === 8) {
                                // backspace
                                updateScore(score - 10);
                            } else if (e.keyCode >= 65 && e.keyCode <= 90) {
                                // a-z
                                updateScore(score + 10);
                            } else if (e.keyCode >= 175 && e.keyCode <= 225) {
                                // other relevant characters
                                updateScore(score + 25);
                            }

                            // this tab code is broken if we want to do pointing, not sure why...
                            // if (e.keyCode === 9) { // tab was pressed
                            //     // get caret position/selection
                            //     var target = e.target;
                            //     var start = target.selectionStart;
                            //     var end = target.selectionEnd;
                            //     var value = target.value;

                            //     // set textarea value to: text before caret + tab + text after caret
                            //     target.value = value.substring(0, start)
                            //                 + "  "
                            //                 + value.substring(end);

                            //     // put caret at right position again (add one for the tab)
                            //     target.selectionStart = target.selectionEnd = start + 2;

                            //     // prevent the focus lose
                            //     e.preventDefault();
                            // }
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
                        updateScore(score + (gameLevel * 250));
                        updateLevel(++gameLevel);
                        setCurrentInput("");
                        clearDistractions();

                        if (gameLevel > maxLevels) {
                        	if (highScore && highScore < score) {
                        		localStorage.setItem("ceddy-wolfadex_gmtk2020_highscore", score);
                        		highScore = score;
                        	}
                        	updateLevel(1);
                        	setProgram(window.LEVELS[gameLevel]);
                            updateState("FINISHED");
                        } else {
                            setProgram(window.LEVELS[gameLevel]);
                            setSaveState('');
                        }
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

function Window({ left, top, children, onClose, fileName, id }) {
	const [position, setPosition] = useState({
		left: left != null ? left : randomInt(10, window.innerWidth - 210),
		top: top != null ? top : randomInt(20, window.innerHeight - 210)
	});
	const [isDragging, setDragging] = useState(false);
	// const [offset, setOffset] = useState({ x: 0, y: 0 });
	const [maximized, setMaximized] = useState(false);
	const content = (
		<div id={id}
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

function getAuthor() {
    const authors = [
        "Bossman",
        "Bosswoman",
        "Your best friend",
        "Your worst enemy",
        "Cool guy from accounting",
        "Cool gal from accounting",
        "Drinks too much coffee",
        "Keeper of secrets",
        "Hideo Kojima",
        "Sid Meier",
        "Gabe Newell",
        "Assitant (to the) engineering manager",
        "Office hipster",
    ];

    return authors[randomInt(0, authors.length)];
}

function getNotification() {
    const notifications = [
		"Shouldn't you be working?",
        "Get back to work!",
		"Got any extra RAM?",
        "Did you get your tickets yet?",
        "A C++, a Java, and a Ruby developer walks into a bar...",
        "Argh, the burrito bar upstairs is on fire again",
        "Do you have the latest TPS report?",
        "Did you see the memo about the latest build?",
        "Still on for that game tomorrow?",
        "You must construct additional pylons",
	];
	return notifications[randomInt(0, notifications.length)];
}

function Notification({ children, onClose }) {
	return (
		<div className="notification" onClick={onClose}>
			{children}
		</div>
	);
}

function getUpdatingTitle() {
    const version = `${randomInt(0, 1000)}.${randomInt(0, 1000)}`;
    const updateNames = [
		"Legacy Email Client [2/100]",
		"Client Browser Interfaces",
        "User Visual Virtual Interfaces",
        "Upstream Downstream Dependencies",
        "Company External Great Firewalls",
        "Super Secret Security System",
        "Spyware",
        "Compiling Central Core Computers",
	];
	return `${updateNames[randomInt(0, updateNames.length)]} to v${version}`;
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
