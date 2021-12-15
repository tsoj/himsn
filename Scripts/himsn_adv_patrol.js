"use strict";

this.name 			= "himsn_adv_patrol";
this.author         = "Pleb";
this.copyright      = "(C) 2014 Pleb.";
this.licence        = "CC-NC-by-SA 4.0";
this.version 		= "0.701";

this._generateDestination = function ()
{
	var thisSystem = system.info;
	var targetSystems = SystemInfo.systemsInRange(7);
	if (!targetSystems) return system.ID;
	var count = targetSystems.length;
	var targetSystem = targetSystems[Math.floor(Math.random()*count)];
	var realDistance = System.infoForSystem(galaxyNumber, targetSystem.systemID).routeToSystem(thisSystem).distance;
	var i = 0;
	while ((!realDistance || realDistance > 7) && i<count)
	{
		targetSystem = targetSystems[i++];
		realDistance = System.infoForSystem(galaxyNumber, targetSystem.systemID).routeToSystem(thisSystem).distance;
	}
	return targetSystem.systemID;
}

this.shipSpawned = function ()
{
	if (!missionVariables.himsn_adv_patrol_mission)
	{
		this.ship.destinationSystem = this._generateDestination();
		missionVariables.himsn_adv_patrol_dest = this.ship.destinationSystem;
		missionVariables.himsn_adv_patrol_home = this.ship.homeSystem;
		if (Math.random() < 0.5)
		{
			missionVariables.himsn_adv_patrol_mission = 0;
		}
		else
		{
			missionVariables.himsn_adv_patrol_mission = 1;
		}
		this.ship.awardEquipment("EQ_FUEL_SCOOPS");
		this.ship.awardEquipment("EQ_HEAT_SHIELD");
	}
	else
	{
		this.ship.destinationSystem = missionVariables.himsn_adv_patrol_dest;
		this.ship.homeSystem = missionVariables.himsn_adv_patrol_home;
	}
	
	// Use Escort Formations OXP if installed for random flight formations:
	if (worldScripts["Escort Formations Randomiser"])
	{
		worldScripts["Escort Formations Randomiser"].$setupDefensiveEscorts(this.ship);
	}
}

this.helpRequestReceived = function(ally, enemy)
{
	this.ship.destination = ally.position;
	this.ship.target = enemy;
	this.ship.performAttack();
}

this.shipBeingAttacked = function(whom)
{
	if (whom.scanClass != "CLASS_MILITARY")
	{
		this.ship.target = whom;
		this.ship.requestHelpFromGroup();
		system.filteredEntities(this, function (entity)
		{
			if (entity.scanClass == "CLASS_MILITARY")
			{
				entity.target = whom;
				entity.performAttack();
			}
			if (entity.isStation && entity.hasRole("himsn_station"))
			{
				entity.alertCondition = 3;
				entity.launchDefenseShip();
			}
		});
	}
}