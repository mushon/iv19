// Adding array functions
Array.prototype.inArray = function (variable) {
	for (var i = 0; i < this.length; i++) {
		if (variable(this[i])) return true;
	}
	return false;
};
Array.prototype.pushIfNotExist = function (element, variable) {
	if (!this.inArray(variable)) {
		this.push(element);
	}
};


//get website data from json files




$.getJSON('data.json')
	.done(function (data) {
		eventsData.eventSection = data;
	});


$.getJSON('dates.json')
	.done(function (data) {
		datesData.dateSection = data;
	});

$.getJSON('speakers.json')
	.done(function (data) {
		speakersData.speakersSection = data;
	});


$.getJSON('videos.json')
	.done(function (data) {
		videosData.videosSection = data;
		for (var i = 0; i < videosData.videosSection.length; i++) {

			videosData.allViedoYears.pushIfNotExist(videosData.videosSection[i].videoYear, function (e) {
				return e === videosData.videosSection[i].videoYear
			});
			for (var j = 0; j < videosData.videosSection[i].videoTags.length; j++) {
				// push all tags into an arrat
				videosData.allViedoTags.pushIfNotExist(videosData.videosSection[i].videoTags[j], function (e) {
					return e === videosData.videosSection[i].videoTags[j]
				});
			}
		}
	});

$.getJSON('intro.json')
	.done(function (data) {
		introData.introSection = data;

		// hide all non related sections if "call for submitions" is active
		if (introData.introSection.isSubmitions)
		{
			$('#datesData').hide();
			$('#ticketsData').hide();
			$('#eventsData').hide();
			$('#SpeakersData').hide();
			$('.hide-on-cfs').hide();
		}
	});

$.getJSON('tickets.json')
	.done(function (data) {
		ticketsData.ticketsSection = data;
	});


// Load data into different views

var datesData = new Vue({
	el: '#datesData',
	data: {
		DatesSection: []
	},
	methods: {
		nextImage: function () {
			// TODO	
		}
	}
});


var eventsData = new Vue({
	el: '#eventsData',
	data: {
		eventSection: []
	}
});

var introData = new Vue({
	el: '#introData',
	data: {
		introSection: [],
		isPageLoaded: false
	}
});


var speakersData = new Vue({
	el: '#speakersData',
	data: {
		speakersSection: []

	},
	methods: {
		getStyle: function (speaker) {
			return "background-image: url(images/" + speaker.img + ")";
		}
	}
});

var videosData = new Vue({
	el: '#VideoData',
	data: {
		videosSection: [],
		allViedoTags: [],
		allViedoYears: [],
		activeTag: '',
		activeYear: 2015,
		sortBy: 'videoLength'

	},computed: {
		ordered: function () {
			console.log('hereS');
		//   return (this.videosSection, 'videoLength');
		  return this.videosSection;

		}
	  },
	methods: {
		getTime: function (mins) {
			return "width:" + ((mins.split(":")[0] * 60 + mins.split(":")[1]) / 3600) + "%;";
		},
		filterVideos: function (tag) {
			if (this.activeTag == tag)
			{
				this.activeTag = "";	
			} else
			{
				this.activeTag = tag;

			}
		},
		filterYear: function (year) {
			this.activeYear = year;
		},
		isTagPresent: function (arr) {
			if (this.activeTag!=='')
			{
				return arr.reduce((acc, crr) => (
					acc || crr == this.activeTag
				), false)
			} else {
				return arr;
			}
			
		},
		isYear: function (year) {
			return year == this.activeYear;

		}
	}
});

var ticketsData = new Vue({
	el: '#ticketsData',
	data: {
		ticketsSection: []

	}
});

//ready 
var finishMapinitialAnimation = false;

// if using safari

if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {}




$(window).resize(function () {
	windowHeigth = $(window).height() / 2;

});




// scroll to links

$(".scrollToLink").click(function () {
	$([document.documentElement, document.body]).animate({
		scrollTop: $('#' + $(this).attr('scrolltarget')).offset().top + 40
	}, 500, function () {
		scrollNow();
	});
});


// color changes on scroll
var windowHeigth = $(window).height() / 2;

function scrollNow() {
	var currScroll = $(window).scrollTop() + (windowHeigth / 2);
	var lastScroll = $(".section:first");
	var prevScroll;

	$(".section").each(function () {
		if (isElementOnScreen($(this).attr('id'))) {
			lastScroll = $(this);
			console.log()
		}
	});

	if (prevScroll != lastScroll) {
		// add relevant class
		$("body").removeClass();
		$("body").addClass(lastScroll.attr('styleClass'));

		if (currcoord[0] !== 0 && finishMapinitialAnimation) {
			map.flyTo({
				pitch: lastScroll.attr('map-pitch')
			});
			map.setPaintProperty("shenkar-route", 'line-color', lastScroll.attr('line-color'));

		}


		// change prevscroll
		prevScroll = lastScroll;
	}
}

$(window).scroll(function () {
	scrollNow();
});


function isElementOnScreen(id) {
	var element = document.getElementById(id);
	var bounds = element.getBoundingClientRect();
	return bounds.top < (window.innerHeight / 2) && bounds.bottom > 0;
}