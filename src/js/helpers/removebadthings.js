
module.exports = function() {
    var content = document.querySelector('.post__content');
    // by Gregor & Avery, I think
    console.log("removed bad things");
    if (content) {
        var allParagraphs = content.querySelectorAll('p');
        allParagraphs.forEach(function (paragraph) {
            if (paragraph.classList.value === '' && paragraph.innerHTML === '') {
                paragraph.parentNode.removeChild(paragraph);
            }
        });
        var allBreakTags = content.querySelectorAll('br');
        allBreakTags.forEach(function(breakTag) {
            if (breakTag.classList.value === '') {
                breakTag.parentNode.removeChild(breakTag);
            }
        });
    }

    //small addition by Katya. Fix WP inserting <p> inside headings and ruining their style.
    if (content) {
        var allHeadings = content.querySelectorAll("h1, h2, h3, h4, h5, h6");
        allHeadings.forEach(function (heading) {
            var par = heading.querySelector("p");
            if( par ){
                var parContent = par.innerHTML;
                heading.removeChild(par);
                heading.innerHTML = parContent;
            }
        });
    }
};


