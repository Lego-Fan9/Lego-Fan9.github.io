import "./nav-bar.css";

const nav = document.querySelector('nav');

if (nav) {
	const navContainer = document.createElement('div');
	navContainer.className = 'nav-container';

	const logo = document.createElement('div');
	logo.className = 'logo';
	logo.textContent = 'SWGoH Updates';
	navContainer.appendChild(logo);

	const menuToggle = document.createElement('button');
	menuToggle.className = 'menu-toggle';
	menuToggle.setAttribute('aria-label', 'Toggle menu');
	menuToggle.textContent = '☰';
	navContainer.appendChild(menuToggle);

	const navLinks = document.createElement('ul');
	navLinks.className = 'nav-links';

	const links: { href: string; text: string }[] = [
		{ href: 'javascript:history.back()', text: 'Back' },
		{ href: '/', text: 'Home' },
		{ href: '../swgoh-portrait-maker/', text: 'SWGoH Portrait Maker' },
		{ href: '../swgoh-updates/', text: 'SWGoH Updates' },
		{ href: '../about/', text: 'About' },
	];

	links.forEach(link => {
		const li = document.createElement('li');
		const a = document.createElement('a');
		a.href = link.href;
		a.textContent = link.text;
		li.appendChild(a);
		navLinks.appendChild(li);
	});

	navContainer.appendChild(navLinks);

	nav.appendChild(navContainer);

	document.querySelector(".menu-toggle")?.addEventListener("click", () => {
		document.querySelector(".nav-links")?.classList.toggle("show");
	});

	adjustBodyPadding();
	window.addEventListener('resize', adjustBodyPadding);
}

function adjustBodyPadding() {
    const nav = document.querySelector('nav');
    if (nav) {
        document.body.style.paddingTop = `${nav.offsetHeight}px`;
    }
}