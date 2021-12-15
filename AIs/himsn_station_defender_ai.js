"use strict";

this.name 			= "himsn_station_defender_ai";
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

	ai.setWaypointGenerator(this.waypointsHomeBasePatrol);

	ai.setPriorities([
		{
			condition: ai.conditionInCombat,
			configuration: ai.configurationAcquireCombatTarget,
			behaviour: this.behaviourTakeHostileAction,
			reconsider: 5
		},
		{
			preconfiguration: ai.configurationCheckScanner,
			condition: this.conditionScannerContainsAttackerOfGuardedShip, 
			configuration: ai.configurationAcquireScannedTarget,
			behaviour: this.behaviourTakeHostileAction,
			reconsider: 5
		},
		{
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
			condition: this.conditionScannerContainsFriendlyIntruder, 
			truebranch: [
				{
					condition: this.conditionPatrolIsGuardingScannedTarget, 
					configuration: ai.configurationAcquireScannedTarget,
					behaviour: ai.behaviourGuardTarget,
					reconsider: 5
				},
				{
					condition: this.conditionPatrolShouldBeGuardingScannedTarget, 
					configuration: this.configurationStartGuardingScannedTarget, 
					behaviour: ai.behaviourGuardTarget,
					reconsider: 5
				}
			]
		},
		{
			condition: this.conditionHomeBaseIntact, 
			truebranch: [
				{
					condition: ai.conditionHasWaypoint,
					configuration: ai.configurationSetDestinationToWaypoint,
					behaviour: ai.behaviourApproachDestination,
					reconsider: 30
				},
				{
					condition: ai.conditionPatrolIsOver,
					truebranch: [
					{
						condition: ai.conditionHasSelectedStation,
						truebranch: [
							{
								condition: ai.conditionSelectedStationNearby,
								configuration: ai.configurationSetSelectedStationForDocking,
								behaviour: ai.behaviourDockWithStation,
								reconsider: 30
							},
							{
								configuration: ai.configurationSetDestinationToSelectedStation,
								behaviour: ai.behaviourApproachDestination,
								reconsider: 30
							}
						],
						falsebranch: [
							{
								configuration: this.configurationSelectHomeBaseAsSelectedStation, 
								behaviour: ai.behaviourReconsider
							}
						]
					}
				  ]
				},
				{
					configuration: ai.configurationSetWaypoint,
					behaviour: ai.behaviourApproachDestination,
					reconsider: 30
				}
			],
		},
		{
			condition: ai.conditionFriendlyStationExists,
			truebranch: ai.templateReturnToBase(),
			falsebranch: ai.templateWitchspaceJumpAnywhere()
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

this.waypointsHomeBasePatrol = function()
{
	this.homeBase = null;
	system.filteredEntities(this, function (entity)
	{
		if (entity.isStation)
		{
			if (entity.hasRole("himsn_station"))
			{
				this.homeBase = entity;
			}
		}
	});
	if (!this.homeBase)
	{
		this.setParameter("oolite_waypoint",new Vector3D(0,0,0));
		this.setParameter("oolite_waypointRange",7500);
		return;
	}
	var z = this.homeBase.vectorForward;
	var tmp = new Vector3D(0,1,0);
	if (system.sun)
	{
		tmp = z.cross(system.sun.position.direction());
	}
	var x = z.cross(tmp);
	var y = z.cross(x);
	
	var waypoints = [
		this.homeBase.position.add(x.multiply(7500)),
		this.homeBase.position.add(y.multiply(7500)),
		this.homeBase.position.add(x.multiply(-7500)),
		this.homeBase.position.add(y.multiply(-7500))
	];
	
	var waypoint = waypoints[0];
	for (var i=0;i<=3;i++)
	{
		if (this.distance(waypoints[i]) < 500)
		{
			waypoint = waypoints[(i+1)%4];
			break;
		}
	}
	this.setParameter("oolite_waypoint",waypoint);
	this.setParameter("oolite_waypointRange",100);
}

this.conditionScannerContainsAttackerOfGuardedShip = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.target && s.hasHostileTarget && s.target.hasRole("himsn_station");
	});
}

this.conditionScannerContainsHostileIntruder = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.isThargoid && s.scanClass != "CLASS_CARGO" && s.scanClass != "CLASS_ROCK" && s.scanClass != "CLASS_BUOY" && s.scanClass != "CLASS_MILITARY";
	});
}

this.conditionScannerContainsFriendlyIntruder = function()
{
	return this.checkScannerWithPredicate(function(s) { 
		return s.bounty < 51 && s.scanClass != "CLASS_THARGOID" && s.scanClass != "CLASS_ROCK" && s.scanClass != "CLASS_CARGO" && s.scanClass != "CLASS_MILITARY";
	});
}

this.conditionPatrolIsGuardingScannedTarget = function()
{
	if (this.ship.target)
	{
		if (this.ship.destination == this.ship.target.position)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}

this.conditionPatrolShouldBeGuardingScannedTarget = function()
{
	this.homeBase = null;
	system.filteredEntities(this, function (entity)
	{
		if (entity.isStation)
		{
			if (entity.hasRole("himsn_station"))
			{
				this.homeBase = entity;
			}
		}
	});
	if (this.ship.target == this.getParameter("oolite_scanResultSpecific"))
	{
		if (this.ship.target.position.distanceTo(this.homeBase.position) <= 15000)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
	else
	{
		return false;
	}
}

this.configurationStartGuardingScannedTarget = function()
{
	this.ship.target = this.getParameter("oolite_scanResultSpecific");
	this.ship.destination = this.ship.target.position;
	this.ship.desiredSpeed = this.cruiseSpeed();
	this.ship.desiredRange = 2500;
	this.behaviourApproachDestination();
}

this.conditionHomeBaseIntact = function()
{
	this.homeBase = null;
	system.filteredEntities(this, function (entity)
	{
		if (entity.isStation)
		{
			if (entity.hasRole("himsn_station"))
			{
				this.homeBase = entity;
			}
		}
	});
	if (this.homeBase && this.distance(this.homeBase) < this.scannerRange)
	{
		return true;
	}
	else
	{
		return false;
	}
}

this.configurationSelectHomeBaseAsSelectedStation = function()
{
	this.setParameter("oolite_selectedStation",this.homeBase);
	this.communicate("oolite_selectedStation",this.homeBase,4);
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