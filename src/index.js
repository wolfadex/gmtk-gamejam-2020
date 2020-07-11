import React, { useState, useEffect } from "react";
import { render } from "react-dom";


render(<Game />, document.getElementById("root"))


function Game() {
	const [popups, setPopups] = useState([createPopup()]);

	// useEffect(() => {

	// }, popups)

	return (
		<>
			<Terminal commandEntered={(cmd) => {
				const index = popups.findIndex((word) => word === cmd);

				if (index > -1) {
					popups.splice(index, 1);
					setPopups(popups);
				}
			}}/>
			{popups.map((popup) => {
				<Window>
					{popup}
				</Window>
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
		<Window left="40" top="40">
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

function Window({ left, top, children }) {
	const [position, setPosition] = useState({
		left: left != null ? left : randomInt(0, window.width), 
		top: top != null ? top : randomInt(0, window.height)
	});

	return (
		<div style={{ left: position.left, top: position.top }} className="faux-window">
			<div class="window-header"><button onClick={() => {}	}>X</button></div>
			{children}
		</div>
	);
}