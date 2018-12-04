// ===========  INFINITE CAROUSEL ALGORYTHM ============ //

// When the page loads, execute turnOnCarousels() function.

window.addEventListener('load', () => {
	turnOnInfiniteCarousels();
});

// This function will get all DOM elements whose ID Class starts with "carousel".

function turnOnInfiniteCarousels () {

	const allCarousels = document.querySelectorAll('[id^=infinite-carousel]');

	for (let i = 0; i < allCarousels.length; i++) {
		carouselInfinite(allCarousels[i].id)
	}
	
}

// =======================================================================================
// 1. VARIABLE DECLARATIONS AND INITIAL CONDITIONS
// =======================================================================================

// ---------------------------------------------------------------------------------------
// 1.1 --> Carousel Inputs
// ---------------------------------------------------------------------------------------

function carouselInfinite(carouselId) {

	const timeCounter = 2500; 				// --> Sets the time in ms for actioning carousel
	const margin = "10px";					// --> In-Between List Item Margins
	const direction = 1;					// --> Sets the timer direction of the carousel
											//     1 is RIGHT and any other value is LEFT

	const mediaQueries = {					// --> min-width: (mediaQueries.key)px
		smallBp: 576,						// --> Two items are displayed
		mediumBp: 768,						// --> Three items are displayed
		largeBp: 992,						// --> Four items are displayed
		xlargeBp: 1100						// --> Six items are displayed
	}

	// ---------------------------------------------------------------------------------------
	// 1.2 --> Initial Variables - Selection or Global Variables
	// ---------------------------------------------------------------------------------------

	const carousel =
		document.querySelector
		('#' + carouselId);				  	// --> Select the carousel item.
	const icnArrowRight = 					// --> Select the Right Arrow
		carousel.nextElementSibling
		.children[1];						// --> Select the Right Arrow
	const icnArrowLeft = 					// --> Select the Left Arrow
		carousel.nextElementSibling
		.children[0];						// --> Select the Left Arrow
	const childCount =						
		carousel.childElementCount;			// --> How many items are in the list.
	let carouselWidth =						// --> Carousel Total Width is calculated dependant of how many children it has.
		childCount*100 + "%"; 				//     Media Queries then resize the carousel according to how many childrens are displayed.			 
	let clickCount = 0;						// --> How many positions the Carousel has moved from the start 
	let itemsInVisual = 0;  				// --> How many items are visible in the current layout
	let itemsDiff = 0; 						// --> Variable used to evaluate if given a resize,
	 										//     how many items were added/substracted.
	 										//     Declared as global to avoid scope issues inside functions.
	let maxClicks = 0;  					// --> Describes what is the limit of clickCounts
	let refreshIntervalId = 0;				// --> Variable used for setting the time interval.
											//     It is used inside a function, so it was declared
											//     as a global variable to avoid scope issues.
	let flag = 0;							// --> Used to stop the carousel running if the number of children
											//     is equal or less than the actual display can hold

	// ---------------------------------------------------------------------------------------
	// 1.4 --> Margin Values Declaration & Assignment of Margins to List Items
	// ---------------------------------------------------------------------------------------

	const carouselChilds = carousel.children;

	for (const child of carouselChilds) {
	  child.style.marginLeft = margin;
	  child.style.marginRight = margin;
	}

	// =======================================================================================
	// 2. FUNCTIONS - STATIC WINDOW SIZE
	// =======================================================================================

	// ---------------------------------------------------------------------------------------
	// 2.1 --> Main Action Functions
	// ---------------------------------------------------------------------------------------

	// 2.1.1 --> Main Triggers

	carouselDirection(direction, timeCounter);					// --> Triggers carousel movement with setTimeOut
	icnArrowRight.addEventListener('click', rightClickAction);  // --> Moves Carousel to the Right
	icnArrowLeft.addEventListener('click', leftClickAction);	// --> Moves Carousel to the Left

	// 2.1.2 --> Main Functions

	function rightClickAction () {

		if (flag === 0) {
			clearInterval(refreshIntervalId);					// --> Clears the accumulated time from refreshInterval Id
			CSSRightAdjustment ();
			clickCountSum ("right");
			maxClicksCalc();
			moveCarouselAbs("right");
			initPosRight ();
			carouselDirection(direction, timeCounter);	        // --> Creates a new time set Interval
		}

	}

	function leftClickAction () {

		if (flag === 0) {
			clearInterval(refreshIntervalId); 					// --> Clears the accumulated time from refreshInterval Id
			CSSRightAdjustment ();
			clickCountSum ("left");
			maxClicksCalc();
			moveCarouselAbs("left");
			maxPosLeft ();
			carouselDirection(direction, timeCounter); 			// --> Creates a new time set Interval 
		}			
	}

	// ---------------------------------------------------------------------------------------
	// 2.2 --> Helper Functions
	// ---------------------------------------------------------------------------------------

	function CSSRightAdjustment () { 							// --> The value of "right" is transferred to "translateX"
																// 	   The transition is temporalily turned off to avoid fuzzy behaviour.

		if (parseFloat(carousel.style.right, 10) !== 0) {

			let rightAdjustment = 
				parseFloat(
				carousel.style.transform.match(/\d+/)[0])
				+ parseFloat(carousel.style.right, 10);
			carousel.classList.add('noTransition');
			carousel.style.transform =
				'translateX(-' + rightAdjustment + 'px)';
			window.getComputedStyle(carousel).transform;	    // --> Extremely important to effectively turn off transition.
			carousel.classList.remove('noTransition');

		}

	}

	function clickCountSum (direction) {						// --> clickCount will add 1 to its value if the action is triggered to the right
																//     clickCount will substract 1 to its value if the action is triggered to the left
		if (direction === "right") {
			clickCount += 1;
		} else if (direction === "left") {
			clickCount -= 1;
		}

	}

	function moveCarouselAbs (direction) {						// --> Moves the carousel to the right or to the left,
																//     it depends if the action is triggered to the right or left respectively
		let itemWidth = carousel.firstElementChild.offsetWidth;
		carousel.style.right = "0px";

		if (direction === "right") {
			let moveCarousel = (clickCount)*itemWidth;

			// Adjust moveCarousel with margin values, "right" case

			moveCarousel += parseFloat(margin, 10) * 2 * (clickCount);

			// Then move carousel with translateX

			carousel.style.transform = 'translateX(-' + moveCarousel + 'px)';

		} else if (direction === "left") {
			let moveCarousel = -(clickCount*itemWidth);

			// Adjust moveCarousel with margin values, "left" case

			moveCarousel -= parseFloat(margin, 10) * 2 * (clickCount);

			// Then move carousel with translateX

			carousel.style.transform = 'translateX(' + moveCarousel + 'px)';
		}

	}

	function maxClicksCalc () {									  // --> maxClicks is recalculated in terms of how many items are displayed
																  //     versus how many children the carousel has.
		let visualWidth = carousel.parentNode.offsetWidth;
		let carouselWidth = carousel.offsetWidth;
		itemsInVisual = 
			Math.round(visualWidth/(carouselWidth/childCount));
		maxClicks = childCount - itemsInVisual;

	}

	function initPosRight () {									  // --> Appends carousel's first list item to the last position
																  //     and moves carousel accordingly	
		if (clickCount > maxClicks) {
			clickCount -= 1;
		  	carousel.insertBefore(carousel.firstElementChild, null);
		  	infiniteMove(-1);

		}
	}

	function maxPosLeft () {									  // --> Appends carousel's last list item to the first position
																  //     and moves carousel accordingly	
		if (clickCount < 0 ) {

			carousel.insertBefore(carousel.lastElementChild, carousel.children[0]);
			infiniteMove(2);
			clickCount += 1;
			
		}
	}

	function infiniteMove(scaleNum, marginAdjust) {				  // --> Infinite move - This function is nested and activated
																  //     when right or left limits are met to insert items.		
		/*  
		scaleNum is an integer that scales and adjusts clickCount to
		be precise in the calculation translateX.
		When the function is used, its value was determined empirically in each case.
		This was tested in all cases and the correct functionality is not affected.

		The following statement declares marginAdjust as an optional argument
		This is for the movements that need margin adjustments.
		*/

		marginAdjust = marginAdjust || 0;

		// The following variable is an adjustment of scaleNum, also determined empirically.
		// It is always a number below scaleNum (absolutely)
		// So if scaleNum is -2 or 2 converter must be +1 or -1 respectively.

		let converter = 0;

		if (scaleNum < 0) {
			converter = scaleNum + 1;
		} else if (scaleNum > 0) {
			converter = scaleNum - 1;
		}

		// Moving - Adjustment & Transition Temporal Deactivation

	  	let itemWidth = carousel.firstElementChild.offsetWidth;
	  	let moveCarousel = (clickCount + scaleNum)*itemWidth;
		moveCarousel += parseFloat(margin, 10) * 2 * (clickCount + scaleNum);
		carousel.classList.add('noTransition');
		carousel.style.transform = 'translateX(-' + moveCarousel + 'px)';
		window.getComputedStyle(carousel).transform; // --> Extremely important to effectively turn off transition.
		carousel.classList.remove('noTransition');

		// Moving Adjustment - Infinite Carousel

		if (marginAdjust === 0) {

		  	moveCarousel = (clickCount + converter)*itemWidth;
			moveCarousel += parseFloat(margin, 10) * 2 * (clickCount + converter);
			carousel.style.transform = 'translateX(-' + moveCarousel + 'px)';

		}
	}

	function carouselDirection(direction, timeCounter) {				//--> triggers the timing function depending
																		//    on the desired direction.
		if (direction === 1) {
			refreshIntervalId = setInterval(rightClickAction, timeCounter);
		} else {
			refreshIntervalId = setInterval(leftClickAction, timeCounter);
		}

	}

	function flagEvaluation () {

		if (childCount - itemsInVisual <= 0 ) {							// --> Evaluate if the carousel has to be stopped
			flag = 1;											
		} else {
			flag = 0;
		}

	}

	// ---------------------------------------------------------------------------------------
	// 2.3 --> Media Queries Functions
	// ---------------------------------------------------------------------------------------

	// 2.3.1 --> Functions

	const changeSizeSmall = function(mql) {
		if (mql.matches) {
			carousel.style.width = childCount*100/2 + "%";
		} else {
			carousel.style.width = childCount*100/1 + "%";
		}
	}

	const changeSizeMedium = function(mql) {
		if (mql.matches) {
			carousel.style.width = childCount*100/3 + "%";
		} else {
			changeSizeSmall(smallBp);
		}
	}

	const changeSizeLarge = function(mql) {
		if (mql.matches) {
			carousel.style.width = childCount*100/4 + "%";
		} else {
			changeSizeMedium(mediumBp);
		}
	}

	const changeSizeXlarge = function(mql) {
		if (mql.matches) {
			carousel.style.width = childCount*100/6 + "%";
		} else {
			changeSizeLarge(largeBp);
		}

	}

	// 2.3.2 --> Functions Operations.
	//			 These variables need to go AFTER the function declarations
	//			 This is why they are located here.

	const smallBp = matchMedia('(min-width: ' + mediaQueries.smallBp + 'px)');
	const mediumBp = matchMedia('(min-width: ' + mediaQueries.mediumBp + 'px)');
	const largeBp = matchMedia('(min-width: ' + mediaQueries.largeBp + 'px)');
	const xlargeBp = matchMedia('(min-width: ' + mediaQueries.xlargeBp + 'px)');

	smallBp.addListener(changeSizeSmall);
	mediumBp.addListener(changeSizeMedium);
	largeBp.addListener(changeSizeLarge);
	xlargeBp.addListener(changeSizeXlarge);

	changeSizeSmall(smallBp);
	changeSizeMedium(mediumBp);
	changeSizeLarge(largeBp);
	changeSizeXlarge(xlargeBp);

	// ---------------------------------------------------------------------------------------
	// 1.3 --> Margin Values Declaration & Assignment of Margins to List Items
	// ---------------------------------------------------------------------------------------

	// --> Initial Numerical Values for carousel objects when resize occurs thanks
	//	   to the media queries of section 2.3.2, this sections needs to go AFTER.

	carousel.style.transform = 'translateX(0px)';
	carousel.style.right = '0px';
	let visualWidth = carousel.parentNode.offsetWidth;
	carouselWidth = carousel.offsetWidth;
	itemsInVisual = 
		Math.round(visualWidth/(carouselWidth/childCount));
	maxClicks = childCount - itemsInVisual;

	flagEvaluation ();

	// =======================================================================================
	// 3. FUNCTIONS - DYNAMIC WINDOW RE-SIZE
	// =======================================================================================

	window.addEventListener('resize', () => {

	// ---------------------------------------------------------------------------------------
	// 3.1 --> Re-positioning when Re-sizing using "right" property
	// ---------------------------------------------------------------------------------------

		let actualPosition = parseInt(carousel.style.transform.match(/\d+/)[0]);
		let diff = actualPosition - (carousel.firstElementChild.offsetWidth
								  + parseFloat(margin, 10) * 2) * (clickCount);
		carousel.style.right = -diff + 'px'; //--> relative positioning with CSS "right" property
											 //    using "diff" as guide.

	// ---------------------------------------------------------------------------------------
	// 3.2 --> Items In Visual Permanent Evaluation
	// ---------------------------------------------------------------------------------------

		let visualWidthEvaluation = carousel.parentNode.offsetWidth;
		let carouselWidthEvaluation = carousel.offsetWidth;
		let itemsInVisualEvaluation = Math.round(visualWidthEvaluation/(carouselWidthEvaluation/childCount));

	// ---------------------------------------------------------------------------------------
	// 3.3 --> Media Queries Take Effect - Number of Items Displayed Changes
	// ---------------------------------------------------------------------------------------

	// 3.3.1 --> There are now more items displayed

		if ( itemsInVisualEvaluation > itemsInVisual ) {

			itemDiff = itemsInVisualEvaluation - itemsInVisual;
			itemsInVisual = itemsInVisualEvaluation;

			flagEvaluation ()

			maxClicks -= itemDiff;
			carousel.style.right = '0px';

			infiniteMove(0, 1);

			if (clickCount > maxClicks) {

				let lackingItems = clickCount - maxClicks;
				clickCount = maxClicks;

				for (let i = 0; i < lackingItems; i++) {

				  	carousel.insertBefore(carousel.firstElementChild, null);
				  	infiniteMove(-1);

				}

			}

	// 3.3.2 --> There are now less items displayed

		} else if (itemsInVisualEvaluation < itemsInVisual) {

			itemDiff = itemsInVisual - itemsInVisualEvaluation;
			itemsInVisual = itemsInVisualEvaluation;

			flagEvaluation ()

			maxClicks += itemDiff;

		}

	});

}