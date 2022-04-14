// from: http://www.robots.ox.ac.uk/~vedaldi/assets/hidebib.js
function hideallbibs()
{
	var el = document.getElementsByTagName("pre") ;
	for (var i = 0 ; i < el.length ; ++i) {
		if (el[i].className == "bib") {
			el[i].style.display = 'none' ;
		}
	}
}

function togglebib(paperid, link)
{
    var bib = document.getElementById(paperid) ;
    if (bib.style.display == 'none') {
		bib.style.display = 'block' ;
	} else {
		bib.style.display = 'none' ;
	}
	link.blur();
}

