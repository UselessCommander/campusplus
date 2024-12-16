document.querySelectorAll('.icon-btn').forEach((button) => {
    button.addEventListener('click', function () {
        const svg = this; // Hele SVG-elementet
        const bellInner = svg.querySelector('.bell-inner');
        let existingLine = svg.querySelector('.strike-line');

        // Tjek og toggle 'fill' og 'stroke' på bell-inner path
        if (bellInner) {
            if (bellInner.getAttribute('fill') === 'black') {
                bellInner.setAttribute('fill', 'none');
                bellInner.setAttribute('stroke', 'black');
            } else {
                bellInner.setAttribute('fill', 'black');
                bellInner.removeAttribute('stroke');
            }
        }

        // Håndter linje (strike-line)
        if (existingLine) {
            existingLine.remove();
        } else {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", "3");
            line.setAttribute("y1", "3");
            line.setAttribute("x2", "17");
            line.setAttribute("y2", "17");
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", "2");
            line.classList.add('strike-line');
            svg.appendChild(line);
        }

        console.log("SVG klik registreret!");
    });
});
