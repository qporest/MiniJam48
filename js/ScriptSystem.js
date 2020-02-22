class ScriptSystem {

	getDialogueFor(char){
		let name = char.name
		console.log("Getting exchange for "+name)
		let currentDialogue = this.dialogue[name][this.currentDialogue[name]]
		console.log(currentDialogue)
		while("nextIf" in currentDialogue){
			if(this.events[currentDialogue["nextIf"]["event"]] == currentDialogue["nextIf"]["value"]){
				this.currentDialogue[name] = currentDialogue["nextIf"]["next"]
				currentDialogue = this.dialogue[name][this.currentDialogue[name]]
			} else {
				break;
			}
		}
		let exchange = currentDialogue["exchange"]
		if("nextIf" in currentDialogue === false){
			this.currentDialogue[name] = currentDialogue["next"]
		}
		if("triggeredEvent" in currentDialogue){
			this.events[currentDialogue["triggeredEvent"]["event"]] = currentDialogue["triggeredEvent"]["value"]
			if(currentDialogue["triggeredEvent"]["event"] in this.eventListeners){
				this.eventListeners[currentDialogue["triggeredEvent"]["event"]]()
			}
		}
		return JSON.parse(JSON.stringify(exchange))
	}

	completeThreshold(name){
		if(name in this.events){
			this.events[name] = true
			if(name in this.eventListeners){
				this.eventListeners[name]()
			}
		}
	}

	constructor(scene){
		this.scene = scene
		this.events = {
			"blame_people": false,
			"drunk_rupert": false,
			"met_jessica": false,
			"talked_to_brody": false,
			"jukebox_checked": false,
			"finish": false,
			"blame_jessica": false,
			"blame_bill": false,
			"blame_ylvis": false,
			"check_ruperts_bag": false,
			"learn_missing_vinyl": false,
			"brody_comes_out": false
		}
		this.currentDialogue = {
			"Jessica": 0,
			"Rupert": 0,
			"Brody": 0,
			"Bill": 0,
			"Vader": 0,
			"Ylvis": 0,
			"Jukebox": 0,
			"Narrator": 0
		}

		this.eventListeners = {
			"jukebox_checked": ()=>{
				this.scene.vader.interactWith(this.scene.jukebox)
			},
			"learn_missing_vinyl": ()=>{
				this.scene.setMusic("music/02_Mystery Song.mp3")
			},
			"check_ruperts_bag": ()=>{
				this.scene.vader.interactWith(this.scene.jukebox)
			},
			"blame_people": ()=>{
				this.scene.getPicks()
			},
			"blame_jessica": ()=>{

			},
			"brody_comes_out": ()=>{
				this.scene.vader.interactWith(this.scene.characters["Brody"])
			},
			"blame_bill": ()=>{

			},
			"blame_ylvis": ()=>{

			},
			"finish": ()=>{
				let sprite = this.scene.app.sprites["Record"]
				sprite.zIndex = 1000
				sprite.x = this.scene.app.canvas.width/2 - sprite.width/2
				sprite.y = this.scene.app.canvas.height/2 - sprite.height/2
				this.scene.actual_stage.addChild(sprite)
				this.scene.vader.sortZIndex()
				this.scene.setMusic("music/03_OWO Song.mp3")
			}
		}
		this.dialogue = {}
		//-------------------------------------------------
		//Bill
		this.dialogue["Bill"] = {
			0: {
				exchange: [
					{character: "Vader", text: "Hey, Bill!"},
					{character: "Bill", text: "Hey, Vader…"},
					{character: "Vader", text: "Slow night?"},
					{character: "Bill", text: "*crosses arms* might be, but that doesn’t mean I’m letting up on my bouncer duties… you’ve got your ID?"},
					{character: "Vader", text: "I’ve been coming here for my past 8 lives - don’t pull my tail! Let me get out of this rain!"},
					{character: "Bill", text: "*huffs* You still look younger than a kitten, hand it over bud!"},
					{character: "Narrator", text: "You roll your eyes and hand over your ID to enter the bar."}
				],
				next: 1
			},
			1: {
				exchange: [
					{character: "Vader", "text": "I've got nothing to ask him at the moment."}
				],
				nextIf: {
					event: "finish",
					value: true,
					next: 2
				}
			}
		}
		//------------------------------------------------
		//Jessica
		this.dialogue["Jessica"] = {
			0: {
				exchange: [
					{character: "Jessica", text: "Haven’t seen you before!"},
					{character: "Vader", text: "I come here every Saturday night... just as you do."},
					{character: "Narrator", text: "You notice a pink sparkly drink in her hand with a tiny umbrella. You’ve always wondered where those came from."},
					{character: "Jessica", text: "hmm.. I wonder why I’ve never noticed you…"},
					{character: "Vader", text: "Yeah, with whiskers like this, I’m hard to miss."},
					{character: "Jessica", text: "Huh...yeah, sure."}
				],
				next: 1,
				triggeredEvent: {
					"event": "met_jessica",
					"value": true
				}
			},
			1: {
				exchange: [
					{character: "Vader", "text": "I've got nothing to ask her at the moment."}
				],
				nextIf: {
					event: "jukebox_checked",
					value: true,
					next: 2
				}
			},
			2: {
				exchange: [
					{character: "Jessica", "text": "Oh man...that’s such a bummer!"},
					{character: "Vader", "text": "How long have you been here for?"},
					{character: "Jessica", "text": "Mmm.. I got here shortly after they opened. Work is always SO terrible and I come here to unwind. It’s like my second home.."},
					{character: "Vader", "text": "Your second home, huh...do you ever treat the bar property as your own?"},
					{character: "Jessica", "text": "A-are you accusing me of stealing the record??? UGH!! You are SO insensitive. LEAVE ME ALONE."}
				],
				next: 3
			},
			3: {
				exchange:[
					{character: "Narrator", "text": "It seems like you’ve offended Jessica. Maybe you should talk to someone else."},
				],
				nextIf: {
					event: "blame_jessica",
					value: true,
					next: 4
				}
			}
		}
		//--------------------------------------------------
		//Jukebox
		this.dialogue["Jukebox"] = {
			0: {
				exchange: [
					{character: "Vader", text: "First, I would like to grab a drink."}
				],
				nextIf: {
					"event": "talked_to_brody",
					"value": true,
					"next": 1
				}
			},
			1: {
				exchange: [
					{character: "Vader", text: "Hum pum pum, some good music will liven this place up."},
					{character: "Jessica", text: "Do you mind putting on a song I could dance to? What's the name of that popular one, that's played everywhere right now?"},
					{character: "Vader", text: "I know exactly which one you mean..."},
					{character: "Vader", text: "It's not here!"},
					{character: "Jessica", text: "It can't be! I was just dancing to it here yesterday!"},
					{character: "Narrator", text: "You are wondering if she's been here since yesterday. In fact every time you visited 'Lil guys she was here."},
					{character: "Vader", text: "I'll ask Brody about it"},
				],
				next: 2,
				triggeredEvent: {
					"event": "jukebox_checked",
					"value": true
				},
			},
			2: {
				exchange: false,
				triggeredEvent: {
					"event": "learn_missing_vinyl",
					"value": true
				},
				next: 3	
			},
			3: {
				exchange: [
					{character: "Vader", "text": "I've got to find where the song is."}
				],
				nextIf: {
					event: "check_ruperts_bag",
					value: true,
					next: 4
				}
			},
			4: {
				exchange: false,
				triggeredEvent: {
					"event": "blame_people",
					"value": true
				},
				next: 3	
			},
		}
		//---------------------------------------------------
		//Rupert
		this.dialogue["Rupert"] = {
			0: {
				exchange: [
					{character:"Vader", text: "Hey there Rupert! Started early tonight didn’t you?"},
					{character:"Rupert", text: "I don’t drink and fly! I swear officer! CAHOooo-OwO-oO"},
					{character:"Vader", text: "I’m not an offic...just drink some water tonight. I don’t want to have to carry you home like last time..."},
					{character:"Vader", text: "...you tend to shit your pants near cars."},
					{character:"Rupert", text: "I ALWAYS FIND MY WAY HOME CAHOooo-OwO-oO!!!!!!!"},
				],
				next: 1
			},
			1: {
				exchange: [
					{character:"Rupert", text: "Joing me for a couple drinks?"}
				],
				nextIf: {
					event: "jukebox_checked",
					value: true,
					next: 2
				}
			},
			2: {
				exchange: [
					{character: "Narrator", text: "Rupert isn't coherent again, try talking to Brody."}
				],
				triggeredEvent: {
					"event": "drunk_rupert",
					"value": true
				},
				next: 3
			}, 
			3: {
				exchange: [
					{character: "Vader", text: "Let's all check what is in Ruperts bag"},
					{character: "Narrator", text: "Inside you only found rolls of toilet paper however."},
					{character: "Narrator", text: "So as you predicted, it's not him."},
					{character: "Narrator", text: "Choose who you think is the one to blame."}
				],
				triggeredEvent: {
					"event": "check_ruperts_bag",
					"value": true
				}
			}

		}
		//---------------------------------------------------
		//Brody
		this.dialogue["Brody"] = {
			0: {
				exchange: [
					{character: "Brody", text: "Hey, Vader, my brother from another mother!"},
					{character: "Vader", text: "Last time I checked, you weren’t a cat."},
					{character: "Brody", text: "Raccoons are like the trash cousin of cats, didn’t you know?"},
					{character: "Vader", text: "Heh, well I’m glad you’re self-aware...give me the usual."},
					{character: "Brody", text: "Are ya sure ya want yer usual? I’ve been werkin’ on a new cocktail recipe."},
					{character: "Brody", text: "Ya oughta try it! Jessica over there tried it, go n’ ask her yerself!"},
					{character: "Vader", text: "I see her drink, looks pretty girly."},
					{character: "Brody", text: "Don’t knock it ‘til ya try it! Real men drink pink."},
					{character: "Vader", text: "I’ll just take my usual...Whiskers on the Rocks"},
					{character: "Narrator", text: "Brody hands you your drink. It smells pleasantly strong."},
					{character: "Brody", text: "Why don’t you go spice up your life with some music?"},
					{character: "Vader", text: "Yeah, I guess I might as well. I really love that one song...hmm"}
				],
				triggeredEvent: {
					"event": "talked_to_brody",
					"value": true
				},
				next: 1,
			},
			1: {
				exchange: [
					{character: "Narrator", text: "You decide not to bother him when he washes the plates. Not after the last time"}
				],
				nextIf: {
					event: "jukebox_checked",
					value: true,
					next: 2
				}
			},
			2: {
				exchange: [
					{character: "Brody", text:"Oh, that's a shame. You said what song? .. Oh, true shame"},
					{character: "Vader", text:"When would someone even take it?"},
					{character: "Brody", text:"I dunno, could be that musician guy. Musicians hate jukeboxes that replace them."},
					{character: "Brody", text:"It was too open earlier, Rupert could have left it open after doin' maintenance on it."},
					{character: "Vader", text:"I'll go ask around then."},
				],
				nextIf: {
					event: "drunk_rupert",
					value: true,
					next: 3
				}
			},
			3: {
				exchange: [
					{character: "Brody", text: "Did you find anything yet?"},
					{character: "Vader", text: "It's hard to tell, everyone might have a motive, but Rupert is most suspicious."},
					{character: "Brody", text: "Maybe the old fool took it to sell for some more booze, haha."},
					{character: "Brody", text: "He doesn't need much anyway, he's pretty lightweight with those hollow bones."},
					{character: "Vader", text: "I'll go check his bag. If it's not him, I know who it will be."},
				],
				nextIf: {
					event: "blame_people",
					value: true,
					next: 4
				}
			},
			4: {
				exchange: [
					{character: "Vader", text:"Everybody! I know who stole the record!!"},
					{character: "Brody", text:"Oh, for christ sake Vader! I hid the darn record!"},
					{character: "Vader", text:"Huh?"},
					{character: "Brody", text:"Everyone is always playing that stupid stong! I needed a break! I was going insane!"},
					{character: "Brody", text:"This stupid jukebox is right next to my bar so it blasts right into my ears!"},
					{character: "Vader", text:"…"},
					{character: "Brody", text:"It’s not even a good song!! The lyrics are just OWO over and over again! It’s worse than dubstep!!"},
					{character: "Vader", text:"Why don’t we...just move the jukebox to the other side of the room…"},
					{character: "Brody", text:"THAT’S JUST ABSOLUTELY INSA- wait, that’s actually a pretty good idea."},
					{character: "Vader", text:"Yeah.."},
					{character: "Brody", text:"…"},
					{character: "Vader", text:"…"},
					{character: "Jessica", text:"Can we just start playing the song?"},
					{character: "Vader", text:"Yeah, let’s do that."},
				],
				triggeredEvent:{
					event: "brody_comes_out",
					value: true
				},
				next: 5
			},
			5: {
				exchange: false,
				triggeredEvent:{
					event: "finish",
					value: true
				},
				nextIf: {
					event: "unreal_event",
					value: true,
					next: 4
				}

			}
		}
		//---------------------------------------------------
		//Vader
		this.dialogue["Vader"] = {
			0: {
				exchange: [
					{character: "Vader", text: "No need to tap me, friend."}
				],
				next: 1
			},
			1: {
				exchange: [
					{character: "Vader", text: "When you scratch that spot it actually feels pretty good, thanks!"}
				],
				nextIf: {
					event: "finish",
					value: true,
					next: 2
				}
			}
		}
		//---------------------------------------------------
		//Ylvis
		this.dialogue["Ylvis"] = {
			0: {
				exchange: [
					{character: "Narrator", text:"He seems lost in his thoughts, maybe you should leave him alone for now."}
				],
				nextIf: {
					event: "jukebox_checked",
					value: true,
					next: 1
				}
			},
			1: {
				exchange: [
					{character: "Vader", text: "Hey man, Brody tells me you’re a musician"},
					{character: "Ylvis", text: "Heck yeah, I am. I used to be booked at every bar every night."},
					{character: "Vader", text: "Used to…?"},
					{character: "Ylvis", text: "Ehh...yeah, I mean once the radios and jukeboxes thing took off, no one really needed a live musician."},
					{character: "Ylvis", text: "Darn those machines of the devil. Everyone loved my cover of that one song...y’know the one that’s all over town right now."},
					{character: "Vader", text: "Yeah, I know. But, are you saying you wouldn’t mind seeing those things gone? Maybe even hide the record?"},
					{character: "Ylvis", text: "Whaa? You’re nuts man. I love that song! I planned on seeing to it for karaoke hour tonight."},
					{character: "Ylvis", text: "Pft, shame on you man. Get out of my space! You’re ruinin’ my groove."},
				],
				nextIf: {
					event: "finish",
					value: true,
					next: 2
				}
			}
		}
		//---------------------------------------------------
		//Narrator
		this.dialogue["Narrator"] = {
			0: {
				exchange:[
					{character:"Narrator", text:"The bar is looking emptier than usual. There are a couple of regulars scattered around the bar."}
				],
				nextIf: {
					event: "finish",
					value: true,
					next: 2
				}
			},
			2: {
				exchange: []
			}
		}
	}
}