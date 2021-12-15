"use strict";

this.name 			= "himsn_station_dock";
this.author         = "Pleb";
this.copyright      = "(C) 2014 Pleb.";
this.licence        = "CC-NC-by-SA 4.0";
this.version 		= "0.8-alpha";

this.acceptDockingRequestFrom = function(ship)
{
	if (ship.isPlayer)
	{
		if (missionVariables.conhunt == "MISSION_COMPLETE" && missionVariables.thargplans == "MISSION_COMPLETE")
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
		return true;
	}
}