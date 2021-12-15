"use strict";

this.name 			= "himsn_station_ai";
this.author         = "Pleb";
this.copyright      = "(C) 2014 Pleb.";
this.licence        = "CC-NC-by-SA 4.0";
this.version 		= "0.701";

this.aiStarted = function() 
{
	var ai = new worldScripts["oolite-libPriorityAI"].PriorityAIController(this.ship);

	ai.setCommunicationsRole("himsn_station");
	
	ai.setParameter("oolite_flag_markOffenders",true);
	
	worldScripts["oolite-libPriorityAI"]._setCommunications({
		"himsn_station": {
			generic: {
				oolite_launchDefenseShips: "[himsn_station_launchDefenseShips]",
				oolite_makePirateDemand: "[himsn_station_alertFriendlyIntruder]",
				oolite_launchMiner: "[himsn_station_warnFriendlyIntruder]"
			}
		}
	});

	ai.setParameter("oolite_friendlyRoles",["himsn_defender","himsn_cruiser"]);

	ai.setPriorities([
		{
			preconfiguration: ai.configurationStationValidateTarget,
			condition: ai.conditionInCombat,
			behaviour: this.behaviourTakeHostileAction,
			reconsider: 5
		},
		{
			preconfiguration: ai.configurationCheckScanner,
			condition: this.conditionScannerContainsHostileIntruder, 
			configuration: ai.configurationAcquireScannedTarget,
			behaviour: this.behaviourTakeHostileAction,
			reconsider: 5
		},
		{
			condition: this.conditionScannerContainsFriendlyIntruder, 
			truebranch: [
				{
					configuration: ai.configurationAcquireScannedTarget,
					behaviour: this.behaviourStationAlertFriendlyIntruder,
					reconsider: 15
				}
			],
			falsebranch: [
				{
					condition: this.conditionFriendlyIntruderLeft,
					behaviour: this.behaviourStationFriendlyIntruderReset,
					reconsider: 5
				}
			]
		},
		{
			configuration: ai.configurationStationReduceAlertLevel,
			behaviour: ai.behaviourStationManageTraffic,
			reconsider: 5
		}
	]);
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
	this.behaviourStationLaunchDefenseShips();
}

this.conditionScannerContainsHostileIntruder = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return (s.bounty > 50 || s.isThargoid) && s.scanClass != "CLASS_CARGO" && s.scanClass != "CLASS_ROCK" && s.scanClass != "CLASS_BUOY" && s.scanClass != "CLASS_MILITARY";
	});
}

this.conditionScannerContainsFriendlyIntruder = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.bounty < 51 && s.scanClass != "CLASS_THARGOID" && s.scanClass != "CLASS_ROCK" && s.scanClass != "CLASS_CARGO" && s.scanClass != "CLASS_BUOY" && s.scanClass != "CLASS_MILITARY";
	});
}

this.behaviourStationAlertFriendlyIntruder = function()
{
	if (!this.friendlyIntruderDetected)
	{
		if (this.ship.target.scanClass == "CLASS_PLAYER")
		{
			if (missionVariables.himsn_status == "HOSTILE")
			{
				this.behaviourStationLaunchDefenseShips();
				return;
			}
			if (missionVariables.conhunt == "MISSION_COMPLETE" && missionVariables.thargplans == "MISSION_COMPLETE")
			{
				var target = this.ship.target;
				this.communicate("oolite_makePirateDemand",target,1);
				this.friendlyIntruderDetected = true;
			}
			else
			{
				if(!this.friendlyIntruderNowHostile)
				{
					var target = this.ship.target;
					this.communicate("oolite_launchMiner",target,1);
					this.friendlyIntruderNowHostile = true;
				}
				else
				{
					missionVariables.himsn_status = "HOSTILE";
					missionVariables.himsn_status_timer = clock.adjustedSeconds + Math.floor(60*86400);
					this.behaviourStationLaunchDefenseShips();
				}
			}
		}
		else
		{
			this.ship.target.destination = this.ship.target.position.add(this.ship.target.vectorForward.multiply(50000));
			this.ship.target.desiredRange = 1000;
			this.ship.target.desiredSpeed = 7 * this.ship.target.maxSpeed;
			this.ship.target.performFlyToRangeFromDestination();
		}
	}
}

this.conditionFriendlyIntruderLeft = function()
{
	if (this.friendlyIntruderDetected)
	{
		return true;
	}
	else
	{
		return false;
	}
}

this.behaviourStationFriendlyIntruderReset = function()
{
	this.friendlyIntruderDetected = null;
}