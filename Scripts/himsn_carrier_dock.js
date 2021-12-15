"use strict";

this.name 			= "himsn_carrier_dock";
this.author         = "Pleb";
this.copyright      = "(C) 2014 Pleb.";
this.licence        = "CC-NC-by-SA 4.0";
this.version 		= "0.701";

this.shipSpawned = function ()
{
	this.ship.allowsDocking = true;
}

this.acceptDockingRequestFrom = function(ship)
{
	if (ship.isPlayer)
	{
		return false;
	}
	else
	{
		return true;
	}
}