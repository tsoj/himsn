"use strict";

this.name 			= "himsn_escort_ai";
this.author         = "Pleb";
this.copyright      = "(C) 2014 Pleb.";
this.licence        = "CC-NC-by-SA 4.0";
this.version 		= "0.8-alpha";

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
			condition: this.conditionScannerContainsHostilePlayer, 
			configuration: ai.configurationAcquireScannedTarget,
			behaviour: this.behaviourDestroyPlayerIfHostileToNavy,
			reconsider: 5
		},
		{
			condition: ai.conditionMothershipInCombat,
			truebranch: [
				{
					condition: ai.conditionMothershipUnderAttack,
					configuration: ai.configurationAcquireDefensiveEscortTarget,
					behaviour: ai.behaviourRepelCurrentTarget,
					reconsider: 5
				},
				{
					condition: ai.conditionMothershipIsAttacking,
					configuration: ai.configurationAcquireOffensiveEscortTarget,
					behaviour: this.behaviourTakeHostileAction,
					reconsider: 5
				},
				{
					behaviour: ai.behaviourRejoinMothership,
					reconsider: 5
				}
			]
		},
		{
			condition: ai.conditionIsEscorting,
			truebranch: [
				{
					behaviour: ai.behaviourEscortMothership,
					reconsider: 30
				}
			],
			falsebranch: [
				{
					configuration: ai.configurationSetDestinationToWitchpoint,
					behaviour: ai.behaviourApproachDestination,
					reconsider: 30
				}
			]
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
	this.behaviourDestroyCurrentTarget();
}

this.conditionScannerContainsHostileIntruder = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.isThargoid && s.scanClass != "CLASS_CARGO" && s.scanClass != "CLASS_ROCK" && s.scanClass != "CLASS_BUOY" && s.scanClass != "CLASS_MILITARY";
	});
}

this.conditionScannerContainsHostilePlayer = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.scanClass == "CLASS_PLAYER" && missionVariables.himsn_status == "HOSTILE";
	});
}

this.behaviourDestroyPlayerIfHostileToNavy = function()
{
	if (missionVariables.himsn_status == "HOSTILE")
	{
		this.behaviourDestroyCurrentTarget();
	}
}