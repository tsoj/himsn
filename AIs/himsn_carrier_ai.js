"use strict";

this.name 			= "himsn_carrier_ai";
this.author         = "Pleb";
this.copyright      = "(C) 2014 Pleb.";
this.licence        = "CC-NC-by-SA 4.0";
this.version 		= "0.8-alpha";

this.aiStarted = function() 
{
	var ai = new worldScripts["oolite-libPriorityAI"].PriorityAIController(this.ship);

	ai.setCommunicationsRole("himsn_carrier");
	
	ai.setParameter("oolite_flag_markOffenders",true);
	
	worldScripts["oolite-libPriorityAI"]._setCommunications({
		"himsn_carrier": {
			generic: {
				oolite_attackLowEnergy: "[himsn_carrier_attackLowEnergy]",
				oolite_beginningAttack: "[himsn_carrier_beginningAttack]",
				oolite_beginningAttackThargoid: "[himsn_carrier_beginningAttackThargoid]",
				oolite_continuingAttack: "[himsn_carrier_continuingAttack]",
				oolite_continuingAttackThargoid: "[himsn_carrier_continuingAttackThargoid]",
				oolite_firedMissile: "[himsn_carrier_firedMissile]",
				oolite_friendlyFire: "[himsn_carrier_friendlyFire]",
				oolite_hitTarget: "[himsn_carrier_hitTarget]",
				oolite_incomingMissile: "[himsn_carrier_incomingMissile]",
				oolite_killedTarget: "[himsn_carrier_killedTarget]",
				oolite_quiriumCascade: "[himsn_carrier_quiriumCascade]",
				oolite_thanksForHelp: "[himsn_carrier_thanksForHelp]",
				oolite_thargoidAttack: "[himsn_carrier_thargoidAttack]",
				oolite_makePirateDemand: "[himsn_carrier_alertFriendlyIntruder]",
				oolite_launchMiner: "[himsn_carrier_warnFriendlyIntruder]"
			}
		}
	});

	ai.setWaypointGenerator(ai.waypointsSpacelanePatrol);

	ai.setPriorities([
		{
			condition: ai.conditionInCombat,
			configuration: ai.configurationAcquireCombatTarget,
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
			condition: this.conditionScannerContainsHostilePlayerIntruder, 
			configuration: ai.configurationAcquireScannedTarget,
			behaviour: this.behaviourTakeHostileAction,
			reconsider: 5
		},
		{
			condition: this.conditionScannerContainsFriendlyNPCIntruder, 
			configuration: ai.configurationAcquireScannedTarget,
			behaviour: this.behaviourMakeFriendlyNPCFleeCarrier,
			reconsider: 5
		},
		/*{
			condition: this.conditionScannerContainsFriendlyPlayerIntruder, 
			truebranch: [
				{
					configuration: ai.configurationAcquireScannedTarget,
					behaviour: this.behaviourCarrierAlertFriendlyPlayerIntruder,
					reconsider: 15
				}
			],
			falsebranch: [
				{
					condition: this.conditionFriendlyPlayerIntruderLeft,
					behaviour: this.behaviourCarrierFriendlyPlayerIntruderReset,
					reconsider: 5
				}
			]
		},*/
		{
			condition: ai.conditionInInterstellarSpace,
			truebranch: ai.templateWitchspaceJumpOutbound(),
			reconsider: 10
		},
		{
			condition: ai.conditionPatrolIsOver,
			truebranch: ai.templateWitchspaceJumpOutbound()
		},
		{
			condition: ai.conditionHasWaypoint,
			configuration: ai.configurationSetDestinationToWaypoint,
			behaviour: ai.behaviourApproachDestination,
			reconsider: 30
		},
		{
			configuration: ai.configurationSetWaypoint,
			behaviour: ai.behaviourApproachDestination,
			reconsider: 30
		}
	]);
}

this.behaviourTakeHostileAction = function()
{
	if (this.ship.target.scanClass == "CLASS_PLAYER")
	{
		missionVariables.himsn_status = "HOSTILE";
		missionVariables.himsn_status_timer = clock.adjustedSeconds + Math.floor(60*86400);
	}
	this.ship.launchDefenseShip();
	this.behaviourDestroyCurrentTarget();
}

this.conditionScannerContainsHostileIntruder = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.isThargoid && s.scanClass != "CLASS_CARGO" && s.scanClass != "CLASS_ROCK" && s.scanClass != "CLASS_BUOY" && s.scanClass != "CLASS_MILITARY";
	});
}

this.conditionScannerContainsFriendlyNPCIntruder = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.scanClass != "CLASS_THARGOID" && s.scanClass != "CLASS_PLAYER" && s.scanClass != "CLASS_CARGO" && s.scanClass != "CLASS_ROCK" && s.scanClass != "CLASS_BUOY" && s.scanClass != "CLASS_MILITARY";
	});
}

this.conditionScannerContainsFriendlyPlayerIntruder = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.scanClass == "CLASS_PLAYER" && missionVariables.himsn_status != "HOSTILE";
	});
}

this.conditionScannerContainsHostilePlayerIntruder = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.scanClass == "CLASS_PLAYER" && missionVariables.himsn_status == "HOSTILE";
	});
}

this.behaviourMakeFriendlyNPCFleeCarrier = function()
{
	this.ship.target.destination = this.ship.target.position.add(this.ship.target.vectorForward.multiply(50000));
	this.ship.target.desiredRange = 1000;
	this.ship.target.desiredSpeed = 7 * this.ship.target.maxSpeed;
	this.ship.target.performFlyToRangeFromDestination();
}

this.behaviourCarrierAlertFriendlyPlayerIntruder = function()
{
	if (!this.friendlyPlayerIntruderDetected && !this.friendlyPlayerIntruderWarned)
	{
		var target = this.ship.target;
		this.communicate("oolite_makePirateDemand",target,1);
		this.friendlyPlayerIntruderDetected = true;
		this.friendlyPlayerIntruderWarned = true;
	}
	else
	{
		if (!this.friendlyPlayerIntruderNowHostile)
		{
			var target = this.ship.target;
			this.communicate("oolite_launchMiner",target,1);
			this.friendlyPlayerIntruderNowHostile = true;
		}
		else
		{
			if (this.ship.escortGroup)
			{
				for (var i = 0 ; i < this.ship.escortGroup.ships.length ; i++)
				{
					this.ship.escortGroup.ships[i].target == this.ship.target;
					this.ship.escortGroup.ships[i].performAttack();
				}
			}
			this.ship.launchDefenseShip();
			this.behaviourDestroyCurrentTarget();
			missionVariables.himsn_status = "HOSTILE";
			missionVariables.himsn_status_timer = clock.adjustedSeconds + Math.floor(60*86400);
		}
	}
}

this.conditionFriendlyPlayerIntruderLeft = function()
{
	if (this.friendlyPlayerIntruderDetected)
	{
		return true;
	}
	else
	{
		return false;
	}
}

this.behaviourCarrierFriendlyPlayerIntruderReset = function()
{
	this.friendlyPlayerIntruderDetected = null;
	this.friendlyPlayerIntruderWarned = null;
}