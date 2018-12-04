*********** CAROUSELS *************

Two kind of carousels can be implemented with this code: finite and infinite. If you wish to know visually how do they function, refer to http://carouselcode.surge.sh/

* The carousel HTML consists of three main parts:
	1. The <div> with class carousel-container
	2. The <ul> with id "(in)finite-carousel-#"
	3. The <li> which are the carousel items

* If you wish to establish a finite carousel, the id of the <ul> must be "finite-carousel-#" where "#" starts from 1, then the next carousel is 2... and so on. The same happens with the infinite, except the formula is "infinite-carousel-#".

* There are some base styles in the folder css/carousel_style.css. Not all of these CSS is necessary but there is a section which is needed for the carousel. Review the notes inside to see this.

* The number of items must greater than six items in order for the carousel to work properly.

* Do not apply padding to the <div> with class "carousel-container". If you wish some separation between the <ul> and the container, apply margin to the <li>.

* Some values can be modified inside javascript/finiteCarousel.js or javascript/infiniteCarousel.js, such as margin values, speed of the carousels, direction, and media queries.
