"use strict";

this.name 			= "himsn_station";
this.author         = "Pleb";
this.copyright      = "(C) 2014 Pleb.";
this.licence        = "CC-NC-by-SA 4.0";
this.version 		= "0.8-alpha";

this.shipSpawned = function ()
{
	if (system.ID == -1) return;
	this.ship.launchShipWithRole("himsn_adv_patrol", [true]);
	worldScripts["himsn_main"]._advPatrolTimer_2 = new Timer(this,worldScripts["himsn_main"]._addAdvPatrol,1800);
	worldScripts["himsn_main"]._advPatrolTimer_3 = new Timer(this,worldScripts["himsn_main"]._launchAdvPatrol,900);
	
	this.liftArray = [];
	this.liftHomeArray = [];
	this.liftStatusArray = [];
	this.subArray = this.ship.subEntities;
	if (this.subArray.length > 0)
	{
		var listCounter = 0 ; // reset the counter
		for(listCounter = 0;listCounter<this.subArray.length;listCounter++)
		{
			if (this.subArray[listCounter].hasRole("himsn_kiotaLift"))
			{
				this.liftArray.push(this.subArray[listCounter]);
				this.liftHomeArray.push(this.subArray[listCounter].position);
				this.liftStatusArray.push("down");				
			}
		}

		this.distanceTimer = new Timer(this, this.distanceCheck, 0, 10);
	}
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
		});
	}
}

this.stationReceivedDockingRequest = function(whom)
{
	system.filteredEntities(this, function (entity)
	{
		if (entity.scanClass == "CLASS_MILITARY")
		{
			entity.target = whom;
			entity.destination = entity.target.position;
			entity.desiredRange = 2500;
			entity.performFlyToRangeFromDestination();
		}
	});
}

this.distanceCheck = function()
{
	if(this.checkDistance())
	{
		if(!this.callbackID) { this.callbackID = addFrameCallback(this.moveLifts.bind(this)); }
		if(!this.liftTimer) { this.liftTimer = new Timer(this, this.triggerLifts, 0, 10); }
		if(!this.missileTimer) { this.missileTimer = new Timer(this, this.awardMissile, 0, 30); }
		return;
	}
	else
	{ 
		this.stopTimers(); 
	}	
}

this.checkDistance = function () 
{
	if(!this.ship || ! player.ship || !this.ship.isValid || !player.ship.isValid)
	{ 
		return false; 
	}
	return (this.ship.position.distanceTo(player.ship) < 256E3);
}	
	
this.rotateStation = function (targetVector)
{
	var angle = this.ship.heading.angleTo(targetVector);
	var cross = this.ship.heading.cross(targetVector).direction();
	this.ship.orientation = this.ship.orientation.rotate(cross,-angle);
}

this.awardMissile = function()
{
	if(this.ship.missiles.length < this.ship.missileCapacity)
	{ 
		this.ship.awardEquipment(this.ship.selectNewMissile()); 
	}
}
	
this.triggerLifts = function()
{
	var listCounter = 0 ; // reset the counter
	for(listCounter = 0;listCounter<this.liftArray.length;listCounter++)
	{
		if(this.liftStatusArray[listCounter] === "down" && Math.random() < (0.1 * Math.random()))
		{ 
			this.liftStatusArray[listCounter] = "rising"; 
		}
		if (this.liftStatusArray[listCounter] === "up" && Math.random() < (0.1 * Math.random()))
		{ 
			this.liftStatusArray[listCounter] = "falling"; 
		}	
	}
}

this.moveLifts = function(delta)
{
	if(!this.ship.isValid || !this.ship.status)
	{
		this.shipDied();
		return;
	}
   
	var listCounter = 0 ; // reset the counter
	var distance = delta * 60; // 60 meter per second
	for(listCounter = 0;listCounter<this.liftArray.length;listCounter++)
	{
		if(this.liftStatusArray[listCounter] === "rising")
		{
			this.liftArray[listCounter].position = this.liftArray[listCounter].position.add(this.liftArray[listCounter].vectorUp.multiply(distance));
			if(this.liftArray[listCounter].position.distanceTo(this.liftHomeArray[listCounter]) >= 1145)
			{
				this.liftArray[listCounter].position = this.liftHomeArray[listCounter].add(this.liftArray[listCounter].vectorUp.multiply(1150));
				this.liftStatusArray[listCounter] = "up";
			}
		}
         
		if(this.liftStatusArray[listCounter] === "falling")
		{
			this.liftArray[listCounter].position = this.liftArray[listCounter].position.subtract(this.liftArray[listCounter].vectorUp.multiply(distance));
			if((this.liftArray[listCounter].position.distanceTo(this.liftHomeArray[listCounter]) <= 5) || (this.liftArray[listCounter].position.subtract(this.liftHomeArray[listCounter]).direction().angleTo(this.liftArray[listCounter].vectorUp) < 0.1))
			{
				this.liftArray[listCounter].position = this.liftHomeArray[listCounter];
				this.liftStatusArray[listCounter] = "down";
			}
		}	
	}
}
	
this.playerWillEnterWitchspace = this.entityDestroyed = this.stopTimers = function()
{
	if(this.callbackID)
	{
		removeFrameCallback(this.callbackID); 
		delete this.callbackID;
	}
		
	if(this.missileTimer && this.missileTimer.isRunning)
	{
		this.missileTimer.stop();
		delete this.missileTimer;
	}
		
	if(this.liftTimer && this.liftTimer.isRunning)
	{
		this.liftTimer.stop();
		delete this.liftTimer;
	}
}

this.shipFiredMissile = function(missile, target)
{
	if(missile && target && this.ship.heading.angleTo(target.position.subtract(this.ship.position).direction()) > (Math.PI / 2))
	{
		missile.orientation = missile.orientation.rotate(missile.vectorUp, Math.PI); 
		missile.position = this.ship.position.subtract(this.ship.vectorForward.multiply(this.ship.position.distanceTo(missile.position)));
	}
}