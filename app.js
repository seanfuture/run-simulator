var Progress = require("progressor");


function simulateMaxBets(initBalance, maxBets, people)
{
	//Create Progress
	var progress = new Progress(
						{
			  					format: 'normal'
						}, maxBets);
	progress.start();

	//declare
	var currentRunLength = 0;
	var peopleCanStillBet = true;
	var flipCount = 0;
	var currentMinBets = maxBets+1;

	//Init
	for(var person of people)
	{
		initPerson(person, initBalance);
	}


	//Loop until everyone has bet
	while(peopleCanStillBet)
	{
		//increment flips
		flipCount++;

		//reset stats to all betting complete
		peopleCanStillBet = false;

		//flip coin
		//0 = tails => loss
		//1 = heads => win
		var flip = Math.floor(Math.random() * 100) % 2;
		var isWin = (flip == 1);
		var isLoss = (flip == 0);

		//loop each person
		for(var person of people)
		{

			if(person.Bets < maxBets)
			{
				person.WatchedFlips++;
			}

			//Determine if person should bet
			//Not exceeded their bet count
			//MinRunLength met
			if(person.Bets < maxBets && person.MinRunLength <= currentRunLength)
			{
				//Person bets
				person.Bets++

				//Determine Bet amount
				var amount = Math.pow(2,person.CurrentRunLosses)

				if(isWin)
				{
					//Update Person
					person.Balance += amount;
					person.Wins++;
					person.CurrentRunLosses = 0;
					person.MaxBalance = Math.max(person.MaxBalance, person.Balance);
					person.MaxProfit = person.MaxBalance - initBalance;
				}

				else if(isLoss)
				{
					person.Balance -= amount;
					person.Losses++;
					person.CurrentRunLosses++; //Run length grows
					person.MinBalance = Math.min(person.MinBalance, person.Balance);
					person.MaxLoss = person.MinBalance - initBalance;
				}

			}

			//Determine if everyone has completed their betting
			peopleCanStillBet |= (person.Bets < maxBets);

			var newMinBets = Math.min(currentMinBets, person.Bets);
			if(newMinBets > currentMinBets) progress.advance();
			//console.log( { count: flipCount, flip: flip, Person: person.Name, Bets: person.Bets });
		}

		//Update Current Run Length, perform after bets are tallied
		//if loss, then Increment Run Length
		if(isLoss) currentRunLength++;

		//If win, then RunLength = 0
		else currentRunLength = 0;

		everyoneMadeMaxBets = false;
	}
	

	progress.finish();
}

function initPerson(person, initBalance)
{
	person.Balance = initBalance;
	person.MinBalance = initBalance;
	person.MaxBalance = initBalance;
	person.Wins = 0;
	person.Losses = 0;
	person.Bets = 0;
	person.CurrentRunLosses = 0;
	person.WatchedFlips = 0;

	person.MaxProfit = 0;
	person.MaxLoss = 0;

	return person;
}

//first simulation
var people = 
			[
				{ Name: "Jason", MinRunLength: 0 },
				{ Name: "Sean", MinRunLength: 10 }
			];
console.log("Starting...");
simulateMaxBets(1000000, 10000, people);
console.log("Finished!");
console.log(JSON.stringify(people, null, "\t"));

