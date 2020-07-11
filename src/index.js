import React, { useState } from "react";
import { render } from "react-dom";


render(<Terminal />, document.getElementById("root"))

function getWord() {
  const words = [
	"word",
	"hack",
	"computer",
	"system",
  ];
  const max = Math.floor(words.length);
  const index = Math.floor(Math.random() * max);
  return words[index];
}


function Terminal() {
	const [currentInput, setCurrentInput] = useState("");
	const [currentWord, setCurrentWord] = useState(getWord())
	const [previousWords, setPreviousWords] = useState([]);

	return (
		<>
			<ul className="previous-commands">
				{previousWords.map((word, i) =>
					<li key={i + "__" + word}>
						$$ word
					</li>
				)}
			</ul>
			{"$> " + currentWord} 
			<input
				autoFocus
				onChange={({ target: { value } }) => setCurrentInput(value)} 
				value={currentInput} 
				onKeyDown={({ key }) => {
					if (key === "Enter") {
						if (currentInput === currentWord) {
							setCurrentWord(getWord());
							setPreviousWords([currentWord, ...previousWords])
						}

						setCurrentInput("");
					}
				}}
			/>
		</>
	)
}