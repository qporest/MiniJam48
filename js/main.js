let game = new EscapeGame({
	debug: true,
	sprites: [
		"./img/fox.png",
		"./img/cleric.png",
		"./img/cave_ceiling.png",
		"./img/elf.png",
		"./img/floor.png",
		"./img/background.png",
		"./img/necromancer.png",
		"./img/dwarf.png",
		"./img/boulder.png",
		"./img/magicdoor.png",
		"./img/toxicgas.png",
		"./img/soulpit.png",
		"./img/pulley.png",
		"./img/monster.png",
		"./img/fork.png",
		"./img/icons/necromancer.png",
		"./img/icons/fox.png",
		"./img/icons/dwarf.png",
		"./img/icons/elf.png",
		"./img/icons/cleric.png",
		"./img/tutorial.png"
	],
	sprite_mapping: {
		'./img/floor.png': 'floor',
		'./img/background.png': 'background',
		'./img/fox.png': 'fox',
		'./img/cave_ceiling.png': 'cave_ceiling',
		'./img/cleric.png': 'cleric',
		'./img/pulley.png': 'pulley',
		'./img/monster.png': 'monster',
		'./img/fork.png': 'fork',
		'./img/elf.png': 'elf',
		'./img/necromancer.png': 'necromancer',
		'./img/dwarf.png': 'dwarf',
		'./img/boulder.png': 'boulder',
		'./img/toxicgas.png': 'toxicgas',
		'./img/magicdoor.png': 'magicdoor',
		'./img/soulpit.png': 'soulpit',
		'./img/icons/necromancer.png': 'necromancerIcon',
		'./img/icons/fox.png': 'foxIcon',
		'./img/icons/dwarf.png': 'dwarfIcon',
		'./img/icons/elf.png': 'elfIcon',
		'./img/icons/cleric.png': 'clericIcon',
		'./img/icons/Rupert.png': 'RupertIcon',
		'./img/icons/Narrator.png': 'NarratorIcon',
		'./img/tutorial.png': 'tutorial',
	}
})
game.run()