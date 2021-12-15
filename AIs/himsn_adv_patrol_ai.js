"use strict";

this.name 			= "himsn_adv_patrol_ai";
this.author         = "Pleb";
this.copyright      = "(C) 2014 Pleb.";
this.licence        = "CC-NC-by-SA 4.0";
this.version 		= "0.8";

this.aiStarted = function() 
{
	var ai = new worldScripts["oolite-libPriorityAI"].PriorityAIController(this.ship);

	ai.setCommunicationsRole("himsn_fighter");
	
	ai.setParameter("oolite_flag_markOffenders",true);
	
	worldScripts["oolite-libPriorityAI"]._setCommunications({
		"himsn_fighter": {
			generic: {
				oolite_attackLowEnergy: "[himsn_fighter_attackLowEnergy]",
				oolite_beginningAttack: "[himsn_fighter_beginningAttack]",
				oolite_beginningAttackThargoid: "[himsn_fighter_beginningAttackThargoid]",
				oolite_continuingAttack: "[himsn_fighter_continuingAttack]",
				oolite_continuingAttackThargoid: "[himsn_fighter_continuingAttackThargoid]",
				oolite_eject: "[himsn_fighter_eject]",
				oolite_firedMissile: "[himsn_fighter_firedMissile]",
				oolite_friendlyFire: "[himsn_fighter_friendlyFire]",
				oolite_hitTarget: "[himsn_fighter_hitTarget]",
				oolite_incomingMissile: "[himsn_fighter_incomingMissile]",
				oolite_killedTarget: "[himsn_fighter_killedTarget]",
				oolite_quiriumCascade: "[himsn_fighter_quiriumCascade]",
				oolite_thanksForHelp: "[himsn_fighter_thanksForHelp]",
				oolite_thargoidAttack: "[himsn_fighter_thargoidAttack]"
			}
		}
	});

	ai.setWaypointGenerator(ai.waypointsSpacelanePatrol);
	
	var common = [
		{
			label: "combat",
			condition: ai.conditionInCombat,
			configuration: ai.configurationAcquireCombatTarget,
			behaviour: this.behaviourTakeHostileAction,
			reconsider: 5
		},
		{
			label: "look for hostile npc",
			preconfiguration: ai.configurationCheckScanner,
			condition: this.conditionScannerContainsHostileIntruder, 
			configuration: ai.configurationAcquireScannedTarget,
			behaviour: this.behaviourTakeHostileAction,
			reconsider: 5
		},
		{
			label: "look for hostile player",
			condition: this.conditionScannerContainsHostilePlayer, 
			configuration: ai.configurationAcquireScannedTarget,
			behaviour: this.behaviourTakeHostileAction,
			reconsider: 5
		}
	];
	var returnToBase = [
		{
			label: "return to base",
			configuration: this.configurationFindBase,
			behaviour: ai.behaviourApproachDestination,
			reconsider: 5
		},
		{
			condition: this.conditionSelectedStationNearby,
			configuration: this.configurationSetSelectedStationForDocking,
			behaviour: this.behaviourDockWithStation,
			reconsider: 5
		},
	];
	var beginMission;
	if (missionVariables.himsn_adv_patrol_mission == 0)
	{
		beginMission = [
			{
				label: "begin patrol #1",
				condition: ai.conditionHasWaypoint,
				configuration: ai.configurationSetDestinationToWaypoint,
				behaviour: ai.behaviourApproachDestination,
				reconsider: 5
			},
			{
				label: "begin patrol #2",
				configuration: ai.configurationSetWaypoint,
				behaviour: ai.behaviourApproachDestination,
				reconsider: 5
			}
		];
	}
	else 
	{
		beginMission = [
			{
				label: "add ship to escort",
				condition: this.checkIfSystemHasShipToEscort,
				configuration: this.addShipToEscort,
				reconsider: 5
			},
			{
				label: "follow escort ship",
				preconfiguration: ai.configurationCheckScanner,
				condition: this.conditionScannerContainsEscortShip, 
				configuration: ai.configurationAcquireScannedTarget,
				behaviour: ai.behaviourFollowCurrentTarget,
				reconsider: 5
			},
		];
	}
	var specific;
	if (this.ship.homeSystem == this.ship.destinationSystem)
	{
		specific = [
			{
				label: "local patrol",
				condition: ai.conditionGroupAttritionReached,
				truebranch: returnToBase,
				falsebranch: beginMission
			}
		];
	}
	else if (this.ship.homeSystem == system.ID && this.ship.fuel == 7)
	{
		label: "leave home system",
		specific = ai.templateWitchspaceJumpOutbound().concat(returnToBase);
	}
	else if (this.ship.homeSystem == system.ID)
	{
		label: "return to base",
		specific = returnToBase;
	}
	else if (system.ID != this.ship.homeSystem && system.ID != this.ship.destinationSystem)
	{
		specific = [
			{
				label: "not in home or destination system",
				condition: ai.conditionGroupAttritionReached,
				truebranch: ai.templateWitchspaceJumpInbound(),
				falsebranch: ai.templateWitchspaceJumpOutbound()
			}
		];
	}
	else
	{
		specific = [
			{
				label: "destination reached #1",
				condition: ai.conditionGroupAttritionReached,
				truebranch: ai.templateWitchspaceJumpInbound()
			},
			{
				label: "destination reached #2",
				condition: ai.conditionInInterstellarSpace,
				truebranch: ai.templateWitchspaceJumpInbound(),
				falsebranch: beginMission
			}
		];
	}

	var fallback = ai.templateWitchspaceJumpAnywhere();

	var priorities = common.concat(specific).concat(fallback);
	
	//ai.setParameter("oolite_flag_behaviourLogging",true);
	
	ai.setPriorities(priorities);
}

this.behaviourTakeHostileAction = function()
{
	if (this.ship.target && this.ship.target.scanClass == "CLASS_PLAYER")
	{
		if (missionVariables.himsn_status != "HOSTILE")
		{
			missionVariables.himsn_status = "HOSTILE";
			missionVariables.himsn_status_timer = clock.adjustedSeconds + Math.floor(60*86400);
		}
	}
	this.behaviourDestroyCurrentTarget();
}

this.conditionScannerContainsHostileIntruder = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.isThargoid && s.scanClass != "CLASS_CARGO" && s.scanClass != "CLASS_ROCK" && s.scanClass != "CLASS_BUOY" && s.scanClass != "CLASS_MILITARY";
	});
}

this.conditionScannerContainsEscortShip = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.hasRole("himsn_logistics_transport");
	});
}

this.checkIfSystemHasShipToEscort = function()
{
	if (system.countShipsWithRole("himsn_logistics_transport") == 0)
	{
		return true;
	}
	else
	{
		return false;
	}
}

this.addShipToEscort = function()
{
	worldScripts["himsn_main"]._addAdvEscort();
}

this.conditionScannerContainsHostilePlayer = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.scanClass == "CLASS_PLAYER" && missionVariables.himsn_status == "HOSTILE";
	});
}

this.configurationFindBase = function()
{
	var homeStation = null;
	system.filteredEntities(this, function (entity)
	{
		if (entity.isStation && entity.hasRole("himsn_station"))
		{
			homeStation = entity;
		}
	});
	this.setParameter("oolite_selectedStation",homeStation);
	this.configurationSetDestinationToSelectedStation();
}