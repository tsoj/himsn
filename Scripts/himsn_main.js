this.name           = "himsn_main";
this.author         = "Pleb";
this.copyright      = "(C) 2014 Pleb.";
this.licence        = "CC-NC-by-SA 4.0";
this.description    = "This is the main worldscript for the HIMSN OXZ.";
this.version        = "0.8";

"use strict";

/**** Functions ****/

this._addAdvPatrol = function()
{
	this._addAdvPatrolSwitch = true;
}

this._addAdvPatrolShips = function(pos)
{
	var advPatrol = system.addShips("himsn_adv_patrol",1,pos,0);
	if (system.ID == missionVariables.himsn_adv_patrol_home) 
	{
		advPatrol.maxEscorts = Math.floor(Math.random() * (4 - 0 + 1) + 0);
	}
}

//TODO why is this never used?
this._addAdvEscort = function()
{
	var pos = system.locationFromCode("WITCHPOINT");
	system.addGroup("himsn_logistics_transport", 1, pos, 0);
}

this._launchAdvPatrol = function()
{
	if (system.ID == -1) return;
	var navyStat = null;
	system.filteredEntities(this, function (entity)
	{
		if (entity.isStation)
		{
			if (entity.hasRole("himsn_station"))
			{
				navyStat = entity;
			}
		}
	});
	if (navyStat)
	{
		navyStat.launchShipWithRole("himsn_adv_patrol", [true]);
		this._advPatrolTimer_3.stop();
		this._advPatrolTimer_3 = new Timer(this,this._launchAdvPatrol,900);
	}
}

//TODO why is this never used?
this._addNavyBattleFleet = function(pos)
{
	// Add Navy Carrier and defending fleet:
	var navyCarrier = system.addShips("himsn_komodo_carrier",1,pos,0)[0];
	var targetVector = system.mainPlanet.position.subtract(navyCarrier.position).direction();
	navyCarrier.orientation = targetVector.rotationTo([0,0,1]);
	navyCarrier.maxEscorts = 16;
	var navyCarrierSidewinders = system.addShips("himsn_escort",8,pos,500);
	var navyCarrierAsps = system.addShips("himsn_escort_asp",5,pos,500);
	var navyCarrierAnacondas = system.addShips("himsn_escort_anaconda",3,pos,500);
	navyCarrierSidewinders[0].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierSidewinders[0].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierSidewinders[0]);
	navyCarrierSidewinders[0].switchAI("himsn_escort_ai.js");
	navyCarrierSidewinders[1].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierSidewinders[1].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierSidewinders[1]);
	navyCarrierSidewinders[1].switchAI("himsn_escort_ai.js");
	navyCarrierSidewinders[2].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierSidewinders[2].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierSidewinders[2]);
	navyCarrierSidewinders[2].switchAI("himsn_escort_ai.js");
	navyCarrierSidewinders[3].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierSidewinders[3].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierSidewinders[3]);
	navyCarrierSidewinders[3].switchAI("himsn_escort_ai.js");
	navyCarrierSidewinders[4].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierSidewinders[4].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierSidewinders[4]);
	navyCarrierSidewinders[4].switchAI("himsn_escort_ai.js");
	navyCarrierSidewinders[5].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierSidewinders[5].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierSidewinders[5]);
	navyCarrierSidewinders[5].switchAI("himsn_escort_ai.js");
	navyCarrierSidewinders[6].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierSidewinders[6].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierSidewinders[6]);
	navyCarrierSidewinders[6].switchAI("himsn_escort_ai.js");
	navyCarrierSidewinders[7].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierSidewinders[7].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierSidewinders[7]);
	navyCarrierSidewinders[7].switchAI("himsn_escort_ai.js");
	navyCarrierAsps[0].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierAsps[0].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierAsps[0]);
	navyCarrierAsps[0].switchAI("himsn_escort_ai.js");
	navyCarrierAsps[1].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierAsps[1].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierAsps[1]);
	navyCarrierAsps[1].switchAI("himsn_escort_ai.js");
	navyCarrierAsps[2].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierAsps[2].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierAsps[2]);
	navyCarrierAsps[2].switchAI("himsn_escort_ai.js");
	navyCarrierAsps[3].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierAsps[3].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierAsps[3]);
	navyCarrierAsps[3].switchAI("himsn_escort_ai.js");
	navyCarrierAsps[4].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierAsps[4].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierAsps[4]);
	navyCarrierAsps[4].switchAI("himsn_escort_ai.js");
	navyCarrierAnacondas[0].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierAnacondas[0].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierAnacondas[0]);
	navyCarrierAnacondas[0].switchAI("himsn_escort_ai.js");
	navyCarrierAnacondas[1].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierAnacondas[1].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierAnacondas[1]);
	navyCarrierAnacondas[1].switchAI("himsn_escort_ai.js");
	navyCarrierAnacondas[2].orientation = targetVector.rotationTo([0,0,1]);
	navyCarrierAnacondas[2].primaryRole = "escort";
	navyCarrier.escortGroup.addShip(navyCarrierAnacondas[2]);
	navyCarrierAnacondas[2].switchAI("himsn_escort_ai.js");
}

this._addNavyHeadquarters = function(pos)
{
	// Add Navy Headquaters and defending fleet:
	navyStation = system.addShips("himsn_headquarters",1,pos,0)[0];
	var navyStationGroup = system.addGroup("himsn_defender",5,pos,8000);
	navyStationGroup.leader = navyStation;
	navyStationGroup.addShip(navyStation);
}

this._addNavySystemBase = function(pos)
{
	// Add Navy Sysytem Base and defending fleet:
	navyStation = system.addShips("himsn_system_base",1,pos,0)[0];
	var targetVector = system.mainPlanet.position.subtract(navyStation.position).direction();
	navyStation.orientation = targetVector.rotationTo([0,0,1]);
	var navyStationGroup = system.addGroup("himsn_defender",3,pos,8000);
	navyStationGroup.leader = navyStation;
	navyStationGroup.addShip(navyStation);
}

this._addNavyInterstellarOutpost = function(pos)
{
	// Add Navy Interstellar Outpost and defending fleet:
	navyStation = system.addShips("himsn_interstellar_outpost",1,pos,0)[0];
	var navyStationGroup = system.addGroup("himsn_defender",3,pos,8000);
	navyStationGroup.leader = navyStation;
	navyStationGroup.addShip(navyStation);
}

this._addNavyPatrol = function (pos)
{
	// 50% chance patrol is heavy or light:
	var patrol;
	if (Math.random() < 0.5)
	{
		if (missionVariables.conhunt == "MISSION_COMPLETE" && missionVariables.thargplans == "MISSION_COMPLETE")
		{
			if (Math.random() < 0.5)
			{
				patrol = "himsn_heavy_patrol_leader";
			}
			else
			{
				patrol = "himsn_missile_corvette";
			}
		}
		else
		{
			patrol = "himsn_light_patrol_leader";
		}
	}
	else
	{
        patrol = "himsn_light_patrol_leader";
	}
	// Add a Navy Patrol:
	system.addGroup(patrol, 1, pos, 0);
}

//TODO why is this never used?
this._addNavyLogisticsTransport = function (pos)
{
	// Add a Navy Logistics Transport:
	system.addGroup("himsn_logistics_transport", 1, pos, 0);
}

//TODO why is this never used?
this._addNavyMissileCorvette = function (pos)
{
	// Add a Navy Missile Corvette:
	system.addGroup("himsn_missile_corvette", 1, pos, 0);
}

this._addNavySpecOpsRecon = function (pos)
{
	// Only add recon (constrictor) if 'Constrictor Hunt' and 'Thargoid Plans' missions are complete:
	if (missionVariables.conhunt == "MISSION_COMPLETE" && missionVariables.thargplans == "MISSION_COMPLETE")
	{
		// Add a Navy Recon:
		system.addGroup("himsn_specops_recon", 1, pos, 0);
	}
}

this._addNavySpecOpsFighter = function (pos)
{
	// Add 3x Navy Spec Ops Fighter:
	system.addGroup("himsn_specops_asp", 3, pos, 0);
}

this._checkIfHostilePeriodIsOver = function ()
{
	// Check if player is considered an enemy of HIMSN and 60 days have passed since being declared an enemy:
	if (missionVariables.himsn_status == "HOSTILE" && clock.adjustedSeconds >= missionVariables.himsn_status_timer)
	{
		missionVariables.himsn_status = "NEUTRAL";
	}
}

this._checkPlayerAngle = function() 
{
	// Check angle for galactic misjump:
	this._oldPlayerAngle = player.ship.vectorForward.direction();
}

this._checkPlayerPitch = function() 
{
	// Check pitch for galactic misjump:
	if (player.ship.pitch) 
	{
		if (player.ship.pitch >= 0.95 || player.ship.pitch <= -0.95) 
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
		var angle = this._oldPlayerAngle.dot(player.ship.vectorForward.direction());
		if (angle < 0.95) 
		{
			return true;
		} 
		else 
		{
			return false;
		}
	}
}

this._checkPlayerMisjump = function() 
{
	// Check pitch for galactic misjump:
	if (this._checkPlayerPitch()) 
	{
		// If pitch okay for misjump then prepare to send player to intergalactic space:
		var jumper = system.addShips("himsn_misjumper",1,[15E5,15E5,15E5],1)[0];
		jumper.scriptedMisjump = true;
		if (jumper.exitSystem()) {
				player.ship.position = [15E5,15E5,15E5];
				this._galacticMisjump = true;
				player.ship.setEquipmentStatus("EQ_GAL_DRIVE","EQUIPMENT_DAMAGED");
		}
	} 
	else 
	{
		// If pitch normal then perform normal galactic jump:
		this._galacticMisjump = false;
		player.ship.scriptedMisjump = false;
	}
}

this._resetGalacticMisjump = this.shipWillEnterWitchspace = function() 
{
	// Reset galactic misjump:
	if (!this._galacticMisjump && System.infoForSystem(galaxyNumber,player.ship.targetSystem).name == "Intergalactic space") 
	{
		System.infoForSystem(galaxyNumber,player.ship.targetSystem).name = null;
	} 
	else if (this._galacticMisjump) 
	{
		player.ship.scriptedMisjump = true;
	}
}

this._repairGalacticHyperDrive = function() 
{
	// Repair galactic hyperdrive when 5 minutes are up:
	player.ship.setEquipmentStatus("EQ_GAL_DRIVE","EQUIPMENT_OK");
	player.consoleMessage("Galactic Hyperdrive recalibration complete. Remaining charge sufficient to complete jump.",10);
}

/**** Event handlers ****/

this.startUp = function ()
{
	//Reset Galactic Misjump variable:
	this._galacticMisjump = false;
	// Check if HIMSN OXZ has run before:
	if (missionVariables.himsn_status == null)
	{
		// Set up internal OXZ variables:
		missionVariables.himsn_status = "NEUTRAL";
		missionVariables.himsn_status_timer = clock.adjustedSeconds;
	}
}

this.playerStartedJumpCountdown = function (type,delay)
{
	if (type == "galactic")
	{
		// Setup timers for Galactic Misjump:
		this._galacticMisjumpTimer2 = new Timer(this,this._checkPlayerAngle,delay-0.5);
		this._galacticMisjumpTimer = new Timer(this,this._checkPlayerMisjump,delay-0.1);
	}
	else if (this._galacticMisjump)
	{
		// Force player to misjump:
		player.ship.scriptedMisjump = true;
	}
	else
	{
		// Reset Galactic Misjump variable:
		this._galacticMisjump = false;
	}
}

this.playerCancelledJumpCountdown = function() 
{
	// Stop and remove Galactic Misjump timers if jump is cancelled:
	if (this._galacticMisjumpTimer) 
	{
		this._galacticMisjumpTimer.stop();
		delete this._galacticMisjumpTimer;
	}
	if (this._galacticMisjumpTimer2) 
	{
		this._galacticMisjumpTimer2.stop();
		delete this._galacticMisjumpTimer2;
	}
}

this.shipWillEnterWitchspace = function (cause)
{
	this._interstellarBaseLocation = false;
	this._headquartersLocation = false;
	// Check if about to jump into interstellar space in between Tetiri and Orlaed in G5:
	if(galaxyNumber == 4 && ((system.ID == 70 && player.ship.targetSystem == 161) || (system.ID == 161 && player.ship.targetSystem == 70)  || (system.ID == 70 && player.ship.targetSystem == 70) || (system.ID == 161 && player.ship.targetSystem == 161)))
	{
		this._headquartersLocation = true;
	}
	// Check if about to jump into interstellar space in between Legees and Laeden in G1:
	if(galaxyNumber == 0 && ((system.ID == 26 && player.ship.targetSystem == 224) || (system.ID == 224 && player.ship.targetSystem == 26)  || (system.ID == 26 && player.ship.targetSystem == 26) || (system.ID == 224 && player.ship.targetSystem == 224)))
	{
		this._interstellarBaseLocation = true;
	}
	// Check if about to jump into interstellar space in between Raried and Maracece in G3:
	if(galaxyNumber == 2 && ((system.ID == 4 && player.ship.targetSystem == 123) || (system.ID == 123 && player.ship.targetSystem == 4)  || (system.ID == 4 && player.ship.targetSystem == 4) || (system.ID == 123 && player.ship.targetSystem == 123)))
	{
		this._interstellarBaseLocation = true;
	}
	// Check if about to jump into interstellar space in between Riusbequ and Quzaarar in G4:
	if(galaxyNumber == 3 && ((system.ID == 217 && player.ship.targetSystem == 221) || (system.ID == 221 && player.ship.targetSystem == 217)  || (system.ID == 217 && player.ship.targetSystem == 217) || (system.ID == 221 && player.ship.targetSystem == 221)))
	{
		this._interstellarBaseLocation = true;
	}
	// Check if about to jump into interstellar space in between Gexequon and Edtizabe in G8:
	if(galaxyNumber == 7 && ((system.ID == 144 && player.ship.targetSystem == 247) || (system.ID == 247 && player.ship.targetSystem == 144)  || (system.ID == 144 && player.ship.targetSystem == 144) || (system.ID == 247 && player.ship.targetSystem == 247)))
	{
		this._interstellarBaseLocation = true;
	}
	if (this._advPatrolTimer_3)
	{
		this._advPatrolTimer_3.stop();
		delete this._advPatrolTimer_3;
	}
}

this.shipWillExitWitchspace = function ()
{
	// Check if player is considered an enemy of HIMSN and 60 days have passed since being declared an enemy:
	this._checkIfHostilePeriodIsOver();
	
	// If player is not jumping into interstellar space make sure galactic misjump variable is reset:
	if (!system.isInterstellarSpace) 
	{
		this._galacticMisjump = false;
	}
	
	// Check if a Galactic Misjump is about to occur:
	if (this._galacticMisjump) 
	{
		// Delete oolite populator scripts:
		delete worldScripts["oolite-populator"].interstellarSpaceWillPopulate;
		delete worldScripts["oolite-populator"].interstellarSpaceWillRepopulate;
		// Set a timer for 2 minutes to recharge galactic hyperdrive:
		this._galacticMisjumpTimer.stop();
		this._galacticMisjumpTimer = new Timer(this,this._repairGalacticHyperDrive,120);
		// Set name for area:
		System.infoForSystem(galaxyNumber,player.ship.targetSystem).name = "Intergalactic space";
		// Adjust player's position to new area of interstellar space:
		player.ship.position = [0,0,1E6];
		// 80% chance of 2x light patrols vs 4-6 thargoids:
		if (Math.random() < 0.8)
		{
			system.addShips("himsn_light_patrol_leader",2,[0,0,1E6],5000);
			system.addShips("thargoid",4+Math.floor(Math.random() * (2 - 0 + 1) + 10),[0,0,1E6],5000);
		}
		// Else 70% chance of 2x heavy patrols vs 6-8 thargoids:
		else if (Math.random() < 0.7)
		{
			if (missionVariables.conhunt == "MISSION_COMPLETE" && missionVariables.thargplans == "MISSION_COMPLETE")
			{
				if (Math.random() < 0.5)
				{
					system.addShips("himsn_heavy_patrol_leader",2,[0,0,1E6],5000);
				}
				else
				{
					system.addShips("himsn_missile_corvette",2,[0,0,1E6],5000);
				}
			}
			else
			{
				system.addShips("himsn_light_patrol_leader",2,[0,0,1E6],5000);
			}
			system.addShips("thargoid",6+Math.floor(Math.random() * (2 - 0 + 1) + 10),[0,0,1E6],5000);
		}
		// If none of the above then just player vs 2-4 thargoids:
		else
		{
			system.addShips("thargoid",2+Math.floor(Math.random() * (2 - 0 + 1) + 10),[0,0,1E6],5000);
		}
		// 30% chance a rogue planet will be spawned:
		if (Math.random() < 0.3)
		{
			// Choose one of eight planets to spawn: 
			var planetchance = Math.random();
			var igPlanet;
			if ((planetchance <= 1) && (planetchance > 0.875)) igPlanet = system.addMoon("himsn_rogue_planet_1");
			if ((planetchance <= 0.875) && (planetchance > 0.75)) igPlanet = system.addMoon("himsn_rogue_planet_2");
			if ((planetchance <= 0.75) && (planetchance > 0.625)) igPlanet = system.addMoon("himsn_rogue_planet_3");
			if ((planetchance <= 0.625) && (planetchance > 0.5)) igPlanet = system.addMoon("himsn_rogue_planet_4");
			if ((planetchance <= 0.5) && (planetchance > 0.375)) igPlanet = system.addMoon("himsn_rogue_planet_5");
			if ((planetchance <= 0.375) && (planetchance > 0.25)) igPlanet = system.addMoon("himsn_rogue_planet_6");
			if ((planetchance <= 0.25) && (planetchance > 0.125)) igPlanet = system.addMoon("himsn_rogue_planet_7");
			if (planetchance <= 0.125) igPlanet = system.addMoon("himsn_rogue_planet_8");
			// 10% chance a navy outpost will be spawned in orbit around planet:
			if (Math.random() < 0.1)
			{
				var planetToStation = Vector3D.randomDirection(2 * igPlanet.radius);
				var igNavyStat = system.addShips("himsn_interstellar_outpost", 1, igPlanet.position.add(planetToStation))[0];
				targetVector = igPlanet.position.subtract(igNavyStat.position).direction();
				angle = igNavyStat.heading.angleTo(targetVector);
				cross = igNavyStat.heading.cross(targetVector).direction();
				igNavyStat.orientation = igNavyStat.orientation.rotate(cross, -angle);
			}
		}
	}
}

this.shipExitedWitchspace = function() 
{
	if (missionVariables.himsn_adv_patrol_dest && system.ID == missionVariables.himsn_adv_patrol_dest && system.countShipsWithRole("himsn_adv_patrol") == 0)
	{
		this._advPatrolTimer_1 = new Timer(this,this._addAdvPatrol,30);
	}
	
	if (this._galacticMisjump) 
	{
		if (!system.isInterstellarSpace) 
		{
			// If player has managed to escape Intergalactic Space the reset galactic misjump variables:
			this._galacticMisjump = false;
			this._resetGalacticMisjump();
		} 
		else 
		{
			// Warn player that Galactic Hyperdrive has malfunctioned:
			if (player.ship.equipmentStatus("EQ_GAL_DRIVE") == "EQUIPMENT_DAMAGED")
			{
				player.consoleMessage("WARNING! Galactic Hyperdrive Malfunction!",10);
				player.consoleMessage("Attempting recalibration with remaining charge...",5);
			}
			player.ship.scriptedMisjump = true;
		}
	}
}

this.guiScreenChanged = function(from,to) 
{
	// Disable short & long range charts and planet info screens:
	if (this._galacticMisjump) 
	{
		if (guiScreen == "GUI_SCREEN_SYSTEM_DATA" || guiScreen == "GUI_SCREEN_SHORT_RANGE_CHART" || guiScreen == "GUI_SCREEN_LONG_RANGE_CHART") 
		{
			mission.runScreen({
				title: "Critical Error",
				message: "Unable to determine location - Cannot load Galactic Chart data."
			});
		}
	}
}

this.shipWillLaunchFromStation = function (station)
{
	// Check if player is considered an enemy of HIMSN and 60 days have passed since being declared an enemy:
	this._checkIfHostilePeriodIsOver();
}

this.interstellarSpaceWillPopulate = function () 
{
	// 15% chance of light patrol encounter:
	var lightpatrolchance = 0.15;
	// 10% chance of heavy patrol encounter:
	var heavypatrolchance = 0.1;
	
	// Add Navy Outpost at designated zero distance locations:
	if (system.ID == -1 && this._interstellarBaseLocation)
	{
		delete worldScripts["oolite-populator"].interstellarSpaceWillPopulate;
		delete worldScripts["oolite-populator"].interstellarSpaceWillRepopulate;
		system.setPopulator("himsn-interstellar-base",
		{
			priority: 200,
			location: "WITCHPOINT",
			groupCount: 1,
			callback: this._addNavyInterstellarOutpost,
			deterministic: true
		});
	}
	else if (system.ID == -1 && this._headquartersLocation)
	{
		delete worldScripts["oolite-populator"].interstellarSpaceWillPopulate;
		delete worldScripts["oolite-populator"].interstellarSpaceWillRepopulate;
		system.setPopulator("himsn-headquarters",
		{
			priority: 200,
			location: "WITCHPOINT",
			groupCount: 1,
			callback: this._addNavyHeadquarters,
			deterministic: true
		});
	}
	// If in interstellar space with no outpost:
	else 
	{
		// 2x heavy patrols vs 6x thargoids:
		if(Math.random() < heavypatrolchance)
		{
			var heavy_patrol;
			if (Math.random() < 0.5)
			{
				heavy_patrol = "himsn_light_patrol_leader";
			}
			else
			{
				heavy_patrol = "himsn_missile_corvette";
				if (missionVariables.conhunt == "MISSION_COMPLETE" && missionVariables.thargplans == "MISSION_COMPLETE")
				{
					if (Math.random() < 0.5)
					{
						heavy_patrol = "himsn_heavy_patrol_leader";
					}
				}
			}
			system.setPopulator("himsn-interstellar-heavy-escort",
			{
				priority: 210,
				location: "WITCHPOINT",
				groupCount: 2,
				callback: function(pos) {
					system.addShips(heavy_patrol,2,pos,0);
				}
			});
			system.setPopulator("himsn-interstellar-heavy-escort-thargoids",
			{
				priority: 210,
				location: "WITCHPOINT",
				groupCount: 6,
				callback: function(pos) {
					system.addShips("thargoid",1,pos,0);
				}
			});
		}
		// 2x light patrols vs 4x thargoids:
		else if(Math.random() < lightpatrolchance)
		{
			system.setPopulator("himsn-interstellar-light-escort",
			{
				priority: 210,
				location: "WITCHPOINT",
				groupCount: 2,
				callback: function(pos) {
					system.addShips("himsn_light_patrol_leader",1,pos,0);
				}
			});
			system.setPopulator("himsn-interstellar-light-escort-thargoids",
			{
				priority: 210,
				location: "WITCHPOINT",
				groupCount: 4,
				callback: function(pos) {
					system.addShips("thargoid",1,pos,0);
				}
			});
		}
	}
}

this.systemWillPopulate = function () 
{
	// 3% chance of patrol appearing:
	var patrolchance = 0.03;
	// 0.2% chance of recon appearing:
	var reconchance = 0.002;
	
	// Check if player is hostile to navy:
	if (missionVariables.himsn_status == "HOSTILE")
	{
		// 30% chance special ops fighters waiting for player at witchpoint & station aegis:
		if (Math.random() < 0.3)
		{
			system.setPopulator("himsn-specops-fighter-witchpoint",
			{
				priority: 200,
				location: "WITCHPOINT",
				groupCount: 1,
				callback: this._addNavySpecOpsFighter,
				deterministic: true
			});
			system.setPopulator("himsn-specops-fighter-station",
			{
				priority: 200,
				location: "STATION_AEGIS",
				groupCount: 1,
				callback: this._addNavySpecOpsFighter,
				deterministic: true
			});
		}
	}
	
	// Add Navy Base to Birera (G3) and Xeer (G1):
	if ((galaxyNumber == 0 && system.ID == 150) || (galaxyNumber == 2 && system.ID == 36))
	{
		system.setPopulator("himsn-system-base",
		{
			priority: 200,
			location: "STAR_ORBIT",
			locationSeed: 67812,
			groupCount: 1,
			callback: this._addNavySystemBase,
			deterministic: true
		});
		// 5% chance of patrol appearing:
		patrolchance = 0.05;
		// 0.5% chance of recon appearing:
		reconchance = 0.005;
		// 3% chance of another patrol appearing on any lane:
		if (Math.random() < 0.03)
		{
			system.setPopulator("himsn-extra-patrol-2",
			{
				priority: 210,
				location: "LANE_WPS",
				groupCount: 1,
				callback: this._addNavyPatrol
			});
		}
	}
	
	// Add patrol on witchpoint-sun lane:
	if (Math.random() < patrolchance)
	{
		system.setPopulator("himsn-patrol",
		{
			priority: 210,
			location: "LANE_WS",
			groupCount: 1,
			callback: this._addNavyPatrol
		});
	}
	
	// Add recon on any lane:
	if (Math.random() < reconchance)
	{
		system.setPopulator("himsn-specops-recon",
		{
			priority: 210,
			location: "LANE_WPS",
			groupCount: 1,
			callback: this._addNavySpecOpsRecon
		});
	}
}

this.systemWillRepopulate = function()
{
	if (missionVariables.himsn_adv_patrol_dest && missionVariables.himsn_adv_patrol_dest == system.ID && this._addAdvPatrolSwitch == true)
	{
		delete this._addAdvPatrolSwitch;
		missionVariables.himsn_adv_patrol_dest = null;
		this._advPatrolTimer_1.stop();
		delete this._advPatrolTimer_1;
		this._addAdvPatrolShips(system.locationFromCode("WITCHPOINT"));
	}
	if (missionVariables.himsn_adv_patrol_home && missionVariables.himsn_adv_patrol_home == system.ID && this._addAdvPatrolSwitch == true)
	{
		delete this._addAdvPatrolSwitch;
		missionVariables.himsn_adv_patrol_home = null;
		missionVariables.himsn_adv_patrol_mission = null;
		this._advPatrolTimer_2.stop();
		delete this._advPatrolTimer_2;
		this._addAdvPatrolShips(system.locationFromCode("WITCHPOINT"));
	}
}