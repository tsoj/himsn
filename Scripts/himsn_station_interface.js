"use strict";

this.name           = "himsn_station_interface";
this.author         = "Tsoj";
this.copyright      = "(C) 2021 Tsoj.";
this.licence        = "CC-NC-by-SA 4.0";
this.description    = "This is the script for station interfaces for the HIMSN OXZ.";
this.version        = "0.8-alpha";

this._timeToFirstWarning = 120; // seconds
this._timeToForcedLaunch = 180; // seconds

this._leaveTimer = null;

this._assert = function(condition, message) {
	if(!condition)
    	log("HIMSN", "ERROR, condition failed: " + message);
}

this._stopLeaveTimer = function(){
	if(this._leaveTimer){
		this._leaveTimer.stop();
		delete this._leaveTimer;
	}
}

this._startLeaveTimer = function(f, t){
	this._stopLeaveTimer();
	this._leaveTimer = new Timer(this, f, t);
}

this._isAtHIMSNStation = function(){
    return player.ship.docked && (
        player.ship.dockedStation.hasRole("himsn_komodo_carrier") ||
        player.ship.dockedStation.hasRole("himsn_station")
    );
}

this._forcedStationLaunch = function() {
	player.bounty += 40;
	mission.runScreen({
		titleKey: "HIMSN_forced_launch_title",
		messageKey: "HIMSN_forced_launch_message",
	}, function(){
		player.ship.launch();
	});
}

this._warningLeaveStation = function(){
	mission.runScreen({
		titleKey: "HIMSN_warning_title",
		messageKey: "HIMSN_warning_message",
		choicesKey: "HIMSN_stay_or_leave"
	}, function (choice){
		if(choice === "HIMSN_stay"){
			this._startLeaveTimer(this._forcedStationLaunch.bind(this), this._timeToForcedLaunch);
		}
		if(choice === "HIMSN_leave"){
			player.ship.launch();
		}
	});
}

this._generateAlienItemPrice = function() {
	let result = {
		price: 100.0,
		isSpecial: false
	};

	if(Math.random() <= 0.05) {
		result.price += (500 + Math.round(4500 * Math.random()))/10;
		result.isSpecial = true;
	}

	return result;
}

this._runMarketScreen = function() {

	const numAlienItems = player.ship.manifest.alien_items;

	const optionPrefix = "HIMSN_option_";

	let options = {};
	for(let i = 1; i < Math.min(10000, numAlienItems); i*=10) {
		options[optionPrefix + i] = "Sell " + i + " alien items";
	}
	if(numAlienItems > 0 && !options[optionPrefix + numAlienItems])
		options[optionPrefix + numAlienItems] = "Sell " + numAlienItems + " alien items";

	mission.runScreen({
		titleKey: "HIMSN_market_title",
		message: expandMissionText("HIMSN_market_message", {num_alien_items: numAlienItems}),
		choices: options,
		allowInterrupt: true
	}, function (text){
		this._assert(text.indexOf(optionPrefix) !== -1, "Options keys all should begin with the option prefix.")
		let x = text.replace(optionPrefix, "");
		
		this._assert(!isNaN(x), "Should be a number: " + x);
		this._assert(x > 0, "Should be only possible to sell positive amounts of alien items.");

		this._startLeaveTimer(this._warningLeaveStation.bind(this), this._timeToFirstWarning);

		const soldAlienItems = Math.min(Math.floor(x), numAlienItems);

		let earnedCredits = 0;
		let numSoldSpecialItems = 0;
		for(let i = 0; i<soldAlienItems; i++){
			const p = this._generateAlienItemPrice();
			earnedCredits += p.price;
			if(p.isSpecial)
				numSoldSpecialItems += 1;
		}
		this._assert(earnedCredits >= 0, "Player shouldn't lose credits by selling alien items.");

		player.ship.manifest.alien_items -= soldAlienItems;
		player.credits += earnedCredits;
		
		mission.runScreen({
			titleKey: "HIMSN_market_title",
			message: expandMissionText("HIMSN_sold_alien_items_message", {
				sold_alien_items: soldAlienItems,
				num_sold_special_items: numSoldSpecialItems,
				earned_credits: earnedCredits
			}),
			allowInterrupt: true
		}, function(){
			this._runMarketScreen();
		});
	});
}

this._runShipyardScreen = function(){
	mission.runScreen({
		titleKey: "HIMSN_shipyard_title",
		messageKey: "HIMSN_shipyard_restricted_message",
		allowInterrupt: true
	});
}

this._runSystemScreen = function(){
	mission.runScreen({
		titleKey: "HIMSN_interfaces_title",
		messageKey: "HIMSN_interfaces_restricted_message",
		allowInterrupt: true
	});
}

this.guiScreenChanged = function () {
    if(this._isAtHIMSNStation()) {
        if (guiScreen === "GUI_SCREEN_MARKET" || guiScreen == "GUI_SCREEN_MARKETINFO")
            this._runMarketScreen();
        if (guiScreen === "GUI_SCREEN_SHIPYARD" || guiScreen === "GUI_SCREEN_EQUIP_SHIP")
            this._runShipyardScreen();
        if (guiScreen === "GUI_SCREEN_INTERFACES")
            this._runSystemScreen();
    }
}

this.shipWillLaunchFromStation = function() {
    if(this._isAtHIMSNStation()) {
        this._startLeaveTimer();
    }
}

this.shipDockedWithStation = function () {
    if(this._isAtHIMSNStation()) {
        mission.runScreen({
            titleKey: "HIMSN_welcome_title",
            messageKey: "HIMSN_welcome_message",
            choicesKey: "HIMSN_stay_or_leave",
        }, function (choice){
            if(choice === "HIMSN_stay"){
                this._startLeaveTimer(this._warningLeaveStation.bind(this), this._timeToFirstWarning);
            }
            if(choice === "HIMSN_leave"){
                player.ship.launch();
            }
        });
    }
}

this.startUpComplete = function() {
    if(this._isAtHIMSNStation()) {
	    this._startLeaveTimer(this._warningLeaveStation.bind(this), this._timeToFirstWarning);
    }
}