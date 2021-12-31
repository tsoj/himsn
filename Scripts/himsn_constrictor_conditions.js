"use strict";

this.name           = "himsn_constrictor_conditions";
this.author         = "Pleb";
this.copyright      = "(C) 2014 Pleb.";
this.licence        = "CC-NC-by-SA 4.0";
this.description    = "This is the conditions script for the HIMSN Constrictor.";
this.version        = "0.9-alpha";

this.allowSpawnShip = function(shipKey)
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