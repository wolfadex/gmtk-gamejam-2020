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

	useInterval(() => {
		setPopups({...popups, [uuidv4()]: getPhoto() });
		popupSound.play();
	}, 3000)

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


function Terminal({ commandEntered }) {
	const [currentInput, setCurrentInput] = useState("");
	const [previousInputs, setPreviousInputs] = useState([]);

	return (
		<Window left={40} top={40} onClose={() => {}}>
			<ul className="previous-commands">
				{previousInputs.map((word, i) =>
					<li key={i + "__" + word}>
						word
					</li>
				)}
			</ul>
			{"$> "}
			<div>
				<span></span>
				<input
					className="terminal"
					autoFocus
					onChange={({ target: { value } }) => setCurrentInput(value)} 
					value={currentInput} 
					onKeyDown={({ key }) => {
						if (key === "Enter") {
							commandEntered(currentInput)
							setPreviousInputs([currentInput, ...previousInputs])
							setCurrentInput("");
						}
					}}
				/>
			</div>
		</Window>
	)
}

function Window({ left, top, children, onClose }) {
	const [position, setPosition] = useState({
		left: left != null ? left : randomInt(10, window.innerWidth - 210), 
		top: top != null ? top : randomInt(10, window.innerHeight - 210)
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
				<button onClick={onClose}>X</button>
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