// Some little helpers
const log = msg => (DEBUG ? console.log(msg) : '');
const select = id => document.getElementById(id);

function plotPieAttr(shootings) {
	data = shootings;
	plotPieChart();
}
function plotBarAttr(shootings) {
	data = shootings;
	plotBarChart();
}
function plotPieChart() {
	let genderButt = document.getElementById('genderCheck');
	let ageButt = document.getElementById('ageCheck');
	let mentalButt = document.getElementById('mentalCheck');
	let weaponLegalButt = document.getElementById("legalWeaponCheck");

	if (mentalButt.checked == true) {
		ageButt.disabled = true;
		genderButt.disabled = true;
		weaponLegalButt.disabled = true;
		let mentalData = getMentalHealth(data)
		filteredData = [{ name: "Unknown", y: mentalData[0], sliced: true, selected: true },
		{ name: "Yes", y: mentalData[1] },
		{ name: "No", y: mentalData[2] }]
		plotPie(filteredData)
	}
	else if (ageButt.checked == true) {
		mentalButt.disabled = true;
		genderButt.disabled = true;
		weaponLegalButt.disabled = true;
		let ageData = getAge(data)
		filteredData = [{ name: "13-25", y: ageData[0], sliced: true, selected: true },
		{ name: "26-30", y: ageData[1] }, { name: "31-39", y: ageData[2] }, { name: "41-49", y: ageData[3] },
		{ name: "50+", y: ageData[4] }]
		plotPie(filteredData)
	}
	else if (genderButt.checked == true) {
		mentalButt.disabled = true;
		ageButt.disabled = true;
		let genderData = getGender(data)
		filteredData = [{ name: "Male", y: genderData[0], sliced: true, selected: true },
		{ name: "Female", y: genderData[1] }]
		plotPie(filteredData)

	}
	else if (weaponLegalButt.checked == true) {
		mentalButt.disabled = true;
		genderButt.disabled = true;
		ageButt.disabled = true;
		let weaponLegalData = getWeaponLegality(data)
		filteredData = [{ name: "Yes", y: weaponLegalData[0], sliced: true, selected: true },
		{ name: "No", y: weaponLegalData[1] }, { name: "Unknown", y: weaponLegalData[2] }]
		plotPie(filteredData)
	}
	else {
		ageButt.disabled = false;
		mentalButt.disabled = false;
		genderButt.disabled = false;
		weaponLegalButt.disabled = false;
	}
}
function plotBarChart() {
	let legalityButt = document.getElementById('legalityCheck');
	let unknownButt = document.getElementById('unknownCheck');
	let injuries = []
	let fatalities = []
	if (legalityButt.checked == true) {
		unknownButt.disabled = true
		const temp = getInjuredAndFatalitiesByWeaponType("yes", data)
		injuries = temp[0]
		fatalities = temp[1]
	}
	else if (unknownButt.checked == true) {
		legalityButt.disabled = true
		const temp = getInjuredAndFatalitiesByWeaponType("unknown", data)
		injuries = temp[0]
		fatalities = temp[1]
	}
	else {
		legalityButt.disabled = false
		unknownButt.disabled = false
		const temp = getInjuredAndFatalitiesByWeaponType("no", data)
		injuries = temp[0]
		fatalities = temp[1]
	}
	plotBar(injuries, fatalities);
}
function plotAreaChart() {
	Highcharts.chart('container', {
		chart: {
			type: 'area'
		},
		title: {
			text: 'Number of fatalities of mass shootings in the US according to the legal status of weapon purchase'
		},
		subtitle: {
			text: 'Source: Mother Jones'
		},
		xAxis: {
			categories: ['1982-1983', '1984-1985', '1986-1987', '1988-1989', '1990-1991', '1992-1993', '1994-1995', '1996-1997', '1998-1999', '2000-2001', '2002-2003', '2004-2005', '2006-2007', '2008-2009', '2010-2011', '2012-2013', '2014-2015', '2016-2017', '2018-2019'],
			tickmarkPlacement: 'on',
			title: {
				enabled: false
			}
		},
		yAxis: {
			labels: {
				format: '{value}%'
			},
			title: {
				enabled: false
			}
		},
		tooltip: {
			pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>',
			split: true
		},
		plotOptions: {
			area: {
				stacking: 'percent',
				lineColor: '#ffffff',
				lineWidth: 1,
				marker: {
					lineWidth: 1,
					lineColor: '#ffffff'
				},
				accessibility: {
					pointDescriptionFormatter: function (point) {
						function round(x) {
							return Math.round(x * 100) / 100;
						}
						return (point.index + 1) + ', ' + point.category + ', ' +
							point.y + ' millions, ' + round(point.percentage) + '%, ' +
							point.series.name;
					}
				}
			}
		},
		series: [{
			name: 'Weapons obtained illegally',
			data: [0, 7, 0, 0, 0, 15, 0, 7, 81, 0, 0, 15, 13, 13, 0, 29, 6, 26, 11]
		},
		{
			name: 'Weapons obtained legally',
			data: [11, 41, 41, 67, 75, 56, 34, 14, 58, 16, 15, 23, 90, 106, 51, 170, 111, 804, 243]
		}]
	});
}

function getMentalHealth(data) {
	const fieldMap = getColumnMap("prior_signs_mental_health_issues", data)
	let unknown = fieldMap.get("unknown");
	let yes = fieldMap.get("yes");
	//unknown?
	let no = fieldMap.get("no");
	const total = unknown + yes + no;
	return [parseFloat(unknown / total), parseFloat(yes / total),
	parseFloat(no / total)];
}

function getAge(data) {
	const fieldMap = getColumnMap("age_of_shooter", data)
	let range13to25 = 0;
	let range26to30 = 0;
	let range31to39 = 0;
	let range40to49 = 0;
	let range50plus = 0;

	for (let [ageKey, ageCount] of fieldMap.entries()) {
		ageKey.split(',').map(a => {
			const age = parseInt(a.trim());
			if (age >= 13 && age <= 25) {
				range13to25 += ageCount;
			}
			else if (age >= 26 && age <= 30) {
				range26to30 += ageCount;
			}
			else if (age >= 31 && age <= 39) {
				range31to39 += ageCount;
			}
			else if (age >= 40 && age <= 49) {
				range40to49 += ageCount;
			}
			else {
				range50plus += ageCount;
			}
		})
	}
	const total = range13to25 + range26to30 + range31to39 + range40to49 + range50plus;
	return [parseFloat(range13to25 / total),
	parseFloat(range26to30 / total),
	parseFloat(range31to39 / total),
	parseFloat(range40to49 / total),
	parseFloat(range50plus / total)];
}

function getWeaponLegality(data) {
	const columnMap = getColumnMap("weapons_obtained_legally", data);
	const yes = columnMap.get("yes")
	const no = columnMap.get("no")
	const unknown = columnMap.get("unknown")
	const total = yes + no + unknown
	return [parseFloat(yes / total), parseFloat(no / total), parseFloat(unknown / total)]
}

function getGender(data) {
	const columnMap = getColumnMap("gender", data);
	const male = columnMap.get("male");
	const female = columnMap.get("female");
	const maleAndFemale = columnMap.get("male & female");
	const total = male + female + maleAndFemale + maleAndFemale;
	return [parseFloat((male + maleAndFemale) / total), parseFloat((female + maleAndFemale) / total)];
}

function getInjuredAndFatalitiesByWeaponType(legalType, data) {
	const rows = getJoinedColumns("injured", "fatalities", "weapon_type", "weapons_obtained_legally", data);
	let weapons = {
		"handgun": { "injured": 0, "fatalities": 0 },
		"rifle": { "injured": 0, "fatalities": 0 },
		"shotgun": { "injured": 0, "fatalities": 0 }
	}
	rows.map(rowMap => {
		const weaponType = String(rowMap.get("weapon_type"));
		const rowLegalType = String(rowMap.get("weapons_obtained_legally"))
		if (rowLegalType == legalType) {
			var changed = false;
			if (weaponType.includes("handgun")) {
				weapons = incrementInjuredAndFatalities("handgun", weapons, rowMap)
				changed = true;
			}
			if (weaponType.includes("rifle")) {
				weapons = incrementInjuredAndFatalities("rifle", weapons, rowMap)
				changed = true;
			}
			if (weaponType.includes("shotgun")) {
				weapons = incrementInjuredAndFatalities("shotgun", weapons, rowMap)
				changed = true;
			}
			if (!changed) {
				console.log(weaponType);
			}
		}
	})
	return [[weapons['handgun']['injured'], weapons['rifle']['injured'], weapons['shotgun']['injured']],
	[weapons['handgun']['fatalities'], weapons['rifle']['fatalities'], weapons['shotgun']['fatalities']]];
}

function incrementInjuredAndFatalities(weaponName, weapons, rowMap) {
	const oldInjured = parseInt(weapons[weaponName]["injured"])
	const oldFatalities = parseInt(weapons[weaponName]["fatalities"])
	weapons[weaponName]["injured"] = parseInt(rowMap.get("injured")) + oldInjured
	weapons[weaponName]["fatalities"] = parseInt(rowMap.get("fatalities")) + oldFatalities
	return weapons
}

function getColumnMap(column, data) {
	const columnMap = new Map;
	data.map(row => {
		const key = row[column].toLowerCase().trim();
		if (columnMap.has(key)) {
			columnMap.set(key, columnMap.get(key) + 1);
		} else {
			columnMap.set(key, 1);
		}
	})
	return columnMap;
}

function getJoinedColumns(column1, column2, data) {
	const columns = [];
	data.map(row => {
		rowMap = new Map
		const value1 = row[column1].toLowerCase().trim();
		const value2 = row[column2].toLowerCase().trim();

		rowMap.set(column1, value1);
		rowMap.set(column2, value2);
		columns.push(rowMap);
	})
	return columns;
}

function getJoinedColumns(column1, column2, column3, column4, data) {
	const columns = [];
	data.map(row => {
		rowMap = new Map
		const value1 = row[column1].toLowerCase().trim();
		const value2 = row[column2].toLowerCase().trim();
		const value3 = row[column3].toLowerCase().trim();
		const value4 = row[column4].toLowerCase().trim();

		rowMap.set(column1, value1);
		rowMap.set(column2, value2);
		rowMap.set(column3, value3);
		rowMap.set(column4, value4);
		columns.push(rowMap);
	})
	return columns;
}

function plotPie(buttonCol) {
	var myChart = Highcharts.chart('pieChart', {
		chart: {
			type: 'pie',
			plotBorderWidth: null,
			plotShadow: false,
			plotBackgroundColor: null
		},
		title: {
			text: 'Breakdown of Shooter Personal Information',
			style: {
				color: 'black',
				fontWeight: 9,
				fontSize: "25px"
			}
		},
		tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
		accessibility: {
			point: {
				valueSuffix: '%'
			}
		},
		legend: {
			enabled: true,
			reversed: true,
			verticalAlign: 'top',
			x: 220,
			y: 40,
			floating: true,
			backgroundColor: 'white',
			borderColor: 'grey',
			borderWidth: 1,
		},
		plotOptions: {
			pie: {
				allowPointSelect: true,
				showInLegend: true,
				cursor: 'pointer',
				// colors: ['red', 'blue'],

				dataLabels: {
					enabled: true,
					format: '<b>{point.name}%</b>: {point.percentage:.1f} %',
				}
			}
		},
		series: [{
			name: 'Sales',
			colorByPoint: true,
			data: buttonCol,
		}]
	})
}
function plotBar(injuriesByWeapon, fatalitiesByWeapon) {
	var myChart = Highcharts.chart('barChart', {
		chart: {
			type: 'bar',
		},
		title: {
			text: 'Damage done by weapon types and legal status of purchases',
			style: {
				color: 'black',
				fontSize: "19px",
			}
		},
		tooltip: {
			headerFormat: '<b>ID: {point.x}</b><br/>',
			pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
		},
		xAxis: {
			categories: ["Handgun", "Rifle", "Shotgun"],
			title: {
				text: 'Order ID',
				style: {
					color: 'grey',
					fontSize: "14px"
				}
			},
			labels: {
				style: {
					color: 'black'
				}
			}
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Amount of Knives & Forks Ordered',
				style: {
					color: 'grey',
					fontSize: "14px"
				}
			},
			stackLabels: {
				enabled: true,
				style: {
					fontWeight: 'bold',
					color: 'gray'
				}
			}
		},
		legend: {
			reversed: true,
			align: 'right',
			verticalAlign: 'top',
			x: 1,
			y: 40,
			floating: true,
			backgroundColor: 'white',
			borderColor: 'grey',
			borderWidth: 1,
		},
		plotOptions: {
			series: {
				stacking: 'normal',
				dataLabels: {
					enabled: true
				}
			}
		},
		series: [{
			name: 'Injured',
			data: injuriesByWeapon,
			// color: 'red'
		}, {
			name: 'Fatalities',
			data: fatalitiesByWeapon,
			// color: 'blue'
		}]
	});
}

var stateNames = {
	"AL": "Alabama",
	"AK": "Alaska",
	"AS": "American Samoa",
	"AZ": "Arizona",
	"AR": "Arkansas",
	"CA": "California",
	"CO": "Colorado",
	"CT": "Connecticut",
	"DE": "Delaware",
	"DC": "District Of Columbia",
	"FM": "Federated States Of Micronesia",
	"FL": "Florida",
	"GA": "Georgia",
	"GU": "Guam",
	"HI": "Hawaii",
	"ID": "Idaho",
	"IL": "Illinois",
	"IN": "Indiana",
	"IA": "Iowa",
	"KS": "Kansas",
	"KY": "Kentucky",
	"LA": "Louisiana",
	"ME": "Maine",
	"MH": "Marshall Islands",
	"MD": "Maryland",
	"MA": "Massachusetts",
	"MI": "Michigan",
	"MN": "Minnesota",
	"MS": "Mississippi",
	"MO": "Missouri",
	"MT": "Montana",
	"NE": "Nebraska",
	"NV": "Nevada",
	"NH": "New Hampshire",
	"NJ": "New Jersey",
	"NM": "New Mexico",
	"NY": "New York",
	"NC": "North Carolina",
	"ND": "North Dakota",
	"MP": "Northern Mariana Islands",
	"OH": "Ohio",
	"OK": "Oklahoma",
	"OR": "Oregon",
	"PW": "Palau",
	"PA": "Pennsylvania",
	"PR": "Puerto Rico",
	"RI": "Rhode Island",
	"SC": "South Carolina",
	"SD": "South Dakota",
	"TN": "Tennessee",
	"TX": "Texas",
	"UT": "Utah",
	"VT": "Vermont",
	"VI": "Virgin Islands",
	"VA": "Virginia",
	"WA": "Washington",
	"WV": "West Virginia",
	"WI": "Wisconsin",
	"WY": "Wyoming"
}
var massShootingState = [{
	"name": "AL",
	"totalVictims": 0
}, {
	"name": "AK",
	"totalVictims": 0
}, {
	"name": "AZ",
	"totalVictims": 19
}, {
	"name": "AR",
	"totalVictims": 15
}, {
	"name": "CA",
	"totalVictims": 299
}, {
	"name": "CO",
	"totalVictims": 142
}, {
	"name": "CT",
	"totalVictims": 46
}, {
	"name": "DE",
	"totalVictims": 0
}, {
	"name": "FL",
	"totalVictims": 235
}, {
	"name": "GA",
	"totalVictims": 27
}, {
	"name": "HI",
	"totalVictims": 7
}, {
	"name": "ID",
	"totalVictims": 0
}, {
	"name": "IL",
	"totalVictims": 49
}, {
	"name": "IN",
	"totalVictims": 0
}, {
	"name": "IA",
	"totalVictims": 7
}, {
	"name": "KS",
	"totalVictims": 17
}, {
	"name": "KY",
	"totalVictims": 28
}, {
	"name": "LA",
	"totalVictims": 6
}, {
	"name": "ME",
	"totalVictims": 0
}, {
	"name": "MD",
	"totalVictims": 0
}, {
	"name": "MA",
	"totalVictims": 19
}, {
	"name": "MI",
	"totalVictims": 18
}, {
	"name": "MN",
	"totalVictims": 23
}, {
	"name": "MS",
	"totalVictims": 15
}, {}, {
	"name": "MO",
	"totalVictims": 8
}, {
	"name": "MT",
	"totalVictims": 0
}, {
	"name": "NE",
	"totalVictims": 13
}, {
	"name": "NV",
	"totalVictims": 616
}, {
	"name": "NH",
	"totalVictims": 0
}, {
	"name": "NJ",
	"totalVictims": 7
}, {
	"name": "NM",
	"totalVictims": 0
}, {
	"name": "NY",
	"totalVictims": 55
}, {
	"name": "NC",
	"totalVictims": 23
}, {
	"name": "ND",
	"totalVictims": 0
}, {
	"name": "OH",
	"totalVictims": 56
}, {
	"name": "OK",
	"totalVictims": 21
}, {
	"name": "OR",
	"totalVictims": 47
}, {
	"name": "PA",
	"totalVictims": 40
}, {
	"name": "RI",
	"totalVictims": 0
}, {
	"name": "SC",
	"totalVictims": 17
}, {
	"name": "SD",
	"totalVictims": 0
}, {
	"name": "TN",
	"totalVictims": 15
}, {
	"name": "TX",
	"totalVictims": 296
}, {
	"name": "UT",
	"totalVictims": 10
}, {
	"name": "VT",
	"totalVictims": 0
}, {
	"name": "VA",
	"totalVictims": 71
}, {
	"name": "WA",
	"totalVictims": 65
}, {
	"name": "WV",
	"totalVictims": 0
}, {
	"name": "WI",
	"totalVictims": 37
}, {
	"name": "WY",
	"totalVictims": 0
}];
var colorGradient = ["#feebe2", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177"];
function getColor(state) {
	if (state.totalVictims < 10) {
		return 0
	}
	else if (10 <= state.totalVictims && state.totalVictims < 20) {
		return 1
	}
	else if (20 <= state.totalVictims && state.totalVictims < 40) {
		return 2
	}
	else if (40 <= state.totalVictims && state.totalVictims < 60) {
		return 3
	}
	else if (60 <= state.totalVictims && state.totalVictims < 100) {
		return 4
	}
	else if (100 <= state.totalVictims && state.totalVictims < 200) {
		return 5
	}
	else if (200 <= state.totalVictims) {
		return 6
	}
}
function setResults() {
	var stateResults = {};

	massShootingState.forEach(function (state) {
		var stateName = state.name;
		var colorIndex = state.totalVictims;
		var styleObject = {
			"background-color": colorGradient[getColor(state)],
			"label": {
				"font-size": 14
			},
			"tooltip": {
				"text": stateNames[stateName] + " has a total number of victims from mass shootings of " + Math.floor(state.totalVictims) + " in the period of 1982 - 2019",
				// "text": stateNames[stateName] + " has a number of victims from mass shootings of " + ((state.totalVictims/state.population).toFixed(2)) + " for every 1 million population in the period of 1982 - 2019",
				"width": 200,
				"wrap-text": true,
				"text-align": "left",
				"font-size": 18
			}
		};
		stateResults[stateName] = styleObject;
	});

	return {
		"background-color": "#FFF",
		"gui": {
			"watermark": {
				"position": "tr"
			}
		},
		"globals": {
			"font-family": "Open Sans Condensed",
			"shadow": false
		},
		"title": {
			"text": "Mass Shootings in the United States: 1982-2019",
			"background-color": "#FFF",
			"color": "#333",
			"font-size": 24,
			"text-align": "left",
			"x": 10,
			"y": 10
		},
		"subtitle": {
			"text": "data from Mother Jones*",
			"font-size": 16,
			"color": "#333",
			"text-align": "left",
			"x": 10,
			"y": 40
		},
		"legend": {
			"toggle-action": "none",
			"offset-y": -10,
			"border-width": 0,
			"background-color": "none",
			"vertical-align": "bottom",
			"marker": {
				"type": "rectangle",
				"width": 20,
				"height": 10,
			},
			"item": {
				"font-size": 16
			}
		},
		"series": [ // render legend items
			{
				"legend-item": {
					"text": "under 10"
				},
				"legend-marker": {
					"background-color": "#feebe2",
				}
			},
			{
				"legend-item": {
					"text": "10 - 20"
				},
				"legend-marker": {
					"background-color": "#fcc5c0",
				}
			},
			{
				"legend-item": {
					"text": "20 - 40"
				},
				"legend-marker": {
					"background-color": "#fa9fb5",
				}
			},
			{
				"legend-item": {
					"text": "40 - 60"
				},
				"legend-marker": {
					"background-color": "#f768a1",
				}
			},
			{
				"legend-item": {
					"text": "60 - 100"
				},
				"legend-marker": {
					"background-color": "#dd3497",
				}
			},
			{
				"legend-item": {
					"text": "100 - 200"
				},
				"legend-marker": {
					"background-color": "#ae017e",
				}
			},
			{
				"legend-item": {
					"text": "above 200"
				},
				"legend-marker": {
					"background-color": "#7a0177",
				}
			}
		],
		"shapes": [ // render map
			{
				"type": "zingchart.maps",
				"options": {
					"y": 40,
					"id": "map",
					"name": "usa",
					"scale": true,
					"style": {
						"hover-state": {
							"background-color": "#FFF",
							"alpha": 0.3,
							"border-width": 3
						},
						"border-color": "#FFF",
						"items": stateResults
					}
				}
			}
		]
	}
}

// renders chart
zingchart.loadModules('maps, maps-usa', function (e) {
	zingchart.render({
		id: 'myChart',
		data: setResults(),
		height: '100%',
		width: '100%'
	});
});
async function loadJSON(path) {
	let response = await fetch(path);
	let dataset = await response.json(); // Now available in global scope
	return dataset;
}
function init() {
	shootingFile = loadJSON('./data.json');
	shootingFile.then(function (shootings) {
		plotPieAttr(shootings);
		plotBarAttr(shootings);
		plotAreaChart();
	});
}
document.addEventListener('DOMContentLoaded', init, false);

