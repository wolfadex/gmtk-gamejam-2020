customElement.define("annoying-popup", class extends HTMLElement {
	connectedCallback() {
		this.render();
		fetch("https://cataas.com/cat").then(this.render);
	}

	render(imageUrl) {
		this.innerHTML = "";

		const container = document.createElement("div");
		const closeButton = document.createElement("button");
		const header = document.createElement("div");

		container.style = "display: flex; flex-direction: column;"
		container.appendChild(header);
		header.appendChild(closeButton);

		closeButton.addEventListener('click', () => {
			this.parentNode.removeChild(this);
		});

		if (imageUrl) {
			const image = document.createElement("img");
			image.src = imageUrl;
			image.setAttribute("width", 100);
			image.setAttribute("height", 100);
			container.appendChild(image);
		} else {
			const placeholder = document.createElement("span");
			placeholder.innerText = "Loading..."l
			container.appendChild(placeholder);
		}
	}
})