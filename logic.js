var colors = ["#0074D9", "#2ECC40", "#FF4136", "#B10DC9", "#3D9970", "#85144b", "#FF851B", "#F012BE", "#01FF70", "#39CCCC"];

window.onload = function prepareDocument() {
	addHeader();
	convertAsides();
	colorNotes();
	convertFeet();
	adjustParagraphs();
}

function addHeader() {
	var article = document.querySelector("article");
	var header = document.querySelector("link[rel='import']");
	if (header) {
		header = header.import;
		var children = header.body.children;
		while (children.length > 0) {
			article.parentNode.insertBefore(children[0], article);
		}	
	}
}

function getAbsoluteBounds(element) {
	var box = element.getBoundingClientRect();
	var offset = window.scrollX;
	return {bottom: box.bottom + offset, top: box.top + offset};
}

function adjustParagraphs() {
	var article = document.querySelectorAll("article")[0];
	var asides = article.querySelectorAll("span.notiz");
	var anker = article.querySelectorAll("em.anker");
	
	if (asides.length < 1 || asides.length != anker.length) {
		return;
	}

	var lasts = [];
	var firsts = [0];
	var tpar = anker[0].closest("p");
	for (var currank = 0; currank < anker.length; currank++) {
		if (anker[currank].parentNode != tpar) {
			console.log(tpar);
			tpar = anker[currank].closest("p");
			lasts.push(currank - 1);
			firsts.push(currank);
		}
	}
	lasts.push(anker.length-1);
	
	for (var i = 0; i < lasts.length; i++) {
		var last = asides[lasts[i]];
		var paragraph = last.closest("p");
		
		var diff = getAbsoluteBounds(last).bottom - getAbsoluteBounds(paragraph).bottom;
		
		if (diff > 0) {
			var last_adjusted = -1;
			var last_diff = -1;
			var paragraph_plus = 0;

			for (var j = lasts[i]; j > firsts[i]; j--) {
				var second = getAbsoluteBounds(asides[j]).top;
				var first = getAbsoluteBounds(asides[j-1]).bottom;
				var curr_diff = second - first;
				if (curr_diff < diff) {
					diff -= curr_diff;
				} else {
					last_adjusted = j;
					last_diff = -diff;
					break;
				}
			}

			if (last_adjusted === -1 && last_diff === -1) {
				var first = getAbsoluteBounds(paragraph).top;
				var second = getAbsoluteBounds(asides[firsts[i]]).top;
				var curr_diff = second - first;
				if (curr_diff < diff) {
					paragraph_plus = diff - curr_diff;
					last_diff = -curr_diff;
				} else {
					last_diff = -diff;
				}
				last_adjusted = firsts[i];
			}
			
			asides[last_adjusted].style.marginTop = last_diff + "px";
			for (var j = last_adjusted; j < lasts[i]; j++) {
				var first = getAbsoluteBounds(asides[j]).bottom;
				var second = getAbsoluteBounds(asides[j+1]).top;
				asides[j+1].style.marginTop = (first - second) + "px";
			}
			
			paragraph.style.paddingBottom = paragraph_plus + "px";
		}
	}
}

function getQuotes() {
	var article = document.querySelectorAll("article");

	if (article.length === 2) {
		article[1].removeAttribute("hidden");
		article[0].setAttribute("hidden", true);
		return;
	} else {
		article = article[0];
	}

	var asides = article.querySelectorAll("span.notiz");
	var anker = article.querySelectorAll("em.anker");

	var new_article = document.createElement("article");
	for (var i = 0; i < asides.length; i++) {
		var quote = document.createElement("blockquote");
		var p = document.createElement("p");
		var em = document.createElement("em");
		em.innerText = anker[i].innerText;

		p.appendChild(em);
		quote.appendChild(p);

		var note = document.createElement("p");
		note.innerText = asides[i].innerText;
		if (asides[i].classList.contains("frage")) {
			note.style.color = "red";
		}

		new_article.appendChild(quote);
		new_article.appendChild(note);
	}
	
	article.setAttribute('hidden', true);
	document.body.appendChild(new_article);
	new_article.removeAttribute('hidden');
}

function getText() {
	var articles = document.querySelectorAll("article");

	if (articles.length < 2) {
		return;
	}

	articles[0].removeAttribute("hidden");
	articles[1].setAttribute("hidden", true);
}

function convertFeet() {
	var asides = document.querySelectorAll("em.foot");

	for (var i = 0; i < asides.length; i++) {
		var label = document.createElement("label");
		label.htmlFor = "fn" + i;
		label.setAttribute("class", "margin-toggle sidenote-number");

		var input = document.createElement("input");
		input.setAttribute("type", "checkbox");
		input.setAttribute("id", "sn" + i);
		input.setAttribute("class", "margin-toggle");

		var span = document.createElement("span");
		span.setAttribute("class", "sidenote");
		span.innerHTML = asides[i].innerHTML;

		var par = asides[i].parentNode;
		par.insertBefore(label, asides[i]);
		par.insertBefore(input, asides[i]);
		par.insertBefore(span, asides[i]);	

		asides[i].remove();
	}
}

function convertAsides() {
	var asides = document.querySelectorAll("em.notiz");

	for (var i = 0; i < asides.length; i++) {
		var label = document.createElement("label");
		label.htmlFor = "sn" + i;
		label.setAttribute("class", "margin-toggle");

		var input = document.createElement("input");
		input.setAttribute("type", "checkbox");
		input.setAttribute("id", "sn" + i);
		input.setAttribute("class", "margin-toggle");

		var span = document.createElement("span");
		span.setAttribute("class", "marginnote notiz");
		if (asides[i].classList.contains("frage")) {
			span.classList.add("frage");
		}
		span.innerHTML = asides[i].innerHTML;

		var par = asides[i].parentNode;
		par.insertBefore(label, asides[i]);
		par.insertBefore(input, asides[i]);
		par.insertBefore(span, asides[i]);	

		asides[i].remove();
	}
}

function colorNotes() {
	var scores = document.querySelectorAll("em.anker");
	var notes = document.querySelectorAll("span.notiz");

	for (var i = 0; i < scores.length; i++) {
		var color = colors[i % colors.length];

		scores[i].style.cssText =  
		`font-style: normal;
		text-decoration: none;
         	background: -webkit-linear-gradient(#fffff8, #fffff8), -webkit-linear-gradient(#fffff8, #fffff8), -webkit-linear-gradient(${color}, ${color});
         	background: linear-gradient(#fffff8, #fffff8), linear-gradient(#fffff8, #fffff8), linear-gradient(${color}, ${color});
         	-webkit-background-size: 0.05em 1px, 0.05em 1px, 1px 1px;
         	-moz-background-size: 0.05em 1px, 0.05em 1px, 1px 1px;
         	background-size: 0.05em 1px, 0.05em 1px, 1px 1px;
         	background-repeat: no-repeat, no-repeat, repeat-x;
         	text-shadow: 0.03em 0 #fffff8, -0.03em 0 #fffff8, 0 0.03em #fffff8, 0 -0.03em #fffff8, 0.06em 0 #fffff8, -0.06em 0 #fffff8, 0.09em 0 #fffff8, -0.09em 0 #fffff8, 0.12em 0 #fffff8, -0.12em 0 #fffff8, 0.15em 0 #fffff8, -0.15em 0 #fffff8;
         	background-position: 0% 93%, 100% 93%, 0% 93%;`;

		notes[i].style.color = color;
	}
}
