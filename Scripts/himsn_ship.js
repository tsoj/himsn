"use strict";

this.name 			= "himsn_ship";
this.author         = "Pleb";
this.copyright      = "(C) 2014 Pleb.";
this.licence        = "CC-NC-by-SA 4.0";
this.version 		= "0.9-alpha";

this.shipSpawned = function ()
{
	this.ship.awardEquipment("EQ_FUEL_SCOOPS");
	this.ship.awardEquipment("EQ_HEAT_SHIELD");
	
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