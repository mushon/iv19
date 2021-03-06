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

checkMobile = function() {
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
  };
  isMobile = checkMobile();




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
		// for (var i = 0; i < speakersData.speakersSection.length; i++) {
		// 	speakersData.speakersSection[i].isOpen = true;
		// }
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
		reverse: function (speaker) {
			this.speakersSection[speaker].isOpen = !this.speakersSection[speaker].isOpen;
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
		sortBy: 'videoLength',
		isModalActive:false,
		modalData:{}

	},computed: {
		ordered: function () {
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

		},
		scrollModalToTop: function () {
			$('.modal-right').animate({
				scrollTop: 0
			  }, 100);


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
		}
	});

	if (prevScroll != lastScroll) {
		// add relevant class
		$("body").removeClass();
		$("body").addClass(lastScroll.attr('styleClass'));

		if (currcoord[0] !== 0 && finishMapinitialAnimation) {
			if (!isMobile)
			{
				map.flyTo({
					pitch: lastScroll.attr('map-pitch')
				});
			}
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